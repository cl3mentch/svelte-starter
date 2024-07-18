import { persisted } from 'svelte-persisted-store';
import { writable } from 'svelte/store';
import { zeroAddress, type Address } from 'viem';

interface IUserInfo {
	user_id: string;
	web3_address: Address;
}

export const emptyUserInfo: IUserInfo = {
	user_id: '',
	web3_address: zeroAddress
};

export const storeUserInfo = writable<IUserInfo>(emptyUserInfo);

// export const storeUserInfo = persisted<IUserInfo>('storeUserInfo', emptyUserInfo);

export type { IUserInfo };
