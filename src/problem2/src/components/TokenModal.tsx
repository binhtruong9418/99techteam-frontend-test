import React, { useState, useMemo } from 'react';
import { X, Search } from 'lucide-react';
import type { Token } from '../types';

interface TokenModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (token: Token) => void;
    tokens: Token[];
}

export const TokenModal: React.FC<TokenModalProps> = ({ isOpen, onClose, onSelect, tokens }) => {
    const [search, setSearch] = useState('');

    const filteredTokens = useMemo(() => {
        const lowerSearch = search.toLowerCase();
        return tokens.filter(t =>
            t.symbol.toLowerCase().includes(lowerSearch)
        );
    }, [tokens, search]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-700">
                    <h3 className="text-lg font-semibold text-white">Select a token</h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Search */}
                <div className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name or symbol"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            autoFocus
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-1">
                    {filteredTokens.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                            No tokens found
                        </div>
                    ) : (
                        filteredTokens.map((token) => (
                            <button
                                key={token.symbol}
                                onClick={() => {
                                    onSelect(token);
                                    onClose();
                                    setSearch('');
                                }}
                                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-700/50 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={token.iconUrl}
                                        alt={token.symbol}
                                        className="w-8 h-8 rounded-full bg-slate-600"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${token.symbol}&background=random`;
                                        }}
                                    />
                                    <div className="flex flex-col items-start">
                                        <span className="font-medium text-white group-hover:text-indigo-300 transition-colors">{token.symbol}</span>
                                        <span className="text-xs text-slate-400">Price: ${token.price.toFixed(2)}</span>
                                    </div>
                                </div>
                                {/* Optional: Add balance or checkmark if selected */}
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
