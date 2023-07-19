import firstIfArray from '@/(account)/_utilities/first-if-array';
import forceArray from '@/(account)/_utilities/force-array';
import createServerRouteClient from '@/_server/create-server-route-client';
import { NextResponse } from 'next/server';

export const revalidate = 60;

const strip = (str: string) => str.replace(/['"]/g, '');

interface GetContext {
  params: {
    subjectId: string;
  };
}

export const GET = async (req: Request, ctx: GetContext) => {
  const { data: events } = await createServerRouteClient()
    .from('events')
    .select(
      `
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
    .eq('subject_id', ctx.params.subjectId)
    .order('created_at')
    .order('order', { foreignTable: 'inputs' });

  if (!events) return new NextResponse(null, { status: 404 });
  const json: Array<any> = [];
  const previousModuleCompletionTime: Record<string, number> = {};

  events.forEach((e) => {
    const event = firstIfArray(e);
    const profile = firstIfArray(event.profile);

    const row: any = {
      'Module duration (quantitative)': event.type.session
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
      'Module number (ordinal)': event.type.session
        ? event.type.order + 1
        : undefined,
      'Name (nominal)': strip(
        event.type.name ?? event.type.session?.mission?.name,
      ),
      'Recorded by (nominal)': strip(
        `${profile.first_name} ${profile.last_name}`,
      ),
      'Session number (ordinal)': event.type.session
        ? event.type.session?.order + 1
        : undefined,
      'Timestamp (temporal)': event.created_at,
    };

    if (event.type.session) {
      previousModuleCompletionTime[event.type.session.id] = event.created_at;
    }

    forceArray(event.inputs).forEach((input: any) => {
      const type = /(duration|number)/.test(input.input.type)
        ? 'quantitative'
        : 'nominal';
      const key = strip(`${input.input.label} (${type})`);
      row[key] = row[key] ?? [];
      row[key].push(input.value ?? input.option.label);
    });

    json.push(row);
  });

  return new NextResponse(JSON.stringify(json), { status: 200 });
};
