'use client';

import Button from '@/_components/button';
import * as Drawer from '@/_components/drawer';
import InputRoot from '@/_components/input-root';
import * as Label from '@/_components/label';
import Select from '@/_components/select-v2';
import { ListSubjectsByTeamIdData } from '@/_queries/list-subjects-by-team-id';
import EyeIcon from '@heroicons/react/24/outline/EyeIcon';
import * as Form from 'react-hook-form';

interface TemplateVisibilityFormSectionProps<T extends Form.FieldValues> {
  form: Form.UseFormReturn<T>;
  subjects: NonNullable<ListSubjectsByTeamIdData>;
}

const TemplateVisibilityFormSection = <T extends Form.FieldValues>({
  form,
  subjects,
}: TemplateVisibilityFormSectionProps<T>) => (
  <Drawer.Root>
    <Drawer.Trigger asChild>
      <Button className="sm:pr-6" variant="link">
        <EyeIcon className="w-5" />
        Visibility
      </Button>
    </Drawer.Trigger>
    <Drawer.Portal>
      <Drawer.Overlay />
      <Drawer.Content>
        <Drawer.Title>Template visibility</Drawer.Title>
        <Drawer.Description />
        <div className="flex flex-col gap-8">
          {!!subjects.length && (
            <Form.Controller
              control={form.control}
              name={'subjects' as Form.FieldPath<T>}
              render={({ field }) => (
                <InputRoot>
                  <Label.Root>Limit visibility to</Label.Root>
                  <Select
                    isMulti
                    onChange={(value) => field.onChange(value)}
                    options={subjects.map((subject) => ({
                      id: subject.id,
                      label: subject.name,
                    }))}
                    placeholder="All subjects…"
                    value={field.value}
                  />
                </InputRoot>
              )}
            />
          )}
          {/*<Form.Controller*/}
          {/*  control={form.control}*/}
          {/*  name={'public' as Form.FieldPath<T>}*/}
          {/*  render={({ field }) => (*/}
          {/*    <Switch*/}
          {/*      checked={field.value}*/}
          {/*      description={*/}
          {/*        <>*/}
          {/*          Enable this to share your template with*/}
          {/*          <br />*/}
          {/*          other professionals using llog.*/}
          {/*        </>*/}
          {/*      }*/}
          {/*      label="Community template"*/}
          {/*      name={field.name}*/}
          {/*      onCheckedChange={(value) => field.onChange(value)}*/}
          {/*    />*/}
          {/*  )}*/}
          {/*/>*/}
        </div>
      </Drawer.Content>
    </Drawer.Portal>
  </Drawer.Root>
);

export default TemplateVisibilityFormSection;
