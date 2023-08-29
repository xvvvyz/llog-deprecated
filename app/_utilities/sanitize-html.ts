import xss from 'xss';

const sanitizeHtml = (html?: string | null) =>
  html
    ? xss(html, {
        whiteList: {
          a: ['href', 'target'],
          br: [],
          em: [],
          li: [],
          ol: [],
          p: [],
          strong: [],
          u: [],
          ul: [],
        },
      })
        .replace(/(<p>(\s|&nbsp;)*<\/p>)+/g, '')
        .replace(/<p>(\s|&nbsp;)+/g, '<p>')
        .replace(/(\s|&nbsp;)+<\/p>/g, '</p>')
    : html;

export default sanitizeHtml;
