import { browser } from '$app/environment';
import { defaultLocale, loadTranslations, locale } from '$lib/i18n';
import { onChange } from '$lib/web3/wagmi';
import type { LayoutLoad } from './$types';

export let ssr = false;

export const load: LayoutLoad = async ({ url }) => {
	const { pathname } = url;
	let targetLocale = defaultLocale;

	if (browser) {
		onChange();
		const getLocal = JSON.parse(localStorage.getItem('storeLocal') || '{}');
		if (getLocal.lang != undefined) targetLocale = getLocal.lang;
	}

	const initLocale = locale.get() || targetLocale;

	await loadTranslations(initLocale, pathname);

	return {};
};
