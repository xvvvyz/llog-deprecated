import sanitizeHtml from '(utilities)/sanitize-html';
import { twMerge } from 'tailwind-merge';

interface HtmlProps {
  children?: string | null;
  className?: string;
}

const DirtyHtml = ({ children, className }: HtmlProps) => (
  <div
    className={twMerge('prose', className)}
    dangerouslySetInnerHTML={{ __html: sanitizeHtml(children) ?? '' }}
  />
);

export default DirtyHtml;
