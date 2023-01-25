import xss from 'xss';

const sanitizeHtml = (html?: string | null) =>
  xss(html ?? '', {
    whiteList: {
      a: ['href', 'target'],
      br: [],
      em: [],
      li: [],
      ol: [],
      p: [],
      strong: [],
      ul: [],
    },
  })
    .replace(/(<br>(\s|&nbsp;)+)+/g, '<br>')
    .replace(/((\s|&nbsp;)+<br>)+/g, '<br>')
    .replace(/(<br>){2,}/g, '<br><br>')
    .replace(/<p>(\s|&nbsp;|<br>)+/g, '<p>')
    .replace(/(\s|&nbsp;|<br>)+<\/p>/g, '</p>');

export default sanitizeHtml;
