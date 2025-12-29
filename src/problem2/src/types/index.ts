export interface TokenPriceRaw {
    currency: string;
    date: string;
    price: number;
}

export interface Token {
    symbol: string;
    price: number; // USD price
    iconUrl: string;
    name: string; // Derived from symbol usually, or just use symbol
}

export interface SwapState {
    fromToken: Token | null;
    toToken: Token | null;
    fromAmount: string;
    toAmount: string;
    exchangeRate: number;
}
