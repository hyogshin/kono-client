import { useState, useEffect, useRef } from 'react';
import { API_ENDPOINTS } from '../config/apiEndpoints';
import { LOG } from '../config/constants';
import type { TickerData } from '../types';

export function useUpbitWebSocket(symbols: string[] = ['BTC']) {
  const [tickerData, setTickerData] = useState<Record<string, TickerData>>({});
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socket = useRef<WebSocket | null>(null);

  const symbolsKey = JSON.stringify(symbols);

  useEffect(() => {
    const symbolsToUse = symbols.length > 0 ? symbols : ['BTC'];

    socket.current = new WebSocket(API_ENDPOINTS.GET_WS_URL);

    socket.current.onopen = function () {
      setIsConnected(true);
      setError(null);

      const message = [
        { ticket: 'test' },
        {
          type: 'ticker',
          codes: symbolsToUse.map((symbol) => `KRW-${symbol}`),
        },
      ];

      if (socket.current && socket.current.readyState === WebSocket.OPEN) {
        socket.current.send(JSON.stringify(message));
      }
    };

    socket.current.onmessage = function (event) {
      const reader = new FileReader();

      reader.onload = function () {
        try {
          const jsonData = JSON.parse(reader.result as string);

          if (jsonData && jsonData.code) {
            setTickerData((prevData) => ({
              ...prevData,
              [jsonData.code]: jsonData,
            }));
          }
        } catch (error) {
          console.error(LOG.ERR.GENERAL.JSON_PARSE, error);
        }
      };

      reader.readAsText(event.data);
    };

    socket.current.onerror = function (_error) {
      setError(LOG.ERR.GENERAL.WEBSOCKET_CONNECTION);
      setIsConnected(false);
    };

    socket.current.onclose = function () {
      setIsConnected(false);
    };

    return () => {
      if (socket.current) {
        socket.current.close();
      }
    };
  }, [symbolsKey]);

  return { tickerData, isConnected, error };
}

export default useUpbitWebSocket;
