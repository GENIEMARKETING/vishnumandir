import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

/**
 * A reusable button component with themed variants.
 * 
 * @param {ButtonProps} props - The button props
 * @returns {JSX.Element} The rendered button element
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className = "", 
    variant = "primary", 
    size = "md",
    disabled = false,
    ...props 
  }, ref) => {
    const baseStyles = "px-4 py-2 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variantStyles = {
      primary: "bg-primary text-white hover:bg-primary/90 focus:ring-primary dark:focus:ring-primary",
      secondary: "bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary dark:focus:ring-secondary",
      outline: "bg-transparent border border-border text-text-primary hover:bg-background/50 focus:ring-primary dark:focus:ring-primary",
    };
    
    const sizeStyles = {
      sm: "text-sm px-3 py-1.5",
      md: "text-base px-4 py-2",
      lg: "text-lg px-6 py-3",
    };
    
    return (
      <button 
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        disabled={disabled}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
