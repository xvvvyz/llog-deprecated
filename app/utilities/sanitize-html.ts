import xss from 'xss';

const sanitizeHtml = (html?: string | null) =>
  xss(html ?? '', {
    whiteList: {
      a: ['href', 'target'],
      em: [],
      li: [],
      ol: [],
      p: [],
      strong: [],
      ul: [],
    },
  })
    .replace(/(<p>(\s|&nbsp;)*<\/p>)+/g, '')
    .replace(/<p>(\s|&nbsp;)+/g, '<p>')
    .replace(/(\s|&nbsp;)+<\/p>/g, '</p>');

export default sanitizeHtml;
