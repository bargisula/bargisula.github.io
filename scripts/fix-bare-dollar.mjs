#!/usr/bin/env node
/**
 * 一次性修正：把財經/一般文章裡的裸 $數字 轉義為 \$數字
 * - 與 validate-mdx.mjs 同邏輯：跳過 ``` 圍起來的程式碼區塊
 * - 跳過數學子分類（科普物理/天文物理），那裡的 $ 是合法 LaTeX
 * - 已轉義的 \$ 不重複處理（lookbehind）
 */
import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

const MATH_SUBCATEGORIES = new Set(['科普物理', '天文物理']);

function getSubcategory(content) {
  const m = content.match(/^subcategory:\s*['"]?([^'"\n]+?)['"]?\s*$/m);
  return m ? m[1].trim() : null;
}

// 列出所有 notes 內容檔
const files = execSync(
  'git -c core.quotepath=false ls-files "src/content/notes/*.md" "src/content/notes/*.mdx"',
  { encoding: 'utf-8' }
).trim().split('\n').map(f => f.trim()).filter(Boolean);

let fixedFiles = 0, fixedCount = 0;

for (const file of files) {
  let content;
  try { content = readFileSync(file, 'utf-8'); } catch { continue; }
  if (MATH_SUBCATEGORIES.has(getSubcategory(content))) continue;

  const lines = content.split('\n');
  let inCode = false, fileChanged = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('```')) { inCode = !inCode; continue; }
    if (inCode) continue;
    const before = lines[i];
    lines[i] = lines[i].replace(/(?<!\\)\$(?=\d)/g, '\\$');
    if (lines[i] !== before) {
      fileChanged += (lines[i].match(/\\\$\d/g) || []).length - (before.match(/\\\$\d/g) || []).length;
    }
  }
  if (fileChanged > 0) {
    writeFileSync(file, lines.join('\n'), 'utf-8');
    fixedFiles++;
    fixedCount += fileChanged;
  }
}

console.log(`修正 ${fixedFiles} 個檔案，共 ${fixedCount} 處裸 $數字 → \\$`);
