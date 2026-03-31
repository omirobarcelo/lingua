import type { Handle, HandleServerError } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { redirect } from '@sveltejs/kit';
import { PUBLIC_POSTHOG_ENABLED } from '$env/static/public';
import { getPostHogClient } from '$lib/server/posthog';
import { isAuthenticated } from '$lib/server/admin/auth';

const enabled = PUBLIC_POSTHOG_ENABLED === 'true';

const adminAuthHandle: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url;

	if (pathname.startsWith('/admin')) {
		const authenticated = isAuthenticated(event.cookies);
		if (pathname !== '/admin/login' && !authenticated) {
			throw redirect(303, '/admin/login');
		}
		event.locals.isAdminAuthenticated = authenticated;
	}

	return resolve(event);
};

const posthogHandle: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url;

	if (enabled && pathname.startsWith('/ingest')) {
		const hostname = pathname.startsWith('/ingest/static/') ? 'eu-assets.i.posthog.com' : 'eu.i.posthog.com';

		const url = new URL(event.request.url);
		url.protocol = 'https:';
		url.hostname = hostname;
		url.port = '443';
		url.pathname = pathname.replace(/^\/ingest/, '');

		const headers = new Headers(event.request.headers);
		headers.set('host', hostname);
		headers.set('accept-encoding', '');

		const clientIp = event.request.headers.get('x-forwarded-for') || event.getClientAddress();
		if (clientIp) {
			headers.set('x-forwarded-for', clientIp);
		}

		const response = await fetch(url.toString(), {
			method: event.request.method,
			headers,
			body: event.request.body,
			// @ts-expect-error - duplex is required for streaming request bodies
			duplex: 'half'
		});

		return response;
	}

	return resolve(event);
};

export const handle = sequence(adminAuthHandle, posthogHandle);

export const handleError: HandleServerError = async ({ error, status, message }) => {
	if (!enabled) return { message, status };

	const posthog = getPostHogClient();

	posthog.capture({
		distinctId: 'server',
		event: 'server_error',
		properties: {
			error: error instanceof Error ? error.message : String(error),
			status,
			message
		}
	});

	return {
		message,
		status
	};
};
