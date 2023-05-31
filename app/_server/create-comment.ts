'use server';

import createServerComponentClient from '@/_server/create-server-component-client';
import sanitizeHtml from '@/_utilities/sanitize-html';

const createComment = ({
  content,
  eventId,
}: {
  content: string;
  eventId: string;
}) =>
  createServerComponentClient()
    .from('comments')
    .upsert({ content: sanitizeHtml(content) ?? '', event_id: eventId });

export default createComment;
