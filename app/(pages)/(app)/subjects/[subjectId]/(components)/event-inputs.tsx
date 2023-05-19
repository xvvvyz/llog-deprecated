import InputTypes from '(utilities)/enum-input-types';
import formatInputValue from '(utilities)/format-input-value';

interface EventInputsProps {
  className?: string;
  inputs: Array<{
    input?: {
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
      <table className="w-full table-fixed">
        <tbody>
          {Object.entries(
            inputs.reduce((acc, { input, option, value }) => {
              if (!input) return acc;
              acc[input.id] = acc[input.id] ?? { values: [] };
              acc[input.id].label = input.label;
              acc[input.id].type = input.type;

              if (value || option?.label) {
                acc[input.id].values.push({ label: option?.label, value });
              }

              return acc;
            }, {} as Record<string, { label: string; type: InputTypes; values: { label?: string; value?: string }[] }>)
          ).map(([id, { label, type, values }]) => (
            <tr key={id}>
              <td className="truncate border-t border-alpha-1 px-4 py-2 align-top text-fg-3">
                {label}
              </td>
              <td className="truncate border-l border-t border-alpha-1 px-4 py-2 align-top text-fg-2">
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
