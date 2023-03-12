create table "public"."input_subjects" (
  "input_id" uuid not null,
  "subject_id" uuid not null
);

alter table "public"."input_subjects" enable row level security;
create unique index input_subjects_pkey on public.input_subjects using btree (input_id, subject_id);
alter table "public"."input_subjects" add constraint "input_subjects_input_id_fkey" foreign key (input_id) references inputs (id) not valid;
alter table "public"."input_subjects" add constraint "input_subjects_pkey" primary key using index "input_subjects_pkey";
alter table "public"."input_subjects" add constraint "input_subjects_subject_id_fkey" foreign key (subject_id) references subjects (id) not valid;
alter table "public"."input_subjects" validate constraint "input_subjects_input_id_fkey";
alter table "public"."input_subjects" validate constraint "input_subjects_subject_id_fkey";

create policy "Team members & subject managers can select." on "public"."input_subjects" as permissive
  for select to authenticated
    using ((exists (
      select 1
      from inputs
      where (input_subjects.input_id = inputs.id))));

create policy "Team members can delete." on "public"."input_subjects" as permissive
  for delete to authenticated
    using ((exists (
      select 1
      from team_members tm
      where ((tm.team_id = (
        select i.team_id
        from inputs i
        where (i.id = input_subjects.input_id))) and (tm.profile_id = auth.uid ())))));

create policy "Team members can insert." on "public"."input_subjects" as permissive
  for insert to authenticated
    with check ((exists (
      select 1
      from team_members tm
      where ((tm.team_id = (
        select i.team_id
        from inputs i
        where (i.id = input_subjects.input_id))) and (tm.profile_id = auth.uid ())))));
