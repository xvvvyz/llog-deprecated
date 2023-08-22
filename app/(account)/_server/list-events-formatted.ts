import firstIfArray from '@/(account)/_utilities/first-if-array';
import forceArray from '@/(account)/_utilities/force-array';
import createServerRouteClient from '@/_server/create-server-route-client';

const strip = (str: string) => str.replace(/['"\[\]]/g, '');

const listEventsFormatted = async (subjectId: string) => {
  const { data: events } = await createServerRouteClient()
    .from('events')
    .select(
      `
      comments(
        content,
        profile:profiles(first_name, last_name)
      ),
      created_at,
      inputs:event_inputs(
        input:inputs(label, type),
        option:input_options(label),
        value
      ),
      profile:profiles(first_name, last_name),
      type:event_types(
        session:sessions(
          id,
          mission:missions(name),
          order
        ),
        name,
        order
      )`,
    )
    .eq('subject_id', subjectId)
    .order('created_at', { ascending: false })
    .order('order', { foreignTable: 'inputs' });

  if (!events) return [];
  const json: Array<any> = [];
  const previousModuleCompletionTime: Record<string, number> = {};

  events.reverse().forEach((e) => {
    const event = firstIfArray(e);
    const profile = firstIfArray(event.profile);

    const row: any = {
      'Comments (an)':
        event.comments && event.comments.length
          ? event.comments.map((comment: any) =>
              `${comment.profile.first_name} ${
                comment.profile.last_name
              }: ${comment.content.replace(/<[^>]+>/g, ' ')}`
                .replace(/\s+/g, ' ')
                .replace(/ $/, ''),
            )
          : undefined,
      'Module duration (q)': event.type.session
        ? previousModuleCompletionTime[event.type.session.id]
          ? Math.floor(
              (new Date(event.created_at).getTime() -
                new Date(
                  previousModuleCompletionTime[event.type.session.id],
                ).getTime()) /
                1000,
            )
          : 0
        : undefined,
      'Module number (o)': event.type.session
        ? event.type.order + 1
        : undefined,
      'Name (n)': strip(event.type.name ?? event.type.session?.mission?.name),
      'Recorded by (n)': strip(`${profile.first_name} ${profile.last_name}`),
      'Session number (o)': event.type.session
        ? event.type.session.order + 1
        : undefined,
      'Timestamp (t)': event.created_at,
    };

    if (event.type.session) {
      previousModuleCompletionTime[event.type.session.id] = event.created_at;
    }

    forceArray(event.inputs).forEach((input: any) => {
      const strippedLabel = strip(input.input.label);

      if (input.input.type === 'multi_select') {
        const key = `${strippedLabel} (an)`;
        row[key] = row[key] ?? [];
        row[key].push(input.option.label);
      } else {
        const type = /(duration|number|stopwatch)/.test(input.input.type)
          ? 'q'
          : 'n';

        row[`${strippedLabel} (${type})`] = input.value ?? input.option.label;
      }
    });

    json.push(row);
  });

  return json;
};

export default listEventsFormatted;
