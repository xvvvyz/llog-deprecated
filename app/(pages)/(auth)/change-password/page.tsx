import ChangePasswordForm from '@/_components/change-password-form';

export const metadata = { title: 'Change password' };

const Page = () => (
  <div className="w-full sm:rounded sm:border sm:border-alpha-1 sm:bg-bg-2 sm:p-8">
    <h1 className="mb-12 text-2xl">Change your password</h1>
    <ChangePasswordForm />
  </div>
);

export default Page;
