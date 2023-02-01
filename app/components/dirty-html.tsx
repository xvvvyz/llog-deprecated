import { twMerge } from 'tailwind-merge';
import sanitizeHtml from 'utilities/sanitize-html';
import Box, { BoxProps } from './box';

interface HtmlProps extends BoxProps {
  children?: string | null;
}

const DirtyHtml = ({ children, className, ...rest }: HtmlProps) => (
  <Box
    className={twMerge('prose', className)}
    dangerouslySetInnerHTML={{ __html: sanitizeHtml(children) ?? '' }}
    {...rest}
  />
);

export default DirtyHtml;
