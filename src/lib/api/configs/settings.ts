export let currentDomainURL: any;
export let liveDomainURL: any;

export const urlList = {
	dev: {
		domainURL: 'https://stagonboard.replant.finance',
		baseUrl: 'https://stagcore.replant.finance/dapp',
		apiBase: 'https://stagcore.replant.finance/dapp',
		wsBase: 'wss://market.xxx.xxx/',
		apiLoginRequest: '/api/auth/request',
		apiLoginVerify: '/api/auth/verify',
		apiUserInfo: '/api/users/info',
		apiEditName: '/dapp/user/editname',
		apiStrategy: '/dapp/user/editname'
	},
	live: {
		domainURL: 'https://liveonboard.replant.finance',
		baseUrl: 'https://stagcore.replant.finance/dapp',
		apiBase: 'https://stagcore.replant.finance/dapp',
		wsBase: 'wss://market.xxx.xxx/',
		apiLoginRequest: '/api/auth/request',
		apiLoginVerify: '/api/auth/verify',
		apiUserInfo: '/api/users/info',
		apiEditName: '/dapp/user/editname',
		apiStrategy: '/dapp/user/editname'
	}
};

if (typeof window !== 'undefined') {
	currentDomainURL = new URL(window.location.href).hostname;
	liveDomainURL = new URL(urlList.live.domainURL).hostname;
}

export let urls: any = currentDomainURL === liveDomainURL ? urlList.live : urlList.dev;
