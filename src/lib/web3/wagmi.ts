import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { emptyUserInfo, storeUserInfo } from '$lib/stores/storeUser';
import {
	connect,
	disconnect,
	getAccount,
	getChainId,
	injected,
	watchAccount,
	watchChainId,
	type GetAccountReturnType,
	type GetChainIdReturnType
} from '@wagmi/core';
import Cookies from 'js-cookie';
import { get, readable } from 'svelte/store';
import { zeroAddress } from 'viem';
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
		onChange: async (account: GetAccountReturnType) => {
			if (!account.connector) return set(undefined);
			set(await account.connector?.getProvider());
		}
	})
);

export async function connectWallet() {
	await connect(wagmiConfig, { connector: injected() });
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

export const onDisconnect = async () => {
	Cookies.remove('accessToken');
	storeUserInfo.set(emptyUserInfo);
	disconnect(wagmiConfig);
	goto('/');
};
