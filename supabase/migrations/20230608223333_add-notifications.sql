create type "public"."notification_type" as enum (
  'comment',
  'event',
  'join_subject'
);

create table "public"."notifications" (
  "created_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
  "id" uuid not null default gen_random_uuid (),
  "profile_id" uuid not null,
  "source_event_id" uuid,
  "type" notification_type not null,
  "source_comment_id" uuid,
  "read" boolean not null default false
);

alter table "public"."notifications" enable row level security;
create index notifications_created_at_index on public.notifications using btree (created_at);
create unique index notifications_pkey on public.notifications using btree (id);
create index notifications_read_index on public.notifications using btree (read);
alter table "public"."notifications" add constraint "notifications_pkey" primary key using index "notifications_pkey";
alter table "public"."notifications" add constraint "notifications_profile_id_fkey" foreign key (profile_id) references profiles (id) on delete cascade not valid;
alter table "public"."notifications" validate constraint "notifications_profile_id_fkey";
alter table "public"."notifications" add constraint "notifications_source_comment_id_fkey" foreign key (source_comment_id) references comments (id) on delete cascade not valid;
alter table "public"."notifications" validate constraint "notifications_source_comment_id_fkey";
alter table "public"."notifications" add constraint "notifications_source_event_id_fkey" foreign key (source_event_id) references events (id) on delete cascade not valid;
alter table "public"."notifications" validate constraint "notifications_source_event_id_fkey";

set check_function_bodies = off;

create or replace function public.handle_insert_comment ()
  returns trigger
  language plpgsql
  security definer
  as $function$
  declare
    source_subject_id uuid;
    subject_manager_profile_ids uuid[];
    team_member_profile_ids uuid[];
    profile_id uuid;
  begin
    select e.subject_id into source_subject_id
      from events e
      where e.id = new.event_id;
    select array_agg(sm.profile_id) into subject_manager_profile_ids
      from subject_managers sm
      where sm.subject_id = source_subject_id and sm.profile_id <> new.profile_id;
    select array_agg(tm.profile_id) into team_member_profile_ids
      from subjects s join team_members tm on s.team_id = tm.team_id
      where s.id = source_subject_id and tm.profile_id <> new.profile_id;
    for profile_id in (
      select unnest(array_cat(subject_manager_profile_ids, team_member_profile_ids)))
        loop
          insert into notifications (profile_id, type, source_comment_id)
            values (profile_id, 'comment', new.id);
        end loop;
    return null;
    end;
  $function$;

create trigger on_insert_comment
  after insert on public.comments
  for each row
  execute function handle_insert_comment ();

create or replace function public.handle_insert_event ()
  returns trigger
  language plpgsql
  security definer
  as $function$
  declare
    subject_manager_profile_ids uuid[];
    team_member_profile_ids uuid[];
    profile_id uuid;
  begin
    select array_agg(sm.profile_id) into subject_manager_profile_ids
      from subject_managers sm
      where sm.subject_id = new.subject_id and sm.profile_id <> new.profile_id;
    select array_agg(tm.profile_id) into team_member_profile_ids
      from subjects s join team_members tm on s.team_id = tm.team_id
      where s.id = new.subject_id and tm.profile_id <> new.profile_id;
    for profile_id in (
      select unnest(array_cat(subject_manager_profile_ids, team_member_profile_ids)))
        loop
          insert into notifications (profile_id, type, source_event_id)
            values (profile_id, 'event', new.id);
        end loop;
    return null;
    end;
  $function$;

create trigger on_insert_event
  after insert on public.events
  for each row
  execute function handle_insert_event ();

create policy "Owners can delete." on "public"."notifications" as permissive
  for delete to authenticated
    using ((profile_id = auth.uid ()));

create policy "Owners can select." on "public"."notifications" as permissive
  for select to authenticated
    using ((profile_id = auth.uid ()));

create policy "Owners can update." on "public"."notifications" as permissive
  for update to authenticated
    using ((profile_id = auth.uid ()))
      with check ((profile_id = auth.uid ()));
