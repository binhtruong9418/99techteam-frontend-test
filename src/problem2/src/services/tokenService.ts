import type { Token, TokenPriceRaw } from "../types";

const PRICE_URL = "https://interview.switcheo.com/prices.json";
const IMG_BASE_URL =
    "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/";

export const fetchTokens = async (): Promise<Token[]> => {
    try {
        const response = await fetch(PRICE_URL);
        if (!response.ok) throw new Error("Failed to fetch prices");

        const rawData: TokenPriceRaw[] = await response.json();
        const uniqueTokensMap = new Map<string, number>();

        rawData.forEach((item) => {
            if (item.price > 0) {
                uniqueTokensMap.set(item.currency, item.price);
            }
        });

        const tokens: Token[] = Array.from(uniqueTokensMap.entries()).map(
            ([symbol, price]) => ({
                symbol,
                price,
                name: symbol,
                iconUrl: `${IMG_BASE_URL}${symbol}.svg`,
            })
        );
        return tokens.sort((a, b) => a.symbol.localeCompare(b.symbol));
    } catch (error) {
        console.error("Error loading tokens:", error);
        return [];
    }
};
