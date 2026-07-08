#!/usr/bin/env node

/**
 * 增强的内容构建脚本
 * 修复跨平台路径问题与日期解析 Bug
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const projectRoot = process.cwd();
const contentDir = path.join(projectRoot, 'content');

function getMarkdownFiles(dir) {
  let files = [];
  if (!fs.existsSync(dir)) return files;

  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      files.push(...getMarkdownFiles(fullPath));
    } else if (item.endsWith('.md')) {
      // 统一使用正斜杠，防止 Windows 环境下的路径匹配问题
      files.push(fullPath.replace(/\\/g, '/'));
    }
  }
  return files;
}

function buildPostsFromMarkdown() {
  const postsDir = path.join(contentDir, 'posts').replace(/\\/g, '/');
  const files = getMarkdownFiles(postsDir);
  const posts = [];

  console.log(`[BUILD] 开始处理 ${files.length} 个 Markdown 文件...`);

  for (const file of files) {
    try {
      const raw = fs.readFileSync(file, 'utf-8');
      const { data, content } = matter(raw);

      // 强制转换日期为字符串，处理 gray-matter 自动转 Date 对象的问题
      const dateStr = data.date instanceof Date 
        ? data.date.toISOString().split('T')[0] 
        : String(data.date || '');

      if (!data.title || !dateStr || !data.category) {
        console.warn(`[SKIP] 文件内容缺失必要字段: ${file}`);
        continue;
      }

      const html = marked.parse(content);
      const excerpt = data.excerpt || generateExcerpt(content);
      const readingTime = calculateReadingTime(content);
      const tags = Array.isArray(data.tags) ? data.tags : [];
      
      // 生成安全的 slug
      const slug = path.basename(file, '.md');

      posts.push({
        slug,
        title: data.title,
        content: html,
        excerpt,
        date: dateStr,
        category: data.category,
        tags,
        coverImage: data.coverImage || '/favicon.svg',
        readingTime,
        draft: !!data.draft,
        author: data.author || 'Binbim',
        updatedAt: data.updatedAt || dateStr,
      });
      console.log(`[SUCCESS] 已解析: ${data.title}`);
    } catch (err) {
      console.error(`[ERROR] 解析失败 ${file}:`, err.message);
    }
  }

  return posts
    .filter(p => !p.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function generateExcerpt(content) {
  const plain = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/[#*`!\[\]\(\)]/g, '')
    .replace(/\n+/g, ' ')
    .trim();
  return plain.substring(0, 150) + (plain.length > 150 ? '...' : '');
}

function calculateReadingTime(content) {
  const chinese = (content.match(/[\u4e00-\u9fa5]/g) || []).length;
  const english = (content.match(/[a-zA-Z]+/g) || []).length;
  return Math.max(1, Math.ceil((chinese + english) / 300));
}

function generateSlug(text) {
  return String(text).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

function aggregateCategoriesAndTags(posts) {
  const catMap = new Map();
  const tagMap = new Map();
  posts.forEach(p => {
    catMap.set(p.category, (catMap.get(p.category) || 0) + 1);
    p.tags.forEach(t => tagMap.set(t, (tagMap.get(t) || 0) + 1));
  });
  return {
    categories: Array.from(catMap.entries()).map(([name, postCount]) => ({ name, postCount, slug: generateSlug(name) })),
    tags: Array.from(tagMap.entries()).map(([name, usageCount]) => ({ name, usageCount, slug: generateSlug(name) }))
  };
}

function main() {
  const distDir = path.join(projectRoot, 'dist');
  const apiDir = path.join(distDir, 'api');
  
  [apiDir, path.join(apiDir, 'posts')].forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });

  const posts = buildPostsFromMarkdown();
  const { categories, tags } = aggregateCategoriesAndTags(posts);

  const postsJson = { posts, total: posts.length, categories: categories.map(c => c.name), tags: tags.map(t => t.name) };
  
  fs.writeFileSync(path.join(apiDir, 'posts.json'), JSON.stringify(postsJson, null, 2));
  
  posts.forEach(post => {
    const pdir = path.join(apiDir, 'posts', post.slug);
    if (!fs.existsSync(pdir)) fs.mkdirSync(pdir, { recursive: true });
    fs.writeFileSync(path.join(pdir, 'index.json'), JSON.stringify({ post, related: [] }, null, 2));
  });

  console.log(`\n✅ 成功构建数据！共有 ${posts.length} 篇文章。`);
}

main();
