import { useState, useCallback } from 'react';
import type { Token } from '../types';

export const useSwap = () => {
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);

  // Calculation Logic
  const calculateRate = useCallback((amount: string, direction: 'from' | 'to') => {
    if (!fromToken || !toToken || !amount || parseFloat(amount) === 0) {
      if (direction === 'from') setToAmount('');
      else setFromAmount('');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return;

    if (direction === 'from') {
      const rate = fromToken.price / toToken.price;
      const result = numAmount * rate;
      setToAmount(result.toFixed(6).replace(/\.?0+$/, ''));
    } else {
      const rate = toToken.price / fromToken.price;
      const result = numAmount * rate;
      setFromAmount(result.toFixed(6).replace(/\.?0+$/, ''));
    }
  }, [fromToken, toToken]);

  // Handlers
  const handleFromAmountChange = useCallback((val: string) => {
    setFromAmount(val);
    calculateRate(val, 'from');
  }, [calculateRate]);

  const handleToAmountChange = useCallback((val: string) => {
    setToAmount(val);
    calculateRate(val, 'to');
  }, [calculateRate]);

  const selectFromToken = useCallback((token: Token) => {
    if (token.symbol === toToken?.symbol) {
      setToToken(fromToken);
    }
    setFromToken(token);
    setFromAmount('');
    setToAmount('');
  }, [fromToken, toToken]);

  const selectToToken = useCallback((token: Token) => {
    if (token.symbol === fromToken?.symbol) {
      setFromToken(toToken);
    }
    setToToken(token);
    setFromAmount('');
    setToAmount('');
  }, [fromToken, toToken]);

  const switchTokens = useCallback(() => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  }, [fromToken, toToken, fromAmount, toAmount]);

  const handleSwap = useCallback(() => {
    if (!fromToken || !toToken || !fromAmount) return;
    setIsSwapping(true);

    setTimeout(() => {
      setIsSwapping(false);
      const swappedFrom = fromAmount;
      const swappedTo = toAmount;
      setFromAmount('');
      setToAmount('');
      alert(`Swapped ${swappedFrom} ${fromToken.symbol} for ${swappedTo} ${toToken.symbol} successfully!`);
    }, 1500);
  }, [fromToken, toToken, fromAmount, toAmount]);

  // Computed values
  const exchangeRate = fromToken && toToken ? fromToken.price / toToken.price : 0;
  const fromUsdValue = fromToken && fromAmount ? parseFloat(fromAmount) * fromToken.price : 0;
  const toUsdValue = toToken && toAmount ? parseFloat(toAmount) * toToken.price : 0;

  return {
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    isSwapping,
    exchangeRate,
    fromUsdValue,
    toUsdValue,
    setFromToken,
    setToToken,
    handleFromAmountChange,
    handleToAmountChange,
    selectFromToken,
    selectToToken,
    switchTokens,
    handleSwap,
  };
};
