import { error } from '@sveltejs/kit';

interface RateLimitEntry {
	attempts: number;
	lastAttempt: number;
	blockedUntil?: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const BLOCK_DURATION_MS = 30 * 60 * 1000; // 30 minutes

export function checkRateLimit(fingerprint: string): { allowed: boolean } {
	const now = Date.now();
	const entry = rateLimitMap.get(fingerprint);

	if (!entry) {
		// First request from this fingerprint
		rateLimitMap.set(fingerprint, { attempts: 1, lastAttempt: now });
		return { allowed: true };
	}

	// Check if still blocked
	if (entry.blockedUntil && now < entry.blockedUntil) {
		return { allowed: false };
	}

	// Reset if the time window has passed
	if (now - entry.lastAttempt > WINDOW_MS) {
		entry.attempts = 1;
		entry.lastAttempt = now;
		delete entry.blockedUntil;
		return { allowed: true };
	}

	// Increment attempts
	entry.attempts++;
	entry.lastAttempt = now;

	if (entry.attempts > MAX_ATTEMPTS) {
		entry.blockedUntil = now + BLOCK_DURATION_MS;
		return { allowed: false };
	}

	return { allowed: true };
}

// Cleanup old entries every minute
setInterval(() => {
	const now = Date.now();
	for (const [fingerprint, entry] of rateLimitMap.entries()) {
		if (now - entry.lastAttempt > WINDOW_MS && (!entry.blockedUntil || now > entry.blockedUntil)) {
			rateLimitMap.delete(fingerprint);
		}
	}
}, 60 * 1000);
