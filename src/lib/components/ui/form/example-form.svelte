<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { formSchema, type FormSchema } from '$lib/zod/schema';
	import { type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	// get the default value form schema
	const initialData: Infer<FormSchema> = formSchema.parse({});

	const form = superForm(initialData, {
		validators: zodClient(formSchema)
	});

	const { form: formData, validateForm, errors, reset } = form;

	const handleSubmit = async () => {
		const result = await validateForm();
		if (!result.valid) {
			errors.update((v) => {
				return {
					...v,
					username: result.errors.username
				};
			});
		}
	};
</script>

<form>
	<Form.Field {form} name="username">
		<Form.Control let:attrs>
			<Form.Label>Username</Form.Label>
			<Input {...attrs} bind:value={$formData.username} on:input={handleSubmit} />
		</Form.Control>
		<Form.Description>This is your public display name.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button on:click={handleSubmit}>Submit</Form.Button>
</form>
