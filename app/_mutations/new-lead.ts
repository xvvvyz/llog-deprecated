'use server';

import { ContactFormValues } from '@/_components/contact-form';
import sanitizeHtml from '@/_utilities/sanitize-html';
import { Resend } from 'resend';

const newLead = async (data: ContactFormValues) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: 'system@llog.app',
    html: `<pre>${JSON.stringify(
      {
        ...data,
        comment: sanitizeHtml(data.comment),
        profession: data.profession?.label,
        types: data.types.map((type) => type.label),
      },
      null,
      2,
    )}</pre>`,
    subject: 'New llog demo request',
    to: ['cade@llog.app'],
  });
};

export default newLead;
