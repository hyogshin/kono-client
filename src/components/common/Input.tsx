import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      fullWidth = false,
      leftIcon,
      rightIcon,
      className = '',
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

    const baseInputStyles = `
      bg-white 
      border 
      rounded-lg 
      py-2 
      px-4 
      focus:outline-none 
      focus:ring-2 
      focus:ring-opacity-50
      transition-all
      duration-200
    `;

    const stateStyles = error
      ? 'border-accentText focus:border-accentText focus:ring-accentText text-accentText'
      : 'border-gray-300 focus:border-primary focus:ring-primary text-mainText';

    const widthStyle = fullWidth ? 'w-full' : '';

    const leftPaddingStyle = leftIcon ? 'pl-10' : '';
    const rightPaddingStyle = rightIcon ? 'pr-10' : '';

    const inputStyles = `
      ${baseInputStyles} 
      ${stateStyles} 
      ${widthStyle} 
      ${leftPaddingStyle} 
      ${rightPaddingStyle} 
      ${className}
    `;

    return (
      <div className={`${fullWidth ? 'w-full' : ''} mb-4`}>
        {label && (
          <label
            htmlFor={inputId}
            className={`block text-sm font-pretendardMedium mb-1 ${
              error ? 'text-accentText' : 'text-mainText'
            }`}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={inputStyles}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              helperText || error ? `${inputId}-help` : undefined
            }
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {(helperText || error) && (
          <p
            id={`${inputId}-help`}
            className={`text-sm mt-1 ${
              error ? 'text-accentText' : 'text-subText'
            }`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
