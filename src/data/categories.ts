export type SubDef = {
  name: string;
  topics: string[];
  subTopicMap?: Record<string, string[]>;
};

export type CatDef = {
  name: string;
  icon: string;
  subs: SubDef[];
  label?: string;
  hideSubs?: boolean;
};

export const CATEGORY_TREE: CatDef[] = [
  {
    name: '經濟', icon: '📈', label: 'Claude',
    subs: [
      { name: '經濟思想史', topics: [] },
      { name: '商業革命', topics: [] },
      { name: '工業革命', topics: [] },
      { name: '名家巨著', topics: ['Barro宏觀', 'Mankiw總體', 'Krugman總體', '貨幣', '國際經濟', '政治經濟學', '經濟成長與景氣循環'] },
    ],
  },
  {
    name: '投資', icon: '💹', label: 'Claude',
    subs: [
      { name: '當月快訊', topics: [] },
      { name: '理財日報', topics: [] },
      {
        name: '美股',
        topics: ['產業分析', '特斯拉', '美債與利率', '財報分析', '公司底稿'],
        subTopicMap: { '產業分析': ['AI基礎設施', '半導體', '太空與國防', '選股模型'] },
      },
      { name: '台股', topics: ['盤前', '盤後', '台股快報', '產業分析', '公司底稿'] },
      { name: '總經速描', topics: [] },
      { name: '其他投資', topics: ['不動產', '黃金', '比特幣'] },
    ],
  },
  {
    name: '軍事', icon: '⚔️', label: 'Gemini',
    subs: [
      { name: '區域防禦', topics: [] },
      { name: '武器裝備', topics: [] },
      { name: '台海分析', topics: [] },
    ],
  },
  {
    name: '國際情勢', icon: '🌐', label: 'GPT',
    subs: [
      { name: '中國', topics: ['週報'] },
      { name: '日本', topics: ['週報'] },
      { name: '印度', topics: ['週報'] },
      { name: '韓國', topics: ['週報'] },
      { name: '歐洲', topics: ['週報'] },
    ],
  },
  {
    name: '小書', icon: '📖', label: 'meta',
    subs: [
      { name: '福建人的海洋500年', topics: [] },
      { name: '紅毛、海賊與十字架', topics: [] },
      { name: '微觀看歷史', topics: [] },
    ],
  },
  {
    name: '勞動', icon: '⚖️', label: 'Gemini',
    subs: [
      { name: '勞動日報', topics: [] },
      { name: '勞動法規', topics: [] },
      { name: '勞工保險', topics: [] },
    ],
  },
  {
    name: '商業故事', icon: '🏢', label: 'Claude',
    subs: [
      { name: '個案研究', topics: ['品牌沉浮', '危機轉型', '競爭格局', '框架方法'] },
      { name: '商業追蹤', topics: [] },
    ],
  },
  {
    name: 'Xompass', icon: '🧭', label: 'Claude',
    subs: [
      { name: '關於 Xompass', topics: [] },
      { name: '知識機制', topics: [] },
      { name: '會議記錄', topics: [] },
      { name: '投資報告', topics: ['璞玉報告', '總經報告', '個股研究', '績效檢討'] },
    ],
  },
  {
    name: '雜記', icon: '🗒️', label: 'meta',
    subs: [
      { name: '快速學習', topics: [] },
      { name: '人體的功能', topics: [] },
      { name: '天文物理', topics: ['時間與時空', '宇宙的誕生', '宇宙模型', '暗物質與暗能量', '黑洞'] },
      { name: '科普物理', topics: ['力學', '波動', '聲學', '光學', '電磁學', '熱學', '能量', '量子力學', '粒子物理'] },
      { name: '心理與腦', topics: ['心理學'] },
      { name: '歷史', topics: ['東亞海洋史-15至17世紀', '日本戰國專題', '日本幕末時代', '新選組', '洋務運動'] },
      { name: 'GitHub 專案', topics: [] },
      { name: '隨手記', topics: [] },
    ],
  },
];

export function getValidSubcategories(category: string): string[] {
  return CATEGORY_TREE.find(c => c.name === category)?.subs.map(s => s.name) ?? [];
}

export function getValidTopics(category: string, subcategory: string): string[] {
  const subDef = CATEGORY_TREE.find(c => c.name === category)?.subs.find(s => s.name === subcategory);
  if (!subDef) return [];
  const allSubTopics = Object.values(subDef.subTopicMap ?? {}).flat();
  return [...subDef.topics, ...allSubTopics];
}
