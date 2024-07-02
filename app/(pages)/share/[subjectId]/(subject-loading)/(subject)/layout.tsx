import SubjectLayout from '@/_components/subject-layout';
import { ReactNode } from 'react';

interface PageProps {
  children: ReactNode;
  params: { subjectId: string };
}

const Layout = ({ children, params: { subjectId } }: PageProps) => (
  <SubjectLayout isPublic subjectId={subjectId}>
    {children}
  </SubjectLayout>
);

export default Layout;
