<script lang="ts">
	import { cn } from '$lib/helper';
	import { cubicOut } from 'svelte/easing';
	import type { HTMLAttributes } from 'svelte/elements';
	import { fade, slide } from 'svelte/transition';

	type $$Props = HTMLAttributes<HTMLElement> & {
		className?: string | any;
	};

	let className: $$Props['className'] = undefined;

	export { className as class };
</script>

<div
	id="dropdown-content"
	transition:fade
	class={cn(' absolute right-0 top-[100%] z-10 p-2 rounded-lg overflow-hidden mt-2', className)}
>
	<div transition:slide={{ duration: 300, easing: cubicOut }} class="w-full flex flex-col gap-y-2">
		<slot />
	</div>
</div>
