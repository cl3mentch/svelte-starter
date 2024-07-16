import { tv, type VariantProps } from 'tailwind-variants';
import Root from './text.svelte';
import type { HTMLAttributes } from 'svelte/elements';

const labelVarient = tv({
	base: 'leading-normal tracking-normal text-black',
	variants: {
		variant: {
			default: ''
		},
		size: {
			default: 'h-10 px-4 py-2',
			sm: 'h-9 rounded-md px-3',
			lg: 'h-11 rounded-md px-8',
			xl: '',
			_2xl: '',
			_3xl: '',
			_4x: '',
			icon: 'h-10 w-10'
		}
	},
	defaultVariants: {
		variant: 'default',
		size: 'default'
	}
});

type Variant = VariantProps<typeof labelVarient>['variant'];
type Size = VariantProps<typeof labelVarient>['size'];
type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';

type Props = HTMLAttributes<HTMLHeadingElement> & {
	variant?: Variant;
	size?: Size;
	tag?: HeadingLevel;
};

export {
	Root,
	type HeadingLevel,
	type Props,
	//
	Root as Text,
	type Props as TextProps,
	type HeadingLevel as Tag,
	labelVarient
};
