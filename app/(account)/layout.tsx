import Nav from '(components)/nav';
import getCurrentUser from '(utilities)/get-current-user';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
  const user = await getCurrentUser();

  return (
    <div className="mx-auto max-w-lg px-4 pb-16">
      <Nav isClient={!!user?.user_metadata?.is_client} />
      {children}
    </div>
  );
};

export default Layout;
