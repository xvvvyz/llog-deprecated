create table "public"."template_subjects" (
  "template_id" uuid not null,
  "subject_id" uuid not null
);

alter table "public"."template_subjects" enable row level security;
create unique index template_subjects_pkey on public.template_subjects using btree (template_id, subject_id);
alter table "public"."template_subjects" add constraint "template_subjects_pkey" primary key using index "template_subjects_pkey";
alter table "public"."template_subjects" add constraint "template_subjects_subject_id_fkey" foreign key (subject_id) references subjects (id) on update cascade on delete cascade not valid;
alter table "public"."template_subjects" validate constraint "template_subjects_subject_id_fkey";
alter table "public"."template_subjects" add constraint "template_subjects_template_id_fkey" foreign key (template_id) references templates (id) on update cascade on delete cascade not valid;
alter table "public"."template_subjects" validate constraint "template_subjects_template_id_fkey";

create policy "Select template = full access." on "public"."template_subjects" as permissive
  for all to public
    using ((exists (
      select 1
      from templates
      where (template_subjects.template_id = templates.id))));
