import { useState, useEffect } from 'react';
import { ArrowDownUp, RefreshCw, Info } from 'lucide-react';
import type { Token } from './types';
import { TokenModal } from './components/TokenModal';
import { SwapInput } from './components/SwapInput';
import { useSwap } from './hooks/useSwap';
import { useTokens } from './hooks/useTokens';

function App() {
  const { tokens, isLoading, getDefaultTokens } = useTokens();
  const {
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
  } = useSwap();

  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [selectingField, setSelectingField] = useState<'from' | 'to'>('from');

  // Set default tokens when tokens are loaded
  useEffect(() => {
    if (tokens.length > 0 && !fromToken && !toToken) {
      const { eth, usdc } = getDefaultTokens();
      if (eth) setFromToken(eth);
      if (usdc) setToToken(usdc);
    }
  }, [tokens, fromToken, toToken, getDefaultTokens, setFromToken, setToToken]);

  const openTokenModal = (field: 'from' | 'to') => {
    setSelectingField(field);
    setIsTokenModalOpen(true);
  };

  const handleTokenSelect = (token: Token) => {
    if (selectingField === 'from') {
      selectFromToken(token);
    } else {
      selectToToken(token);
    }
    setIsTokenModalOpen(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[url('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop')] bg-cover bg-center relative">
      {/* Overlay to darken background */}
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>

      <div className="w-full max-w-[480px] relative z-10">
        {/* Main Card */}
        <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-2 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 pb-2">
            <h1 className="text-xl font-semibold text-white tracking-tight">Swap</h1>
            <div className="flex gap-2">
              <button
                onClick={() => window.location.reload()}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                title="Refresh prices"
              >
                <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          {/* Inputs Container */}
          <div className="p-2 space-y-1 relative">
            <SwapInput
              label="You pay"
              amount={fromAmount}
              token={fromToken}
              onAmountChange={handleFromAmountChange}
              onTokenClick={() => openTokenModal('from')}
              usdValue={fromUsdValue}
            />

            {/* Switch Button */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <button
                onClick={switchTokens}
                className="bg-slate-800 border-4 border-slate-800 p-2 rounded-xl text-slate-400 hover:text-indigo-400 hover:scale-110 transition-all shadow-lg"
              >
                <ArrowDownUp size={20} />
              </button>
            </div>

            <SwapInput
              label="You receive"
              amount={toAmount}
              token={toToken}
              onAmountChange={handleToAmountChange}
              onTokenClick={() => openTokenModal('to')}
              usdValue={toUsdValue}
            />
          </div>

          {/* Price Info / Exchange Rate */}
          {fromToken && toToken && (
            <div className="px-4 py-3 flex items-center justify-between text-xs font-medium text-slate-400">
              <div className="flex items-center gap-1 hover:text-slate-300 cursor-pointer">
                <Info size={14} />
                <span>
                  1 {fromToken.symbol} ={' '}
                  {exchangeRate.toLocaleString(undefined, { maximumFractionDigits: 6 })}{' '}
                  {toToken.symbol}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-emerald-400">$0.00</span>
                <span>Gas fee</span>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="p-2">
            <button
              onClick={handleSwap}
              disabled={!fromToken || !toToken || !fromAmount || isSwapping}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all transform active:scale-[0.98] ${
                !fromToken || !toToken
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : !fromAmount
                  ? 'bg-indigo-600/50 text-indigo-200 cursor-not-allowed'
                  : isSwapping
                  ? 'bg-indigo-600 text-white cursor-wait opacity-80'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
              }`}
            >
              {isLoading
                ? 'Loading...'
                : isSwapping
                ? 'Swapping...'
                : !fromToken || !toToken
                ? 'Select a token'
                : !fromAmount
                ? 'Enter an amount'
                : 'Swap'}
            </button>
          </div>
        </div>
      </div>

      {/* Token Select Modal */}
      <TokenModal
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
        onSelect={handleTokenSelect}
        tokens={tokens}
      />
    </div>
  );
}

export default App;
