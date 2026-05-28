import * as React from 'react';
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  variant?: 'default' | 'bold' | 'subtle';
}
export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={`label label-${variant} ${className || ''}`}
        {...props}
      >
        {children}
      </label>
    );
  }
);
Label.displayName = 'Label';
