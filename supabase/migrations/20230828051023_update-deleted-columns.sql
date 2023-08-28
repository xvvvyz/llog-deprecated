drop index if exists "public"."input_options_input_id_deleted_order_index";
drop index if exists "public"."sessions_mission_id_deleted_order_draft_scheduled_for_index";
drop index if exists "public"."event_types_session_id_deleted_order_index";
drop index if exists "public"."event_types_subject_id_session_id_deleted_name_index";
drop index if exists "public"."inputs_team_id_deleted_label_index";
drop index if exists "public"."missions_subject_id_deleted_name_index";
alter table "public"."event_types" drop column "deleted";
alter table "public"."event_types" add column "archived" boolean not null default false;
alter table "public"."input_options" drop column "deleted";
alter table "public"."inputs" drop column "deleted";
alter table "public"."inputs" add column "archived" boolean not null default false;
alter table "public"."missions" drop column "deleted";
alter table "public"."missions" add column "archived" boolean not null default false;
alter table "public"."sessions" drop column "deleted";
create index event_types_session_id_archived_order_index on public.event_types using btree (session_id, archived, "order");
create index event_types_subject_id_session_id_archived_name_index on public.event_types using btree (subject_id, session_id, archived, name);
create index inputs_team_id_archived_label_index on public.inputs using btree (team_id, archived, label);
create index missions_subject_id_archived_name_index on public.missions using btree (subject_id, archived, name);

create policy "Team members can delete." on "public"."event_types" as permissive
  for delete to authenticated
    using ((exists (
      select 1
      from team_members tm
      where ((tm.team_id = (
        select s.team_id
        from subjects s
        where (s.id = event_types.subject_id))) and (tm.profile_id = auth.uid ())))));

create policy "Team members can delete." on "public"."input_options" as permissive
  for delete to authenticated
    using ((exists (
      select 1
      from team_members tm
      where ((tm.team_id = (
        select i.team_id
        from inputs i
        where (i.id = input_options.input_id))) and (tm.profile_id = auth.uid ())))));

create policy "Team members can delete." on "public"."inputs" as permissive
  for delete to authenticated
    using ((exists (
      select 1
      from team_members tm
      where ((tm.team_id = inputs.team_id) and (tm.profile_id = auth.uid ())))));

create policy "Team members can delete." on "public"."missions" as permissive
  for delete to authenticated
    using ((exists (
      select 1
      from team_members tm
      where ((tm.team_id = (
        select s.team_id
        from subjects s
        where (s.id = missions.subject_id))) and (tm.profile_id = auth.uid ())))));

create policy "Team members can delete." on "public"."sessions" as permissive
  for delete to authenticated
    using ((exists (
      select 1
      from team_members tm
      where ((tm.team_id = (
        select s.team_id
        from subjects s
        where (s.id = (
          select m.subject_id
          from missions m
          where (m.id = sessions.mission_id))))) and (tm.profile_id = auth.uid ())))));
