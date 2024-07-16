import { persisted } from 'svelte-persisted-store';

interface IAccessToken {
	access_token: string;
	expires_in: number;
	refresh_token: 0;
}

export const emptyAccessToken: IAccessToken = {
	access_token: '',
	expires_in: 0,
	refresh_token: 0
};

export const storeAccessToken = persisted<IAccessToken>('storeAccessToken', emptyAccessToken);
