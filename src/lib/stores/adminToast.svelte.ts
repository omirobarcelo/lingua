type Toast = {
	id: number;
	type: 'ok' | 'error';
	message: string;
};

let toasts = $state<Toast[]>([]);
let nextId = 0;

export function addToast(type: Toast['type'], message: string): void {
	const id = nextId++;
	toasts.push({ id, type, message });
	setTimeout(() => {
		toasts = toasts.filter((t) => t.id !== id);
	}, 4000);
}

export function getToasts(): Toast[] {
	return toasts;
}
