import type { ReactNode } from 'react';

const variants = {
  titleHeader: { class: 'text-2xl/7 sm:text-4xl text-black font-semibold', tag: 'h1' },
  bodyHeader: { class: 'text-xs/3 sm:text-sm text-black font-semibold', tag: 'p' },
  titleTask: { class: 'text-base sm:text-lg text-black font-semibold text-center', tag: 'h2' },
  descriptionTask: {
    class: 'text-xs sm:text-sm text-black font-normal wrap-anywhere',
    tag: 'p',
  },
  termTask: { class: 'text-xs sm:text-sm text-black font-normal  text-nowrap', tag: 'p' },
  mediumText: { class: 'text-base sm:text-lg text-black font-semibold text-center', tag: 'span' },
} as const;

export type TypographyProps = { variant: keyof typeof variants; children: ReactNode };

export const Typography = ({ variant, children }: TypographyProps) => {
  const Tag = variants[variant].tag;
  return <Tag className={variants[variant].class}>{children}</Tag>;
};
