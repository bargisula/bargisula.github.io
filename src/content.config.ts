import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { getValidSubcategories, getValidTopics } from './data/categories';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: z.optional(image()),
      category: z.enum(['投資', '科技', '生活', '策略', '其他']).default('其他'),
    }),
});

const notes = defineCollection({
  loader: glob({ base: './src/content/notes', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['經濟', '投資', '軍事', '小書', '勞動', '雜記', '國際情勢', '商業故事']),
    subcategory: z.string().optional(),
    topic: z.string().optional(),
    series: z.string().optional(),
    seriesOrder: z.number().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
  }).superRefine((data, ctx) => {
    if (data.subcategory !== undefined) {
      const valid = getValidSubcategories(data.category);
      if (valid.length > 0 && !valid.includes(data.subcategory)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['subcategory'],
          message: `'${data.subcategory}' 不是 ${data.category} 的合法子分類。可用：${valid.join('、')}`,
        });
      }
    }
    if (data.topic !== undefined && data.subcategory !== undefined) {
      if (data.topic === data.subcategory) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['topic'],
          message: `topic 不能與 subcategory 同名（'${data.topic}'），這會產生多餘的卡片層。`,
        });
      } else {
        const valid = getValidTopics(data.category, data.subcategory);
        if (valid.length > 0 && !valid.includes(data.topic)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['topic'],
            message: `'${data.topic}' 不是 ${data.category}/${data.subcategory} 的合法 topic。可用：${valid.join('、')}`,
          });
        }
      }
    }
  }),
});

export const collections = { blog, notes };
