import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { api } from '$lib/api/https';
import { failure } from '$lib/component/toast/toast';
import { abi } from '$lib/contract/Transfer/transferAbi';
import { onTranslateErrMsg } from '$lib/helper';
import { storeUserInfo, type IUserInfo } from '$lib/stores/storeUser';
import {
	disconnect,
	getAccount,
	getChainId,
	reconnect,
	signMessage,
	watchAccount,
	watchChainId,
	type Config,
	type GetAccountReturnType,
	type GetChainIdReturnType
} from '@wagmi/core';
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi';
import Cookies from 'js-cookie';
import { toast } from 'svelte-sonner';
import { get, readable } from 'svelte/store';
import {
	parseEther,
	zeroAddress,
	type Address,
	type Chain,
	type Hash,
	type SignMessageReturnType
} from 'viem';
import { blast, blastSepolia, bsc, bscTestnet } from 'viem/chains';
import { bscClient, walletClient } from './client';

// 1. Get a project ID at https://cloud.walletconnect.com
const projectId = '18be835f20f632ccc46132be6a8ecba4';

// 2. Create wagmiConfig
const metadata = {
	name: 'Replant',
	description: 'Replant Example',
	url: '',
	icons: ['']
};

const chains: [Chain, ...Chain[]] =
	process.env.NODE_ENV === 'production' ? [bsc, blast] : [bscTestnet, blastSepolia];

export const wagmiConfig: Config = defaultWagmiConfig({
	chains,
	projectId,
	metadata,
	enableCoinbase: false,
	enableInjected: false
});

// To reconnect your account to different account
reconnect(wagmiConfig);

// 3. Create modal
export const modal = createWeb3Modal({
	wagmiConfig,
	projectId,
	themeMode: 'dark'
});

export const chainId = readable<GetChainIdReturnType>(getChainId(wagmiConfig), (set) =>
	watchChainId(wagmiConfig, { onChange: set })
);

export const account = readable<GetAccountReturnType>(getAccount(wagmiConfig), (set) =>
	watchAccount(wagmiConfig, {
		onChange: set
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

// Subscribe to account store and assign storeUserinfo if connected
account.subscribe((account) => {
	if (!account.isConnected) return;

	storeUserInfo.update((item): IUserInfo => {
		return {
			...item,
			web3_address: account.address as Address
		};
	});
});

export function connectWallet() {
	modal.open();
}

export async function onRequestSignMessage() {
	let message: Hash;
	try {
		if (get(account).address === zeroAddress) {
			return failure('Please Connect Account First');
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

export const onLogOut = async () => {
	await api('POST', '/auth/logout');
	goto('/');
};

export const onDisconnect = async () => {
	Cookies.remove('accessToken');
	disconnect(wagmiConfig);
	goto('/');
};

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
			let walletClientAddress = await walletClient.requestAddresses();

			if (walletClientAddress[0] !== get(storeUserInfo).web3_address) {
				onDisconnect();
			}
		}
	}
};

export const sendTransaction = async (
	amount: number | string,
	contractAddress: any,
	toAddress: Address
) => {
	let hash: any;
	const gasPrice = await bscClient.getGasPrice();

	const gasEstimate = await bscClient.estimateContractGas({
		address: contractAddress,
		abi: abi,
		functionName: 'transfer',
		args: [toAddress, parseEther(amount.toString())],
		account: get(account).address,
		gasPrice
	});

	const { request } = await bscClient.simulateContract({
		address: contractAddress,
		abi: abi,
		functionName: 'transfer',
		args: [toAddress, parseEther(amount.toString())],
		account: get(account).address,
		gas: gasEstimate,
		gasPrice: gasPrice
	});

	hash = await walletClient.writeContract(request);

	if (hash) {
		return { success: true, txid: hash };
	} else {
		return { success: false };
	}
};
