import React, { useEffect, useState } from 'react';
import { Eye, Users } from 'lucide-react';

interface WebvisoStatsProps {
  className?: string;
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

interface StatsData {
  pv: number;
  uv: number;
  loading: boolean;
  error: string | null;
}

/**
 * Webviso 统计组件
 * 集成 webviso.yestool.org 的 PV/UV 统计功能
 */
const WebvisoStats: React.FC<WebvisoStatsProps> = ({
  className = '',
  showLabels = true,
  size = 'md',
}) => {
  const [stats, setStats] = useState<StatsData>({
    pv: 0,
    uv: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchStats = () => {
      try {
        setStats(prev => ({ ...prev, loading: true, error: null }));

        // 等待 Webviso 脚本加载完成
        const checkWebviso = () => {
          // 检查 Webviso 是否已经在页面中创建了统计元素
          const pageUvElement = document.getElementById('page_uv');
          const pagePvElement = document.getElementById('page_pv');

          if (pageUvElement && pagePvElement) {
            // 如果元素存在，尝试获取数据
            const uvText = pageUvElement.textContent || '0';
            const pvText = pagePvElement.textContent || '0';

            const uv = parseInt(uvText) || 0;
            const pv = parseInt(pvText) || 0;

            setStats({
              pv: pv,
              uv: uv,
              loading: false,
              error: null,
            });
          } else {
            // 如果元素不存在，创建隐藏的统计元素让 Webviso 填充
            if (!document.getElementById('page_pv')) {
              const pvSpan = document.createElement('span');
              pvSpan.id = 'page_pv';
              pvSpan.style.display = 'none';
              document.body.appendChild(pvSpan);
            }

            if (!document.getElementById('page_uv')) {
              const uvSpan = document.createElement('span');
              uvSpan.id = 'page_uv';
              uvSpan.style.display = 'none';
              document.body.appendChild(uvSpan);
            }

            // 继续检查
            setTimeout(checkWebviso, 500);
          }
        };

        // 延迟检查，确保 Webviso 脚本有时间加载
        setTimeout(checkWebviso, 1000);
      } catch (error) {
        console.error('Failed to fetch webviso stats:', error);
        setStats(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : '获取统计数据失败',
        }));
      }
    };

    fetchStats();
  }, []);

  // 格式化数字显示
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // 根据尺寸设置样式
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'text-sm',
          icon: 'w-4 h-4',
          number: 'text-lg',
          label: 'text-xs',
        };
      case 'lg':
        return {
          container: 'text-lg',
          icon: 'w-6 h-6',
          number: 'text-3xl',
          label: 'text-sm',
        };
      default:
        return {
          container: 'text-base',
          icon: 'w-5 h-5',
          number: 'text-2xl',
          label: 'text-sm',
        };
    }
  };

  const sizeClasses = getSizeClasses();

  if (stats.loading) {
    return (
      <div
        className={`flex items-center space-x-4 ${sizeClasses.container} ${className}`}
      >
        <div className='animate-pulse flex items-center space-x-2'>
          <div
            className={`bg-gray-200 dark:bg-gray-700 rounded ${sizeClasses.icon}`}
          ></div>
          <div className='bg-gray-200 dark:bg-gray-700 rounded h-4 w-8'></div>
        </div>
        <div className='animate-pulse flex items-center space-x-2'>
          <div
            className={`bg-gray-200 dark:bg-gray-700 rounded ${sizeClasses.icon}`}
          ></div>
          <div className='bg-gray-200 dark:bg-gray-700 rounded h-4 w-8'></div>
        </div>
      </div>
    );
  }

  if (stats.error) {
    return (
      <div
        className={`text-gray-500 dark:text-gray-400 ${sizeClasses.container} ${className}`}
      >
        <span className='text-xs'>统计数据暂不可用</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center space-x-4 ${sizeClasses.container} ${className}`}
    >
      {/* PV 统计 */}
      <div className='flex items-center space-x-1'>
        <Eye
          className={`text-blue-600 dark:text-blue-400 ${sizeClasses.icon}`}
        />
        <span
          className={`font-bold text-gray-900 dark:text-white ${sizeClasses.number}`}
        >
          {formatNumber(stats.pv)}
        </span>
        {showLabels && (
          <span
            className={`text-gray-500 dark:text-gray-400 ${sizeClasses.label}`}
          >
            PV
          </span>
        )}
      </div>

      {/* UV 统计 */}
      <div className='flex items-center space-x-1'>
        <Users
          className={`text-green-600 dark:text-green-400 ${sizeClasses.icon}`}
        />
        <span
          className={`font-bold text-gray-900 dark:text-white ${sizeClasses.number}`}
        >
          {formatNumber(stats.uv)}
        </span>
        {showLabels && (
          <span
            className={`text-gray-500 dark:text-gray-400 ${sizeClasses.label}`}
          >
            UV
          </span>
        )}
      </div>
    </div>
  );
};

export default WebvisoStats;
