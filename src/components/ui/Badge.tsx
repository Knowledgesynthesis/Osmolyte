import { HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { SafetyLevel } from '@/types';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | SafetyLevel;
}

export const Badge = ({ variant = 'default', className, children, ...props }: BadgeProps) => {
  return (
    <span
      className={clsx(
        'badge',
        {
          'bg-slate-100 text-slate-800': variant === 'default',
          'badge-safe': variant === 'safe',
          'badge-caution': variant === 'caution',
          'badge-danger': variant === 'danger',
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
