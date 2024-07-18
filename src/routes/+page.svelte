<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { connectWallet } from '$lib/web3/wagmi';
</script>

<!-- YOU CAN DELETE EVERYTHING IN THIS PAGE -->

<div class="container h-full mx-auto flex justify-center items-center">
	<Button on:click={connectWallet}>Connect</Button>
</div>
