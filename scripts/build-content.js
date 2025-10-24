#!/usr/bin/env node

/**
 * 简单的内容验证脚本
 * 验证content目录结构和文件
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

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

  // 创建示例API文件
  const sampleData = {
    posts: [],
    total: 0,
    categories: [],
    tags: [],
  };

  const apiFiles = [
    { path: path.join(apiDir, 'posts.json'), data: sampleData },
    { path: path.join(apiDir, 'categories.json'), data: { categories: [] } },
    { path: path.join(apiDir, 'tags.json'), data: { tags: [] } },
    {
      path: path.join(apiDir, 'stats.json'),
      data: { totalPosts: 0, totalCategories: 0, totalTags: 0 },
    },
  ];

  apiFiles.forEach(({ path: filePath, data }) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`📄 创建文件: ${path.relative(projectRoot, filePath)}`);
  });
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

    // 创建API结构
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
