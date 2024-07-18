import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { api } from '$lib/api/https';
import { onTranslateErrMsg } from '$lib/helper';
import { emptyUserInfo, storeUserInfo } from '$lib/stores/storeUser';
import {
	connect,
	disconnect,
	getAccount,
	getChainId,
	injected,
	signMessage,
	watchAccount,
	watchChainId,
	type GetAccountReturnType,
	type GetChainIdReturnType
} from '@wagmi/core';
import Cookies from 'js-cookie';
import { toast } from 'svelte-sonner';
import { get, readable } from 'svelte/store';
import { zeroAddress, type Hash, type SignMessageReturnType } from 'viem';
import { wagmiConfig } from './client';

export const chainId = readable<GetChainIdReturnType>(getChainId(wagmiConfig), (set) =>
	watchChainId(wagmiConfig, { onChange: set })
);

export const account = readable<GetAccountReturnType>(getAccount(wagmiConfig), (set) =>
	watchAccount(wagmiConfig, {
		onChange: (data) => {
			set(data);
		}
	})
);

export const provider = readable<unknown | undefined>(undefined, (set) =>
	watchAccount(wagmiConfig, {
		onChange: async (account: any) => {
			if (!account.connector) return set(undefined);
			set(await account.connector?.getProvider());
		}
	})
);

export async function connectWallet() {
	await connect(wagmiConfig, { connector: injected() });
}

export async function onRequestSignMessage() {
	let message: Hash;
	try {
		if (get(account).address === zeroAddress) {
			return toast.error('Please Connect Account First');
		} else {
			const res = await api('GET', '/auth/request', {
				address: get(account).address
			});

			if (res.success) {
				message = res.data;
				await signMessage(wagmiConfig, { message }).then((signedMessage) => {
					onVerifyMessage(signedMessage);
				});
			}
		}
	} catch (error) {
		onTranslateErrMsg(error);
	}
}

async function onVerifyMessage(message: SignMessageReturnType) {
	try {
		if (!get(account).isConnected || !message) {
			return toast.error('Please Request Sign Message First');
		}

		const resp = await api('POST', '/auth/verify', {
			address: get(account).address,
			sign: message
		});

		if (!resp.success) {
			toast.error('Verify Signed Message Failed');
		} else {
			Cookies.set('accessToken', resp.data.access_token, {
				expires: new Date(new Date().getTime() + resp.data.expires_in * 1000)
			});
		}
	} catch (error) {
		throw error;
	}
}

export const onChange = async () => {
	// To compare address in native mobile apps
	// Tp wallet cant detect wallet change, so use this method
	if (browser && get(storeUserInfo).web3_address != zeroAddress) {
		let isChange = false;

		window.ethereum.on('accountsChanged', async () => {
			onDisconnect();
			return (isChange = true);
		});

		if (!isChange) {
			const { address } = getAccount(wagmiConfig);

			if (address !== get(storeUserInfo).web3_address) {
				onDisconnect();
			}
		}
	}
};

export const onLogOut = async () => {
	await api('POST', '/auth/logout');
	goto('/');
};

export const onDisconnect = async () => {
	Cookies.remove('accessToken');
	storeUserInfo.set(emptyUserInfo);
	disconnect(wagmiConfig);
	goto('/');
};
