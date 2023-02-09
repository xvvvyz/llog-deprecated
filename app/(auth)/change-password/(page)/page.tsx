import Card from '(components)/card';
import ChangePasswordForm from './(components)/change-password-form';

const Page = () => (
  <Card breakpoint="sm">
    <h1 className="mb-8 text-2xl">Change your password</h1>
    <ChangePasswordForm />
  </Card>
);

export default Page;
