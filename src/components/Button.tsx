import React from 'react';
import { cn } from '../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  pill?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'primary',
  size = 'md',
  pill = true,
  ...props
}) => {
  const variants = {
    primary:
      'bg-brand-lime text-brand-ink shadow-[0_14px_28px_rgba(176,214,78,0.24)] transition-[transform,background-color,box-shadow,color] duration-200 hover:scale-[1.02] hover:bg-white hover:shadow-[0_18px_32px_rgba(23,53,45,0.16)]',
    secondary: 'border-2 border-accent text-accent hover:bg-accent hover:text-bg-dark',
    ghost: 'text-accent hover:bg-accent/10',
  };

  const sizes = {
    sm: 'px-4 py-2.5',
    md: 'px-6 py-3.5',
    lg: 'px-8 py-4',
  };

  return (
    <button
      className={cn(
        'text-button inline-flex items-center justify-center transition-all duration-300 active:scale-95 disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        pill ? 'rounded-full' : 'rounded-md',
        className
      )}
      {...props}
    />
  );
};
