alter table "public"."subjects" add column "share_code" text;
create unique index subjects_share_code_key on public.subjects using btree (share_code);

drop policy "Team members & subject managers can update." on "public"."events";
drop policy "Subject managers can select." on "public"."subject_managers";
drop policy "Team members & subject managers can update." on "public"."subjects";
drop policy "Team members can select." on "public"."team_members";
drop policy "Team members & subject managers can insert." on "public"."comments";
drop policy "Team members can delete." on "public"."event_type_inputs";
drop policy "Team members can insert." on "public"."event_type_inputs";
drop policy "Team members can insert." on "public"."event_types";
drop policy "Team members can update." on "public"."event_types";
drop policy "Team members & subject managers can insert." on "public"."events";
drop policy "Team members can insert." on "public"."input_options";
drop policy "Team members can update." on "public"."input_options";
drop policy "Team members & subject managers can select." on "public"."inputs";
drop policy "Team members can insert." on "public"."inputs";
drop policy "Team members can update." on "public"."inputs";
drop policy "Team members & subject managers can select." on "public"."missions";
drop policy "Team members can insert." on "public"."missions";
drop policy "Team members can update." on "public"."missions";
drop policy "Team members & subject managers can select." on "public"."subjects";
drop policy "Team members can insert." on "public"."subjects";
drop policy "Team members can delete." on "public"."templates";
drop policy "Team members can insert." on "public"."templates";
drop policy "Team members can select." on "public"."templates";
drop policy "Team members can update." on "public"."templates";

create policy "Owners can update." on "public"."events" as permissive
  for update to authenticated
    using ((profile_id = auth.uid ()))
    with check ((profile_id = auth.uid ()));

create policy "Authenticated users can select." on "public"."subject_managers" as permissive
  for select to authenticated using (true);

create policy "Team members can delete." on "public"."subject_managers" as permissive
  for delete to authenticated
    using ((exists (
      select 1
      from team_members tm
      where ((tm.team_id = (
        select s.team_id
        from subjects s
        where (s.id = subject_managers.subject_id))) and (tm.profile_id = auth.uid ())))));

create policy "Team members can update." on "public"."subjects" as permissive
  for update to authenticated
    using ((exists (
      select 1
      from team_members tm
      where ((tm.team_id = subjects.team_id) and (tm.profile_id = auth.uid ())))))
    with check ((exists (
      select 1
      from team_members tm
      where ((tm.team_id = subjects.team_id) and (tm.profile_id = auth.uid ())))));

create policy "Authenticated users can select." on "public"."team_members" as permissive
  for select to authenticated
    using (true);

create policy "Team members & subject managers can insert." on "public"."comments" as permissive
  for insert to authenticated
    with check (true);

create policy "Team members can delete." on "public"."event_type_inputs" as permissive
  for delete to authenticated
    using ((exists (
      select 1
      from team_members tm
      where ((tm.team_id = (
        select s.team_id
        from subjects s
        where (s.id = (
          select et.subject_id
          from event_types et
          where (et.id = event_type_inputs.event_type_id))))) and (tm.profile_id = auth.uid ())))));

create policy "Team members can insert." on "public"."event_type_inputs" as permissive
  for insert to authenticated
    with check ((exists (
      select 1
      from team_members tm
      where ((tm.team_id = (
        select s.team_id
        from subjects s
        where (s.id = (
          select et.subject_id
          from event_types et
          where (et.id = event_type_inputs.event_type_id))))) and (tm.profile_id = auth.uid ())))));

create policy "Team members can insert." on "public"."event_types" as permissive
  for insert to authenticated
    with check ((exists (
      select 1
      from team_members tm
      where ((tm.team_id = (
        select s.team_id
        from subjects s
        where (s.id = event_types.subject_id))) and (tm.profile_id = auth.uid ())))));

create policy "Team members can update." on "public"."event_types" as permissive
  for update to authenticated
    using ((exists (
      select 1
      from team_members tm
      where ((tm.team_id = (
        select s.team_id
        from subjects s
        where (s.id = event_types.subject_id))) and (tm.profile_id = auth.uid ())))))
      with check ((exists (
        select 1
        from team_members tm
        where ((tm.team_id = (
          select s.team_id
          from subjects s
          where (s.id = event_types.subject_id))) and (tm.profile_id = auth.uid ())))));

create policy "Team members & subject managers can insert." on "public"."events" as permissive
  for insert to authenticated with check (true);

create policy "Team members can insert." on "public"."input_options" as permissive
  for insert to authenticated
    with check ((exists (
      select 1
      from team_members tm
      where ((tm.team_id = (
        select i.team_id
        from inputs i
        where (i.id = input_options.input_id))) and (tm.profile_id = auth.uid ())))));

create policy "Team members can update." on "public"."input_options" as permissive
  for update to authenticated
    using ((exists (
      select 1
      from team_members tm
      where ((tm.team_id = (
        select i.team_id
        from inputs i
        where (i.id = input_options.input_id))) and (tm.profile_id = auth.uid ())))))
      with check ((exists (
        select 1
        from team_members tm
        where ((tm.team_id = (
          select i.team_id
          from inputs i
          where (i.id = input_options.input_id))) and (tm.profile_id = auth.uid ())))));

create policy "Team members & subject managers can select." on "public"."inputs" as permissive
  for select to authenticated
    using (((exists (
      select 1
      from team_members tm
      where ((tm.team_id = inputs.team_id) and (tm.profile_id = auth.uid ())))) or (exists (
        select 1
        from event_type_inputs eti
        where (eti.input_id = inputs.id)))));

create policy "Team members can insert." on "public"."inputs" as permissive
  for insert to authenticated
    with check ((exists (
      select 1
      from team_members tm
      where ((tm.team_id = inputs.team_id) and (tm.profile_id = auth.uid ())))));

create policy "Team members can update." on "public"."inputs" as permissive
  for update to authenticated
    using ((exists (
      select 1
      from team_members tm
      where ((tm.team_id = inputs.team_id) and (tm.profile_id = auth.uid ())))))
    with check ((exists (
      select 1
      from team_members tm
      where ((tm.team_id = inputs.team_id) and (tm.profile_id = auth.uid ())))));

create policy "Team members & subject managers can select." on "public"."missions" as permissive
  for select to authenticated
    using (((exists (
      select 1
      from team_members tm
      where ((tm.team_id = (
        select s.team_id
        from subjects s
        where (s.id = missions.subject_id))) and (tm.profile_id = auth.uid ())))) or (exists (
          select 1
          from subject_managers sm
          where ((sm.subject_id = missions.subject_id) and (sm.profile_id = auth.uid ()))))));

create policy "Team members can insert." on "public"."missions" as permissive
  for insert to authenticated
    with check ((exists (
      select 1
      from team_members tm
      where ((tm.team_id = (
        select s.team_id
        from subjects s
        where (s.id = missions.subject_id))) and (tm.profile_id = auth.uid ())))));

create policy "Team members can update." on "public"."missions" as permissive
  for update to authenticated
    using ((exists (
      select 1
      from team_members tm
      where ((tm.team_id = (
        select s.team_id
        from subjects s
        where (s.id = missions.subject_id))) and (tm.profile_id = auth.uid ())))))
      with check ((exists (
        select 1
        from team_members tm
        where ((tm.team_id = (
          select s.team_id
          from subjects s
          where (s.id = missions.subject_id))) and (tm.profile_id = auth.uid ())))));

create policy "Team members & subject managers can select." on "public"."subjects" as permissive
  for select to authenticated
    using (((exists (
      select 1
      from team_members tm
      where ((tm.team_id = subjects.team_id) and (tm.profile_id = auth.uid ())))) or (exists (
        select 1
        from subject_managers sm
        where ((sm.subject_id = subjects.id) and (sm.profile_id = auth.uid ()))))));

create policy "Team members can insert." on "public"."subjects" as permissive
  for insert to authenticated
    with check ((exists (
      select 1
      from team_members tm
      where ((tm.team_id = subjects.team_id) and (tm.profile_id = auth.uid ())))));

create policy "Team members can delete." on "public"."templates" as permissive
  for delete to authenticated
    using ((exists (
      select 1
      from team_members tm
      where ((tm.team_id = templates.team_id) and (tm.profile_id = auth.uid ())))));

create policy "Team members can insert." on "public"."templates" as permissive
  for insert to authenticated
    with check ((exists (
      select 1
      from team_members tm
      where ((tm.team_id = templates.team_id) and (tm.profile_id = auth.uid ())))));

create policy "Team members can select." on "public"."templates" as permissive
  for select to authenticated
    using ((public or (exists (
      select 1
      from team_members tm
      where ((tm.team_id = templates.team_id) and (tm.profile_id = auth.uid ()))))));

create policy "Team members can update." on "public"."templates" as permissive
  for update to authenticated
    using ((exists (
      select 1
      from team_members tm
      where ((tm.team_id = templates.team_id) and (tm.profile_id = auth.uid ())))))
    with check ((exists (
      select 1
      from team_members tm
      where ((tm.team_id = templates.team_id) and (tm.profile_id = auth.uid ())))));

create or replace function join_subject_as_manager (share_code text)
  returns void
  language plpgsql
  security definer
  as $$
  # variable_conflict use_variable
  declare
    subject_id uuid;
  begin
    select id into subject_id
      from subjects
      where subjects.share_code = share_code;
    if subject_id is not null then
      insert into subject_managers (profile_id, subject_id)
        values (auth.uid (), subject_id);
    end if;
  end;
  $$;
