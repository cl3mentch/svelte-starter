<script lang="ts">
	import { Toaster } from '$lib/components/ui/toast';
	import '../app.postcss';
</script>

<div class="w-full h-full min-h-screen relative z-10 transition">
	<slot />
	<Toaster />
</div>
