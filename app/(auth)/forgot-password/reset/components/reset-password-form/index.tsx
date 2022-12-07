'use client';

import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import Button from '/components/button';
import Input from '/components/input';
import Label from '/components/label';
import supabase from '/utilities/browser-supabase-client';
import sleep from '/utilities/sleep';

const ResetPasswordForm = () => {
  const router = useRouter();

  return (
    <Formik
      initialValues={{ password: '' }}
      onSubmit={async ({ password }) => {
        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
          alert(error.message);
        } else {
          await router.push('/subjects');
          await sleep();
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Label className="mt-9">
            New password
            <Input name="password" type="password" />
          </Label>
          <Button className="mt-12" loading={isSubmitting} loadingText="Sending link…" type="submit">
            Update password
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default ResetPasswordForm;
