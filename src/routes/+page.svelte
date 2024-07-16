<script lang="ts">
	import Treeview from '$lib/components/ui/treeview/Treeview.svelte';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	const tree = {
		label: 'USA',
		children: [
			{
				label: 'Florida',
				children: [
					{ label: 'Jacksonville' },
					{
						label: 'Orlando',
						children: [
							{ label: 'Disney World' },
							{ label: 'Universal Studio' },
							{ label: 'Sea World' }
						]
					},
					{ label: 'Miami' }
				]
			},
			{
				label: 'California',
				children: [{ label: 'San Francisco' }, { label: 'Los Angeles' }, { label: 'Sacramento' }]
			}
		]
	};
</script>

<!-- YOU CAN DELETE EVERYTHING IN THIS PAGE -->

<div class="container h-full mx-auto flex justify-center items-center">
	<Treeview {tree} isChild={false} />
	<Button on:click={() => toast.success('Hello world')}>Show toast</Button>
</div>
