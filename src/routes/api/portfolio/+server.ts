import type { RequestHandler } from '@sveltejs/kit';
import type { Portfolio } from '$lib/types';
import { buildPortfolio } from '$lib/server/portfolio';

const sessionCache = new Map<string, { data: Portfolio; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 min

export const GET: RequestHandler = async ({ locals }) => {
	const sessionId = locals.sessionId;

	if (!sessionId) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}
	const now = Date.now();

	const cached = sessionCache.get(sessionId);
	if (cached && now - cached.timestamp < CACHE_DURATION) {
		return new Response(JSON.stringify(cached.data), {
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const portfolio = await buildPortfolio();
	sessionCache.set(sessionId, { data: portfolio, timestamp: now });

	return new Response(JSON.stringify(portfolio), {
		headers: { 'Content-Type': 'application/json' }
	});
};