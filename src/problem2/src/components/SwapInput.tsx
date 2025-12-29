import React from 'react';
import { ChevronDown } from 'lucide-react';
import type { Token } from '../types';

interface SwapInputProps {
    label: string;
    amount: string;
    token: Token | null;
    onAmountChange: (value: string) => void;
    onTokenClick: () => void;
    usdValue?: number;
    disabled?: boolean;
}

export const SwapInput: React.FC<SwapInputProps> = ({
    label,
    amount,
    token,
    onAmountChange,
    onTokenClick,
    usdValue,
    disabled = false
}) => {

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        // Allow only numbers and one decimal point
        if (val === '' || /^\d*\.?\d*$/.test(val)) {
            onAmountChange(val);
        }
    };

    return (
        <div className="bg-slate-900/50 rounded-2xl p-4 hover:ring-1 hover:ring-slate-700 transition-all focus-within:ring-1 focus-within:ring-indigo-500/50">
            <div className="flex justify-between mb-2">
                <span className="text-slate-400 text-sm font-medium">{label}</span>
            </div>

            <div className="flex items-center gap-3">
                <input
                    type="text"
                    value={amount}
                    onChange={handleInputChange}
                    placeholder="0.0"
                    className="w-full bg-transparent text-3xl font-semibold text-white placeholder-slate-600 focus:outline-none disabled:opacity-50"
                    disabled={disabled}
                />

                <button
                    onClick={onTokenClick}
                    className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-white pl-2 pr-3 py-1.5 rounded-full transition-all shrink-0 shadow-sm"
                >
                    {token ? (
                        <>
                            <img
                                src={token.iconUrl}
                                alt={token.symbol}
                                className="w-6 h-6 rounded-full"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${token.symbol}&background=random`;
                                }}
                            />
                            <span className="font-semibold">{token.symbol}</span>
                        </>
                    ) : (
                        <span className="font-semibold px-1">Select</span>
                    )}
                    <ChevronDown size={16} className="text-slate-300" />
                </button>
            </div>

            <div className="mt-2 h-5 flex justify-between text-xs text-slate-500 font-medium">
                <span>
                    {usdValue ? `~$${usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'}
                </span>
                {/* Placeholder for balance if we had wallet integration */}
            </div>
        </div>
    );
};
