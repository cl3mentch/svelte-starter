import Cookies from 'js-cookie';
import { toast } from 'svelte-sonner';
import { urls } from './settings';

export const api = async (
	method: string,
	resource: string,
	data?: any,
	useToken: boolean = false
) => {
	let resp: any;
	try {
		const queryString: string =
			data && method === 'GET'
				? '?' +
					Object.keys(data)
						.map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
						.join('&')
				: '';

		const headers: HeadersInit = {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		};

		if (useToken) {
			const tokenApi: any = Cookies.get('accessToken');
			if (tokenApi) {
				headers.Authorization = `Bearer ${tokenApi}`;
			} else {
				toast.error('Please Login Again To Access');
				throw new Error('No access token available');
			}
		}

		const response = await fetch(`${urls.apiBase}${resource}${queryString}`, {
			method,
			mode: 'cors',
			headers,
			body: method !== 'GET' ? JSON.stringify(data) : null
		});

		resp = await response.json();

		return resp;
	} catch (err) {
		console.error('API call error:', err);
		throw err;
	}
};
