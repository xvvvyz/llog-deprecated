create or replace function public.get_public_mission_with_sessions_and_events(public_mission_id uuid)
  returns json
  language plpgsql
  security definer
  as $$
  declare
    result json;
  begin
    select json_build_object(
      'id', m.id,
      'name', m.name,
      'sessions', coalesce((
        select json_agg(json_build_object(
          'draft', s.draft,
          'id', s.id,
          'order', s.order,
          'scheduled_for', s.scheduled_for,
          'title', s.title,
          'modules', coalesce((
            select json_agg(json_build_object(
              'id', et.id,
              'event', (
                select json_agg(json_build_object('created_at', e.created_at, 'id', e.id))
                from events e
                where e.event_type_id = et.id
              )
            ) order by et.order)
            from event_types et
            where et.archived = false and et.session_id = s.id
          ), '[]'::json)
        ) order by s.order)
        from sessions s
        where s.mission_id = m.id and s.draft = false
      ), '[]'::json)
    )
    into result
    from missions m
    join subjects sub on m.subject_id = sub.id
    where m.id = public_mission_id and sub.public = true
    order by m.id;
    return result;
  end;
  $$;
