import ChangePasswordForm from './(components)/change-password-form';

const Page = () => (
  <div className="w-full sm:rounded sm:border sm:border-alpha-1 sm:bg-bg-2 sm:p-8">
    <h1 className="mb-10 text-2xl">Change your password</h1>
    <ChangePasswordForm />
  </div>
);

export const metadata = { title: 'Change password' };
export default Page;
