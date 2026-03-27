import { ADMIN_PASSWORD, ADMIN_SESSION_SECRET } from '$env/static/private';
import { dev } from '$app/environment';
import { createHmac, timingSafeEqual } from 'crypto';
import type { Cookies } from '@sveltejs/kit';

const COOKIE_NAME = 'admin_session';

export function getValidToken(): string {
	return createHmac('sha256', ADMIN_SESSION_SECRET).update(ADMIN_PASSWORD).digest('hex');
}

export function setSessionCookie(cookies: Cookies): void {
	cookies.set(COOKIE_NAME, getValidToken(), {
		path: '/admin',
		httpOnly: true,
		sameSite: 'strict',
		secure: !dev
	});
}

export function clearSessionCookie(cookies: Cookies): void {
	cookies.delete(COOKIE_NAME, { path: '/admin' });
}

export function isAuthenticated(cookies: Cookies): boolean {
	const token = cookies.get(COOKIE_NAME);
	if (!token) return false;

	const valid = getValidToken();
	if (token.length !== valid.length) return false;

	return timingSafeEqual(Buffer.from(token), Buffer.from(valid));
}
