import { z } from 'zod';

// Please refer to components/forms/example-form.svelte for usage

export const formSchema = z.object({
	username: z.string().min(2).max(10).default(''),
	username1: z.string().min(2).max(10).default(''),
	username2: z.string().min(2).max(10).default(''),
	username3: z.string().min(2).max(10).default('')
});

export type FormSchema = typeof formSchema;
