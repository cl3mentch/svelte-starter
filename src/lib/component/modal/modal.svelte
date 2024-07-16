<script lang="ts">
	export let showModal: any; // boolean

	let dialog: any; // HTMLDialogElement

	export let closeState: any = false;
	$: if (dialog && showModal) {
		dialog.showModal();
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
{#if showModal}
	<dialog
		bind:this={dialog}
		on:close={() => (showModal = false)}
		class="z-[99] overflow-hidden rounded-lg text-white m-auto"
	>
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div on:click|stopPropagation>
			<div class="flex items-center justify-between">
				<slot name="header" />
				{#if closeState}
					<button
						class="btn p-0 w-7 h-7 text-sm bg-white font-bold text-black rounded-full"
						on:click={() => {
							dialog.close();
						}}
					>
						<p>X</p>
					</button>
				{/if}
			</div>

			<slot />
		</div>
	</dialog>
{/if}

<style>
	* {
		---background-color: #292929;
	}

	dialog {
		max-width: 100rem;
		border: none;
		padding: 0;
		background-color: var(---background-color);
	}

	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}

	dialog > div {
		padding: 1em;
	}

	dialog[open] {
		animation: bounceIn 0.5s ease;
	}

	@keyframes bounceIn {
		from,
		20%,
		40%,
		60%,
		80%,
		to {
			animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
		}
		0% {
			opacity: 0;
			transform: scale3d(0.3, 0.3, 0.3);
		}
		20% {
			transform: scale3d(1.1, 1.1, 1.1);
		}
		40% {
			transform: scale3d(0.9, 0.9, 0.9);
		}
		60% {
			opacity: 1;
			transform: scale3d(1.03, 1.03, 1.03);
		}
		80% {
			transform: scale3d(0.97, 0.97, 0.97);
		}
		to {
			opacity: 1;
			transform: scale3d(1, 1, 1);
		}
	}

	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
