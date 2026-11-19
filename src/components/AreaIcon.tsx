import React from 'react';
import { Database, Globe, Server, Smartphone, Terminal } from 'lucide-react';
import type { CourseArea } from '../types/course';
import { AREA_STYLES } from '../content/loader';

interface AreaIconProps {
  area: CourseArea;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AreaIcon: React.FC<AreaIconProps> = ({
  area,
  className = '',
  size = 'md',
}) => {
  const style = AREA_STYLES[area];
  const iconSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';
  const boxSize =
    size === 'sm' ? 'w-8 h-8 rounded-lg' : size === 'lg' ? 'w-12 h-12 rounded-xl' : 'w-10 h-10 rounded-xl';

  const Icon =
    style.iconName === 'Globe'
      ? Globe
      : style.iconName === 'Terminal'
        ? Terminal
        : style.iconName === 'Database'
          ? Database
          : style.iconName === 'Server'
            ? Server
            : Smartphone;

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 ${boxSize} ${style.colorBgSoft} ${style.colorText} ${className}`}
      aria-hidden="true"
    >
      <Icon className={iconSize} strokeWidth={1.85} />
    </span>
  );
};
