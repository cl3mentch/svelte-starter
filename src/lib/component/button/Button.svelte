<script lang="ts">
	import { cn } from '$lib/helper';
	import type { HTMLAttributes } from 'svelte/elements';

	type $$Props = HTMLAttributes<HTMLButtonElement> & {
		className?: any;
		boxShadow?: any;
		disabled?: any;
	};

	let className: $$Props['class'] = undefined;

	export { className as class };
	export let disabled = false;
	export let boxShadow: string = '0';
</script>

<button class={cn('rounded-xl', className)} on:click {disabled} {...$$restProps}>
	<slot />
</button>
