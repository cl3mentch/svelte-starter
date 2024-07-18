import { browser } from '$app/environment';
import { createConfig, getPublicClient } from '@wagmi/core';
import { createPublicClient, createWalletClient, custom, http, type WalletClient } from 'viem';
import { bsc, bscTestnet, mainnet, sepolia } from 'viem/chains';

const isProduction = process.env.NODE_ENV === 'production';
const bscChain = isProduction ? bsc : bscTestnet;
const ethChain = isProduction ? mainnet : sepolia;

export const wagmiConfig = createConfig({
	chains: [bscChain],
	client({ chain }) {
		return createPublicClient({ chain, transport: http() });
	}
});

export let walletClient: WalletClient;

// Wagmi Public Client with specified chain
export const bscClient = getPublicClient(wagmiConfig, { chainId: bscChain.id });

if (typeof window !== 'undefined' && browser) {
	walletClient = createWalletClient({
		chain: bscChain,
		transport: custom(window.ethereum!)
	});
}
