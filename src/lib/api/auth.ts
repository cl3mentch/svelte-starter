import { type Address } from 'viem';
import { api } from '../http/https';
import Cookies from 'js-cookie';
import { signMessage } from '@wagmi/core';
import { wagmiConfig } from '../web3/client';
import { goto } from '$app/navigation';

const AuthAPI = {
	requestMessage: async function (address: Address) {
		try {
			const response = await api.get('/dapp/auth/request', {
				data: { address }
			});

			if (!response.data.message) throw new Error('No Message Received');

			const signature = await signMessage(wagmiConfig, {
				message: { raw: response.data.message }
			});

			if (signature) {
				const verified = await this.verifyMessage(signature, address);
				return verified;
			}
		} catch (error) {
			console.error('Error requesting message:', error);
			return error;
		}
	},
	verifyMessage: async function (signature: string, address: Address) {
		try {
			const response = await api.post('/dapp/auth/verify', {
				data: {
					address,
					signature
				}
			});

			if (!response.data.token) {
				throw new Error('No Token Received');
			}

			Cookies.set('accessToken', response.data.token, {
				expires: response.data.expires
			});
			return true;
		} catch (error) {
			console.error('Error validating message:', error);
			return false;
		}
	},
	logout: async function () {
		const cookie = Cookies.get('accessToken');

		if (!cookie) return goto('/');

		await api.post('/dapp/auth/logout', { useToken: true });
		Cookies.remove('accessToken');
		return goto('/');
	}
};

export default AuthAPI;
