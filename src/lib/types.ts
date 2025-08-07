export interface Asset {
	isin: string;
	ticker: string;
	name: string;
	provider: string;
	currency: 'EUR' | 'USD' | string;
	units: number;
	ter: number;
	currentPrice?: number;
	currentValue?: number;
	percentage?: number;
	accumulating: boolean;
}
export type Portfolio = {
	totalAssets: number;
	equity: Asset[];
	bonds: Asset[];
	commodities: Asset[];
};
