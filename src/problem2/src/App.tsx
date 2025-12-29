import { useState, useEffect, useCallback } from 'react';
import { ArrowDownUp, RefreshCw, Info } from 'lucide-react';
import { fetchTokens } from './services/tokenService';
import type { Token } from './types';
import { TokenModal } from './components/TokenModal';
import { SwapInput } from './components/SwapInput';

function App() {
  // Data State
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Swap State
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');

  // UI State
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [selectingField, setSelectingField] = useState<'from' | 'to'>('from');
  const [isSwapping, setIsSwapping] = useState(false);

  // Initialize Data
  useEffect(() => {
    const init = async () => {
      try {
        const data = await fetchTokens();
        setTokens(data);

        // Set default tokens if available (e.g., ETH to USDC)
        const eth = data.find(t => t.symbol === 'ETH');
        const usdc = data.find(t => t.symbol === 'USDC');
        if (eth) setFromToken(eth);
        if (usdc) setToToken(usdc);

      } catch (err) {
        console.error('Failed to load token prices', err);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

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
      // Rate = FromPrice / ToPrice
      const rate = fromToken.price / toToken.price;
      const result = numAmount * rate;
      setToAmount(result.toFixed(6).replace(/\.?0+$/, ''));
    } else {
      // Rate = ToPrice / FromPrice
      const rate = toToken.price / fromToken.price;
      const result = numAmount * rate;
      setFromAmount(result.toFixed(6).replace(/\.?0+$/, ''));
    }
  }, [fromToken, toToken]);

  // Handlers
  const handleFromAmountChange = (val: string) => {
    setFromAmount(val);
    calculateRate(val, 'from');
  };

  const handleToAmountChange = (val: string) => {
    setToAmount(val);
    calculateRate(val, 'to');
  };

  const openTokenModal = (field: 'from' | 'to') => {
    setSelectingField(field);
    setIsTokenModalOpen(true);
  };

  const handleTokenSelect = (token: Token) => {
    if (selectingField === 'from') {
      if (token.symbol === toToken?.symbol) {
        setToToken(fromToken);
      }
      setFromToken(token);
      setFromAmount('');
      setToAmount('');
    } else {
      if (token.symbol === fromToken?.symbol) {
        setFromToken(toToken);
      }
      setToToken(token);
      setFromAmount('');
      setToAmount('');
    }
  };

  const switchTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const handleSwap = () => {
    if (!fromToken || !toToken || !fromAmount) return;
    setIsSwapping(true);
    // Simulate API call and smart contract interaction

    setTimeout(() => {
      setIsSwapping(false);
      setFromAmount('');
      setToAmount('');
      alert(`Swapped ${fromAmount} ${fromToken.symbol} for ${toAmount} ${toToken.symbol} successfully!`);
    }, 1500);
  };

  const exchangeRate = fromToken && toToken ? fromToken.price / toToken.price : 0;
  const fromUsdValue = fromToken && fromAmount ? parseFloat(fromAmount) * fromToken.price : 0;
  const toUsdValue = toToken && toAmount ? parseFloat(toAmount) * toToken.price : 0;

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

            {/* Switch Button (Absolute positioned in the middle) */}
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
                <span>1 {fromToken.symbol} = {exchangeRate.toLocaleString(undefined, { maximumFractionDigits: 6 })} {toToken.symbol}</span>
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
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all transform active:scale-[0.98] ${!fromToken || !toToken
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : !fromAmount
                    ? 'bg-indigo-600/50 text-indigo-200 cursor-not-allowed'
                    : isSwapping
                      ? 'bg-indigo-600 text-white cursor-wait opacity-80'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                }`}
            >
              {isLoading ? 'Loading...' :
                isSwapping ? 'Swapping...' :
                  !fromToken || !toToken ? 'Select a token' :
                    !fromAmount ? 'Enter an amount' : 'Swap'}
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
