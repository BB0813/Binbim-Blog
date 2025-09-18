import { GiscusConfig } from '@/types/giscus';

/**
 * 获取giscus配置
 * @returns GiscusConfig 配置对象
 */
export function getGiscusConfig(): GiscusConfig {
  return {
    repo: import.meta.env.VITE_GISCUS_REPO || '',
    repoId: import.meta.env.VITE_GISCUS_REPO_ID || '',
    category: import.meta.env.VITE_GISCUS_CATEGORY || '',
    categoryId: import.meta.env.VITE_GISCUS_CATEGORY_ID || '',
    mapping: 'pathname',
    strict: false,
    reactionsEnabled: true,
    emitMetadata: true,
    inputPosition: 'bottom',
    theme: 'preferred_color_scheme',
    lang: 'zh-CN',
    loading: 'lazy'
  };
}

/**
 * 验证giscus配置是否完整
 * @param config 配置对象
 * @returns boolean 是否有效
 */
export function validateGiscusConfig(config: Partial<GiscusConfig>): boolean {
  const required = ['repo', 'repoId', 'category', 'categoryId'];
  return required.every(key => {
    const value = config[key as keyof GiscusConfig];
    return typeof value === 'string' && value.trim() !== '' && !value.includes('[在此输入');
  });
}

/**
 * 生成GitHub讨论链接
 * @param repo 仓库名称
 * @param pathname 路径名
 * @returns string 讨论链接
 */
export function generateDiscussionUrl(repo: string, pathname: string): string {
  const encodedPath = encodeURIComponent(pathname);
  return `https://github.com/${repo}/discussions?discussions_q=${encodedPath}`;
}

/**
 * 根据主题获取giscus主题名称
 * @param theme 当前主题
 * @returns string giscus主题名称
 */
export function getGiscusTheme(theme: 'light' | 'dark' | 'auto'): string {
  switch (theme) {
    case 'dark':
      return 'dark';
    case 'light':
      return 'light';
    case 'auto':
    default:
      return 'preferred_color_scheme';
  }
}

/**
 * 创建giscus脚本元素
 * @param config giscus配置
 * @returns HTMLScriptElement 脚本元素
 */
export function createGiscusScript(config: GiscusConfig): HTMLScriptElement {
  const script = document.createElement('script');
  script.src = 'https://giscus.app/client.js';
  script.setAttribute('data-repo', config.repo);
  script.setAttribute('data-repo-id', config.repoId);
  script.setAttribute('data-category', config.category);
  script.setAttribute('data-category-id', config.categoryId);
  script.setAttribute('data-mapping', config.mapping);
  script.setAttribute('data-strict', config.strict.toString());
  script.setAttribute('data-reactions-enabled', config.reactionsEnabled.toString());
  script.setAttribute('data-emit-metadata', config.emitMetadata.toString());
  script.setAttribute('data-input-position', config.inputPosition);
  script.setAttribute('data-theme', config.theme);
  script.setAttribute('data-lang', config.lang);
  if (config.loading) {
    script.setAttribute('data-loading', config.loading);
  }
  script.crossOrigin = 'anonymous';
  script.async = true;
  
  return script;
}

/**
 * 发送消息到giscus iframe
 * @param message 消息内容
 */
export function sendMessageToGiscus(message: Record<string, unknown>): void {
  const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage(message, 'https://giscus.app');
  }
}

/**
 * 更新giscus主题
 * @param theme 新主题
 */
export function updateGiscusTheme(theme: string): void {
  sendMessageToGiscus({
    giscus: {
      setConfig: {
        theme
      }
    }
  });
}

/**
 * 检查giscus是否已加载
 * @returns boolean 是否已加载
 */
export function isGiscusLoaded(): boolean {
  return !!document.querySelector('iframe.giscus-frame');
}