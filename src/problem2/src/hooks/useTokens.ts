import { useState, useEffect } from 'react';
import { fetchTokens } from '../services/tokenService';
import type { Token } from '../types';

export const useTokens = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const data = await fetchTokens();
        setTokens(data);
      } catch (err) {
        console.error('Failed to load token prices', err);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const getDefaultTokens = () => {
    const eth = tokens.find(t => t.symbol === 'ETH');
    const usdc = tokens.find(t => t.symbol === 'USDC');
    return { eth, usdc };
  };

  return {
    tokens,
    isLoading,
    getDefaultTokens,
  };
};
