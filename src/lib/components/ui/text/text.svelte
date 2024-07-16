<script lang="ts">
	import { cn } from '$lib/utils';
	import { labelVarient, type Props } from '.';

	type $$Props = Props;

	let className: $$Props['class'] = undefined;
	export let tag: $$Props['tag'] = 'p';
	export let variant: $$Props['variant'] = 'default';
	export let size: $$Props['size'] = 'default';
	export { className as class };
</script>

<svelte:element this={tag} class={cn(labelVarient({ variant, size, className }))} {...$$restProps}>
	<slot />
</svelte:element>
