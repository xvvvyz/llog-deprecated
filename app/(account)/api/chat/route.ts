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
            description: `Create a Vega-Lite visualization.

Must use the following fields: InputLabel, InputValue, ModuleNumber, Name, RecordType, RecordedBy, SessionNumber, Timestamp
Must use availableFieldValues map to determine relevant values for each field.
Must use inputTypes map to determine the type of each field.`,
            name: 'create_visualization',
            parameters: {
              $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
              properties: {},
              type: 'object',
            },
          },
        ],
        messages: [
          {
            content: `Example metadata, prompts and function calls:

{"metadata":{"availableFieldValues":{},"inputTypes":{}}}
Prompt: events over time
create_visualization({"encoding":{"x":{"field":"Timestamp","scale":{"type":"time"}},"y":{"field":"Name","sort":{"op":"count"}}},"mark":{"type":"circle"},"transform":[{"filter":{"field":"RecordType","oneOf":["Event"]}}]})

{"metadata":{"availableFieldValues":{},"inputTypes":{}}}
Prompt: events by time of day
create_visualization({"encoding":{"x":{"field":"Timestamp","timeUnit":"hours"},"y":{"field":"Name","sort":{"op":"count"}},"color":{"aggregate":"count"}},"mark":{"type":"rect"},"transform":[{"filter":{"field":"RecordType","oneOf":["Event"]}}]})

{"metadata":{"availableFieldValues":{},"inputTypes":{}}}
Prompt: event counts
create_visualization({"encoding":{"x":{"aggregate":"count"},"y":{"field":"Name","sort":{"encoding":"x"}}},"mark":{"type":"bar"},"transform":[{"filter":{"field":"RecordType","oneOf":["Event"]}}]})

{"metadata":{"availableFieldValues":{"InputLabel":["Duration"]},"inputTypes":{"Duration":"quantitative"}}}
Prompt: duration over time
create_visualization({"encoding":{"x":{"field":"Timestamp","scale":{"type":"time"}},"y":{"field":"InputValue","type":"quantitative"},"color":{"field":"Name"}},"mark":{"type":"line"},"transform":[{"filter":{"field":"InputLabel","oneOf":["Duration"]}}]})

{"metadata":{"availableFieldValues":{"Name":["Exercise"],"InputLabel":["Duration"]},"inputTypes":{"Duration":"quantitative"}}}
Prompt: exercise duration over time
create_visualization({"encoding":{"x":{"field":"Timestamp","scale":{"type":"time"}},"y":{"field":"InputValue","type":"quantitative"}},"mark":{"type":"line"},"transform":[{"filter":{"field":"Name","oneOf":["Exercise"]}},{"filter":{"field":"InputLabel","oneOf":["Duration"]}}]})

{"metadata":{"availableFieldValues":{"Name":["Exercise"],"InputLabel":["Duration"]},"inputTypes":{"Duration":"quantitative"}}}
Prompt: exercise duration average by week
create_visualization({"encoding":{"x":{"field":"Timestamp","timeUnit":"week"},"y":{"field":"InputValue","aggregate":"average"}},"mark":{"type":"line"},"transform":[{"filter":{"field":"Name","oneOf":["Exercise"]}},{"filter":{"field":"InputLabel","oneOf":["Duration"]}}]})

{"metadata":{"availableFieldValues":{"InputLabel":["Rate"]},"inputTypes":{"Rate":"nominal"}}}
Prompt: rating over time
create_visualization({"encoding":{"x":{"field":"Timestamp","scale":{"type":"time"}},"y":{"field":"InputValue","sort":{"encoding":"y"},"color":{"field":"Name"}},"mark":{"type":"circle"}},"transform":[{"filter":{"field":"InputLabel","oneOf":["Rate"]}}]})

{"metadata":{"availableFieldValues":{"InputLabel":["Rating"]},"inputTypes":{"Rating":"nominal"}}}
Prompt: rating counts
create_visualization({"encoding":{"x":{"aggregate":"count"},"y":{"field":"InputValue","sort":{"op":"count"}},"color":{"field":"Name","sort":{"op":"count"}}},"mark":{"type":"bar"},"transform":[{"filter":{"field":"InputLabel","oneOf":["Rating"]}}]})

{"metadata":{"availableFieldValues":{"Name":["Exercise"],"InputLabel":["Rating"]},"inputTypes":{"Rating":"nominal"}}}
Prompt: exercise rating over time
create_visualization({"encoding":{"x":{"field":"Timestamp","scale":{"type":"time"}},"y":{"field":"InputValue"}},"mark":{"type":"circle"},"transform":[{"filter":{"field":"InputLabel","oneOf":["Rating"]}},{"filter":{"field":"Name","oneOf":["Exercise"]}}]})

{"metadata":{"availableFieldValues":{"Name":["Exercise"],"InputLabel":["Rate"]},"inputTypes":{"Rate":"nominal"}}}
Prompt: exercise rating over time by person
create_visualization({"encoding":{"x":{"field":"Timestamp","scale":{"type":"time"}},"y":{"field":"InputValue"},"color":{"field":"RecordedBy"}},"mark":{"type":"circle"},"transform":[{"filter":{"field":"InputLabel","oneOf":["Rate"]}},{"filter":{"field":"Name","oneOf":["Exercise"]}}]})

{"metadata":{"availableFieldValues":{"Name":["Exercise"],"InputLabel":["Rating"]},"inputTypes":{"Rating":"nominal"}}}
Prompt: exercise rating counts
create_visualization({"encoding":{"x":{"aggregate":"count"},"y":{"field":"InputValue","sort":{"op":"count"}}},"mark":{"type":"bar"},"transform":[{"filter":{"field":"Name","oneOf":["Exercise"]}},{"filter":{"field":"InputLabel","oneOf":["Rate"]}}]})`,
            role: 'system',
          },
          ...messages,
        ],
        model: 'gpt-4-0613',
        stream: true,
        temperature: 0.4,
      }),
    ),
  );
};
