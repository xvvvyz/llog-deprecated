import InputType from '@/_constants/enum-input-type';
import { ListEventsData } from '@/_queries/list-events';
import formatInputValue from '@/_utilities/format-input-value';
import { twMerge } from 'tailwind-merge';

interface TimelineEventInputsTableProps {
  className?: string;
  inputs: NonNullable<ListEventsData>[0]['inputs'];
}

const TimelineEventInputsTable = ({
  className,
  inputs,
}: TimelineEventInputsTableProps) => (
  <div className={twMerge('border-t border-alpha-1 pt-2', className)}>
    <table className="w-full table-fixed">
      <tbody>
        {Object.entries(
          inputs.reduce<
            Record<
              string,
              {
                label: string;
                type: InputType;
                values: {
                  label?: string;
                  value?: string;
                }[];
              }
            >
          >((acc, { input, option, value }) => {
            if (!input) return acc;
            acc[input.id] = acc[input.id] ?? { values: [] };
            acc[input.id].label = input.label;
            acc[input.id].type = input.type as InputType;

            if (value || option?.label) {
              acc[input.id].values.push({
                label: option?.label,
                value: value as string,
              });
            }

            return acc;
          }, {}),
        ).map(([id, { label, type, values }]) => (
          <tr key={id}>
            <td className="truncate py-0.5 pr-4 text-fg-4">{label}</td>
            <td className="truncate py-0.5">
              {formatInputValue[type as InputType](values)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TimelineEventInputsTable;
