import { get } from 'svelte/store';
import { getContract, type Abi, type PublicClient } from 'viem';
import { account, publicClient, walletClient } from '../web3modal/web3modal';
import contractConfig from './contract.config.json';
import example from './example/example';

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

export const example1 = _getContract('example', example, publicClient);

/**
 * Global function to approve ERC721/ERC1155 allowance to an address
 * @param owner_contract address of the contract/EOA to grant the approval
 * @param operator_contract address of the contract/EOA to give the approval to
 * @returns true if succeed; false for failure to approve
 */

export const _approveContracts = async (owner_contract: any, operator_contract: any) => {
	if (
		!(await owner_contract.read.isApprovedForAll([get(account).address, operator_contract.address]))
	) {
		try {
			const hash = await owner_contract.write.setApprovalForAll([operator_contract.address, true], {
				account: get(account).address,
				chain: get(account).chain
			});

			await publicClient.waitForTransactionReceipt({ hash: hash });

			return true;
		} catch (error) {
			throw error;
		}
	}
};

export class InsufficientTokenBalanceError extends Error {
	constructor(message = 'Insufficient balance') {
		super(message);
		this.message = message;
	}
}

/**
 * Global function to approve ERC20 allowance to an address
 * @param owner_contract address of the contract/EOA to grant the approval
 * @param operator_contract address of the contract/EOA to give the approval to
 * @param amount amount of tokens to be approved
 * @returns true if succeed; false for failure to approve
 */

export const _approveContractToken = async (
	owner_contract: any,
	operator_contract: any,
	amount: any
) => {
	if ((await owner_contract.read.balanceOf([get(account).address])) < amount)
		throw new InsufficientTokenBalanceError();

	let currentSpendingCap: any = await owner_contract.read.allowance([
		get(account).address,
		operator_contract.address
	]);

	if (currentSpendingCap < Number(amount)) {
		try {
			const hash = await owner_contract.write.approve([operator_contract.address, amount], {
				account: get(account).address,
				chain: get(account).chain
			});
			await publicClient.waitForTransactionReceipt({ hash: hash });
			return true;
		} catch (error) {
			// throw Error('Cannot approve NFT')
			throw error;
		}
	}
};
