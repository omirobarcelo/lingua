type DialogState = {
	open: boolean;
	message: string;
	resolve: ((value: boolean) => void) | null;
};

let state = $state<DialogState>({ open: false, message: '', resolve: null });

export function confirm(message: string): Promise<boolean> {
	return new Promise((resolve) => {
		state.open = true;
		state.message = message;
		state.resolve = resolve;
	});
}

export function accept(): void {
	state.resolve?.(true);
	state.open = false;
	state.resolve = null;
}

export function cancel(): void {
	state.resolve?.(false);
	state.open = false;
	state.resolve = null;
}

export function getState(): DialogState {
	return state;
}
