import { PUBLIC_SITE_URL } from '$env/static/public';

export const SITE_URL = PUBLIC_SITE_URL || 'https://lingua-vercel.vercel.app';

export function canonical(path: string): string {
	return `${SITE_URL}${path}`;
}
