export const urlList = {
	dev: {
		domainURL: import.meta.env.STAG_DOMAIN_URL,
		baseUrl: import.meta.env.STAG_BASE_URL,
		apiBase: import.meta.env.STAG_API_BASE,
		wsBase: import.meta.env.STAG_WS_BASE
	},
	live: {
		domainURL: import.meta.env.PROD_DOMAIN_URL,
		baseUrl: import.meta.env.PROD_BASE_URL,
		apiBase: import.meta.env.PROD_API_BASE,
		wsBase: import.meta.env.PROD_WS_BASE
	}
};

export let urls = import.meta.env.NODE_ENV === 'production' ? urlList.live : urlList.dev;
