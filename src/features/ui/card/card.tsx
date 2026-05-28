import * as React from 'react';
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'filled';
}
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`card card-${variant} ${className || ''}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';
