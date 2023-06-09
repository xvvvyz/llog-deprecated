import EmailSent from '@/(authentication)/_components/email-sent';

const Page = () => <EmailSent>We sent you a password reset link.</EmailSent>;

export const metadata = { title: 'Forgot password' };
export default Page;
