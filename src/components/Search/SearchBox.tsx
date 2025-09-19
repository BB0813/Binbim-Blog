import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  ClockIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { useDebounce } from '@/hooks/useDebounce';

/**
 * 搜索框属性接口
 */
export interface SearchBoxProps {
  value?: string;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  showSuggestions?: boolean;
  showHistory?: boolean;
  maxSuggestions?: number;
  maxHistory?: number;
  onSearch?: (query: string) => void;
  onChange?: (query: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
  autoFocus?: boolean;
  disabled?: boolean;
}

/**
 * 搜索框组件
 * 支持搜索建议、历史记录、自动完成等功能
 */
const SearchBox: React.FC<SearchBoxProps> = ({
  value = '',
  placeholder = '搜索文章...',
  size = 'md',
  showSuggestions = true,
  showHistory = true,
  maxSuggestions = 5,
  maxHistory = 5,
  onSearch,
  onChange,
  onFocus,
  onBlur,
  className = '',
  autoFocus = false,
  disabled = false,
}) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const debouncedQuery = useDebounce(query, 300);
  const searchHistory = useSearchHistory();

  // 模拟搜索建议（实际项目中应该从API获取）
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // 获取搜索建议
  useEffect(() => {
    if (debouncedQuery.length >= 2 && showSuggestions) {
      // 这里应该调用API获取建议，现在使用模拟数据
      const mockSuggestions = [
        'React Hooks',
        'TypeScript',
        'Vue.js',
        'JavaScript',
        'CSS Grid',
        'Node.js',
      ]
        .filter(item =>
          item.toLowerCase().includes(debouncedQuery.toLowerCase())
        )
        .slice(0, maxSuggestions);

      setSuggestions(mockSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery, showSuggestions, maxSuggestions]);

  // 获取历史记录
  const recentSearches = showHistory
    ? searchHistory
        .getRecentSearches(maxHistory)
        .filter(
          item =>
            !query || item.query.toLowerCase().includes(query.toLowerCase())
        )
    : [];

  // 合并下拉选项
  const dropdownItems = [
    ...suggestions.map(item => ({ type: 'suggestion' as const, text: item })),
    ...recentSearches.map(item => ({
      type: 'history' as const,
      text: item.query,
      timestamp: item.timestamp,
    })),
  ];

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setSelectedIndex(-1);
    onChange?.(newQuery);
  };

  // 处理搜索提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  // 执行搜索
  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setShowDropdown(false);
    inputRef.current?.blur();

    // 添加到搜索历史
    searchHistory.addSearchRecord(searchQuery.trim());

    // 触发搜索回调
    onSearch?.(searchQuery.trim());

    // 导航到搜索页面
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  // 处理焦点
  const handleFocus = () => {
    setIsFocused(true);
    setShowDropdown(true);
    onFocus?.();
  };

  // 处理失焦
  const handleBlur = (_e: React.FocusEvent) => {
    // 延迟隐藏下拉框，以便点击下拉项
    setTimeout(() => {
      if (!dropdownRef.current?.contains(document.activeElement)) {
        setIsFocused(false);
        setShowDropdown(false);
        setSelectedIndex(-1);
        onBlur?.();
      }
    }, 150);
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || dropdownItems.length === 0) {
      if (e.key === 'Enter') {
        handleSubmit(e);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < dropdownItems.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev > 0 ? prev - 1 : dropdownItems.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          performSearch(dropdownItems[selectedIndex].text);
        } else {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // 处理下拉项点击
  const handleItemClick = (text: string) => {
    setQuery(text);
    performSearch(text);
  };

  // 清空搜索
  const handleClear = () => {
    setQuery('');
    onChange?.('');
    inputRef.current?.focus();
  };

  // 尺寸样式
  const sizeClasses = {
    sm: 'h-8 text-sm',
    md: 'h-10 text-base',
    lg: 'h-12 text-lg',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className='relative'>
          <MagnifyingGlassIcon
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${iconSizes[size]} text-gray-400`}
          />
          <input
            ref={inputRef}
            type='text'
            value={query}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoFocus={autoFocus}
            disabled={disabled}
            className={`
              w-full pl-10 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg 
              bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
              placeholder-gray-500 dark:placeholder-gray-400
              focus:ring-2 focus:ring-blue-500 focus:border-transparent
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors
              ${sizeClasses[size]}
              ${isFocused ? 'ring-2 ring-blue-500 border-transparent' : ''}
            `}
          />
          {query && (
            <button
              type='button'
              onClick={handleClear}
              className={`
                absolute right-3 top-1/2 transform -translate-y-1/2 
                text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                transition-colors
              `}
            >
              <XMarkIcon className={iconSizes[size]} />
            </button>
          )}
        </div>
      </form>

      {/* 下拉建议框 */}
      {showDropdown && dropdownItems.length > 0 && (
        <div
          ref={dropdownRef}
          className='absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto'
        >
          {dropdownItems.map((item, index) => (
            <button
              key={`${item.type}-${index}`}
              onClick={() => handleItemClick(item.text)}
              className={`
                w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700
                flex items-center space-x-3 transition-colors
                ${selectedIndex === index ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
              `}
            >
              {item.type === 'suggestion' ? (
                <SparklesIcon className='w-4 h-4 text-blue-500 flex-shrink-0' />
              ) : (
                <ClockIcon className='w-4 h-4 text-gray-400 flex-shrink-0' />
              )}
              <div className='flex-1 min-w-0'>
                <div className='text-gray-900 dark:text-white truncate'>
                  {item.text}
                </div>
                {item.type === 'history' && 'timestamp' in item && (
                  <div className='text-xs text-gray-500 dark:text-gray-400'>
                    {new Date(item.timestamp).toLocaleDateString()}
                  </div>
                )}
              </div>
            </button>
          ))}

          {/* 清空历史记录选项 */}
          {recentSearches.length > 0 && (
            <div className='border-t border-gray-200 dark:border-gray-700'>
              <button
                onClick={() => {
                  searchHistory.clearHistory();
                  setShowDropdown(false);
                }}
                className='w-full px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
              >
                清空搜索历史
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
