import { PASSWORD } from '$env/static/private';
import { generateToken } from '$lib/server/jwt';
import { redirect, type Actions, fail } from '@sveltejs/kit';
import { checkRateLimit } from '$lib/server/rateLimiter';
import { dev } from '$app/environment';

export const actions = {
	login: async ({ request, cookies }) => {
		const formData = await request.formData();

		console.log('Form data received:', formData);

		const fingerprint = formData.get('fingerprint') as string;

		if (!fingerprint) {
			return fail(400, {
				success: false,
				message: 'Fingerprint is required. Please enable JavaScript and try again.'
			});
		}

		// Check rate limiting
		const rateLimitResult = checkRateLimit(fingerprint);

		if (!rateLimitResult.allowed) {
			return fail(429, {
				success: false,
				message: `Too many attempts. :(`
			});
		}

		const password = formData.get('password') as string;

		if (password === PASSWORD) {
			const token = generateToken();
			cookies.set('auth-token', token, {
				path: '/',
				httpOnly: true,
				maxAge: 60 * 60 * 24 * 7,
				secure: !dev,
				sameSite: 'strict'
			});
			throw redirect(302, '/app');
		} else {
			return fail(401, {
				success: false,
				message: `Incorrect password.`
			});
		}
	}
} satisfies Actions;
