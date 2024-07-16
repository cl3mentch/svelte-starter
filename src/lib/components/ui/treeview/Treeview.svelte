<script context="module" lang="ts">
	const _expansionState: Record<string, boolean> = {};
</script>

<script lang="ts">
	import { slide } from 'svelte/transition';
	import Icon from '@iconify/svelte';

	export let tree;
	export let isChild = false;
	const { label, children } = tree;

	let expanded = _expansionState[label] || false;

	const toggleExpansion = () => {
		expanded = _expansionState[label] = !expanded;
	};

	$: arrowDown = expanded;
</script>

<div
	class="w-full overflow-hidden relative rounded-lg bg-gray-800 after:content-[''] {expanded &&
	!isChild
		? 'pb-4'
		: ''}"
>
	{#if children}
		<button
			on:click={toggleExpansion}
			class="w-full text-left flex gap-x-3 p-3 items-center transition hover:bg-white/10 rounded-lg"
		>
			<!-- Arrow icon to indicate expansion state -->
			<span class="transition inline-block {arrowDown ? 'rotate-90' : ''}"
				><Icon icon="material-symbols:chevron-right" class="text-xl" /></span
			>
			{label}
		</button>
		{#if expanded}
			<!-- Nested children with slide transition -->
			<div transition:slide class="pl-[0.6rem]">
				{#each children as child}
					<svelte:self tree={child} isChild={true} />
				{/each}
			</div>
		{/if}
	{:else}
		<!-- Leaf node without children -->
		<span class="flex gap-x-3 items-center pl-[1rem] py-3 hover:bg-white/10 rounded-lg w-full">
			<Icon icon="octicon:dash-16" class=" inline-block text-white/20 text-sm " />
			{label}
		</span>
	{/if}
</div>
