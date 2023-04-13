import createServerSupabaseClient from '(utilities)/create-server-supabase-client';
import InputTypes from '(utilities)/enum-input-types';
import firstIfArray from '(utilities)/first-if-array';
import getCurrentUser from '(utilities)/get-current-user';
import listEvents from '(utilities)/list-events';
import { JSDOM } from 'jsdom';
import { NextResponse } from 'next/server';
import { Configuration, OpenAIApi } from 'openai';

interface GetContext {
  params: {
    subjectId: string;
  };
}

export const GET = async (req: Request, ctx: GetContext) => {
  const user = await getCurrentUser();

  if (!user?.id) {
    return new NextResponse(null, { status: 401 });
  }

  const searchParams = new URL(req.url).searchParams;
  const q = searchParams.get('q');

  if (!q) {
    return new NextResponse(null, { status: 400 });
  }

  const { data: subject } = await createServerSupabaseClient()
    .from('subjects')
    .select('birthdate, id, name, species')
    .eq('id', ctx.params.subjectId)
    .single();

  const { data: eventsData } = await listEvents(ctx.params.subjectId);

  if (!subject || !eventsData) {
    return new NextResponse(null, { status: 404 });
  }

  let system =
    'Answer any queries regarding the selected subject and events recorded in the app. If there is not enough even event data to provide useful information, suggest consistently recording detailed observations and routines so you can provide useful insights. Avoid giving advice on why a particular behavior may be occurring unless explicitly asked. Do not mention that you are an AI language model.\n\n';

  system += `Today's date: ${new Date().toISOString()}\n\n`;

  system += 'Selected subject: """\n';
  system += `Name: ${subject.name.split(' ')[0]}\n`;
  if (subject.species) system += `Species: ${subject.species.toLowerCase()}\n`;
  if (subject.birthdate) system += `Birthdate: ${subject.birthdate}\n`;
  system += '"""\n\n';
  system += 'Events recorded in the app: """';

  system += eventsData.reduce((acc, e) => {
    const event = firstIfArray(e);

    const date = new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      hour: '2-digit',
      hour12: false,
      minute: '2-digit',
      month: '2-digit',
      timeZone: 'America/Los_Angeles',
      year: '2-digit',
    })
      .format(new Date(event.created_at))
      .replace(',', '');

    const name =
      event.type.name ??
      `${event.type.mission.name} session ${event.type.order + 1}`;

    acc += `\n${date} ${name} ${event.type.type}\n`;

    Object.entries(
      event.inputs.reduce((acc: any, { input, option, value }: any) => {
        if (!input) return acc;
        acc[input.id] = acc[input.id] ?? { values: [] };
        acc[input.id].label = input.label;

        if (input.type === InputTypes.Stopwatch) {
          if (option) acc[input.id].values.push(`${value} ${option.label}`);
          else acc[input.id].values.push(`total time was ${value}`);
        } else if (value || option?.label) {
          acc[input.id].values.push(option?.label ?? value);
        }

        return acc;
      }, {} as Record<string, { label: string; values: string[] }>)
    ).forEach(([, input]: any) => {
      acc += `${input.label}: ${input.values.join(', ')}\n`;
    });

    event.comments.forEach((comment: any) => {
      acc += new JSDOM(comment.content).window.document.body.textContent;
      acc += '\n';
    });

    return `${acc}`;
  }, '');

  system += '"""\n';

  try {
    const completion = await new OpenAIApi(
      new Configuration({ apiKey: process.env.OPENAI_API_KEY })
    ).createChatCompletion({
      messages: [
        { content: system, role: 'system' },
        { content: q, role: 'user' },
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0.8,
      user: user.id,
    });

    return NextResponse.json(completion.data.choices[0]);
  } catch (e: any) {
    return new NextResponse(JSON.stringify(e.response.data.error), {
      status: e.response.status,
    });
  }
};
