'use client';

import Menu from '(components)/menu';

import {
  ArrowUpRightIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline';

interface EventCardMenuProps {
  missionId: string;
  sessionNumber: number;
  subjectId: string;
}

const EventCardMenu = ({
  missionId,
  sessionNumber,
  subjectId,
}: EventCardMenuProps) => (
  <Menu>
    <Menu.Button className="-mr-3 p-3">
      <EllipsisHorizontalIcon className="relative -right-[0.18em] w-7" />
    </Menu.Button>
    <Menu.Items>
      <Menu.Item
        href={`/subjects/${subjectId}/mission/${missionId}/session/${sessionNumber}`}
      >
        <ArrowUpRightIcon className="w-5 text-fg-3" />
        View full session
      </Menu.Item>
    </Menu.Items>
  </Menu>
);

export default EventCardMenu;
