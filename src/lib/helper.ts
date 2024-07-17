import { toast } from 'svelte-sonner';
import { InsufficientFundsError, type GetBlockNumberErrorType } from 'viem';

export const truncateString = (str: any, startNum: number, endNum: number) => {
	if (!str) {
		return;
	}
	if (str.length <= startNum + endNum) {
		return str;
	}
	const startStr = str.slice(0, startNum);
	const endStr = str.slice(-endNum);
	return `${startStr}...${endStr}`;
};

export const onTranslateErrMsg = (e: any) => {
	const error: any = e as GetBlockNumberErrorType;
	const isInsufficientFundsError = error.walk((e: any) => e instanceof InsufficientFundsError);

	if (isInsufficientFundsError) {
		toast.error('Not Enough Balance in Wallet');
	} else {
		toast.error(error.shortMessage);
	}
};

export function copyToClipboard(text: any) {
	// Check if the Clipboard API is available
	if (navigator.clipboard) {
		navigator.clipboard
			.writeText(text)
			.then(() => {
				toast.success('Copied !');
			})
			.catch((error) => {
				console.error('Unable to copy text to clipboard', error);
			});
	} else {
		try {
			const storage = document.createElement('textarea');
			storage.value = text;
			document.body.appendChild(storage);
			storage.select();
			storage.setSelectionRange(0, 99999);
			document.execCommand('copy');
			document.body.removeChild(storage);
			toast.success('Copied !');
		} catch (err) {
			console.error('Unable to copy text to clipboard', err);
		}
	}
}

export function filterInput(e: any) {
	let inputAmount = e.target.value;
	let regex = /^[0-9]*\.?[0-9]*$/;

	if (regex.test(inputAmount)) {
		return inputAmount;
	}
}
