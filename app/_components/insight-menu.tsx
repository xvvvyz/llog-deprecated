import * as Drawer from '@/_components/drawer';
import DrawerDeleteButton from '@/_components/drawer-delete-button';
import deleteInsight from '@/_mutations/delete-insight';
import EllipsisVerticalIcon from '@heroicons/react/24/outline/EllipsisVerticalIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';

interface InsightMenuProps {
  insightId: string;
  subjectId: string;
}

const InsightMenu = ({ insightId, subjectId }: InsightMenuProps) => (
  <Drawer.Root>
    <Drawer.Trigger>
      <div className="group flex items-center justify-center px-1.5 text-fg-3 transition-colors hover:text-fg-2">
        <div className="rounded-full p-2 transition-colors group-hover:bg-alpha-1">
          <EllipsisVerticalIcon className="w-5" />
        </div>
      </div>
    </Drawer.Trigger>
    <Drawer.Portal>
      <Drawer.Overlay />
      <Drawer.Content>
        <Drawer.Title>Insight menu</Drawer.Title>
        <Drawer.Description />
        <Drawer.Button
          href={`/subjects/${subjectId}/insights/${insightId}/edit`}
        >
          <PencilIcon className="w-5 text-fg-4" />
          Edit
        </Drawer.Button>
        <DrawerDeleteButton
          confirmText="Delete insight"
          onConfirm={() => deleteInsight(insightId)}
        />
      </Drawer.Content>
    </Drawer.Portal>
  </Drawer.Root>
);

export default InsightMenu;
