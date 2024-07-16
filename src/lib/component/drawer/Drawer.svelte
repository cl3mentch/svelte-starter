<script lang='ts'>
	import { Drawer } from "@skeletonlabs/skeleton";
	import { drawer } from "./Drawer";


</script>


<Drawer>
	{#if $drawer.id === 'example-1'}
		<!-- (show 'example-1' contents) -->
	{:else if $drawer.id === 'example-2'}
		<!-- (show 'example-2' contents) -->
	{:else}
		<!-- (fallback contents) -->
	{/if}
</Drawer>
