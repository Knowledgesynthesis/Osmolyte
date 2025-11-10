import { HTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'siadh' | 'csw' | 'di';
}

export const Card = ({ variant = 'default', className, children, ...props }: CardProps) => {
  return (
    <div
      className={clsx(
        'card',
        {
          'card-siadh': variant === 'siadh',
          'card-csw': variant === 'csw',
          'card-di': variant === 'di',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={clsx('mb-4', className)} {...props}>
      {children}
    </div>
  );
};

export const CardTitle = ({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <h3 className={clsx('text-lg font-semibold', className)} {...props}>
      {children}
    </h3>
  );
};

export const CardContent = ({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={clsx(className)} {...props}>
      {children}
    </div>
  );
};
