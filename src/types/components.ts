import { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export interface HeaderProps {
  title?: string;
  rightElement?: ReactNode;
  centerTitle?: boolean;
}

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export interface TradeConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  tradeType: 'buy' | 'sell';
  ticker: string;
  amount: number | string | undefined;
  price: number | string | null;
  quantity: number | string;
  name: string;
  coinName?: string;
  total?: string;
}

export interface PurchaseCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'buy' | 'sell';
}

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export type DarkModeToggleProps = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

export interface PriceInfoProps {
  ticker: string;
  onPriceUpdate?: (price: number) => void;
}

export interface TradingViewWidgetProps {
  symbol: string;
  theme?: 'light' | 'dark';
}
