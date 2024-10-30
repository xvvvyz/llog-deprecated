import Button from '@/_components/button';
import CheckoutButton from '@/_components/checkout-button';
import * as Modal from '@/_components/modal';
import PageModalHeader from '@/_components/page-modal-header';
import SubscriptionVariantName from '@/_constants/enum-subscription-variant-name';
import getCurrentUser from '@/_queries/get-current-user';
import getTeam from '@/_queries/get-team';

interface PageProps {
  params: Promise<{ teamId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { teamId } = await params;

  const [{ data: team }, user] = await Promise.all([
    getTeam(teamId),
    getCurrentUser(),
  ]);

  if (!team || !user) return;

  return (
    <Modal.Content>
      <PageModalHeader title="Upgrade plan" />
      <div className="space-y-14 px-4 pb-8 pt-6 sm:px-8">
        <table className="w-full">
          <thead>
            <tr className="text-fg-4">
              <th></th>
              <th className="pb-2 text-xl font-normal">Free</th>
              <th className="pb-2 text-xl font-normal">Pro</th>
              <th className="pb-2 text-xl font-normal">Team</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-alpha-1">
            <tr>
              <td className="py-2 text-fg-4">Team seats</td>
              <td className="py-2 text-center text-fg-4">1</td>
              <td className="py-2 text-center text-fg-4">2</td>
              <td className="py-2 text-center text-lg leading-none">∞</td>
            </tr>
            <tr>
              <td className="py-2 text-fg-4">Subject limit</td>
              <td className="py-2 text-center text-fg-4">2</td>
              <td className="py-2 text-center text-lg leading-none">∞</td>
              <td className="py-2 text-center text-lg leading-none">∞</td>
            </tr>
            <tr>
              <td className="py-2 text-fg-4">Priority support</td>
              <td className="py-2 text-center text-fg-4">x</td>
              <td className="py-2 text-center">✓</td>
              <td className="py-2 text-center">✓</td>
            </tr>
            <tr>
              <td></td>
              <td className="pt-2 text-center">$0</td>
              <td className="pt-2 text-center">
                $19<span className="text-xs"> / m</span>
              </td>
              <td className="pt-2 text-center">
                $59<span className="text-xs"> / m</span>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex gap-4">
          <Modal.Close asChild>
            <Button className="w-full" colorScheme="transparent">
              Cancel
            </Button>
          </Modal.Close>
          <CheckoutButton
            disabled={!!team.subscriptions.length}
            teamId={teamId}
            variant={SubscriptionVariantName.Pro}
          />
        </div>
      </div>
    </Modal.Content>
  );
};

export default Page;
