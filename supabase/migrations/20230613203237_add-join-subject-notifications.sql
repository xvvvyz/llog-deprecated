alter table "public"."notifications" add column "source_profile_id" uuid;
alter table "public"."notifications" add constraint "notifications_source_profile_id_fkey" foreign key (source_profile_id) references profiles(id) on delete cascade not valid;
alter table "public"."notifications" validate constraint "notifications_source_profile_id_fkey";
alter table "public"."notifications" add column "source_subject_id" uuid;
alter table "public"."notifications" add constraint "notifications_source_subject_id_fkey" foreign key (source_subject_id) references subjects(id) on delete cascade not valid;
alter table "public"."notifications" validate constraint "notifications_source_subject_id_fkey";

create or replace function join_subject_as_manager (share_code text)
  returns void
  language plpgsql
  security definer
  as $$
    # variable_conflict use_variable
  declare
    existing_manager boolean;
    profile_id uuid;
    subject_id uuid;
    team_member_profile_ids uuid[];
  begin
    select id into subject_id
      from subjects
      where subjects.share_code = share_code;
    if subject_id is not null then
      select exists(select true from subject_managers
        where profile_id = auth.uid() and subject_id = subject_id)
        into existing_manager;
      if not existing_manager then
        insert into subject_managers (profile_id, subject_id)
          values (auth.uid (), subject_id);
        select array_agg(tm.profile_id) into team_member_profile_ids
          from subjects s join team_members tm on s.team_id = tm.team_id
          where s.id = subject_id;
        for profile_id in (select unnest(team_member_profile_ids)) loop
          insert into notifications (profile_id, type, source_profile_id, source_subject_id)
            values (profile_id, 'join_subject', auth.uid (), subject_id);
        end loop;
      end if;
    end if;
  end;
  $$;

create or replace function public.handle_insert_comment ()
  returns trigger
  language plpgsql
  security definer
  as $$
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
      select unnest(array_cat(subject_manager_profile_ids, team_member_profile_ids))) loop
        insert into notifications (profile_id, type, source_comment_id, source_profile_id, source_subject_id)
          values (profile_id, 'comment', new.id, new.profile_id, source_subject_id);
      end loop;
    return null;
    end;
  $$;

create or replace function public.handle_insert_event ()
  returns trigger
  language plpgsql
  security definer
  as $$
  declare
    curr_session_id uuid;
    profile_id uuid;
    subject_manager_profile_ids uuid[];
    team_member_profile_ids uuid[];
  begin
    select array_agg(sm.profile_id) into subject_manager_profile_ids
      from subject_managers sm
      where sm.subject_id = new.subject_id and sm.profile_id <> new.profile_id;
    select array_agg(tm.profile_id) into team_member_profile_ids
      from subjects s join team_members tm on s.team_id = tm.team_id
      where s.id = new.subject_id and tm.profile_id <> new.profile_id;
    select et.session_id into curr_session_id
      from event_types et
      where et.id = new.event_type_id;
    for profile_id in (
      select unnest(array_cat(subject_manager_profile_ids, team_member_profile_ids))) loop
        if not exists (
          select 1
          from notifications n
          join events e on n.source_event_id = e.id
          join event_types et on e.event_type_id = et.id
            where n.read = false
            and et.session_id = curr_session_id)
        then
          insert into notifications (profile_id, type, source_event_id, source_profile_id, source_subject_id)
            values (profile_id, 'event', new.id, new.profile_id, new.subject_id);
        end if;
      end loop;
    return null;
  end;
  $$;
