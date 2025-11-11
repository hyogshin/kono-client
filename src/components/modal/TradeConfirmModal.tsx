import { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Toast from '../common/Toast';
import PurchaseCompleteModal from './PurchaseCompleteModal';
import { useNavigate } from 'react-router-dom';
import { formatAmount, formatCurrency } from '../../utils/formatter';
import { marketBuy, marketSell } from '../../services/trade';

interface TradeConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticker: string;
  amount: number | undefined;
  price: number | null;
  quantity: number;
  tradeType: 'buy' | 'sell';
  name: string;
  // totalAmount: number;
}

export default function TradeConfirmModal({
  isOpen,
  onClose,
  ticker,
  amount,
  price,
  tradeType,
  quantity,
  name,
}: TradeConfirmModalProps) {
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);
  const [showComplete, setShowComplete] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [confirmedPrice, setConfirmedPrice] = useState(0);
  const [confirmedQuantity, setConfirmedQuantity] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // 값이 없을 때의 기본값 처리
  // const safeAmount = amount || 0;
  // const safePrice = price || 0;

  const handleTrade = async () => {
    if (isProcessing) return;
    try {
      setIsProcessing(true);
      if (tradeType === 'buy') {
        await marketBuy(ticker, amount || 0);
      } else if (tradeType === 'sell') {
        if (amount === null) {
          await marketSell(ticker, 0, quantity);
        } else {
          await marketSell(ticker, amount || 0, quantity);
        }
      }
      onClose();
      setShowComplete(true);
    } catch (error) {
      console.error('거래 실패:', error);
      setShowToast(true); // 에러 토스트 메시지 표시
    } finally {
      setIsProcessing(false); // 처리 완료 플래그 리셋
    }
  };

  const handleCompleteConfirm = () => {
    setShowComplete(false);
    // Store toast info in sessionStorage before navigation
    sessionStorage.setItem(
      'tradeToast',
      JSON.stringify({
        show: true,
        message: `${tradeType === 'buy' ? '구매' : '판매'} 주문을 완료했어요.`,
        timestamp: Date.now(),
      }),
    );
    navigate(`/coins/${ticker}`);
  };

  const handleConfirm = () => {
    setConfirmedPrice(price || 0);
    setConfirmedQuantity(quantity);

    handleTrade();
  };

  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity dark:bg-white dark:bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 z-10">
            <div className="flex min-h-full items-end justify-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-full"
                enterTo="opacity-100 translate-y-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-full"
              >
                <Dialog.Panel
                  ref={panelRef}
                  className="relative w-full max-w-[410px] transform bg-white rounded-t-3xl transition-all mx-auto overflow-hidden dark:bg-gray-800 dark:text-white"
                >
                  {/* X 버튼 */}
                  <button
                    onClick={onClose}
                    className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <XMarkIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                  </button>

                  {/* 스크롤 가능한 컨텐츠 영역 */}
                  <div className="max-h-[80vh] overflow-y-auto">
                    <div className="px-6 pb-8">
                      <div className="text-center my-8">
                        <Dialog.Title
                          as="h3"
                          className="text-lg text-gray-500 mb-2 dark:text-gray-400"
                        >
                          {ticker}
                        </Dialog.Title>
                        <p
                          className={`text-2xl font-bold ${
                            tradeType === 'buy'
                              ? 'text-red-500 dark:text-red-400'
                              : 'text-blue-500 dark:text-blue-400'
                          }`}
                        >
                          {tradeType === 'buy' ? '구매' : '판매'}
                        </p>
                      </div>

                      <div className="space-y-4 mb-8">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 dark:text-gray-400">
                            1 {ticker} 가격
                          </span>
                          <span>{formatCurrency(price || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 dark:text-gray-400">
                            예상 {ticker} 수량
                          </span>
                          <span>
                            {formatAmount(quantity)} {ticker}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 dark:text-gray-400">
                            총 예상 {tradeType === 'buy' ? '구매' : '판매'} 금액
                          </span>
                          <span className="font-medium text-lg">
                            {formatCurrency(amount || 0)}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          className="flex-1 py-4 rounded-xl bg-gray-100 font-medium text-gray-900 dark:bg-gray-700 dark:text-gray-100     "
                          onClick={onClose}
                        >
                          닫기
                        </button>
                        <button
                          type="button"
                          className={`flex-1 py-4 rounded-xl font-medium text-white ${
                            tradeType === 'buy'
                              ? 'bg-red-500 dark:bg-red-600 dark:hover:bg-red-700'
                              : 'bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700'
                          } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={handleConfirm}
                          disabled={isProcessing}
                        >
                          {isProcessing
                            ? '처리중...'
                            : tradeType === 'buy'
                              ? '구매'
                              : '판매'}
                        </button>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <PurchaseCompleteModal
        isOpen={showComplete}
        onClose={() => setShowComplete(false)}
        onConfirm={handleCompleteConfirm}
        ticker={ticker}
        amount={amount || 0}
        price={confirmedPrice}
        quantity={confirmedQuantity}
        tradeType={tradeType}
        coinName={name}
      />

      <Toast
        show={showToast}
        message={`${tradeType === 'buy' ? '구매' : '판매'}를 완료했어요.`}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}
