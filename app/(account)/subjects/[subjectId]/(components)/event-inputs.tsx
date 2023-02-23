import InputTypes from '(utilities)/enum-input-types';
import formatInputValue from '(utilities)/format-input-value';

interface EventInputsProps {
  className?: string;
  inputs: Array<{
    input: {
      id: string;
      label: string;
      type: InputTypes;
    };
    option?: {
      label: string;
    };
    value?: string;
  }>;
}

const EventInputs = ({ className, inputs }: EventInputsProps) => {
  if (!inputs.length) return null;

  return (
    <div className={className}>
      <table className="w-full table-fixed text-fg-3">
        <tbody>
          {Object.entries(
            inputs.reduce((acc, { input, option, value }) => {
              acc[input.id] = acc[input.id] ?? { values: [] };
              acc[input.id].label = input.label;
              acc[input.id].type = input.type;
              const s = value ?? option?.label;
              if (s) acc[input.id].values.push(s);
              return acc;
            }, {} as Record<string, { label: string; type: InputTypes; values: string[] }>)
          ).map(([id, { label, type, values }]) => (
            <tr key={id}>
              <td className="border-t border-alpha-1 px-4 py-2 align-top">
                {label}
              </td>
              <td className="border-t border-l border-alpha-1 py-2 px-4 align-top">
                {formatInputValue[type](values)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventInputs;
