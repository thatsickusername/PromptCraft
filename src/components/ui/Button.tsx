import React from 'react';

interface ButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'ghost';
  size?: 'sm' | 'default';
  className?: string;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant, 
  size = 'default', 
  className, 
  children, 
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-start rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    ghost: "hover:bg-neutral-200/60",
  };

  const sizes = {
    sm: "h-9 px-3",
    default: "h-10 py-2 px-4",
  };
  
  // Fix: Handle undefined variant properly
  const classes = `${baseClasses} ${variant ? variants[variant] : ''} ${sizes[size]} ${className || ''}`;

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Button;