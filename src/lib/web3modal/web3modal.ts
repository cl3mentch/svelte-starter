import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi';

import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { abi } from '$lib/contract/Transfer/abi';
import { emptyUserInfo, storeUserInfo, type IUserInfo } from '$lib/stores/storeUser';
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
	type GetChainIdReturnType,
	type WatchChainIdReturnType
} from '@wagmi/core';
import { get, readable } from 'svelte/store';
import {
	createPublicClient,
	createWalletClient,
	custom,
	http,
	parseEther,
	zeroAddress,
	type Address,
	type Chain,
	type PublicClient,
	type WalletClient
} from 'viem';
import { blast, blastSepolia, bsc, bscTestnet } from 'viem/chains';
import { currentDomainURL, liveDomainURL } from '$lib/api/configs/settings';
import { failure } from '$lib/component/toast/toast';
import { onTranslateErrMsg } from '$lib/helper';
import { api, apiWithToken } from '$lib/api/https';
import { emptyAccessToken, storeAccessToken } from '$lib/stores/storeAccessToken';

export let isConnectedProvider: boolean;
export let walletClient: WalletClient;
export let publicClient: PublicClient;
export let blastPublicClient: PublicClient;

const bscChain: Chain = currentDomainURL === liveDomainURL ? bsc : bscTestnet; // default wallet client chain
export const blastChain = currentDomainURL === liveDomainURL ? blast : blastSepolia; // for crosschain interaction purposes

// 1. Get a project ID at https://cloud.walletconnect.com
const projectId = '18be835f20f632ccc46132be6a8ecba4';

// 2. Create wagmiConfig
const metadata = {
	name: 'Replant',
	description: 'Replant Example',
	url: '',
	icons: ['']
};

const chains: any = currentDomainURL === liveDomainURL ? [bsc, blast] : [bscTestnet, blastSepolia];

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

// Subscribe to account store and assign storeUserinfo if connected
account.subscribe((account) => {
	if (!account.isConnected) return;

	storeUserInfo.update((item): IUserInfo => {
		return {
			...item,
			web3_address: account.address as Address,
			chainid: account.chain?.id as number
		};
	});
});

export const provider = readable<unknown | undefined>(undefined, (set) =>
	watchAccount(wagmiConfig, {
		onChange: async (account: any) => {
			if (!account.connector) return set(undefined);
			set(await account.connector?.getProvider());
		}
	})
);

export function connectWallet() {
	try {
		modal.open();
	} catch (error) {
		console.log(error);
	}
}

export async function onRequestSignMessage() {
	let message: any;
	let signedMessage: any;
	try {
		if (get(account).address === zeroAddress) {
			return failure('Please Connect Account First');
		} else {
			const res = await api('GET', '/auth/request', {
				address: get(storeUserInfo).web3_address
			});

			if (res.success) {
				message = res.data;
				signedMessage = await signMessage(wagmiConfig, { message });

				if (signedMessage) {
					onVerifyMessage(signedMessage);
				}
			}
		}
	} catch (error) {
		onTranslateErrMsg(error);
	}
}

async function onVerifyMessage(message: string) {
	try {
		if (!get(account).isConnected || !message) {
			return failure('Please Request Sign Message First');
		}

		const resp = await api('POST', '/auth/verify', {
			address: get(storeUserInfo).web3_address,
			sign: message
		});

		if (!resp.success) {
			failure('Verify Signed Message Failed');
		} else {
			storeAccessToken.set({
				...storeAccessToken,
				access_token: resp.data.access_token,
				refresh_token: resp.data.refresh_token,
				expires_in: new Date().getTime() + resp.data.expires_in * 1000
			});
		}
	} catch (error) {
		throw error;
	}
}

export const onDisconnect = async () => {
	clearUserData();
	disconnect(wagmiConfig);
	goto('/');
};

export const clearUserData = () => {
	storeAccessToken.set(emptyAccessToken);
	storeUserInfo.set(emptyUserInfo);
};

export const onLogOut = async () => {
	await apiWithToken('POST', '/auth/logout');
	clearUserData();
	goto('/');
};

export const onChange = async () => {
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
	const gasPrice = await publicClient.getGasPrice();

	const gasEstimate = await publicClient.estimateContractGas({
		address: contractAddress,
		abi: abi,
		functionName: 'transfer',
		args: [toAddress, parseEther(amount.toString())],
		account: get(account).address,
		gasPrice
	});

	const { request } = await publicClient.simulateContract({
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
		// const transaction = await publicClient.waitForTransactionReceipt({
		// 	// passedby 10 blocks because we need to make sure the transaction passed thru 10 blocks to confirm its in the blockchain already
		// 	confirmations: 1,
		// 	hash: hash
		// });
		return { success: true, txid: hash };
	} else {
		return { success: false };
	}
};

if (browser && window.ethereum) {
	walletClient = createWalletClient({
		chain: bscChain,
		transport: custom(window.ethereum)
	});

	isConnectedProvider = window.ethereum ? true : false;

	blastPublicClient = createPublicClient({
		chain: currentDomainURL === liveDomainURL ? blast : blastSepolia,
		transport: http()
	});
	publicClient = createPublicClient({
		chain: bscChain,
		transport: http()
	});
}
