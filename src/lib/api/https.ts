import { goto } from '$app/navigation';
import { get } from 'svelte/store';
import { urls } from './configs/settings';
import { clearUserData } from '../web3modal/web3modal';
import { failure } from '$lib/component/toast/toast';
import { storeAccessToken } from '$lib/stores/storeAccessToken';

export const api = async (method: string, resource: string, data?: any) => {
	let resp: any;
	try {
		const queryString: string =
			data && method == 'GET'
				? '?' +
					Object.keys(data)
						.map((key) => key + '=' + data[key])
						.join('&')
				: '';
		const response = await fetch(`${urls.apiBase}${resource}${queryString}`, {
			method,
			mode: 'cors',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: method !== 'GET' ? data && JSON.stringify(data) : null
		}).then(async (response) => {
			resp = await response.json();
			if (resp.code == 403) {
				tokenExpiredAction();
			}
		});
		return resp;
	} catch (err) {
		return false;
	}
};

export const apiWithToken = async (method: string, resource: string, data?: any) => {
	const tokenApi: any = get(storeAccessToken);
	let returnData: any;
	if (tokenApi.access_token) {
		const queryString: string =
			data && method == 'GET'
				? '?' +
					Object.keys(data)
						.map((key) => key + '=' + data[key])
						.join('&')
				: '';

		await fetch(`${urls.apiBase}${resource}${queryString}`, {
			method,
			mode: 'cors',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${tokenApi.access_token}`,
				'Content-Type': 'application/json'
			},
			body: method !== 'GET' ? data && JSON.stringify(data) : null
		})
			.then(async (response) => {
				returnData = await response.json();
				if (returnData.code == 403) {
					tokenExpiredAction();
				} else if (returnData.code === 500 || returnData.data === '901') {
					clearUserData();
					goto('/');
					failure('Login Session Expired, Please Login Again');
				}
			})
			.catch((e) => {
				console.log('info', `${urls.apiBase}${resource}${queryString}`);
				console.log('error', e.message);
			});

		return returnData;
	}
};

export const downloadWithToken = async (targetFilename: string, resource: string, data?: any) => {
	const tokenApi = get(storeAccessToken);
	const method = 'POST';

	if (tokenApi.access_token) {
		// const queryString: string =
		// 	data && method == 'GET'
		// 		? '?' +
		// 		  Object.keys(data)
		// 				.map((key) => key + '=' + data[key])
		// 				.join('&')
		// 		: '';
		// console.log(data);

		// await fetch(`${urls.apiBase}${resource}${queryString}`, {
		await fetch(`${urls.apiBase}${resource}`, {
			method,
			mode: 'cors',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${tokenApi.access_token}`,
				'Content-Type': 'application/json'
			},
			// body: method !== 'GET' ? data && JSON.stringify(data) : null
			body: data && JSON.stringify(data)
		})
			.then((response) => {
				if (response.ok) {
					return response.blob();
				}
				throw new Error('Network response was not ok.');
			})
			.then((blob) => {
				const url = window.URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = url;
				link.setAttribute('download', targetFilename);
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			})
			.catch((e) => {
				// console.log('info', `${urls.apiBase}${resource}`);
				// console.log('error', e.message);
			});
	}
};

export const uploadWithToken = async (method: string, resource: string, data?: any) => {
	const tokenApi = get(storeAccessToken);
	let returnData: any;
	if (tokenApi.access_token) {
		await fetch(`${urls.apiBase}${resource}`, {
			method,
			mode: 'cors',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${tokenApi.access_token}`
			},
			body: data
		})
			.then(async (response) => {
				returnData = await response.json();
				if (returnData.code == 403) {
					tokenExpiredAction();
				}
			})
			.catch((e) => {
				// console.log('info', `${urls.apiBase}${resource}`);
				// console.log('error', e.message);
			});

		return returnData;
	}
};

const tokenExpiredAction = async () => {
	const res = await apiWithToken('POST', '/auth/logout');
	if (res.code == 0) {
		storeAccessToken.set({
			access_token: '',
			expires_in: 0,
			refresh_token: 0
		});
		goto('/');
		return false;
	}
};
