<script lang="ts">
	import { cn } from '$lib/helper';
	import type { HTMLAttributes } from 'svelte/elements';

	type $$Props = HTMLAttributes<HTMLElement> & {
		className?: string | any;
	};

	let className: $$Props['className'] = undefined;

	export { className as class };
</script>

<div id="selectedOption" class={cn('w-full', className)}>
	<slot />
</div>
