import React from 'react';
import { MapPinIcon, LinkIcon, MailIcon, CalendarIcon } from 'lucide-react';
import { Card } from '@/components/UI';

interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
}

interface ProfileCardProps {
  name: string;
  avatar: string;
  bio: string;
  location?: string;
  website?: string;
  email?: string;
  joinDate?: string;
  socialLinks?: SocialLink[];
  stats?: {
    posts: number;
    views: number;
    likes: number;
  };
  className?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  avatar,
  bio,
  location,
  website,
  email,
  joinDate,
  socialLinks = [],
  stats,
  className = '',
}) => {
  return (
    <Card className={`p-6 ${className}`}>
      <div className='text-center'>
        {/* 头像 */}
        <div className='relative inline-block mb-4'>
          <img
            src={avatar}
            alt={`${name}的头像`}
            className='w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg'
            onError={e => {
              const target = e.target as HTMLImageElement;
              target.src = `https://q1.qlogo.cn/g?b=qq&nk=1721822150&s=640`;
            }}
          />
          {/* 在线状态指示器 */}
          <div className='absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-2 border-white dark:border-gray-700 rounded-full'></div>
        </div>

        {/* 姓名 */}
        <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-2'>
          {name}
        </h2>

        {/* 简介 */}
        <p className='text-gray-600 dark:text-gray-300 mb-4 leading-relaxed'>
          {bio}
        </p>

        {/* 基本信息 */}
        <div className='space-y-2 mb-4 text-sm text-gray-500 dark:text-gray-400'>
          {location && (
            <div className='flex items-center justify-center gap-1'>
              <MapPinIcon className='w-4 h-4' />
              <span>{location}</span>
            </div>
          )}

          {website && (
            <div className='flex items-center justify-center gap-1'>
              <LinkIcon className='w-4 h-4' />
              <a
                href={website}
                target='_blank'
                rel='noopener noreferrer'
                className='hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
              >
                个人网站
              </a>
            </div>
          )}

          {email && (
            <div className='flex items-center justify-center gap-1'>
              <MailIcon className='w-4 h-4' />
              <a
                href={`mailto:${email}`}
                className='hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
              >
                联系我
              </a>
            </div>
          )}

          {joinDate && (
            <div className='flex items-center justify-center gap-1'>
              <CalendarIcon className='w-4 h-4' />
              <span>
                加入于 {new Date(joinDate).toLocaleDateString('zh-CN')}
              </span>
            </div>
          )}
        </div>

        {/* 统计信息 */}
        {stats && (
          <div className='grid grid-cols-3 gap-4 py-4 border-t border-gray-200 dark:border-gray-700 mb-4'>
            <div className='text-center'>
              <div className='text-lg font-bold text-gray-900 dark:text-white'>
                {stats.posts}
              </div>
              <div className='text-xs text-gray-500 dark:text-gray-400'>
                文章
              </div>
            </div>
            <div className='text-center'>
              <div className='text-lg font-bold text-gray-900 dark:text-white'>
                {stats.views.toLocaleString()}
              </div>
              <div className='text-xs text-gray-500 dark:text-gray-400'>
                阅读
              </div>
            </div>
            <div className='text-center'>
              <div className='text-lg font-bold text-gray-900 dark:text-white'>
                {stats.likes}
              </div>
              <div className='text-xs text-gray-500 dark:text-gray-400'>
                点赞
              </div>
            </div>
          </div>
        )}

        {/* 社交链接 */}
        {socialLinks.length > 0 && (
          <div className='flex justify-center space-x-3'>
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target='_blank'
                rel='noopener noreferrer'
                className='p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors'
                title={link.name}
              >
                {link.icon}
              </a>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProfileCard;
