#!/usr/bin/env node
/**
 * MDX/MD pre-push validator
 *
 * Checks:
 *   - Required frontmatter fields (title, description, category, pubDate)
 *   - Valid category  (parsed from src/data/categories.ts)
 *   - Valid subcategory (parsed from src/data/categories.ts)
 *   - topic ≠ subcategory
 *   - Valid topic (parsed from src/data/categories.ts)
 *   - Bare $number in content
 *
 * Auto-fixes:
 *   - import 在 frontmatter 前面 → 自動移到後面，提示重新 commit
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';

// ── Colors ───────────────────────────────────────────────────────────────────
const R = '\x1b[31m', G = '\x1b[32m', Y = '\x1b[33m', B = '\x1b[34m';
const RESET = '\x1b[0m', BOLD = '\x1b[1m', DIM = '\x1b[2m';

// ── Parse CATEGORY_TREE from categories.ts ───────────────────────────────────
function extractTopLevelObjects(src, arrStart) {
  const blocks = [];
  let depth = 0, blockStart = -1;
  for (let i = arrStart; i < src.length; i++) {
    const c = src[i];
    if (c === '{') {
      if (depth === 0) blockStart = i;
      depth++;
    } else if (c === '}') {
      depth--;
      if (depth === 0 && blockStart !== -1) {
        blocks.push(src.slice(blockStart, i + 1));
        blockStart = -1;
      }
    } else if (c === ']' && depth === 0) break;
  }
  return blocks;
}

function loadCategoryTree() {
  const src = readFileSync('src/data/categories.ts', 'utf-8');
  const validSubs = {};   // { catName: string[] }
  const validTopics = {}; // { catName: { subName: string[] } }

  const treeIdx = src.indexOf('CATEGORY_TREE');
  if (treeIdx === -1) return { validSubs, validTopics };
  // Find the actual array `= [` (not `CatDef[]` type annotation)
  const eqIdx = src.indexOf('= [', treeIdx);
  if (eqIdx === -1) return { validSubs, validTopics };
  const arrStart = eqIdx + 2; // points to '['

  for (const catBlock of extractTopLevelObjects(src, arrStart)) {
    const catMatch = catBlock.match(/name:\s*'([^']+)',\s*icon:/);
    if (!catMatch) continue;
    const cat = catMatch[1];
    validSubs[cat] = [];
    validTopics[cat] = {};

    const subsIdx = catBlock.indexOf('subs:');
    if (subsIdx === -1) continue;
    const subsArrStart = catBlock.indexOf('[', subsIdx);
    if (subsArrStart === -1) continue;

    for (const subBlock of extractTopLevelObjects(catBlock, subsArrStart)) {
      const subMatch = subBlock.match(/name:\s*'([^']+)'/);
      if (!subMatch) continue;
      const sub = subMatch[1];
      validSubs[cat].push(sub);
      validTopics[cat][sub] = [];

      // topics: [...]
      const topicsMatch = subBlock.match(/topics:\s*\[([^\]]*)\]/s);
      if (topicsMatch) {
        const ts = [...topicsMatch[1].matchAll(/'([^']+)'/g)].map(m => m[1]);
        validTopics[cat][sub].push(...ts);
      }

      // subTopicMap: { 'key': ['t1','t2'] }
      const mapMatch = subBlock.match(/subTopicMap:\s*\{([\s\S]*?)\}/);
      if (mapMatch) {
        for (const arr of mapMatch[1].matchAll(/\[([^\]]*)\]/g)) {
          const ts = [...arr[1].matchAll(/'([^']+)'/g)].map(m => m[1]);
          validTopics[cat][sub].push(...ts);
        }
      }
    }
  }
  return { validSubs, validTopics };
}

// ── Parse frontmatter ────────────────────────────────────────────────────────
function parseFrontmatter(content) {
  const lines = content.split('\n');
  let fmStart = -1, fmEnd = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      if (fmStart === -1) fmStart = i;
      else { fmEnd = i; break; }
    }
  }
  if (fmStart === -1 || fmEnd === -1) return null;

  const fm = {};
  for (const line of lines.slice(fmStart + 1, fmEnd)) {
    const m = line.match(/^(\w+):\s*['"]?([^'"#\n]+?)['"]?\s*$/);
    if (m) fm[m[1]] = m[2].trim();
  }
  return { fm, fmStart, fmEnd };
}

// ── Auto-fix: import before frontmatter ─────────────────────────────────────
function fixImportPosition(content, filePath) {
  // Match one or more import lines before the first ---
  const match = content.match(/^((?:import[^\n]+\n)+\n*)(---[\s\S]*?---\n?)([\s\S]*)$/);
  if (!match) return { fixed: false, content };

  const [, imports, frontmatter, rest] = match;
  const fixed = frontmatter + imports + rest;
  writeFileSync(filePath, fixed, 'utf-8');
  return { fixed: true, content: fixed };
}

// ── Check bare $number ───────────────────────────────────────────────────────
function findBareDollars(content) {
  const issues = [];
  let inCodeBlock = false;
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('```')) inCodeBlock = !inCodeBlock;
    if (inCodeBlock) continue;
    if (/(?<!\\)\$\d/.test(lines[i])) {
      issues.push(`第 ${i + 1} 行: ${lines[i].trim().slice(0, 60)}`);
    }
  }
  return issues;
}

// ── Get changed MD/MDX files ─────────────────────────────────────────────────
function getChangedFiles() {
  // Use -c core.quotepath=false to get raw UTF-8 paths without octal encoding
  const filter = f => f && f.trim() && (f.endsWith('.md') || f.endsWith('.mdx')) && existsSync(f.trim());
  const split = out => out.trim().split('\n').map(f => f.trim()).filter(Boolean);

  // 1. Files in commits not yet pushed to remote
  try {
    const out = execSync(
      'git -c core.quotepath=false diff --name-only --diff-filter=ACMR origin/main...HEAD',
      { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }
    ).trim();
    if (out) {
      const files = split(out).filter(filter);
      if (files.length) return files;
    }
  } catch { /* no remote yet */ }

  // 2. Fallback: files changed in last commit only
  try {
    const out = execSync(
      'git -c core.quotepath=false diff --name-only --diff-filter=ACMR HEAD~1 HEAD',
      { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }
    ).trim();
    return split(out).filter(filter);
  } catch { return []; }
}

// ── Main ─────────────────────────────────────────────────────────────────────
const REQUIRED = ['title', 'description', 'category', 'pubDate'];

const { validSubs, validTopics } = loadCategoryTree();
const files = getChangedFiles();

if (files.length === 0) {
  console.log(`${G}✓ No MD/MDX files to validate${RESET}`);
  process.exit(0);
}

console.log(`\n${BOLD}${B}🔍 Pre-push MDX validator${RESET}`);
console.log(`${DIM}Checking ${files.length} file(s)...${RESET}\n`);

let totalErrors = 0;
let totalFixes = 0;

for (const file of files) {
  let content = readFileSync(file, 'utf-8');
  const errors = [];
  const fixes = [];

  // ── Auto-fix: import position ──
  const { fixed, content: fixedContent } = fixImportPosition(content, file);
  if (fixed) {
    content = fixedContent;
    fixes.push('import 已移到 frontmatter 後方');
    totalFixes++;
  }

  // ── Parse frontmatter ──
  const parsed = parseFrontmatter(content);
  if (!parsed) {
    errors.push('找不到有效的 frontmatter（---）');
  } else {
    const { fm } = parsed;

    // Required fields
    for (const field of REQUIRED) {
      if (!fm[field]) errors.push(`缺少必填欄位: ${BOLD}${field}${RESET}${R}`);
    }

    const cat = fm.category;
    const sub = fm.subcategory;
    const topic = fm.topic;

    // Valid category
    if (cat && !validSubs[cat]) {
      const valid = Object.keys(validSubs).join('、');
      errors.push(`category '${cat}' 不合法\n    可用：${valid}`);
    }

    // Valid subcategory
    if (cat && sub && validSubs[cat]) {
      if (!validSubs[cat].includes(sub)) {
        errors.push(`subcategory '${sub}' 不是 ${cat} 的合法子分類\n    可用：${validSubs[cat].join('、')}`);
      }
    }

    // topic ≠ subcategory
    if (topic && sub && topic === sub) {
      errors.push(`topic '${topic}' 不能與 subcategory 同名`);
    }

    // Valid topic
    if (topic && sub && cat && topic !== sub) {
      const ts = validTopics[cat]?.[sub] ?? [];
      if (ts.length > 0 && !ts.includes(topic)) {
        errors.push(`topic '${topic}' 不合法\n    可用：${ts.join('、')}`);
      }
    }
  }

  // ── Bare $number check ──
  const dollars = findBareDollars(content);
  for (const d of dollars) {
    errors.push(`裸 $數字（MDX 會誤判為 LaTeX）→ ${d}`);
  }

  // ── Report ──
  const icon = errors.length > 0 ? `${R}✗${RESET}` : `${G}✓${RESET}`;
  console.log(`${icon} ${BOLD}${file}${RESET}`);
  for (const fix of fixes)  console.log(`    ${G}⚡ 自動修正: ${fix}${RESET}`);
  for (const err of errors) console.log(`    ${R}✗ ${err}${RESET}`);
  if (errors.length > 0 || fixes.length > 0) console.log('');

  totalErrors += errors.length;
}

console.log('');

if (totalFixes > 0) {
  console.log(`${Y}${BOLD}⚡ 自動修正了 ${totalFixes} 個 import 位置問題${RESET}`);
  console.log(`${Y}  → 請重新 stage 並 commit 這些檔案後再 push：${RESET}`);
  console.log(`${DIM}     git add <fixed-files> && git commit --amend --no-edit${RESET}\n`);
}

if (totalErrors > 0) {
  console.log(`${R}${BOLD}✗ 發現 ${totalErrors} 個問題，push 已取消。${RESET}`);
  console.log(`${R}  請修正後重新 commit 再 push。${RESET}\n`);
  process.exit(1);
}

if (totalFixes > 0) {
  // Fixes were made but need re-commit
  process.exit(1);
}

console.log(`${G}${BOLD}✓ 全部通過，繼續 push...${RESET}\n`);
process.exit(0);
