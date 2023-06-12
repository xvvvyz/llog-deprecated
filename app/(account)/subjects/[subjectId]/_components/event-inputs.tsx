import InputTypes from '@/(account)/_constants/enum-input-types';
import formatInputValue from '@/(account)/_utilities/format-input-value';

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
      <table className="w-full table-fixed bg-alpha-reverse-1">
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
            <tr className="group" key={id}>
              <td className="truncate border-t border-alpha-1 px-4 py-2 align-top text-fg-3 group-first-of-type:border-t-0">
                {label}
              </td>
              <td className="truncate border-t border-alpha-1 py-2 pr-4 align-top group-first-of-type:border-t-0">
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
