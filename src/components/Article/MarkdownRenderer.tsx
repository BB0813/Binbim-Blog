import React, { useEffect, useState, useCallback } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

export interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

interface MarkdownRendererProps {
  content: string;
  onHeadingsExtracted?: (headings: HeadingItem[]) => void;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  onHeadingsExtracted,
  className = '',
}) => {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // 使用useCallback优化回调函数，避免每次渲染都创建新的函数引用
  const stableOnHeadingsExtracted = useCallback(
    (headings: HeadingItem[]) => {
      onHeadingsExtracted?.(headings);
    },
    [onHeadingsExtracted]
  );

  useEffect(() => {
    const processMarkdown = async () => {
      setIsLoading(true);

      // 自定义渲染器来添加标题ID和代码高亮
      const renderer = new marked.Renderer();
      const headings: HeadingItem[] = [];

      // 重写heading渲染器
      renderer.heading = function ({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        const id = text
          .toLowerCase()
          .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
          .replace(/^-+|-+$/g, '');

        headings.push({ id, text, level: depth });

        return `<h${depth} id="${id}" class="scroll-mt-20">${text}</h${depth}>`;
      };

      // 重写code渲染器以支持语法高亮
      renderer.code = function ({ text, lang }) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            const highlighted = hljs.highlight(text, { language: lang }).value;
            return `<pre><code class="hljs language-${lang}">${highlighted}</code></pre>`;
          } catch (err) {
            console.warn('Highlight.js error:', err);
          }
        }
        return `<pre><code>${text}</code></pre>`;
      };

      // 配置 marked
      marked.setOptions({
        renderer,
        breaks: true,
        gfm: true,
      });

      try {
        const html = await marked.parse(content);
        setHtmlContent(html);

        // 使用稳定的回调函数引用
        stableOnHeadingsExtracted(headings);
      } catch (error) {
        console.error('Markdown parsing error:', error);
        setHtmlContent('<p>内容解析失败</p>');
      } finally {
        setIsLoading(false);
      }
    };

    processMarkdown();
  }, [content, stableOnHeadingsExtracted]); // 使用稳定的回调函数引用

  // 在内容更新后应用代码高亮（作为备用方案）
  useEffect(() => {
    if (!isLoading && htmlContent) {
      // 使用 setTimeout 确保 DOM 已更新
      const timer = setTimeout(() => {
        const codeBlocks = document.querySelectorAll('pre code:not(.hljs)');
        codeBlocks.forEach(block => {
          // 只对未高亮的代码块进行处理
          hljs.highlightElement(block as HTMLElement);
        });
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [htmlContent, isLoading]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
        <span className='ml-2 text-gray-600 dark:text-gray-400'>加载中...</span>
      </div>
    );
  }

  return (
    <div
      className={`prose prose-lg dark:prose-invert max-w-none
        prose-headings:scroll-mt-20
        prose-pre:bg-gray-900 prose-pre:text-gray-100
        prose-code:bg-gray-100 dark:prose-code:bg-gray-800
        prose-code:px-1 prose-code:py-0.5 prose-code:rounded
        prose-code:text-sm prose-code:font-mono
        prose-blockquote:border-l-blue-500
        prose-a:text-blue-600 dark:prose-a:text-blue-400
        prose-strong:text-gray-900 dark:prose-strong:text-gray-100 ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default MarkdownRenderer;
