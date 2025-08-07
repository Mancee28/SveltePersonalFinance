import yahooFinance from 'yahoo-finance2';
import portfolioData from '$lib/assets/portfolio.json';
import type { Portfolio, Asset } from '$lib/types';

const fetchQuotes = async (tickers: string[]) =>
	yahooFinance.quote(tickers, { fields: ['regularMarketPrice', 'currency'] });

const fetchFxRates = async (currencies: string[]) => {
	const fxTickers = currencies.map(c => `${c}EUR=X`);
	if (fxTickers.length === 0) return new Map<string, number>([['EUR', 1]]);

	const fxQuotes = await yahooFinance.quote(fxTickers, {
		fields: ['regularMarketPrice', 'symbol']
	});

	const entries = fxQuotes
		.map(q => {
			const price = q.regularMarketPrice;
			const code = q.symbol?.slice(0, 3);
			return price != null && code ? ([code, price] as [string, number]) : null;
		})
		.filter((e): e is [string, number] => e !== null);

	return new Map<string, number>(entries).set('EUR', 1);
};

const enrichAssets = (
	assets: Asset[],
	quotes: Awaited<ReturnType<typeof fetchQuotes>>,
	fx: Map<string, number>
): Asset[] => {
	const withValues = assets.map(a => {
		const q = quotes.find(qt => qt.symbol === a.ticker)!;
		const rate = fx.get(q.currency ?? 'EUR') ?? 1;

		const currentPrice = q.regularMarketPrice ?? 0;
		const currentValue = currentPrice * a.units * rate; // in EUR

		return { ...a, currentPrice, currentValue };
	});

	const total = withValues.reduce((sum, a) => sum + (a.currentValue ?? 0), 0);

	return withValues.map(a => ({
		...a,
		percentage: total ? (a.currentValue! / total) * 100 : 0
	}));
};

export const buildPortfolio = async (): Promise<Portfolio> => {
	const portfolio = portfolioData as Portfolio;
	const assets = [...portfolio.equity, ...portfolio.bonds, ...portfolio.commodities];

	const quotes = await fetchQuotes(assets.map(a => a.ticker));

	const otherCurrencies = [
		...new Set(
			quotes
				.map(q => q.currency)
				.filter((c): c is string => !!c && c !== 'EUR')
		)
	];
	const fxRates = await fetchFxRates(otherCurrencies);

	const allEnriched = enrichAssets(assets, quotes, fxRates);

	const enrichByTicker = new Map(allEnriched.map(a => [a.ticker, a]));
	const mapBack = (list: Asset[]) => list.map(a => enrichByTicker.get(a.ticker)!);

	const equity = mapBack(portfolio.equity);
	const bonds = mapBack(portfolio.bonds);
	const commodities = mapBack(portfolio.commodities);

	const totalAssets = allEnriched.reduce((s, a) => s + (a.currentValue ?? 0), 0);

	return { totalAssets, equity, bonds, commodities };
};