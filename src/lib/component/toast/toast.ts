import { toast } from '@zerodevx/svelte-toast';

export const success = (m: any) =>
	toast.push(
		`<div class='flex items-center gap-x-2'> <span class="icon-[teenyicons--tick-circle-solid] text-green-500"></span> ${m} </div>`
	);

export const failure = (m: any) =>
	toast.push(
		`<div class='flex items-center gap-x-2'> <span class="icon-[material-symbols--error] text-xl text-red-500"></span> ${m} </div>`,
		{
			theme: {
				'--toastBarBackground': 'red'
			}
		}
	);
