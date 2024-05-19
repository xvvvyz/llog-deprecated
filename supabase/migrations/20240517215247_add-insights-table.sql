create table "public"."insights" (
  "id" uuid not null default gen_random_uuid (),
  "subject_id" uuid not null,
  "config" jsonb not null,
  "name" text not null
);

alter table "public"."insights" enable row level security;
create unique index insights_pkey on public.insights using btree (id);

alter table "public"."insights"
  add constraint "insights_pkey" primary key using index "insights_pkey";

alter table "public"."insights"
  add constraint "insights_subject_id_fkey" foreign key (subject_id) references subjects (id) on delete cascade not valid;

alter table "public"."insights" validate constraint "insights_subject_id_fkey";
alter table "public"."insights" add constraint "insights_name_check" check (((length(name) > 0) and (length(name) < 50))) not valid;
alter table "public"."insights" validate constraint "insights_name_check";

create policy "Team members & subject managers can select." on "public"."insights" as permissive
  for select to authenticated
    using ((exists (
      select 1
      from subjects s
      where (s.id = insights.subject_id))));

create policy "Team members can delete." on "public"."insights" as permissive
  for delete to authenticated
    using ((exists (
      select 1
      from team_members tm
      where ((tm.team_id = (
        select s.team_id
        from subjects s
        where (s.id = insights.subject_id))) and (tm.profile_id = auth.uid ())))));

create policy "Team members can insert." on "public"."insights" as permissive
  for insert to authenticated
    with check ((exists (
      select 1
      from team_members tm
      where ((tm.team_id = (
        select s.team_id
        from subjects s
        where (s.id = insights.subject_id))) and (tm.profile_id = auth.uid ())))));

create policy "Team members can update." on "public"."insights" as permissive
  for update to authenticated
    using ((exists (
      select 1
      from team_members tm
      where ((tm.team_id = (
        select s.team_id
        from subjects s
        where (s.id = insights.subject_id))) and (tm.profile_id = auth.uid ())))))
      with check ((exists (
        select 1
        from team_members tm
        where ((tm.team_id = (
          select s.team_id
          from subjects s
          where (s.id = insights.subject_id))) and (tm.profile_id = auth.uid ())))));
