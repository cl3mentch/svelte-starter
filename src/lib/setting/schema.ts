import { z } from 'zod';

export const formSchema = z.object({
	username: z.string().min(2).max(10).default('sdf'),
	username1: z.string().min(2).max(10).default('sdfdsf'),
	username2: z.string().min(2).max(10).default('sdf'),
	username3: z.string().min(2).max(10).default('sdf')
});

export type FormSchema = typeof formSchema;
