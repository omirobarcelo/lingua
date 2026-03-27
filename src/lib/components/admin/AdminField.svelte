<script lang="ts">
	type Props = {
		label: string;
		name: string;
		value?: string;
		type?: 'text' | 'textarea' | 'select';
		required?: boolean;
		error?: string;
		placeholder?: string;
		rows?: number;
		readonly?: boolean;
		options?: Array<{ value: string; label: string }>;
	};

	let {
		label,
		name,
		value = '',
		type = 'text',
		required = false,
		error = '',
		placeholder = '',
		rows = 3,
		readonly = false,
		options = []
	}: Props = $props();
</script>

<div class="mb-4">
	<label class="block mb-1.5 text-sm font-medium text-base" for={name}>{label}</label>

	{#if type === 'textarea'}
		<textarea
			id={name}
			{name}
			{required}
			{placeholder}
			{rows}
			readonly={readonly}
			class="w-full rounded-lg border-2 px-4 py-3 text-base transition-colors focus:border-brand focus:outline-none {error
				? 'border-red-400'
				: 'border-border'} {readonly ? 'bg-neutral-100 text-muted' : ''}"
			>{value}</textarea
		>
	{:else if type === 'select'}
		<select
			id={name}
			{name}
			{required}
			class="w-full rounded-lg border-2 px-4 py-3 text-base transition-colors focus:border-brand focus:outline-none {error
				? 'border-red-400'
				: 'border-border'}"
		>
			<option value="">{placeholder || 'Selecciona...'}</option>
			{#each options as opt}
				<option value={opt.value} selected={opt.value === value}>{opt.label}</option>
			{/each}
		</select>
	{:else}
		<input
			id={name}
			{name}
			type="text"
			{value}
			{required}
			{placeholder}
			readonly={readonly}
			class="w-full rounded-lg border-2 px-4 py-3 text-base transition-colors focus:border-brand focus:outline-none {error
				? 'border-red-400'
				: 'border-border'} {readonly ? 'bg-neutral-100 text-muted' : ''}"
		/>
	{/if}

	{#if error}
		<p class="mt-1 text-sm text-red-600">{error}</p>
	{/if}
</div>
