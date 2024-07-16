<script lang="ts">
	import { cn } from '$lib/helper';
	import type { HTMLAttributes } from 'svelte/elements';

	type $$Props = HTMLAttributes<HTMLElement> & {
		className?: string | any;
	};

	let className: $$Props['className'] = undefined;

	export { className as class };
</script>

<button id="option" class={cn('w-full  btn', className)} on:click>
	<slot />
</button>
