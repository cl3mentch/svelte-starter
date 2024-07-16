<script lang="ts">
	import { cn } from '$lib/helper';
	import type { HTMLAttributes } from 'svelte/elements';
	import { slide } from 'svelte/transition';

	type $$Props = HTMLAttributes<HTMLDivElement> & {
		className?: string | any;
	};

	let className: $$Props['class'] = undefined;

	export { className as class };
	export let open = false;

	const handleClick = () => (open = !open);
</script>

<div class={cn('w-full', className)}>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div on:click={handleClick} class="text-left w-full cursor-pointer">
		<slot name="head" />
	</div>

	{#if open}
		<div transition:slide>
			<slot name="details"></slot>
		</div>
	{/if}
</div>
