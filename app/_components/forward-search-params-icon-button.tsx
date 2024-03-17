'use client';

import IconButton, { IconButtonProps } from '@/_components/icon-button';
import useForwardSearchString from '@/_hooks/use-forward-search-string';

const ForwardSearchParamsIconButton = ({ href, ...rest }: IconButtonProps) => (
  <IconButton {...rest} href={useForwardSearchString(href)} />
);

export default ForwardSearchParamsIconButton;
