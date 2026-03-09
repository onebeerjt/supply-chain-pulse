import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/10 bg-card/70 backdrop-blur-md transition duration-300 hover:border-cyan-300/20',
        className
      )}
      {...props}
    />
  );
}
