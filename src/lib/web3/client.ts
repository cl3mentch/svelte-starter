import {
	createPublicClient,
	createWalletClient,
	custom,
	http,
	type Chain,
	type PublicClient,
	type WalletClient
} from 'viem';
import { bsc, bscTestnet } from 'viem/chains';

export const bscChain: Chain = process.env.NODE_ENV === 'production' ? bsc : bscTestnet; // default wallet client chain

export let walletClient: WalletClient = createWalletClient({
	chain: bscChain,
	transport: custom(window?.ethereum)
});

export let bscClient: PublicClient = createPublicClient({
	chain: bscChain,
	transport: http()
});
