create table sessions (
  id uuid not null default uuid_generate_v4 (),
  mission_id uuid not null,
  "order" smallint not null,
  scheduled_for timestamp with time zone,
  "deleted" boolean not null default false,
  primary key (id)
);

alter table sessions add constraint sessions_mission_id_fkey foreign key (mission_id) references missions (id);
alter table event_types add column session_id uuid;

insert into sessions (mission_id, "order")
  select distinct mission_id, session
  from event_types
  where event_types.mission_id is not null;

update event_types
  set session_id = sessions.id
  from sessions
  where event_types.mission_id = sessions.mission_id and event_types.session = sessions."order";

alter table event_types drop column session;
alter table event_types add constraint event_types_session_id_fkey foreign key (session_id) references sessions (id);
alter table event_types add column new_order smallint;

update event_types set new_order = new_order_values.new_order
  from (select id, dense_rank() over (order by "order") - 1 as new_order from event_types) as new_order_values
  where event_types.id = new_order_values.id;

alter table event_types drop column "order";
alter table event_types rename column new_order to "order";
alter table event_types drop column mission_id;

create index sessions_mission_id_deleted_order_index on public.sessions using btree (mission_id, deleted, "order");
create index event_types_session_id_deleted_order_index on public.event_types using btree (session_id, deleted, "order");

drop policy "Team members & subject managers can select." on "public"."missions";

alter table "public"."sessions" enable row level security;

create policy "Team members & subject managers can select." on "public"."sessions" as permissive
  for select to authenticated
    using ((exists (
      select 1
      from missions m
      where (m.id = sessions.mission_id))));

create policy "Team members can insert." on "public"."sessions" as permissive
  for insert to authenticated
    with check ((exists (
      select 1
      from team_members tm
      where ((tm.team_id = (
        select s.team_id
        from subjects s
        where (s.id = (
          select m.subject_id
          from missions m
          where (m.id = sessions.mission_id))))) and (tm.profile_id = auth.uid ())))));

create policy "Team members can update." on "public"."sessions" as permissive
  for update to authenticated
    using ((exists (
      select 1
      from team_members tm
      where ((tm.team_id = (
        select s.team_id
        from subjects s
        where (s.id = (
          select m.subject_id
          from missions m
          where (m.id = sessions.mission_id))))) and (tm.profile_id = auth.uid ())))))
        with check ((exists (
          select 1
          from team_members tm
          where ((tm.team_id = (
            select s.team_id
            from subjects s
            where (s.id = (
              select m.subject_id
              from missions m
              where (m.id = sessions.mission_id))))) and (tm.profile_id = auth.uid ())))));

create policy "Team members & subject managers can select." on "public"."missions" as permissive
  for select to authenticated
    using ((exists (
      select 1
      from subjects s
      where (s.id = missions.subject_id))));
