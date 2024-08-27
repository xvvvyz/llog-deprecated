import * as Modal from '@/_components/modal';
import PageModalBackButton from '@/_components/page-modal-back-button';
import PageModalHeader from '@/_components/page-modal-header';
import UpgradePlanButton from '@/_components/upgrade-plan-button';
import getCurrentUser from '@/_queries/get-current-user';

const Page = async () => {
  const user = await getCurrentUser();
  if (!user) return;

  return (
    <Modal.Content>
      <PageModalHeader title="Upgrade plan" />
      <div className="space-y-14 px-4 pb-8 pt-6 sm:px-8">
        <table className="w-full">
          <thead>
            <tr>
              <th></th>
              <th className="pb-2 text-xl font-normal text-fg-4">Free</th>
              <th className="pb-2 text-xl font-normal">Pro</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-alpha-1">
            <tr>
              <td className="py-2 text-fg-4">Active subject limit</td>
              <td className="py-2 text-center text-fg-4">2</td>
              <td className="py-2 text-center">Unlimited</td>
            </tr>
            <tr>
              <td className="py-2 text-fg-4">Priority customer support</td>
              <td className="py-2 text-center text-fg-4">x</td>
              <td className="py-2 text-center">✓</td>
            </tr>
            <tr>
              <td className="py-2 text-fg-4">Support our mission</td>
              <td className="py-2 text-center text-fg-4">x</td>
              <td className="py-2 text-center">✓</td>
            </tr>
            <tr>
              <td></td>
              <td className="pt-2 text-center text-fg-4">$0</td>
              <td className="pt-2 text-center">
                $19<span className="text-xs"> / month</span>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex gap-4">
          <PageModalBackButton className="w-full" colorScheme="transparent">
            Close
          </PageModalBackButton>
          <UpgradePlanButton user={user} />
        </div>
      </div>
    </Modal.Content>
  );
};

export default Page;
