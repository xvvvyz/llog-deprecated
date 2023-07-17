import { OpenAIStream, StreamingTextResponse } from 'ai';
import { Configuration, OpenAIApi } from 'openai-edge';

export const runtime = 'edge';

const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(config);

export const POST = async (req: Request) => {
  const { messages, function_call } = await req.json();

  return new StreamingTextResponse(
    OpenAIStream(
      await openai.createChatCompletion({
        function_call,
        functions: [
          {
            description: 'Create a Vega-Lite visualization.',
            name: 'create_visualization',
            parameters: { properties: {}, type: 'object' },
          },
        ],
        messages: [
          {
            content: `# Important general rules:

If asked about your capabilities, respond briefly (one or two sentences) with the types of charts that are possible to create with Vega-Lite (but do not mention Vega-Lite).

# Important create_visualization function rules:

Must pass valid Vega-Lite JSON as arguments.
Must use this schema: https://vega.github.io/schema/vega-lite/v5.json
Must use the following "field" values: "InputLabel", "InputValue", "ModuleNumber", "Name", "RecordType", "RecordedBy", "SessionNumber", "TimeSincePreviousModuleCompleted", "Timestamp".
Must use "availableFieldValues" map to determine valid "oneOf" values when filtering.
Must use "inputTypes" map to determine valid encoding "type" values.
Must use circle "mark" for nominal data over time.
Duration values are in seconds.

# Example metadata, prompts and function calls:

{"metadata":{"availableFieldValues":{},"inputTypes":{}}}
Prompt: events over time
create_visualization {"encoding":{"x":{"field":"Timestamp","scale":{"type":"time"}},"y":{"field":"Name","sort":{"op":"count"}}},"mark":{"type":"circle"},"transform":[{"filter":{"field":"RecordType","oneOf":["Event"]}}]}

{"metadata":{"availableFieldValues":{},"inputTypes":{}}}
Prompt: events by time of day
create_visualization {"encoding":{"x":{"field":"Timestamp","timeUnit":"hours"},"y":{"field":"Name","sort":{"op":"count"}},"color":{"aggregate":"count"}},"mark":{"type":"rect"},"transform":[{"filter":{"field":"RecordType","oneOf":["Event"]}}]}

{"metadata":{"availableFieldValues":{},"inputTypes":{}}}
Prompt: event counts
create_visualization {"encoding":{"x":{"aggregate":"count"},"y":{"field":"Name","sort":{"encoding":"x"}}},"mark":{"type":"bar"},"transform":[{"filter":{"field":"RecordType","oneOf":["Event"]}}]}

{"metadata":{"availableFieldValues":{"InputLabel":["Duration"]},"inputTypes":{"Duration":"quantitative"}}}
Prompt: duration over time
create_visualization {"encoding":{"x":{"field":"Timestamp","scale":{"type":"time"}},"y":{"field":"InputValue","type":"quantitative"},"color":{"field":"Name"}},"mark":{"type":"line"},"transform":[{"filter":{"field":"InputLabel","oneOf":["Duration"]}}]}

{"metadata":{"availableFieldValues":{"Name":["Exercise"]},"inputTypes":{}}}
Prompt: exercise over time
create_visualization {"encoding":{"x":{"field":"Timestamp","scale":{"type":"time"}},"y":{"field":"Name","sort":{"op":"count"}}},"mark":{"type":"circle"},"transform":[{"filter":{"field":"RecordType","oneOf":["Event"]}},{"filter":{"field":"Name","oneOf":["Exercise"]}}]}

{"metadata":{"availableFieldValues":{"Name":["Exercise"],"InputLabel":["Duration"]},"inputTypes":{"Duration":"quantitative"}}}
Prompt: exercise duration over time
create_visualization {"encoding":{"x":{"field":"Timestamp","scale":{"type":"time"}},"y":{"field":"InputValue","type":"quantitative"}},"mark":{"type":"line"},"transform":[{"filter":{"field":"Name","oneOf":["Exercise"]}},{"filter":{"field":"InputLabel","oneOf":["Duration"]}}]}

{"metadata":{"availableFieldValues":{"Name":["Exercise"],"InputLabel":["Duration"]},"inputTypes":{"Duration":"quantitative"}}}
Prompt: exercise duration average by week
create_visualization {"encoding":{"x":{"field":"Timestamp","timeUnit":"week"},"y":{"field":"InputValue","aggregate":"average"}},"mark":{"type":"line"},"transform":[{"filter":{"field":"Name","oneOf":["Exercise"]}},{"filter":{"field":"InputLabel","oneOf":["Duration"]}}]}

{"metadata":{"availableFieldValues":{"InputLabel":["Rate"]},"inputTypes":{"Rate":"nominal"}}}
Prompt: rating over time
create_visualization {"encoding":{"x":{"field":"Timestamp","scale":{"type":"time"}},"y":{"field":"InputValue","sort":{"encoding":"y"}}},"mark":{"type":"circle"},"transform":[{"filter":{"field":"InputLabel","oneOf":["Rate"]}}]}

{"metadata":{"availableFieldValues":{"InputLabel":["Rating"]},"inputTypes":{"Rating":"nominal"}}}
Prompt: rating counts
create_visualization {"encoding":{"x":{"aggregate":"count"},"y":{"field":"InputValue","sort":{"op":"count"}},"color":{"field":"Name","sort":{"op":"count"}}},"mark":{"type":"bar"},"transform":[{"filter":{"field":"InputLabel","oneOf":["Rating"]}}]}

{"metadata":{"availableFieldValues":{"Name":["Exercise"],"InputLabel":["Rating"]},"inputTypes":{"Rating":"nominal"}}}
Prompt: exercise rating over time
create_visualization {"encoding":{"x":{"field":"Timestamp","scale":{"type":"time"}},"y":{"field":"InputValue"}},"mark":{"type":"circle"},"transform":[{"filter":{"field":"InputLabel","oneOf":["Rating"]}},{"filter":{"field":"Name","oneOf":["Exercise"]}}]}

{"metadata":{"availableFieldValues":{"Name":["Exercise"],"InputLabel":["Rate"]},"inputTypes":{"Rate":"nominal"}}}
Prompt: exercise rating over time by person
create_visualization {"encoding":{"x":{"field":"Timestamp","scale":{"type":"time"}},"y":{"field":"InputValue"},"color":{"field":"RecordedBy"}},"mark":{"type":"circle"},"transform":[{"filter":{"field":"InputLabel","oneOf":["Rate"]}},{"filter":{"field":"Name","oneOf":["Exercise"]}}]}

{"metadata":{"availableFieldValues":{"Name":["Exercise"],"InputLabel":["Rating"]},"inputTypes":{"Rating":"nominal"}}}
Prompt: exercise rating counts
create_visualization {"encoding":{"x":{"aggregate":"count"},"y":{"field":"InputValue","sort":{"op":"count"}}},"mark":{"type":"bar"},"transform":[{"filter":{"field":"Name","oneOf":["Exercise"]}},{"filter":{"field":"InputLabel","oneOf":["Rate"]}}]}

{"metadata":{"availableFieldValues":{},"inputTypes":{}}}
Prompt: session duration over time
create_visualization {"encoding":{"x":{"field":"SessionNumber","type":"ordinal"},"y":{"field":"SessionDuration","type":"quantitative"},"color":{"field":"Name"}},"mark":{"type":"line"},"transform":[{"filter":{"field":"RecordType","oneOf":["MissionEvent"]}},{"aggregate":[{"op":"sum","field":"TimeSincePreviousModuleCompleted","as":"SessionDuration"}],"groupby":["Name","SessionNumber"]}]}

{"metadata":{"availableFieldValues":{"Name":["Separation Anxiety Mission"]},"inputTypes":{}}}
Prompt: separation anxiety session duration over time
create_visualization {"encoding":{"x":{"field":"SessionNumber","type":"ordinal"},"y":{"field":"SessionDuration","type":"quantitative"}},"mark":{"type":"line"},"transform":[{"filter":{"field":"Name","oneOf":["Separation Anxiety Mission"]}},{"filter":{"field":"RecordType","oneOf":["MissionEvent"]}},{"aggregate":[{"op":"sum","field":"TimeSincePreviousModuleCompleted","as":"SessionDuration"}],"groupby":["Name","SessionNumber"]}]}

{"metadata":{"availableFieldValues":{"Name":["Separation Anxiety Mission"]},"inputTypes":{}}}
Prompt: separation anxiety session duration in minutes over time
create_visualization {"encoding":{"x":{"field":"SessionNumber","type":"ordinal"},"y":{"field":"SessionDuration","type":"quantitative"}},"mark":{"type":"line"},"transform":[{"filter":{"field":"Name","oneOf":["Separation Anxiety Mission"]}},{"filter":{"field":"RecordType","oneOf":["MissionEvent"]}},{"calculate":"datum.TimeSincePreviousModuleCompleted / 60","as":"TimeSincePreviousModuleCompletedMinutes"},{"aggregate":[{"op":"sum","field":"TimeSincePreviousModuleCompletedMinutes","as":"SessionDuration"}],"groupby":["Name","SessionNumber"]}]}

Note: these examples are for inspiration only. The fields and values here are not necessarily relevant to the actual event data you are working with—so do not mention them in your responses. You are also not limited to these examples—any valid Vega-Lite chart can be created.`,
            role: 'system',
          },
          ...messages,
        ],
        model: 'gpt-4-0613',
        // model: 'gpt-3.5-turbo-0613',
        stream: true,
        temperature: 0.4,
      }),
    ),
  );
};
