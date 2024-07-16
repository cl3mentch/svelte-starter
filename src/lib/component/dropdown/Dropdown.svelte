<script lang="ts" context="module">
	let close = () => {};
</script>

<script lang="ts">
	import { cn } from '$lib/helper';
	import Icon from '@iconify/svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type $$Props = HTMLAttributes<HTMLElement> & {
		buttonClassName?: string | any;
		chevronClass?: string | any;
		dropdownVisible?: boolean;
		triggerMethod?: 'click' | 'hover'; // New prop to choose the trigger method
	};

	let buttonClassName: $$Props['buttonClassName'] = undefined;
	let chevronClass: $$Props['chevronClass'] = undefined;

	export { buttonClassName as class };
	export { chevronClass as chevronClass };

	// variable
	export let dropdownVisible: $$Props['dropdownVisible'] = false;
	export let triggerMethod: $$Props['triggerMethod'] = 'click'; // Default to click

	function hoverDropdown() {
		if (triggerMethod !== 'hover') return;
		dropdownVisible = !dropdownVisible;

		if (close !== closeDropdown) {
			close();
		}
		close = closeDropdown;
	}

	function closeDropdown() {
		dropdownVisible = false;
	}

	function onButtonClick() {
		if (triggerMethod !== 'click') return;
		dropdownVisible = !dropdownVisible;

		if (close !== closeDropdown) {
			close();
		}
		close = closeDropdown;
	}

	function onClick(e: MouseEvent) {
		const target = e.target as Element;

		if (!target.closest('.dropdown')) {
			close();
		}
	}
</script>

<svelte:window on:click={onClick} />

<div class="dropdown relative">
	<button
		type="button"
		class={cn('flex items-center', buttonClassName)}
		on:click={onButtonClick}
		on:mouseenter={hoverDropdown}
	>
		<slot name="selectedOption" />
		<Icon
			icon={dropdownVisible ? 'mdi:chevron-up' : 'mdi:chevron-down'}
			class={cn('text-lg', chevronClass)}
		/>
	</button>

	{#if dropdownVisible}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div on:mouseleave={triggerMethod === 'hover' ? closeDropdown : null}>
			<slot name="content" />
		</div>
	{/if}
</div>
