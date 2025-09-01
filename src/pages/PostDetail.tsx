import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  MarkdownRenderer,
  TableOfContents,
  ReadingProgress,
  ArticleMeta,
  HeadingItem,
} from '@/components/Article';
import { LazyGiscus, CommentCount } from '@/components/Giscus';
import { getGiscusConfig, validateGiscusConfig } from '@/utils/giscus';

const PostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  
  // 获取giscus配置
  const giscusConfig = getGiscusConfig();
  const isGiscusEnabled = validateGiscusConfig(giscusConfig);

  // 使用useCallback优化回调函数，避免每次渲染都创建新的函数引用
  const handleHeadingsExtracted = useCallback((extractedHeadings: HeadingItem[]) => {
    setHeadings(extractedHeadings);
  }, []);

  // 模拟文章数据
  const mockArticle = {
    title: 'React 18 新特性详解',
    author: {
      name: 'Binbim',
      avatar:
        'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20developer%20avatar%2C%20friendly%20tech%20person%2C%20modern%20style&image_size=square',
      url: '/about',
    },
    publishDate: '2024-01-15',
    updateDate: '2024-01-16',
    readingTime: 8,
    category: '前端开发',
    tags: ['React', 'JavaScript', '前端', 'Web开发'],
    views: 1250,
    likes: 89,
    content: `# React 18 新特性详解

## 概述

React 18 是 React 的一个重大版本更新，引入了许多令人兴奋的新特性和改进。本文将详细介绍这些新特性以及如何在项目中使用它们。

## 并发特性 (Concurrent Features)

### Automatic Batching

React 18 引入了自动批处理功能，这意味着 React 会自动将多个状态更新合并为一个重新渲染，以提高性能。

\`\`\`javascript
// React 18 之前
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React 会渲染两次，每次状态更新一次
}, 1000);

// React 18
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React 只会渲染一次！
}, 1000);
\`\`\`

### Suspense 改进

React 18 对 Suspense 进行了重大改进，现在支持服务端渲染和并发特性。

\`\`\`jsx
function App() {
  return (
    <Suspense fallback={<Loading />}>
      <ComponentThatSuspendsOnData />
      <Sibling />
    </Suspense>
  );
}
\`\`\`

## 新的 Hooks

### useId

\`useId\` 是一个新的 Hook，用于生成唯一的 ID，特别适用于可访问性属性。

\`\`\`javascript
function Checkbox() {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>选择我</label>
      <input id={id} type="checkbox" name="checkbox"/>
    </>
  );
}
\`\`\`

### useTransition

\`useTransition\` 允许你将状态更新标记为非紧急的，让 React 知道哪些更新可以被中断。

\`\`\`javascript
function App() {
  const [isPending, startTransition] = useTransition();
  const [count, setCount] = useState(0);
  
  function handleClick() {
    startTransition(() => {
      setCount(c => c + 1);
    });
  }
  
  return (
    <div>
      {isPending && <Spinner />}
      <button onClick={handleClick}>{count}</button>
    </div>
  );
}
\`\`\`

### useDeferredValue

\`useDeferredValue\` 让你可以延迟更新 UI 的某些部分。

\`\`\`javascript
function App() {
  const [text, setText] = useState("");
  const deferredText = useDeferredValue(text);
  
  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <SlowList text={deferredText} />
    </div>
  );
}
\`\`\`

## 严格模式的变化

React 18 的严格模式会故意双重调用某些函数，以帮助你发现副作用：

- 组件构造函数
- render 方法
- setState 更新函数
- useState、useMemo 或 useReducer 的函数

## 迁移指南

### 1. 更新到 React 18

\`\`\`bash
npm install react@18 react-dom@18
\`\`\`

### 2. 使用新的 createRoot API

\`\`\`javascript
// React 17
import ReactDOM from 'react-dom';
ReactDOM.render(<App />, document.getElementById('root'));

// React 18
import { createRoot } from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(<App />);
\`\`\`

### 3. 更新类型定义

如果你使用 TypeScript，确保更新类型定义：

\`\`\`bash
npm install @types/react@18 @types/react-dom@18
\`\`\`

## 性能优化建议

1. **使用 Suspense 进行代码分割**
2. **利用 useTransition 优化用户体验**
3. **使用 useDeferredValue 处理昂贵的计算**
4. **充分利用自动批处理**

## 总结

React 18 带来了许多激动人心的新特性，特别是并发特性的引入，为构建更好的用户体验提供了强大的工具。虽然迁移可能需要一些工作，但这些新特性绝对值得升级。

> **注意**: 在生产环境中使用这些新特性之前，请确保充分测试你的应用程序。

希望这篇文章能帮助你更好地理解和使用 React 18 的新特性！`,
  };

  return (
    <>
      {/* 阅读进度条 */}
      <ReadingProgress target='.article-content' />

      <div className='max-w-7xl mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          {/* 主要内容区域 */}
          <div className='lg:col-span-3'>
            <article className='article-content'>
              {/* 文章元信息 */}
              <ArticleMeta
                title={mockArticle.title}
                author={mockArticle.author}
                publishDate={mockArticle.publishDate}
                updateDate={mockArticle.updateDate}
                readingTime={mockArticle.readingTime}
                category={mockArticle.category}
                tags={mockArticle.tags}
                views={mockArticle.views}
                likes={mockArticle.likes}
                className='mb-8'
              />
              
              {/* 评论数量显示 */}
              {isGiscusEnabled && slug && (
                <div className='mb-4'>
                  <CommentCount 
                    repo={giscusConfig.repo}
                    pathname={`/post/${slug}`}
                    className='text-sm'
                  />
                </div>
              )}

              {/* 文章内容 */}
              <MarkdownRenderer
                content={mockArticle.content}
                onHeadingsExtracted={handleHeadingsExtracted}
                className='mb-12'
              />

              {/* 评论区域 */}
              <section className='mt-12'>
                <h2 className='text-2xl font-bold mb-6 text-gray-900 dark:text-white'>
                  评论
                </h2>
                {isGiscusEnabled && slug ? (
                  <LazyGiscus
                    repo={giscusConfig.repo}
                    repoId={giscusConfig.repoId}
                    category={giscusConfig.category}
                    categoryId={giscusConfig.categoryId}
                    threshold={0.1}
                    placeholderHeight={250}
                  />
                ) : (
                  <div className='bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6'>
                    <div className='flex items-center mb-2'>
                      <svg className='w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                        <path fillRule='evenodd' d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                      </svg>
                      <h3 className='text-sm font-medium text-yellow-800 dark:text-yellow-200'>
                        评论系统配置不完整
                      </h3>
                    </div>
                    <div className='text-sm text-yellow-700 dark:text-yellow-300'>
                      <p className='mb-2'>请完成以下配置以启用评论功能：</p>
                      <ul className='list-disc list-inside space-y-1'>
                        <li>在GitHub仓库中启用Discussions功能</li>
                        <li>访问 <a href='https://giscus.app' target='_blank' rel='noopener noreferrer' className='underline hover:text-yellow-600 dark:hover:text-yellow-200'>giscus.app</a> 获取配置参数</li>
                        <li>在.env文件中设置正确的VITE_GISCUS_CATEGORY和VITE_GISCUS_CATEGORY_ID</li>
                      </ul>
                    </div>
                  </div>
                )}
              </section>
            </article>
          </div>

          {/* 侧边栏 */}
          <div className='lg:col-span-1'>
            <div className='sticky top-8 space-y-6'>
              {/* 目录导航 */}
              <TableOfContents headings={headings} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostDetail;
