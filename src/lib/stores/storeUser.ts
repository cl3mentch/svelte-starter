import { persisted } from 'svelte-persisted-store';
import { zeroAddress, type Address } from 'viem';

interface IUserInfo {
	chainid: number;
	upline: string;
	user_id: string;
	web3_address: Address;
	invite_code: string;
	invite_code_current_usage: string;
	invite_code_max_usage: string;
}

export const emptyUserInfo: IUserInfo = {
	chainid: 0,
	upline: '',
	user_id: '',
	web3_address: zeroAddress,
	invite_code: '',
	invite_code_current_usage: '',
	invite_code_max_usage: ''
};

export const storeUserInfo = persisted<IUserInfo>('storeUserInfo', emptyUserInfo);

export type { IUserInfo };
