import { goto } from '$app/navigation';
import { get } from 'svelte/store';
import { urls } from './configs/settings';
import { clearUserData } from '../web3modal/web3modal';
import { failure } from '$lib/component/toast/toast';
import { storeAccessToken } from '$lib/stores/storeAccessToken';

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
			const tokenApi: any = get(storeAccessToken);
			if (tokenApi?.access_token) {
				headers.Authorization = `Bearer ${tokenApi.access_token}`;
			} else {
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

		if (resp.code === 403 || resp.code === 500 || resp.data === '901') {
			clearUserData();
			goto('/');
			failure('Login Session Expired, Please Login Again');
		}

		return resp;
	} catch (err) {
		console.error('API call error:', err);
		return false;
	}
};
