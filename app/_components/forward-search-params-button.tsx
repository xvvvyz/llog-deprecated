'use client';

import Button, { ButtonProps } from '@/_components/button';
import useForwardSearchString from '@/_hooks/use-forward-search-string';

const ForwardSearchParamsButton = ({ href, ...rest }: ButtonProps) => (
  <Button {...rest} href={useForwardSearchString(href)} />
);

export default ForwardSearchParamsButton;
