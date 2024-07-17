import { get } from 'svelte/store';
import { getContract, type Abi, type PublicClient } from 'viem';
import contractConfig from './contract.config.json';
import { bscClient, walletClient } from '$lib/web3/client';
import { account } from '$lib/web3/walletConnect';
import example from './abi/example';

export const contracts = contractConfig.contracts;
export let listABIs: { [K in keyof typeof contracts]: Abi[] } | Record<string, never> = {};
export let wagmiContracts:
	| { [K in keyof typeof contracts]: { address: any; abi: any } }
	| Record<string, never> = {};

let allABIs: Abi[] = [];

function _getContract(name: keyof typeof contracts, abi: any, client: PublicClient) {
	allABIs = [...allABIs, ...abi];

	listABIs[name] = abi;
	wagmiContracts[name] = {
		address: contracts[name],
		abi: abi
	};

	return getContract({
		address: `0x${contracts[name as keyof typeof contracts].slice(2)}`,
		abi: abi,
		client: {
			public: client,
			wallet: walletClient
		}
	});
}

export const example1 = _getContract('example', example, bscClient);

/**
 * Global function to approve ERC20 allowance to an address
 * @param owner_contract address of the contract/EOA to grant the approval
 * @param operator_contract address of the contract/EOA to give the approval to
 * @param amount amount of tokens to be approved
 * @returns true if succeed; false for failure to approve
 */
class InsufficientTokenBalanceError extends Error {
	constructor(message = 'Insufficient balance') {
		super(message);
		this.message = message;
	}
}

export const _approveContractToken = async (
	owner_contract: any,
	operator_contract: any,
	amount: any
) => {
	if ((await owner_contract.read.balanceOf([get(account).address])) < amount)
		throw new InsufficientTokenBalanceError();

	const currentSpendingCap: any = await owner_contract.read.allowance([
		get(account).address,
		operator_contract.address
	]);

	if (currentSpendingCap < Number(amount)) {
		try {
			const hash = await owner_contract.write.approve([operator_contract.address, amount], {
				account: get(account).address,
				chain: get(account).chain
			});
			await bscClient.waitForTransactionReceipt({ hash: hash });
			return true;
		} catch (error) {
			throw error;
		}
	}
};
