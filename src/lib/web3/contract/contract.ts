import { bscClient, walletClient } from '$lib/web3/client';
import { getContract, parseAbi, type Abi, type Address, type PublicClient } from 'viem';
import DgenBank from './abi/DgenBank';
import DgenToken from './abi/DgenToken';
import contractConfig from './contract.config.json';

export const contracts = contractConfig.contracts;
export let listABIs: { [K in keyof typeof contracts]: Abi } | Record<string, never> = {};
export let wagmiContracts:
	| { [K in keyof typeof contracts]: { address: Address; abi: Abi } }
	| Record<string, never> = {};

let allABIs: Abi = [];

function _getContract(name: keyof typeof contracts, abi: any, client: PublicClient) {
	allABIs = [...allABIs, ...abi];

	listABIs[name] = abi;

	wagmiContracts[name] = {
		address: contracts[name] as Address,
		abi: abi
	};

	return getContract({
		address: `0x${contracts[name as keyof typeof contracts].slice(2)}`,
		abi: parseAbi(abi),
		client: {
			public: client,
			wallet: walletClient
		}
	});
}
