import { sequence } from '@sveltejs/kit/hooks';
import { redirect, type Handle } from '@sveltejs/kit';
import { verifyToken } from '$lib/server/jwt';

const authHandle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('auth-token');

	if (token) {
		const decoded = verifyToken(token);
		if (decoded) {
			event.locals.sessionId = decoded.sessionId;
		} else {
			event.cookies.delete('auth-token', { path: '/' });
		}
	}

	return resolve(event);
};

const authRouteProtection: Handle = ({ event, resolve }) => {
	if (event.locals.sessionId && event.url.pathname === '/') {
		redirect(302, '/app');
	}

	if (!event.locals.sessionId && event.url.pathname.includes('/app')) {
		redirect(302, '/');
	}
	return resolve(event);
};

export const handle = sequence(authHandle, authRouteProtection);
