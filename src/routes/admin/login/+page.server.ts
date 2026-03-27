import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { ADMIN_PASSWORD } from '$env/static/private';
import { timingSafeEqual } from 'crypto';
import { isAuthenticated, setSessionCookie } from '$lib/server/admin/auth';

export const load: PageServerLoad = async ({ cookies }) => {
	if (isAuthenticated(cookies)) {
		throw redirect(303, '/admin');
	}
};

function passwordMatches(input: string): boolean {
	const a = Buffer.from(input);
	const b = Buffer.from(ADMIN_PASSWORD);
	if (a.length !== b.length) return false;
	return timingSafeEqual(a, b);
}

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const password = data.get('password') as string;

		if (!password || !passwordMatches(password)) {
			return fail(401, { error: 'Contrasenya incorrecta' });
		}

		setSessionCookie(cookies);
		throw redirect(303, '/admin');
	}
};
