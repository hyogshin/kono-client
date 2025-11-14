import React, { ButtonHTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  className = '',
  disabled,
  ...rest
}) => {
  const { t } = useTranslation();
  const variantClasses = {
    primary: 'bg-konoBlue text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    outline:
      'bg-transparent border border-konoBlue text-konoBlue hover:bg-konoBlue hover:text-white',
  };

  const sizeClasses = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-6 text-lg',
  };

  const baseClasses = 'font-pretendardMedium rounded-lg transition-all';
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass =
    disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  const buttonClasses = `
      ${baseClasses}
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${widthClass}
      ${disabledClass}
      ${className}
    `;

  return (
    <button
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin h-5 w-5 border-2 border-t-transparent border-white rounded-full mr-2"></div>
          <span>{t('common.loading')}</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
