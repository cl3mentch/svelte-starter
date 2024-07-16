<script lang="ts">
	import Treeview from '$lib/component/treeview/Treeview.svelte';
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
</div>
