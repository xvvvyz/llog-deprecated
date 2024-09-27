create table "public"."protocols" (
  "id" uuid not null default extensions.uuid_generate_v4 (),
  "name" text not null,
  "subject_id" uuid not null,
  "archived" boolean not null default false
);

insert into "public"."protocols" select * from "public"."training_plans";

alter table "public"."sessions" add column "protocol_id" uuid not null default '00000000-0000-0000-0000-000000000000';
update "public"."sessions" set "protocol_id" = "training_plan_id";
alter table "public"."sessions" alter column "protocol_id" drop default;

alter table "public"."protocols" enable row level security;

create unique index protocols_pkey on public.protocols using btree (id);
create index protocols_subject_id_archived_name_index on public.protocols using btree (subject_id, archived, name);
create index sessions_protocols_id_order_draft_index on public.sessions using btree (protocol_id, "order", draft);

alter table "public"."protocols" add constraint "protocols_pkey" primary key using index "protocols_pkey";
alter table "public"."sessions" add constraint "sessions_protocol_id_fkey" foreign key (protocol_id) references protocols (id) on delete cascade not valid;
alter table "public"."sessions" validate constraint "sessions_protocol_id_fkey";
alter table "public"."protocols" add constraint "protocols_name_length" check (((length(name) > 0) and (length(name) < 50))) not valid;
alter table "public"."protocols" validate constraint "protocols_name_length";
alter table "public"."protocols" add constraint "protocols_subject_id_fkey" foreign key (subject_id) references subjects (id) on delete cascade not valid;
alter table "public"."protocols" validate constraint "protocols_subject_id_fkey";

drop policy "Team members & subject managers can select." on "public"."training_plans";
drop policy "Team members can delete." on "public"."training_plans";
drop policy "Team members can insert." on "public"."training_plans";
drop policy "Team members can update." on "public"."training_plans";
drop policy "Team members & subject managers can select." on "public"."sessions";
drop policy "Team members can delete." on "public"."sessions";
drop policy "Team members can insert." on "public"."sessions";
drop policy "Team members can update." on "public"."sessions";

create policy "Team members & subject managers can select." on "public"."protocols" as permissive
  for select to authenticated
    using ((exists (
      select 1
      from subjects s
      where (s.id = protocols.subject_id))));

create policy "Team members can delete." on "public"."protocols" as permissive
  for delete to authenticated
    using ((exists (
      select 1
      from team_members tm
      where ((tm.team_id = (
        select s.team_id
        from subjects s
        where (s.id = protocols.subject_id))) and (tm.profile_id = auth.uid ())))));

create policy "Team members can insert." on "public"."protocols" as permissive
  for insert to authenticated
    with check ((exists (
      select 1
      from team_members tm
      where ((tm.team_id = (
        select s.team_id
        from subjects s
        where (s.id = protocols.subject_id))) and (tm.profile_id = auth.uid ())))));

create policy "Team members can update." on "public"."protocols" as permissive
  for update to authenticated
    using ((exists (
      select 1
      from team_members tm
      where ((tm.team_id = (
        select s.team_id
        from subjects s
        where (s.id = protocols.subject_id))) and (tm.profile_id = auth.uid ())))))
      with check ((exists (
        select 1
        from team_members tm
        where ((tm.team_id = (
          select s.team_id
          from subjects s
          where (s.id = protocols.subject_id))) and (tm.profile_id = auth.uid ())))));

create policy "Team members & subject managers can select." on "public"."sessions" as permissive
  for select to authenticated
    using ((exists (
      select 1
      from protocols p
      where (p.id = sessions.protocol_id))));

create policy "Team members can delete." on "public"."sessions" as permissive
  for delete to authenticated
    using ((exists (
      select 1
      from team_members tm
      where ((tm.team_id = (
        select s.team_id
        from subjects s
        where (s.id = (
          select p.subject_id
          from protocols p
          where (p.id = sessions.protocol_id))))) and (tm.profile_id = auth.uid ())))));

create policy "Team members can insert." on "public"."sessions" as permissive
  for insert to authenticated
    with check ((exists (
      select 1
      from team_members tm
      where ((tm.team_id = (
        select s.team_id
        from subjects s
        where (s.id = (
          select p.subject_id
          from protocols p
          where (p.id = sessions.protocol_id))))) and (tm.profile_id = auth.uid ())))));

create policy "Team members can update." on "public"."sessions" as permissive
  for update to authenticated
    using ((exists (
      select 1
      from team_members tm
      where ((tm.team_id = (
        select s.team_id
        from subjects s
        where (s.id = (
          select p.subject_id
          from protocols p
          where (p.id = sessions.protocol_id))))) and (tm.profile_id = auth.uid ())))))
        with check ((exists (
          select 1
          from team_members tm
          where ((tm.team_id = (
            select s.team_id
            from subjects s
            where (s.id = (
              select p.subject_id
              from protocols p
              where (p.id = sessions.protocol_id))))) and (tm.profile_id = auth.uid ())))));

drop function if exists public.get_public_training_plan_with_sessions(public_training_plan_id uuid);

create or replace function public.get_public_protocol_with_sessions(public_protocol_id uuid)
  returns json
  language plpgsql
  security definer
  as $$
  declare
    result json;
  begin
    select json_build_object(
      'id', p.id,
      'name', p.name,
      'sessions', coalesce((
        select json_agg(json_build_object(
          'id', s.id,
          'order', s.order,
          'scheduled_for', s.scheduled_for,
          'title', s.title
        ) order by s.order, s.draft desc)
        from sessions s
        where s.protocol_id = p.id and s.draft is not true
      ), '[]'::json)
    )
    into result
    from protocols p
    join subjects sub on p.subject_id = sub.id
    where p.id = public_protocol_id and sub.public = true;
    return result;
  end;
  $$;

drop function if exists public.get_public_training_plan_with_sessions_and_events(public_training_plan_id uuid);

create or replace function public.get_public_protocol_with_sessions_and_events(public_protocol_id uuid)
  returns json
  language plpgsql
  security definer
  as $$
  declare
    result json;
  begin
    select json_build_object(
      'id', p.id,
      'name', p.name,
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
        where s.protocol_id = p.id and s.draft = false
      ), '[]'::json)
    )
    into result
    from protocols p
    join subjects sub on p.subject_id = sub.id
    where p.id = public_protocol_id and sub.public = true
    order by p.id;
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
                'protocol', (
                  select json_build_object(
                    'id', p.id,
                    'name', p.name
                  )
                  from protocols p
                  where p.id = s.protocol_id
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
              'protocol', (select json_build_object(
                'id', p.id,
                'name', p.name
              )
              from protocols p
              where p.id = s.protocol_id),
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
      'modules', coalesce((
        select json_agg(json_build_object(
          'content', et.content,
          'event', (
            select json_agg(json_build_object(
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
                ))
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
              )
            ))
            from events e
            where e.event_type_id = et.id
          ),
          'id', et.id,
          'inputs', coalesce((
            select json_agg(json_build_object(
              'input', (
                select json_build_object(
                  'id', i.id,
                  'label', i.label,
                  'options', coalesce((
                    select json_agg(json_build_object(
                      'id', io.id,
                      'label', io.label
                    ))
                    from input_options io
                    where io.input_id = i.id
                  ), '[]'::json),
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
          'order', et.order
        ) order by et.order)
        from event_types et
        where et.archived = false and et.session_id = s.id
      ), '[]'::json)
    )
    into result
    from sessions s
    join protocols p on s.protocol_id = p.id
    join subjects sub on p.subject_id = sub.id
    where s.id = public_session_id and sub.public = true;
    return result;
  end;
  $$;

alter table "public"."sessions" drop column "training_plan_id";

alter table "public"."training_plans" drop constraint "training_plans_name_length";
alter table "public"."training_plans" drop constraint "training_plans_subject_id_fkey";
alter table "public"."training_plans" drop constraint "training_plans_pkey";

drop index if exists "public"."training_plans_pkey";
drop index if exists "public"."training_plans_subject_id_archived_name_index";
drop index if exists "public"."sessions_training_plan_id_order_draft_index";

drop table "public"."training_plans";

alter type public.template_type add value 'protocol' after 'training_plan';
commit;
update public.templates set type = 'protocol' where type = 'training_plan';
create type public.new_template_type as enum ('event_type', 'module', 'session', 'protocol');
alter table public.templates alter column type type public.new_template_type using type::text::public.new_template_type;
drop type public.template_type;
alter type public.new_template_type rename to template_type;
