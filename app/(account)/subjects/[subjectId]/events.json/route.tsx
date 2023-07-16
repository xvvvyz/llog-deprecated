import firstIfArray from '@/(account)/_utilities/first-if-array';
import forceArray from '@/(account)/_utilities/force-array';
import createServerRouteClient from '@/_server/create-server-route-client';
import { NextResponse } from 'next/server';

export const revalidate = 60;

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
          mission:missions(name),
          order
        ),
        name,
        order
      )`,
    )
    .eq('subject_id', ctx.params.subjectId)
    .order('created_at', { ascending: false })
    .order('order', { foreignTable: 'inputs' });

  if (!events) return new NextResponse(null, { status: 404 });
  const json: Array<any> = [];

  events.forEach((e) => {
    const event = firstIfArray(e);
    const profile = firstIfArray(event.profile);

    const common = {
      ModuleNumber: event.type.session ? event.type.order + 1 : undefined,
      Name: event.type.name ?? event.type.session?.mission?.name,
      RecordType: event.type.session ? 'MissionEvent' : 'Event',
      RecordedBy: `${profile.first_name} ${profile.last_name}`,
      SessionNumber: event.type.session
        ? event.type.session?.order + 1
        : undefined,
      Timestamp: event.created_at,
    };

    json.push(common);

    forceArray(event.inputs).forEach((input) => {
      json.push({
        ...common,
        InputLabel: input.input?.label,
        InputType: input.input?.type,
        InputValue: input.value ?? input.option?.label,
        RecordType: 'EventInput',
      });
    });
  });

  return new NextResponse(JSON.stringify(json), { status: 200 });
};
