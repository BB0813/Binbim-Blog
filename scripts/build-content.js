#!/usr/bin/env node

/**
 * 简单的内容验证脚本
 * 验证content目录结构和文件
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = path.join(__dirname, '..');
const contentDir = path.join(projectRoot, 'content');

function validateContentStructure() {
  console.log('🔍 验证内容结构...');

  const errors = [];
  const warnings = [];

  // 检查content目录
  if (!fs.existsSync(contentDir)) {
    errors.push('content目录不存在');
    return { valid: false, errors, warnings };
  }

  // 检查posts目录
  const postsDir = path.join(contentDir, 'posts');
  if (!fs.existsSync(postsDir)) {
    warnings.push('posts目录不存在');
  } else {
    const postFiles = getMarkdownFiles(postsDir);
    console.log(`📝 找到 ${postFiles.length} 篇文章`);
    postFiles.forEach(file => {
      console.log(`  - ${path.relative(contentDir, file)}`);
    });
  }

  // 检查config目录
  const configDir = path.join(contentDir, 'config');
  if (!fs.existsSync(configDir)) {
    warnings.push('config目录不存在');
  } else {
    const blogConfigPath = path.join(configDir, 'blog.json');
    if (fs.existsSync(blogConfigPath)) {
      console.log('⚙️  找到博客配置文件');
      try {
        const config = JSON.parse(fs.readFileSync(blogConfigPath, 'utf-8'));
        console.log(`  - 博客标题: ${config.title}`);
        console.log(`  - 作者: ${config.author?.name}`);
      } catch (error) {
        errors.push('博客配置文件格式错误');
      }
    } else {
      warnings.push('博客配置文件不存在');
    }
  }

  // 检查pages目录
  const pagesDir = path.join(contentDir, 'pages');
  if (!fs.existsSync(pagesDir)) {
    warnings.push('pages目录不存在');
  } else {
    const pageFiles = getMarkdownFiles(pagesDir);
    console.log(`📄 找到 ${pageFiles.length} 个页面`);
    pageFiles.forEach(file => {
      console.log(`  - ${path.relative(contentDir, file)}`);
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

function getMarkdownFiles(dir) {
  const files = [];

  if (!fs.existsSync(dir)) {
    return files;
  }

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...getMarkdownFiles(fullPath));
    } else if (item.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

function testMarkdownParsing() {
  console.log('\n📖 测试Markdown解析...');

  const postsDir = path.join(contentDir, 'posts');
  const postFiles = getMarkdownFiles(postsDir);

  if (postFiles.length === 0) {
    console.log('⚠️  没有找到文章文件');
    return;
  }

  // 测试第一篇文章
  const firstPost = postFiles[0];
  console.log(`🧪 解析文章: ${path.relative(contentDir, firstPost)}`);

  try {
    const content = fs.readFileSync(firstPost, 'utf-8');

    // 简单的前置元数据检查
    if (content.startsWith('---')) {
      const endIndex = content.indexOf('---', 3);
      if (endIndex > 0) {
        const frontMatter = content.substring(4, endIndex).trim();
        console.log('✅ 找到前置元数据');

        // 检查必要字段
        const lines = frontMatter.split('\n');
        const fields = {};
        lines.forEach(line => {
          const [key, ...valueParts] = line.split(':');
          if (key && valueParts.length > 0) {
            fields[key.trim()] = valueParts.join(':').trim();
          }
        });

        const requiredFields = ['title', 'date', 'category'];
        const missingFields = requiredFields.filter(field => !fields[field]);

        if (missingFields.length === 0) {
          console.log('✅ 所有必要字段都存在');
          console.log(`  - 标题: ${fields.title}`);
          console.log(`  - 日期: ${fields.date}`);
          console.log(`  - 分类: ${fields.category}`);
        } else {
          console.log(`❌ 缺少必要字段: ${missingFields.join(', ')}`);
        }
      } else {
        console.log('❌ 前置元数据格式错误');
      }
    } else {
      console.log('❌ 没有找到前置元数据');
    }
  } catch (error) {
    console.log(`❌ 解析失败: ${error.message}`);
  }
}

function createApiStructure() {
  console.log('\n🏗️  创建API目录结构...');

  const distDir = path.join(projectRoot, 'dist');
  const apiDir = path.join(distDir, 'api');

  // 创建目录
  const dirs = [
    apiDir,
    path.join(apiDir, 'posts'),
    path.join(apiDir, 'categories'),
    path.join(apiDir, 'tags'),
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 创建目录: ${path.relative(projectRoot, dir)}`);
    }
  });

  const posts = buildPostsFromMarkdown();
  const { categories, tags } = aggregateCategoriesAndTags(posts);
  const stats = buildStats(posts, categories, tags);

  const postsJson = {
    posts,
    total: posts.length,
    categories: categories.map(c => c.name),
    tags: tags.map(t => t.name),
  };

  fs.writeFileSync(path.join(apiDir, 'posts.json'), JSON.stringify(postsJson, null, 2));
  console.log(`📄 创建文件: ${path.relative(projectRoot, path.join(apiDir, 'posts.json'))}`);

  fs.writeFileSync(
    path.join(apiDir, 'categories.json'),
    JSON.stringify({ categories }, null, 2)
  );
  console.log(`📄 创建文件: ${path.relative(projectRoot, path.join(apiDir, 'categories.json'))}`);

  fs.writeFileSync(path.join(apiDir, 'tags.json'), JSON.stringify({ tags }, null, 2));
  console.log(`📄 创建文件: ${path.relative(projectRoot, path.join(apiDir, 'tags.json'))}`);

  fs.writeFileSync(path.join(apiDir, 'stats.json'), JSON.stringify(stats, null, 2));
  console.log(`📄 创建文件: ${path.relative(projectRoot, path.join(apiDir, 'stats.json'))}`);

  writePerPostIndex(apiDir, posts);
}

async function main() {
  console.log('🚀 内容管理系统验证开始...');
  console.log(`📁 项目根目录: ${projectRoot}`);
  console.log(`📁 内容目录: ${contentDir}`);

  try {
    // 验证内容结构
    const validation = validateContentStructure();

    if (validation.warnings.length > 0) {
      console.log('\n⚠️  警告:');
      validation.warnings.forEach(warning => {
        console.log(`  - ${warning}`);
      });
    }

    if (!validation.valid) {
      console.log('\n❌ 错误:');
      validation.errors.forEach(error => {
        console.log(`  - ${error}`);
      });
      process.exit(1);
    }

    // 测试Markdown解析
    testMarkdownParsing();

    createApiStructure();

    console.log('\n✅ 内容管理系统验证完成！');
    console.log('\n📊 下一步:');
    console.log('  1. 完善TypeScript编译配置');
    console.log('  2. 集成到Vite构建流程');
    console.log('  3. 实现前端数据获取逻辑');
  } catch (error) {
    console.error('❌ 验证失败:', error.message);
    process.exit(1);
  }
}

// 运行主函数
main();

function buildPostsFromMarkdown() {
  const postsDir = path.join(contentDir, 'posts');
  const files = getMarkdownFiles(postsDir);
  const posts = [];

    for (const file of files) {
      console.log(`[DEBUG] 正在处理文件: ${file}`);
      try {
        const raw = fs.readFileSync(file, 'utf-8');
        const { data, content } = matter(raw);
        if (!data.title || !data.date || !data.category) {
          console.log(`[DEBUG] 文件 ${file} 缺少必要字段: title=${!!data.title}, date=${!!data.date}, category=${!!data.category}`);
          continue;
        }
        console.log(`[DEBUG] 文件 ${file} 解析成功: ${data.title}`);
      const html = marked.parse(content);
      const excerpt = generateExcerpt(content);
      const readingTime = calculateReadingTime(content);
      const tags = Array.isArray(data.tags) ? data.tags : [];
      const slug = getFileSlug(file);
      posts.push({
        slug,
        title: data.title,
        content: html,
        excerpt,
        date: data.date,
        category: data.category,
        tags,
        coverImage: data.coverImage,
        readingTime,
        draft: !!data.draft,
        author: data.author,
        updatedAt: data.updatedAt,
      });
    } catch {}
  }

  return posts
    .filter(p => !p.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function getFileSlug(file) {
  const name = path.basename(file, '.md');
  if (name && name !== 'index') return name;
  return '';
}

function aggregateCategoriesAndTags(posts) {
  const catMap = new Map();
  const tagMap = new Map();

  posts.forEach(p => {
    catMap.set(p.category, (catMap.get(p.category) || 0) + 1);
    p.tags.forEach(t => tagMap.set(t, (tagMap.get(t) || 0) + 1));
  });

  const categories = Array.from(catMap.entries())
    .map(([name, postCount]) => ({ name, postCount, slug: generateSlug(name) }))
    .sort((a, b) => b.postCount - a.postCount);

  const tags = Array.from(tagMap.entries())
    .map(([name, usageCount]) => ({ name, usageCount, slug: generateSlug(name) }))
    .sort((a, b) => b.usageCount - a.usageCount);

  return { categories, tags };
}

function buildStats(posts, categories, tags) {
  const totalWords = posts.reduce((sum, post) => {
    const plain = post.content.replace(/<[^>]*>/g, '');
    const chinese = (plain.match(/[\u4e00-\u9fa5]/g) || []).length;
    const english = (plain.match(/[a-zA-Z]+/g) || []).length;
    return sum + chinese + english;
  }, 0);

  const totalReadingTime = posts.reduce((sum, p) => sum + (p.readingTime || 0), 0);
  const averageReadingTime = posts.length > 0 ? Math.round((totalReadingTime / posts.length) * 10) / 10 : 0;

  const lastUpdated = posts.length > 0
    ? posts.reduce((latest, p) => {
        const d = new Date(p.updatedAt || p.date);
        return d > latest ? d : latest;
      }, new Date(posts[0].updatedAt || posts[0].date)).toISOString()
    : new Date().toISOString();

  return {
    totalPosts: posts.length,
    totalCategories: categories.length,
    totalTags: tags.length,
    totalWords,
    averageReadingTime,
    lastUpdated,
  };
}

function generateExcerpt(content) {
  const plain = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/#{1,6}\s/g, '')
    .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const maxLength = 150;
  if (plain.length <= maxLength) return plain;
  const truncated = plain.substring(0, maxLength);
  const i = truncated.lastIndexOf(' ');
  return i > maxLength * 0.8 ? truncated.substring(0, i) + '...' : truncated + '...';
}

function calculateReadingTime(content) {
  const plain = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/#{1,6}\s/g, '')
    .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1')
    .replace(/\n/g, ' ')
    .trim();
  const chinese = (plain.match(/[\u4e00-\u9fa5]/g) || []).length;
  const english = (plain.match(/[a-zA-Z]+/g) || []).length;
  const total = chinese + english;
  return Math.max(1, Math.ceil(total / 200));
}

function generateSlug(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function writePerPostIndex(apiDir, posts) {
  const dir = path.join(apiDir, 'posts');
  posts.forEach(post => {
    const pdir = path.join(dir, post.slug);
    if (!fs.existsSync(pdir)) fs.mkdirSync(pdir, { recursive: true });
    const related = getRelatedPosts(posts, post);
    const data = { post, related };
    fs.writeFileSync(path.join(pdir, 'index.json'), JSON.stringify(data, null, 2));
  });
}

function getRelatedPosts(all, target) {
  const others = all.filter(p => p.slug !== target.slug);
  const scored = others.map(p => {
    const inter = new Set(target.tags.filter(t => p.tags.includes(t)));
    const union = new Set([...target.tags, ...p.tags]);
    const tagScore = union.size > 0 ? inter.size / union.size : 0;
    const categoryScore = target.category === p.category ? 0.5 : 0;
    return { post: p, score: tagScore * 0.7 + categoryScore * 0.3 };
  });
  return scored
    .filter(x => x.score >= 0.3)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(x => x.post);
}
