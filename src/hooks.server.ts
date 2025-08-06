import { sequence } from "@sveltejs/kit/hooks";
import { redirect, type Handle } from '@sveltejs/kit';
import { verifyToken } from "$lib/server/jwt";

const authHandle: Handle = async ({ event, resolve }) => {

    event.locals.isAuth = false;

    const token = event.cookies.get('auth-token');

    if (token) {
        if ( verifyToken(token) ) {
            event.locals.isAuth = true;
        } else {
            event.cookies.delete('auth-token', { path: '/' });
        }
    }

    return resolve(event);
};

const authRouteProtection : Handle = ({ event, resolve }) => {
    if (event.locals.isAuth && event.url.pathname === '/') {
        redirect(302, '/app');
    }

    if (!event.locals.isAuth && event.url.pathname !== '/') {
        redirect(302, '/');
    }
    return resolve(event);
}



export const handle = sequence(authHandle, authRouteProtection);