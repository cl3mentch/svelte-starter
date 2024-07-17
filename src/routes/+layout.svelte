<script lang="ts">
	import Nprogress from '$lib/components/ui/nprogress/nprogress.svelte';
	import { Toaster } from '$lib/components/ui/toast';
	import '../app.postcss';
</script>

<div class="w-full h-full min-h-screen relative z-10 transition">
	<Nprogress />
	<slot />
	<Toaster />
</div>
