import { failure, success } from '$lib/component/toast/toast';
import {
	InsufficientFundsError,
	type GetBlockNumberErrorType
} from 'viem';

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
	const isInsufficientFundsError =
		error.walk((e: any) => e instanceof InsufficientFundsError) instanceof InsufficientFundsError;

	if (isInsufficientFundsError) {
		failure('Not Enough Balance in Wallet');
	} else {
		failure(error.shortMessage);
	}
};

export function copyToClipboard(text: any) {
	// Check if the Clipboard API is available
	if (navigator.clipboard) {
		navigator.clipboard
			.writeText(text)
			.then(() => {
				success('Copied !');
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
			success('Copied !');
		} catch (err) {
			console.error('Unable to copy text to clipboard', err);
		}
	}
}

export function filterInput(e: any) {
	let inputAmount = e.target.value;
	// Regular expression to match digits and a decimal point
	let regex = /^[0-9]*\.?[0-9]*$/;

	// Check if the input matches the regular expression
	if (regex.test(inputAmount)) {
		return inputAmount; // Set the amount to the filtered input
	}
}
