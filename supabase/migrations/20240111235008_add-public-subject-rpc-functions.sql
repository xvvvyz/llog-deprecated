create type name_type as enum ('first', 'last');

create or replace function public.anonymize_name(name text, name_type name_type)
  returns text
  language plpgsql
  as $$
  declare
    first_names text[] := array[
      'Alice', 'Bob', 'Charlie', 'Diana', 'Edward',
      'Fiona', 'George', 'Hannah', 'Ian', 'Julia',
      'Kevin', 'Laura', 'Michael', 'Nora', 'Oliver',
      'Paula', 'Quentin', 'Rachel', 'Steven', 'Tina',
      'Ursula', 'Victor', 'Wendy', 'Xavier', 'Yvonne',
      'Zachary', 'Amelia', 'Benjamin', 'Catherine', 'Daniel',
      'Eleanor', 'Frank', 'Grace', 'Henry', 'Isabella',
      'Jack', 'Karen', 'Liam', 'Mia', 'Noah',
      'Olivia', 'Patrick', 'Quinn', 'Rebecca', 'Samuel',
      'Theresa', 'Ulysses', 'Vanessa', 'William', 'Xenia',
      'Yasmine', 'Zoe'];
    last_names text[] := array[
      'Smith', 'Johnson', 'Williams', 'Brown', 'Jones',
      'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson',
      'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Hernandez',
      'Moore', 'Martin', 'Jackson', 'Thompson', 'White',
      'Lopez', 'Lee', 'Gonzalez', 'Harris', 'Clark',
      'Lewis', 'Robinson', 'Walker', 'Perez', 'Hall',
      'Young', 'Allen', 'Sanchez', 'Wright', 'King',
      'Scott', 'Green', 'Baker', 'Adams', 'Nelson',
      'Hill', 'Ramirez', 'Campbell', 'Mitchell', 'Roberts',
      'Carter', 'Phillips', 'Evans', 'Turner', 'Torres',
      'Parker', 'Collins', 'Edwards', 'Stewart', 'Flores'];
    hash_value bigint;
    random_index int;
  begin
    hash_value := ('x' || substr(md5(name), 1, 16))::bit(64)::bigint;
    if name_type = 'first' then
      random_index := abs(hash_value) % array_length(first_names, 1) + 1;
      return first_names[random_index];
    elsif name_type = 'last' then
      random_index := abs(hash_value) % array_length(last_names, 1) + 1;
      return last_names[random_index];
    end if;
  end;
  $$;

create or replace function public.get_public_subject(public_subject_id uuid)
  returns json
  language plpgsql
  security definer
  as $$
  begin
    return (
      select json_build_object(
        'banner', s.banner,
        'id', s.id,
        'image_uri', s.image_uri,
        'name', s.name
      )
      from subjects s
      where s.id = public_subject_id and s.public = true
    );
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
        'comments', (
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
          ))
          from comments c
          join profiles p on c.profile_id = p.id
          where c.event_id = e.id
        ),
        'created_at', e.created_at,
        'id', e.id,
        'inputs', (
          select json_agg(json_build_object(
            'id', ei.id,
            'input_id', ei.input_id,
            'input_option_id', ei.input_option_id,
            'value', ei.value
          ))
          from event_inputs ei
          where ei.event_id = e.id
        ),
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
            'inputs', (
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
            ),
            'name', et.name,
            'order', et.order
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

create or replace function public.list_public_events(public_subject_id uuid, limit_count int default 50)
  returns json
  language plpgsql
  security definer
  as $$
  declare
    result json;
  begin
    select json_agg(event_info)
    into result
    from (
      select
        json_build_object(
          'id', e.id,
          'created_at', e.created_at,
          'comments', (
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
            ))
            from comments c
            left join profiles p on c.profile_id = p.id
            where c.event_id = e.id
          ),
          'inputs', (
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
          ),
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
          'type', (
            select json_build_object(
              'id', et.id,
              'name', et.name,
              'order', et.order,
              'session', (
                select json_build_object(
                'id', s.id,
                'order', s.order,
                'mission', (
                  select json_build_object(
                    'id', m.id,
                    'name', m.name
                  )
                  from missions m
                  where m.id = s.mission_id
                )
              )
              from sessions s
              where s.id = et.session_id
            )
          )
          from event_types et
          where et.id = e.event_type_id
        )
      ) as event_info, e.created_at
      from events e
      join subjects s on e.subject_id = s.id
      where e.subject_id = public_subject_id and s.public = true
      order by e.created_at desc
      limit (case when limit_count = 0 then null else limit_count end)
    ) as sub;
    return result;
  end;
  $$;


create or replace function public.get_public_mission_with_sessions(public_mission_id uuid)
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
      'sessions', (
        select json_agg(json_build_object(
          'id', s.id,
          'order', s.order,
          'scheduled_for', s.scheduled_for,
          'title', s.title
        ) order by s.order, s.draft desc)
        from sessions s
        where s.mission_id = m.id and s.draft is not true
      )
    )
    into result
    from missions m
    join subjects sub on m.subject_id = sub.id
    where m.id = public_mission_id and sub.public = true;
    return result;
  end;
  $$;

create or replace function public.get_public_session_with_details(public_session_id uuid)
  returns json
  language plpgsql
  security definer
  as $$
  declare
    result json;
  begin
    select json_build_object(
      'id', s.id,
      'order', s.order,
      'scheduled_for', s.scheduled_for,
      'title', s.title,
      'modules', (
        select json_agg(json_build_object(
          'content', et.content,
          'event', (
            select json_agg(json_build_object(
              'comments', (
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
                ))
                from comments c
                join profiles p on c.profile_id = p.id
                where c.event_id = e.id
              ),
              'created_at', e.created_at,
              'id', e.id,
              'inputs', (
                select json_agg(json_build_object(
                  'id', ei.id,
                  'input_id', ei.input_id,
                  'input_option_id', ei.input_option_id,
                  'value', ei.value
                ))
                from event_inputs ei
                where ei.event_id = e.id
              ),
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
              )
            ))
            from events e
            where e.event_type_id = et.id
          ),
          'id', et.id,
          'inputs', (
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
          ),
          'name', et.name,
          'order', et.order
        ) order by et.order)
        from event_types et
        where et.archived = false and et.session_id = s.id
      )
    )
    into result
    from sessions s
    join missions m on s.mission_id = m.id
    join subjects sub on m.subject_id = sub.id
    where s.id = public_session_id and sub.public = true;
    return result;
  end;
  $$;

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
      'sessions', (
        select json_agg(json_build_object(
          'draft', s.draft,
          'id', s.id,
          'order', s.order,
          'scheduled_for', s.scheduled_for,
          'title', s.title,
          'modules', (
            select json_agg(json_build_object(
              'id', et.id,
              'event', (
                select json_agg(json_build_object('id', e.id))
                from events e
                where e.event_type_id = et.id
              )
            ) order by et.order)
            from event_types et
            where et.archived = false and et.session_id = s.id
          )
        ) order by s.order)
        from sessions s
        where s.mission_id = m.id and s.draft = false
      )
    )
    into result
    from missions m
    join subjects sub on m.subject_id = sub.id
    where m.id = public_mission_id and sub.public = true
    order by m.id;
    return result;
  end;
  $$;
