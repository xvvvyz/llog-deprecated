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
      select unnest(array_cat(subject_manager_profile_ids, team_member_profile_ids)))
      loop
        if not exists (
          select 1
          from notifications n
          join events e on n.source_event_id = e.id
          join event_types et on e.event_type_id = et.id
            where n.read = false
            and et.session_id = curr_session_id)
        then
          insert into notifications (profile_id, type, source_event_id)
            values (profile_id, 'event', new.id);
        end if;
      end loop;
    return null;
  end;
  $$;
