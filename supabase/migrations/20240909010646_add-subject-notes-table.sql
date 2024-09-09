create table "public"."subject_notes" (
  "id" uuid not null,
  "content" text not null
);

alter table "public"."subject_notes" enable row level security;
create unique index subject_notes_pkey on public.subject_notes using btree (id);
alter table "public"."subject_notes" add constraint "subject_notes_pkey" primary key using index "subject_notes_pkey";
alter table "public"."subject_notes" add constraint "subject_notes_id_fkey" foreign key (id) references subjects (id) on update cascade on delete cascade not valid;
alter table "public"."subject_notes" validate constraint "subject_notes_id_fkey";

create policy "Team members = full access." on "public"."subject_notes" as permissive
  for all to authenticated
    using ((exists (
      select 1
      from team_members tm
      where ((tm.team_id = (
        select s.team_id
        from subjects s
        where (s.id = subject_notes.id))) and (tm.profile_id = auth.uid ())))));
