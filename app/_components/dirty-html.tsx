import sanitizeHtml from '@/_utilities/sanitize-html';
import { twMerge } from 'tailwind-merge';

interface HtmlProps {
  children?: string | null;
  className?: string;
}

const DirtyHtml = ({ children, className }: HtmlProps) => (
  <div
    className={twMerge('prose select-text', className)}
    dangerouslySetInnerHTML={{ __html: sanitizeHtml(children) ?? '' }}
  />
);

export default DirtyHtml;
