import type { PageLoad } from './$types';
import type { Portfolio } from '$lib/types';

export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch('/api/portfolio');
	const portfolio: Portfolio = await res.json();
	return { portfolio };
};