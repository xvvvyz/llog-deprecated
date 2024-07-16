create or replace function public.list_public_events(
    public_subject_id uuid,
    from_arg int default 0,
    to_arg int default 10000,
    start_date timestamp without time zone default NULL,
    end_date timestamp without time zone default NULL
  )
    returns json
    language plpgsql
    security definer
    as $$
  declare
    result json;
    limit_count int;
  begin
    limit_count := to_arg - from_arg + 1;
    select json_agg(event_info)
    into result
    from (
      select
        json_build_object(
          'id', e.id,
          'created_at', e.created_at,
          'comments', coalesce((
            select json_agg(json_build_object(
              'content', c.content,
              'created_at', c.created_at,
              'id', c.id,
              'profile', (
                select json_build_object(
                  'first_name', case when sm.profile_id is not null then (select anonymize_name(p.first_name, 'first')) else p.first_name end,
                  'id', p.id,
                  'image_uri', case when sm.profile_id is not null then null else p.image_uri end,
                  'last_name', case when sm.profile_id is not null then (select anonymize_name(p.last_name, 'last')) else p.last_name end
                )
                from profiles p
                left join subject_managers sm on p.id = sm.profile_id and e.subject_id = sm.subject_id
                where p.id = c.profile_id
              )
            ) order by c.created_at asc)
            from comments c
            left join profiles p on c.profile_id = p.id
            where c.event_id = e.id
          ), '[]'::json),
          'inputs', coalesce((
            select json_agg(json_build_object(
              'input', json_build_object(
                'id', i.id,
                'label', i.label,
                'type', i.type
              ),
              'option', json_build_object(
                'id', io.id,
                'label', io.label
              ),
              'value', ei.value
            ))
            from event_inputs ei
            left join inputs i on ei.input_id = i.id
            left join input_options io on ei.input_option_id = io.id
            where ei.event_id = e.id
          ), '[]'::json),
          'profile', (
            select json_build_object(
              'first_name', case when sm.profile_id is not null then
              (select anonymize_name(p.first_name, 'first')) else p.first_name end,
              'id', p.id,
              'image_uri', case when sm.profile_id is not null then null else p.image_uri end,
              'last_name', case when sm.profile_id is not null then (select anonymize_name(p.last_name, 'last')) else p.last_name end
            )
            from profiles p
            left join subject_managers sm on p.id = sm.profile_id and e.subject_id = sm.subject_id
            where p.id = e.profile_id
          ),
          'type', (select json_build_object(
            'id', et.id,
            'name', et.name,
            'order', et.order,
            'session', (select json_build_object(
              'id', s.id,
              'order', s.order,
              'mission', (select json_build_object(
                'id', m.id,
                'name', m.name
              )
              from missions m
              where m.id = s.mission_id),
              'title', s.title
            )
            from sessions s
            where s.id = et.session_id)
          )
          from event_types et
          where et.id = e.event_type_id
        )
      ) as event_info, e.created_at
      from events e
      join subjects s on e.subject_id = s.id
      where e.subject_id = public_subject_id and s.public = true
        and (start_date IS NULL OR e.created_at >= start_date)
        and (end_date IS NULL OR e.created_at < end_date)
      order by e.created_at desc
      offset from_arg
      limit limit_count
    ) as sub;
    return result;
  end;
  $$;

  create or replace function public.get_public_event(public_event_id uuid)
  returns json
  language plpgsql
  security definer
  as $$
  declare
    result json;
  begin
    select
      json_build_object(
        'comments', coalesce((
          select json_agg(json_build_object(
            'content', c.content,
            'created_at', c.created_at,
            'id', c.id,
            'profile', (
              select json_build_object(
                'first_name', case when sm.profile_id is not null then (select anonymize_name(p.first_name, 'first')) else p.first_name end,
                'id', p.id,
                'image_uri', case when sm.profile_id is not null then null else p.image_uri end,
                'last_name', case when sm.profile_id is not null then (select anonymize_name(p.last_name, 'last')) else p.last_name end
              )
              from profiles p
              left join subject_managers sm on p.id = sm.profile_id and e.subject_id = sm.subject_id
              where p.id = c.profile_id
            )
          ) order by c.created_at asc)
          from comments c
          join profiles p on c.profile_id = p.id
          where c.event_id = e.id
        ), '[]'::json),
        'created_at', e.created_at,
        'id', e.id,
        'inputs', coalesce((
          select json_agg(json_build_object(
            'id', ei.id,
            'input_id', ei.input_id,
            'input_option_id', ei.input_option_id,
            'value', ei.value
          ))
          from event_inputs ei
          where ei.event_id = e.id
        ), '[]'::json),
        'profile', (
          select json_build_object(
            'first_name', case when sm.profile_id is not null then (select anonymize_name(p.first_name, 'first')) else p.first_name end,
            'id', p.id,
            'image_uri', case when sm.profile_id is not null then null else p.image_uri end,
            'last_name', case when sm.profile_id is not null then (select anonymize_name(p.last_name, 'last')) else p.last_name end
          )
          from profiles p
          left join subject_managers sm on p.id = sm.profile_id and e.subject_id = sm.subject_id
          where p.id = e.profile_id
        ),
        'type', (
          select json_build_object(
            'content', et.content,
            'id', et.id,
            'inputs', coalesce((
              select json_agg(json_build_object(
                'input', (
                  select json_build_object(
                    'id', i.id,
                    'label', i.label,
                    'options', (
                      select json_agg(json_build_object(
                        'id', io.id,
                        'label', io.label
                      ))
                      from input_options io
                      where io.input_id = i.id
                    ),
                    'settings', i.settings,
                    'type', i.type
                  )
                  from inputs i
                  where i.id = eti.input_id
                )
              ))
              from event_type_inputs eti
              where eti.event_type_id = et.id
            ), '[]'::json),
            'name', et.name,
            'order', et.order,
            'session', (
              select json_build_object(
                'id', s.id,
                'mission', (
                  select json_build_object(
                    'id', m.id,
                    'name', m.name
                  )
                  from missions m
                  where m.id = s.mission_id
                ),
                'order', s.order
              )
              from sessions s
              where s.id = et.session_id
            )
          )
          from event_types et
          where et.id = e.event_type_id
        )
      )
      into result
      from events e
      join subjects s on e.subject_id = s.id
      where e.id = public_event_id and s.public = true;
    return result;
  end;
  $$;
