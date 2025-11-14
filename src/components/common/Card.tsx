import React, { ReactNode } from 'react';
import styles from '../../assets/style';

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  footer?: ReactNode;
  hoverEffect?: boolean;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  footer,
  hoverEffect = false,
  className = '',
}) => {
  const baseCardStyle = styles.cardStyle;
  const hoverStyle = hoverEffect ? styles.hoverEffect : '';

  return (
    <div className={`${baseCardStyle} ${hoverStyle} ${className}`}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="font-pretendardBold text-lg text-mainText">
              {title}
            </h3>
          )}
          {subtitle && <p className="text-subText text-sm mt-1">{subtitle}</p>}
        </div>
      )}

      <div className="mb-4">{children}</div>

      {footer && (
        <div className="pt-4 border-t border-gray-200 mt-auto">{footer}</div>
      )}
    </div>
  );
};

export default Card;
