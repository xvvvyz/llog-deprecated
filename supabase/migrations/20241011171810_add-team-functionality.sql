-- add enums

create type team_member_role as enum ('owner', 'admin', 'recorder', 'viewer');

-- add tags

create table "public"."input_tags" (
  "input_id" uuid not null,
  "tag_id" uuid not null
);

create table "public"."subject_tags" (
  "subject_id" uuid not null,
  "tag_id" uuid not null
);

create table "public"."tags" (
  "id" uuid not null default gen_random_uuid (),
  "name" text not null,
  "team_id" uuid not null
);

create table "public"."team_member_subject_roles" (
  "team_id" uuid not null,
  "profile_id" uuid not null,
  "subject_id" uuid not null,
  "role" team_member_role not null
);

create table "public"."team_member_tag_roles" (
  "team_id" uuid not null,
  "profile_id" uuid not null,
  "tag_id" uuid not null,
  "role" team_member_role not null
);

create table "public"."template_tags" (
  "template_id" uuid not null,
  "tag_id" uuid not null
);

alter table "public"."input_tags" enable row level security;
alter table "public"."subject_tags" enable row level security;
alter table "public"."tags" enable row level security;
alter table "public"."team_member_subject_roles" enable row level security;
alter table "public"."team_member_tag_roles" enable row level security;
alter table "public"."template_tags" enable row level security;

create unique index input_tags_pkey on public.input_tags using btree (input_id, tag_id);
create unique index subject_tags_pkey on public.subject_tags using btree (subject_id, tag_id);
create unique index tags_pkey on public.tags using btree (id);
create unique index team_member_subject_roles_pkey on public.team_member_subject_roles using btree (team_id, profile_id, subject_id);
create unique index team_member_tag_roles_pkey on public.team_member_tag_roles using btree (team_id, profile_id, tag_id);
create unique index template_tags_pkey on public.template_tags using btree (template_id, tag_id);

create index tags_team_id_name_index on public.tags using btree (team_id, name);

alter table "public"."input_tags" add constraint "input_tags_input_id_fkey" foreign key (input_id) references inputs (id) on update cascade on delete cascade not valid;
alter table "public"."input_tags" add constraint "input_tags_pkey" primary key using index "input_tags_pkey";
alter table "public"."input_tags" add constraint "input_tags_tag_id_fkey" foreign key (tag_id) references tags (id) on update cascade on delete cascade not valid;
alter table "public"."input_tags" add constraint "input_tags_template_id_fkey" foreign key (input_id) references subjects (id) on update cascade on delete cascade not valid;
alter table "public"."input_tags" add constraint "input_tags_template_id_fkey1" foreign key (input_id) references templates (id) on update cascade on delete cascade not valid;
alter table "public"."input_tags" validate constraint "input_tags_input_id_fkey";
alter table "public"."input_tags" validate constraint "input_tags_tag_id_fkey";
alter table "public"."input_tags" validate constraint "input_tags_template_id_fkey";
alter table "public"."input_tags" validate constraint "input_tags_template_id_fkey1";
alter table "public"."subject_tags" add constraint "subject_tags_pkey" primary key using index "subject_tags_pkey";
alter table "public"."subject_tags" add constraint "subject_tags_subject_id_fkey" foreign key (subject_id) references subjects (id) on update cascade on delete cascade not valid;
alter table "public"."subject_tags" add constraint "subject_tags_tag_id_fkey" foreign key (tag_id) references tags (id) on update cascade on delete cascade not valid;
alter table "public"."subject_tags" validate constraint "subject_tags_subject_id_fkey";
alter table "public"."subject_tags" validate constraint "subject_tags_tag_id_fkey";
alter table "public"."tags" add constraint "tags_name_length" check (((length(name) > 0) and (length(name) < 50))) not valid;
alter table "public"."tags" add constraint "tags_pkey" primary key using index "tags_pkey";
alter table "public"."tags" add constraint "tags_team_id_fkey" foreign key (team_id) references teams (id) on update cascade on delete cascade not valid;
alter table "public"."tags" validate constraint "tags_name_length";
alter table "public"."tags" validate constraint "tags_team_id_fkey";
alter table "public"."team_member_subject_roles" add constraint "team_member_subject_roles_pkey" primary key using index "team_member_subject_roles_pkey";
alter table "public"."team_member_subject_roles" add constraint "team_member_subject_roles_profile_id_fkey" foreign key (profile_id) references profiles (id) on update cascade on delete cascade not valid;
alter table "public"."team_member_subject_roles" add constraint "team_member_subject_roles_tag_id_fkey" foreign key (subject_id) references subjects (id) on update cascade on delete cascade not valid;
alter table "public"."team_member_subject_roles" add constraint "team_member_subject_roles_team_id_fkey" foreign key (team_id) references teams (id) on update cascade on delete cascade not valid;
alter table "public"."team_member_subject_roles" validate constraint "team_member_subject_roles_profile_id_fkey";
alter table "public"."team_member_subject_roles" validate constraint "team_member_subject_roles_tag_id_fkey";
alter table "public"."team_member_subject_roles" validate constraint "team_member_subject_roles_team_id_fkey";
alter table "public"."team_member_tag_roles" add constraint "team_member_tag_roles_pkey" primary key using index "team_member_tag_roles_pkey";
alter table "public"."team_member_tag_roles" add constraint "team_member_tag_roles_profile_id_fkey" foreign key (profile_id) references profiles (id) on update cascade on delete cascade not valid;
alter table "public"."team_member_tag_roles" add constraint "team_member_tag_roles_tag_id_fkey" foreign key (tag_id) references tags (id) on update cascade on delete cascade not valid;
alter table "public"."team_member_tag_roles" add constraint "team_member_tag_roles_team_id_fkey" foreign key (team_id) references teams (id) on update cascade on delete cascade not valid;
alter table "public"."team_member_tag_roles" validate constraint "team_member_tag_roles_profile_id_fkey";
alter table "public"."team_member_tag_roles" validate constraint "team_member_tag_roles_tag_id_fkey";
alter table "public"."team_member_tag_roles" validate constraint "team_member_tag_roles_team_id_fkey";
alter table "public"."template_tags" add constraint "template_tags_pkey" primary key using index "template_tags_pkey";
alter table "public"."template_tags" add constraint "template_tags_subject_id_fkey" foreign key (template_id) references subjects (id) on update cascade on delete cascade not valid;
alter table "public"."template_tags" add constraint "template_tags_tag_id_fkey" foreign key (tag_id) references tags (id) on update cascade on delete cascade not valid;
alter table "public"."template_tags" add constraint "template_tags_template_id_fkey" foreign key (template_id) references templates (id) on update cascade on delete cascade not valid;
alter table "public"."template_tags" validate constraint "template_tags_subject_id_fkey";
alter table "public"."template_tags" validate constraint "template_tags_tag_id_fkey";
alter table "public"."template_tags" validate constraint "template_tags_template_id_fkey";

-- add subscriptions

create type "public"."subscription_variant" as enum ('pro', 'team');

create table "public"."subscriptions" (
  "id" bigint not null,
  "team_id" uuid not null,
  "profile_id" uuid not null,
  "variant" subscription_variant not null,
  "status" subscription_status not null
);

alter table "public"."subscriptions" enable row level security;
create unique index subscriptions_pkey on public.subscriptions using btree (id);
create index subscriptions_team_id_status_variant_index on public.subscriptions using btree (team_id, status, variant);
alter table "public"."subscriptions" add constraint "subscriptions_pkey" primary key using index "subscriptions_pkey";
alter table "public"."subscriptions" add constraint "subscriptions_profile_id_fkey" foreign key (profile_id) references profiles (id) on update cascade on delete cascade not valid;
alter table "public"."subscriptions" validate constraint "subscriptions_profile_id_fkey";
alter table "public"."subscriptions" add constraint "subscriptions_team_id_fkey" foreign key (team_id) references teams (id) on update cascade on delete cascade not valid;
alter table "public"."subscriptions" validate constraint "subscriptions_team_id_fkey";

-- alter tables

alter table "public"."inputs" alter column "team_id" drop default;
alter table "public"."subjects" alter column "team_id" drop default;
alter table "public"."team_members" alter column "team_id" drop default;
alter table "public"."templates" alter column "team_id" drop default;
alter table "public"."teams" add column "image_uri" text;

alter table "public"."team_members" add column "role" team_member_role;
update public.team_members set role = 'owner';
alter table "public"."team_members" alter column "role" set not null;

-- update functions

create or replace function public.handle_insert_user()
  returns trigger
  language plpgsql
  security definer
  as $$
  declare
    new_team_id uuid;
  begin
    insert into public.profiles (id, first_name, last_name)
      values (new.id, new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data ->> 'last_name');
    insert into public.teams (id, name) values ((new.raw_user_meta_data ->> 'team_id')::uuid, coalesce(nullif(new.raw_user_meta_data ->> 'organization', ''), 'Personal')) returning id into new_team_id;
    insert into public.team_members (team_id, profile_id, role) values (new_team_id, new.id, 'owner');
    return new;
  end;
  $$;

create or replace function public.is_client()
  returns boolean
  language plpgsql
  as $$
  begin
    return coalesce((select auth.jwt() -> 'app_metadata' ->> 'is_client')::boolean, false);
  end;
  $$;

create or replace function public.can_insert_subject_on_current_plan (subject_id uuid default null)
  returns boolean
  language plpgsql
  as $$
  declare
    subject_count int;
    active_team_id uuid;
  begin
    active_team_id := (select (auth.jwt() -> 'app_metadata' ->> 'active_team_id')::uuid);
    select count(*)
      into subject_count
      from subjects s
        where s.team_id = active_team_id
        and s.deleted = false
        and s.archived = false
        and s.id is distinct from subject_id;
    if subject_count < 2 then
      return true;
    end if;
    return exists (
      select 1
      from subscriptions
        where team_id = active_team_id
        and status = 'active'::subscription_status
    );
  end;
  $$;

create or replace function public.handle_insert_or_update_object ()
  returns trigger
  language plpgsql
  security definer
  set search_path to 'public'
  as $$
  begin
    if (new.bucket_id = 'teams' and storage.filename (new.name) = 'avatar') then
      update public.teams
        set image_uri = new.bucket_id || '/' || new.name || '?c=' || substr(md5(random()::text), 0, 5)
        where id::text = (storage.foldername (new.name))[1];
    end if;
    if (new.bucket_id = 'subjects' and storage.filename (new.name) = 'avatar') then
      update public.subjects
        set image_uri = new.bucket_id || '/' || new.name || '?c=' || substr(md5(random()::text), 0, 5)
        where id::text = (storage.foldername (new.name))[1];
    end if;
    if (new.bucket_id = 'profiles' and storage.filename (new.name) = 'avatar') then
      update auth.users
        set raw_user_meta_data = jsonb_set(raw_user_meta_data, '{image_uri}', to_jsonb (new.bucket_id || '/' || new.name || '?c=' || substr(md5(random()::text), 0, 5)))
        where id::text = (storage.foldername (new.name))[1];
    end if;
    return new;
  end;
  $$;

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
              'event', coalesce((
                select json_agg(json_build_object('created_at', e.created_at, 'id', e.id))
                from events e
                where e.event_type_id = et.id
              ), '[]'::json)
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

create or replace function public.handle_delete_object ()
  returns trigger
  language plpgsql
  security definer
  set search_path to 'public'
  as $$
  begin
    if (old.bucket_id = 'teams' and storage.filename (old.name) = 'avatar') then
      update public.teams
        set image_uri = null
        where id::text = (storage.foldername (old.name))[1];
    end if;
    if (old.bucket_id = 'subjects' and storage.filename (old.name) = 'avatar') then
      update public.subjects
        set image_uri = null
        where id::text = (storage.foldername (old.name))[1];
    end if;
    if (old.bucket_id = 'profiles' and storage.filename (old.name) = 'avatar') then
      update auth.users
        set raw_user_meta_data = jsonb_set(raw_user_meta_data, '{image_uri}', 'null'::jsonb)
        where id::text = (storage.foldername (old.name))[1];
    end if;
    return old;
  end;
  $$;

create trigger on_delete_object
  after delete on storage.objects
  for each row
  execute function handle_delete_object ();

-- add functions

create or replace function public.upsert_team(_name text, _id uuid default null)
  returns uuid
  language plpgsql
  set search_path = ''
  as $$
  begin
    if _id is null then
      insert into public.teams (name) values (_name) returning id into _id;
      insert into public.team_members (team_id, profile_id, role) values (_id, (select auth.uid()::uuid), 'owner'::public.team_member_role);
    else
      update public.teams set name = _name where id = _id;
    end if;
    return _id;
  end;
  $$;

-- nuke rls

drop policy "Owners and team members can delete." on "public"."comments";
drop policy "Team members & subject managers can insert." on "public"."comments";
drop policy "Team members & subject managers can select." on "public"."comments";
drop policy "Team members & subject managers can delete." on "public"."event_inputs";
drop policy "Team members & subject managers can insert." on "public"."event_inputs";
drop policy "Team members & subject managers can select." on "public"."event_inputs";
drop policy "Team members & subject managers can update." on "public"."event_inputs";
drop policy "Team members & subject managers can select." on "public"."event_type_inputs";
drop policy "Team members can delete." on "public"."event_type_inputs";
drop policy "Team members can insert." on "public"."event_type_inputs";
drop policy "Team members & subject managers can select." on "public"."event_types";
drop policy "Team members can delete." on "public"."event_types";
drop policy "Team members can insert." on "public"."event_types";
drop policy "Team members can update." on "public"."event_types";
drop policy "Team members & subject managers can insert." on "public"."events";
drop policy "Team members & subject managers can select." on "public"."events";
drop policy "Team members & subject managers can update." on "public"."events";
drop policy "Team members can delete." on "public"."events";
drop policy "Team members & subject managers can insert." on "public"."input_options";
drop policy "Team members & subject managers can select." on "public"."input_options";
drop policy "Team members can delete." on "public"."input_options";
drop policy "Team members can update." on "public"."input_options";
drop policy "Team members & subject managers can select." on "public"."input_subjects";
drop policy "Team members can delete." on "public"."input_subjects";
drop policy "Team members can insert." on "public"."input_subjects";
drop policy "Team members & subject managers can insert." on "public"."inputs";
drop policy "Team members & subject managers can select." on "public"."inputs";
drop policy "Team members can delete." on "public"."inputs";
drop policy "Team members can update." on "public"."inputs";
drop policy "Team members & subject managers can select." on "public"."insights";
drop policy "Team members can delete." on "public"."insights";
drop policy "Team members can insert." on "public"."insights";
drop policy "Team members can update." on "public"."insights";
drop policy "Owners can delete." on "public"."notifications";
drop policy "Owners can select." on "public"."notifications";
drop policy "Owners can update." on "public"."notifications";
drop policy "Authenticated users can select." on "public"."profiles";
drop policy "Team members & subject managers can select." on "public"."protocols";
drop policy "Team members can delete." on "public"."protocols";
drop policy "Team members can insert." on "public"."protocols";
drop policy "Team members can update." on "public"."protocols";
drop policy "Team members & subject managers can select." on "public"."sessions";
drop policy "Team members can delete." on "public"."sessions";
drop policy "Team members can insert." on "public"."sessions";
drop policy "Team members can update." on "public"."sessions";
drop policy "Authenticated users can select." on "public"."subject_managers";
drop policy "Team members can delete." on "public"."subject_managers";
drop policy "Team members = full access." on "public"."subject_notes";
drop policy "Team members & subject managers can select." on "public"."subjects";
drop policy "Team members can insert." on "public"."subjects";
drop policy "Team members can update." on "public"."subjects";
drop policy "Authenticated users can select." on "public"."team_members";
drop policy "Select template = full access." on "public"."template_subjects";
drop policy "Team members = full access." on "public"."templates";
drop policy "Team members & subject managers can select (subjects)." on "storage"."objects";
drop policy "Team members can delete (subjects)." on "storage"."objects";
drop policy "Team members can insert (subjects)." on "storage"."objects";
drop policy "Team members can update (subjects)." on "storage"."objects";
drop policy "Everyone can select (profiles)." on "storage"."objects";
drop policy "Owners can delete (profiles)." on "storage"."objects";
drop policy "Owners can insert (profiles)." on "storage"."objects";
drop policy "Owners can update (profiles)." on "storage"."objects";

-- subject manager -> subject client

create table "public"."subject_clients" ("profile_id" uuid not null, "subject_id" uuid not null);
insert into "public"."subject_clients" select * from "public"."subject_managers";
alter table "public"."subject_clients" enable row level security;
create unique index subject_clients_pkey on public.subject_clients using btree (profile_id, subject_id);
create index subject_clients_subject_id_index on public.subject_clients using btree (subject_id);
alter table "public"."subject_clients" add constraint "subject_clients_pkey" primary key using index "subject_clients_pkey";
alter table "public"."subject_clients" add constraint "subject_clients_profile_id_fkey" foreign key (profile_id) references profiles(id) on delete cascade not valid;
alter table "public"."subject_clients" validate constraint "subject_clients_profile_id_fkey";
alter table "public"."subject_clients" add constraint "subject_clients_subject_id_fkey" foreign key (subject_id) references subjects(id) on delete cascade not valid;
alter table "public"."subject_clients" validate constraint "subject_clients_subject_id_fkey";

create or replace function public.join_subject_as_client (share_code text)
  returns void
  language plpgsql
  security definer
  as $$
  # variable_conflict use_variable
  declare
    existing_client boolean;
    profile_id uuid;
    subject_id uuid;
    team_member_profile_ids uuid[];
  begin
    select id into subject_id
      from subjects
      where subjects.share_code = share_code;
    if subject_id is not null then
      select exists(select true from subject_clients
        where profile_id = auth.uid() and subject_id = subject_id)
        into existing_client;
      if not existing_client then
        insert into subject_clients (profile_id, subject_id)
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

create or replace function public.handle_insert_event ()
  returns trigger
  language plpgsql
  security definer
  as $$
  declare
    curr_session_id uuid;
    profile_id uuid;
    subject_client_profile_ids uuid[];
    team_member_profile_ids uuid[];
  begin
    select array_agg(sc.profile_id) into subject_client_profile_ids
      from subject_clients sc
      where sc.subject_id = new.subject_id and sc.profile_id <> new.profile_id;
    select array_agg(tm.profile_id) into team_member_profile_ids
      from subjects s join team_members tm on s.team_id = tm.team_id
      where s.id = new.subject_id and tm.profile_id <> new.profile_id;
    select et.session_id into curr_session_id
      from event_types et
      where et.id = new.event_type_id;
    for profile_id in (
      select unnest(array_cat(subject_client_profile_ids, team_member_profile_ids))) loop
        if not exists (
          select 1
            from notifications n
            join events e on n.source_event_id = e.id
            join event_types et on e.event_type_id = et.id
              where et.session_id = curr_session_id)
        then
          insert into notifications (profile_id, type, source_event_id, source_profile_id, source_subject_id)
            values (profile_id, 'event', new.id, new.profile_id, new.subject_id);
        end if;
      end loop;
    return null;
  end;
  $$;

create or replace function public.handle_insert_comment ()
  returns trigger
  language plpgsql
  security definer
  as $$
  declare
    source_subject_id uuid;
    subject_client_profile_ids uuid[];
    team_member_profile_ids uuid[];
    profile_id uuid;
  begin
    select e.subject_id into source_subject_id
      from events e
      where e.id = new.event_id;
    select array_agg(sc.profile_id) into subject_client_profile_ids
      from subject_clients sc
      where sc.subject_id = source_subject_id and sc.profile_id <> new.profile_id;
    select array_agg(tm.profile_id) into team_member_profile_ids
      from subjects s join team_members tm on s.team_id = tm.team_id
      where s.id = source_subject_id and tm.profile_id <> new.profile_id;
    for profile_id in (
      select unnest(array_cat(subject_client_profile_ids, team_member_profile_ids))) loop
        insert into notifications (profile_id, type, source_comment_id, source_profile_id, source_subject_id)
          values (profile_id, 'comment', new.id, new.profile_id, source_subject_id);
      end loop;
    return null;
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
                  'first_name', case when sc.profile_id is not null then (select anonymize_name(p.first_name, 'first')) else p.first_name end,
                  'id', p.id,
                  'image_uri', case when sc.profile_id is not null then null else p.image_uri end,
                  'last_name', case when sc.profile_id is not null then (select anonymize_name(p.last_name, 'last')) else p.last_name end
                )
                from profiles p
                left join subject_clients sc on p.id = sc.profile_id and e.subject_id = sc.subject_id
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
              'first_name', case when sc.profile_id is not null then
              (select anonymize_name(p.first_name, 'first')) else p.first_name end,
              'id', p.id,
              'image_uri', case when sc.profile_id is not null then null else p.image_uri end,
              'last_name', case when sc.profile_id is not null then (select anonymize_name(p.last_name, 'last')) else p.last_name end
            )
            from profiles p
            left join subject_clients sc on p.id = sc.profile_id and e.subject_id = sc.subject_id
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
                'first_name', case when sc.profile_id is not null then (select anonymize_name(p.first_name, 'first')) else p.first_name end,
                'id', p.id,
                'image_uri', case when sc.profile_id is not null then null else p.image_uri end,
                'last_name', case when sc.profile_id is not null then (select anonymize_name(p.last_name, 'last')) else p.last_name end
              )
              from profiles p
              left join subject_clients sc on p.id = sc.profile_id and e.subject_id = sc.subject_id
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
            'first_name', case when sc.profile_id is not null then (select anonymize_name(p.first_name, 'first')) else p.first_name end,
            'id', p.id,
            'image_uri', case when sc.profile_id is not null then null else p.image_uri end,
            'last_name', case when sc.profile_id is not null then (select anonymize_name(p.last_name, 'last')) else p.last_name end
          )
          from profiles p
          left join subject_clients sc on p.id = sc.profile_id and e.subject_id = sc.subject_id
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
                      'first_name', case when sc.profile_id is not null then (select anonymize_name(p.first_name, 'first')) else p.first_name end,
                      'id', p.id,
                      'image_uri', case when sc.profile_id is not null then null else p.image_uri end,
                      'last_name', case when sc.profile_id is not null then (select anonymize_name(p.last_name, 'last')) else p.last_name end
                    )
                    from profiles p
                    left join subject_clients sc on p.id = sc.profile_id and e.subject_id = sc.subject_id
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
                  'first_name', case when sc.profile_id is not null then (select anonymize_name(p.first_name, 'first')) else p.first_name end,
                  'id', p.id,
                  'image_uri', case when sc.profile_id is not null then null else p.image_uri end,
                  'last_name', case when sc.profile_id is not null then (select anonymize_name(p.last_name, 'last')) else p.last_name end
                )
                from profiles p
                left join subject_clients sc on p.id = sc.profile_id and e.subject_id = sc.subject_id
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

-- update data

insert into storage.buckets (id, name, public)
  values ('teams', 'teams', true);

update auth.users
  set raw_app_meta_data = jsonb_set(
    raw_app_meta_data,
    '{active_team_id}',
    to_jsonb(users.id),
    true
  );

update auth.users
  set raw_app_meta_data = jsonb_set(
    raw_app_meta_data,
    '{is_client}',
    to_jsonb(coalesce(users.raw_user_meta_data ->> 'is_client', 'false')::boolean),
    true
  );

update auth.users
  set raw_user_meta_data = raw_user_meta_data - 'is_client';

-- drop old stuff

drop trigger if exists on_insert_team on public.teams;

drop function public.handle_insert_team ();
drop function public.join_subject_as_manager (share_code text);

alter table "public"."subject_managers" drop constraint "subject_managers_profile_id_fkey";
alter table "public"."subject_managers" drop constraint "subject_managers_subject_id_fkey";
alter table "public"."subject_managers" drop constraint "subject_managers_pkey";
alter table "public"."teams" drop column "owner";

drop index if exists "public"."subject_managers_pkey";
drop index if exists "public"."subject_managers_subject_id_index";

drop table "public"."subject_managers";

-- add new rls policies

create or replace function public.check_tag_roles(
    _allow_if_role_is_one_of public.team_member_role[],
    _tag_ids uuid[],
    _team_id uuid,
    _user_id uuid
  )
  returns boolean
  language plpgsql
  as $$
  declare
    matched_tag_roles public.team_member_role[] := '{}';
  begin
    if array_length(_tag_ids, 1) > 0 then
      select coalesce(array_agg(tm.role), '{}') into matched_tag_roles
        from public.team_member_tag_roles tm
        where tm.profile_id = _user_id
        and tm.team_id = _team_id
        and tm.tag_id = any(_tag_ids);
      if array_length(array(select unnest(matched_tag_roles) intersect select unnest(_allow_if_role_is_one_of)), 1) > 0 then
        return true;
      end if;
    end if;
    return false;
  end;
  $$;

create or replace function public.check_subject_roles(
    _allow_if_role_is_one_of public.team_member_role[],
    _subject_id uuid,
    _team_id uuid,
    _user_id uuid
  )
  returns boolean
  language plpgsql
  as $$
  begin
    if (

       (select tm.role from public.team_member_subject_roles tm
         where tm.team_id = _team_id
           and tm.profile_id = _user_id
           and tm.subject_id = _subject_id
         limit 1)
       = any(_allow_if_role_is_one_of)
    ) then
      return true;
    end if;
    return false;
  end;
  $$;

create or replace function public.authorize(
    allow_if_is_subject_client boolean default false,
    allow_if_profile_id_is_user_id boolean default false,
    allow_if_role_is_one_of public.team_member_role[] default null,
    allow_if_team_has_no_owner boolean default false,
    object_input_id uuid default null,
    object_profile_id uuid default null,
    object_subject_id uuid default null,
    object_team_id uuid default null,
    object_template_id uuid default null
  )
  returns boolean
  language plpgsql
  security definer
  set search_path = ''
  as $$
  declare
    object_tag_ids uuid[];
    team_has_owner boolean;
    user_id uuid;
  begin
    select auth.uid()::uuid into user_id;

    -- Check if profile ID matches user ID
    if allow_if_profile_id_is_user_id and object_profile_id is not null and user_id = object_profile_id then
      return true;
    end if;

    -- Check if the user is a subject client
    if allow_if_is_subject_client and object_subject_id is not null and exists (
      select 1 from public.subject_clients sc where sc.subject_id = object_subject_id and sc.profile_id = user_id
    ) then
      return true;
    end if;

    -- Resolve the team ID if necessary
    if allow_if_role_is_one_of is not null and array_length(allow_if_role_is_one_of, 1) > 0 then
      if object_team_id is null then
        if object_subject_id is not null then
          select s.team_id into object_team_id
            from public.subjects s
            where s.id = object_subject_id;
        end if;
        if object_input_id is not null then
          select i.team_id into object_team_id
            from public.inputs i
            where i.id = object_input_id;
        end if;
        if object_template_id is not null then
          select t.team_id into object_team_id
            from public.templates t
            where t.id = object_template_id;
        end if;
      end if;

      -- Check if the user has one of the allowed roles in the team
      if object_team_id is not null then
        if (
          select tm.role from public.team_members tm
            where tm.team_id = object_team_id
            and tm.profile_id = user_id
            limit 1
        ) = any(allow_if_role_is_one_of) then
          return true;
        end if;

        -- Additional checks for subjects and tags
        if object_subject_id is not null then
          if public.check_subject_roles(
            _allow_if_role_is_one_of => allow_if_role_is_one_of,
            _subject_id => object_subject_id,
            _team_id => object_team_id,
            _user_id => user_id
          ) then
            return true;
          end if;
          select array_agg(tm.tag_id) into object_tag_ids
            from public.subject_tags tm
            where tm.subject_id = object_subject_id;
          if public.check_tag_roles(
            _allow_if_role_is_one_of => allow_if_role_is_one_of,
            _tag_ids => object_tag_ids,
            _team_id => object_team_id,
            _user_id => user_id
          ) then
            return true;
          end if;
        end if;

        -- Additional checks for inputs and tags
        if object_input_id is not null then
          select array_agg(it.tag_id) into object_tag_ids
            from public.input_tags it
            where it.input_id = object_input_id;
          if public.check_tag_roles(
            _allow_if_role_is_one_of => allow_if_role_is_one_of,
            _tag_ids => object_tag_ids,
            _team_id => object_team_id,
            _user_id => user_id
          ) then
            return true;
          end if;
        end if;

        -- Additional checks for templates and tags
        if object_template_id is not null then
          select array_agg(it.tag_id) into object_tag_ids
            from public.template_tags it
            where it.template_id = object_template_id;
          if public.check_tag_roles(
            _allow_if_role_is_one_of => allow_if_role_is_one_of,
            _tag_ids => object_tag_ids,
            _team_id => object_team_id,
            _user_id => user_id
          ) then
            return true;
          end if;
        end if;
      end if;
    end if;

    -- Check if the team has no owner, if allowed
    if allow_if_team_has_no_owner and object_team_id is not null then
      select exists (
        select 1 from public.team_members tm
        where tm.team_id = object_team_id
        and tm.role = 'owner'
      ) into team_has_owner;

      if not team_has_owner then
        return true;
      end if;
    end if;

    -- Handle inputs linked to event types
    if object_input_id is not null then
      for object_subject_id in
        select distinct et.subject_id
          from public.event_type_inputs eti
          join public.event_types et on et.id = eti.event_type_id
          where eti.input_id = object_input_id
      loop
        if public.authorize(
          allow_if_is_subject_client => allow_if_is_subject_client,
          allow_if_role_is_one_of => allow_if_role_is_one_of,
          object_subject_id => object_subject_id
        ) then
          return true;
        end if;
      end loop;
    end if;

    return false;
  end;
  $$;

create or replace function public.get_subject_id_from_event_id(event_id uuid)
  returns uuid
  language plpgsql
  as $$
  begin
    return (select event_types.subject_id
      from events
      join event_types on events.event_type_id = event_types.id
      where events.id = event_id);
  end;
  $$;

create or replace function public.get_subject_id_from_event_type_id(event_type_id uuid)
  returns uuid
  language plpgsql
  as $$
  begin
    return (select event_types.subject_id
      from event_types
      where event_types.id = event_type_id);
  end;
  $$;

create or replace function public.get_subject_id_from_protocol_id(protocol_id uuid)
  returns uuid
  language plpgsql
  as $$
  begin
    return (select protocols.subject_id
      from protocols
      where protocols.id = protocol_id);
  end;
  $$;

create policy "select_policy" on "public"."comments" for select to authenticated using ((select public.authorize(
  allow_if_is_subject_client => true,
  allow_if_role_is_one_of => array['owner', 'admin', 'recorder', 'viewer']::public.team_member_role[],
  object_subject_id => (select public.get_subject_id_from_event_id(event_id)))));

create policy "insert_policy" on "public"."comments" for insert to authenticated with check ((select public.authorize(
  allow_if_is_subject_client => true,
  allow_if_role_is_one_of => array['owner', 'admin', 'recorder']::public.team_member_role[],
  object_subject_id => (select public.get_subject_id_from_event_id(event_id)))));

create policy "delete_policy" on "public"."comments" for delete to authenticated using ((select public.authorize(
  allow_if_profile_id_is_user_id => true,
  allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
  object_profile_id => profile_id,
  object_subject_id => (select public.get_subject_id_from_event_id(event_id)))));

create policy "select_policy" on "public"."event_inputs" for select to authenticated using ((select public.authorize(
  allow_if_is_subject_client => true,
  allow_if_role_is_one_of => array['owner', 'admin', 'recorder', 'viewer']::public.team_member_role[],
  object_subject_id => (select public.get_subject_id_from_event_id(event_id)))));

create policy "insert_policy" on "public"."event_inputs" for insert to authenticated with check ((select public.authorize(
  allow_if_is_subject_client => true,
  allow_if_role_is_one_of => array['owner', 'admin', 'recorder']::public.team_member_role[],
  object_subject_id => (select public.get_subject_id_from_event_id(event_id)))));

create policy "update_policy" on "public"."event_inputs" for update to authenticated
  using ((select public.authorize(
    allow_if_is_subject_client => true,
    allow_if_role_is_one_of => array['owner', 'admin', 'recorder']::public.team_member_role[],
    object_subject_id => (select public.get_subject_id_from_event_id(event_id)))))
  with check ((select public.authorize(
    allow_if_is_subject_client => true,
    allow_if_role_is_one_of => array['owner', 'admin', 'recorder']::public.team_member_role[],
    object_subject_id => (select public.get_subject_id_from_event_id(event_id)))));

create policy "delete_policy" on "public"."event_inputs" for delete to authenticated using ((select public.authorize(
  allow_if_is_subject_client => true,
  allow_if_role_is_one_of => array['owner', 'admin', 'recorder']::public.team_member_role[],
  object_subject_id => (select public.get_subject_id_from_event_id(event_id)))));

create policy "select_policy" on "public"."event_type_inputs" for select to authenticated using ((select public.authorize(
  allow_if_is_subject_client => true,
  allow_if_role_is_one_of => array['owner', 'admin', 'recorder', 'viewer']::public.team_member_role[],
  object_subject_id => (select public.get_subject_id_from_event_type_id(event_type_id)))));

create policy "insert_policy" on "public"."event_type_inputs" for insert to authenticated with check ((select public.authorize(
  allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
  object_subject_id => (select public.get_subject_id_from_event_type_id(event_type_id)))));

create policy "delete_policy" on "public"."event_type_inputs" for delete to authenticated using ((select public.authorize(
  allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
  object_subject_id => (select public.get_subject_id_from_event_type_id(event_type_id)))));

create policy "select_policy" on "public"."event_types" for select to authenticated using ((select public.authorize(
  allow_if_is_subject_client => true,
  allow_if_role_is_one_of => array['owner', 'admin', 'recorder', 'viewer']::public.team_member_role[],
  object_subject_id => subject_id)));

create policy "insert_policy" on "public"."event_types" for insert to authenticated with check ((select public.authorize(
  allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
  object_subject_id => subject_id)));

create policy "update_policy" on "public"."event_types" for update to authenticated
  using ((select public.authorize(
    allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
    object_subject_id => subject_id)))
  with check ((select public.authorize(
    allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
    object_subject_id => subject_id)));

create policy "delete_policy" on "public"."event_types" for delete to authenticated using ((select public.authorize(
  allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
  object_subject_id => subject_id)));

create policy "select_policy" on "public"."events" for select to authenticated using ((select public.authorize(
  allow_if_is_subject_client => true,
  allow_if_role_is_one_of => array['owner', 'admin', 'recorder', 'viewer']::public.team_member_role[],
  object_subject_id => subject_id)));

create policy "insert_policy" on "public"."events" for insert to authenticated with check ((select public.authorize(
  allow_if_is_subject_client => true,
  allow_if_role_is_one_of => array['owner', 'admin', 'recorder']::public.team_member_role[],
  object_subject_id => subject_id)));

create policy "update_policy" on "public"."events" for update to authenticated
  using ((select public.authorize(
    allow_if_is_subject_client => true,
    allow_if_role_is_one_of => array['owner', 'admin', 'recorder']::public.team_member_role[],
    object_subject_id => subject_id)))
  with check ((select public.authorize(
    allow_if_is_subject_client => true,
    allow_if_role_is_one_of => array['owner', 'admin', 'recorder']::public.team_member_role[],
    object_subject_id => subject_id)));

create policy "delete_policy" on "public"."events" for delete to authenticated using ((select public.authorize(
  allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
  object_subject_id => subject_id)));

create policy "select_policy" on "public"."input_options" for select to authenticated using ((select public.authorize(
  allow_if_is_subject_client => true,
  allow_if_role_is_one_of => array['owner', 'admin', 'recorder', 'viewer']::public.team_member_role[],
  object_input_id => input_id)));

create policy "insert_policy" on "public"."input_options" for insert to authenticated with check ((select public.authorize(
  allow_if_is_subject_client => true,
  allow_if_role_is_one_of => array['owner', 'admin', 'recorder']::public.team_member_role[],
  object_input_id => input_id)));

create policy "update_policy" on "public"."input_options" for update to authenticated
  using ((select public.authorize(
    allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
    object_input_id => input_id)))
  with check ((select public.authorize(
    allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
    object_input_id => input_id)));

create policy "delete_policy" on "public"."input_options" for delete to authenticated using ((select public.authorize(
  allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
  object_input_id => input_id)));

create policy "select_policy" on "public"."input_subjects" for select to authenticated using (true);

create policy "insert_policy" on "public"."input_subjects" for insert to authenticated with check ((select public.authorize(
  allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
  object_input_id => input_id)));

create policy "delete_policy" on "public"."input_subjects" for delete to authenticated using ((select public.authorize(
  allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
  object_input_id => input_id)));

create policy "select_policy" on "public"."input_tags" for select to authenticated using (true);

create policy "insert_policy" on "public"."input_tags" for insert to authenticated with check ((select public.authorize(
  allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
  object_input_id => input_id)));

create policy "update_policy" on "public"."input_tags" for update to authenticated
  using ((select public.authorize(
    allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
    object_input_id => input_id)))
  with check ((select public.authorize(
    allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
    object_input_id => input_id)));

create policy "delete_policy" on "public"."input_tags" for delete to authenticated using ((select public.authorize(
  allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
  object_input_id => input_id)));

create policy "select_policy" on "public"."inputs" for select to authenticated using ((select public.authorize(
  allow_if_is_subject_client => true,
  allow_if_role_is_one_of => array['owner', 'admin', 'recorder', 'viewer']::public.team_member_role[],
  object_input_id => id,
  object_team_id => team_id)));

create policy "insert_policy" on "public"."inputs" for insert to authenticated with check ((select public.authorize(
  allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
  object_team_id => team_id)));

create policy "update_policy" on "public"."inputs" for update to authenticated
  using ((select public.authorize(
    allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
    object_team_id => team_id)))
  with check ((select public.authorize(
    allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
    object_team_id => team_id)));

create policy "delete_policy" on "public"."inputs" for delete to authenticated using ((select public.authorize(
  allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
  object_team_id => team_id)));

create policy "select_policy" on "public"."insights" for select to authenticated using ((select public.authorize(
  allow_if_is_subject_client => true,
  allow_if_role_is_one_of => array['owner', 'admin', 'recorder', 'viewer']::public.team_member_role[],
  object_subject_id => subject_id)));

create policy "insert_policy" on "public"."insights" for insert to authenticated with check ((select public.authorize(
  allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
  object_subject_id => subject_id)));

create policy "update_policy" on "public"."insights" for update to authenticated
  using ((select public.authorize(
    allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
    object_subject_id => subject_id)))
  with check ((select public.authorize(
    allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
    object_subject_id => subject_id)));

create policy "delete_policy" on "public"."insights" for delete to authenticated using ((select public.authorize(
  allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
  object_subject_id => subject_id)));

create policy "select_policy" on "public"."notifications" for select to authenticated using ((select public.authorize(
  allow_if_profile_id_is_user_id => true,
  object_profile_id => profile_id)));

create policy "delete_policy" on "public"."notifications" for delete to authenticated using ((select public.authorize(
  allow_if_profile_id_is_user_id => true,
  object_profile_id => profile_id)));

create policy "select_policy" on "public"."profiles" for select to authenticated using (true);

create policy "select_policy" on "public"."protocols" for select to authenticated using ((select public.authorize(
  allow_if_is_subject_client => true,
  allow_if_role_is_one_of => array['owner', 'admin', 'recorder', 'viewer']::public.team_member_role[],
  object_subject_id => subject_id)));

create policy "insert_policy" on "public"."protocols" for insert to authenticated with check ((select public.authorize(
  allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
  object_subject_id => subject_id)));

create policy "update_policy" on "public"."protocols" for update to authenticated
  using ((select public.authorize(
    allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
    object_subject_id => subject_id)))
  with check ((select public.authorize(
    allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
    object_subject_id => subject_id)));

create policy "delete_policy" on "public"."protocols" for delete to authenticated using ((select public.authorize(
  allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
  object_subject_id => subject_id)));

create policy "select_policy" on "public"."sessions" for select to authenticated using ((select public.authorize(
  allow_if_is_subject_client => true,
  allow_if_role_is_one_of => array['owner', 'admin', 'recorder', 'viewer']::public.team_member_role[],
  object_subject_id => (select public.get_subject_id_from_protocol_id(protocol_id)))));

create policy "insert_policy" on "public"."sessions" for insert to authenticated with check ((select public.authorize(
  allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
  object_subject_id => (select public.get_subject_id_from_protocol_id(protocol_id)))));

create policy "update_policy" on "public"."sessions" for update to authenticated
  using ((select public.authorize(
    allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
    object_subject_id => (select public.get_subject_id_from_protocol_id(protocol_id)))))
  with check ((select public.authorize(
    allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
    object_subject_id => (select public.get_subject_id_from_protocol_id(protocol_id)))));

create policy "delete_policy" on "public"."sessions" for delete to authenticated using ((select public.authorize(
  allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
  object_subject_id => (select public.get_subject_id_from_protocol_id(protocol_id)))));

create policy "select_policy" on "public"."subject_clients" for select to authenticated using ((select public.authorize(
  allow_if_is_subject_client => true,
  allow_if_role_is_one_of => array['owner', 'admin', 'recorder', 'viewer']::public.team_member_role[],
  object_subject_id => subject_id)));

create policy "delete_policy" on "public"."subject_clients" for delete to authenticated using ((select public.authorize(
  allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
  object_subject_id => subject_id)));

create policy "select_policy" on "public"."subject_notes" for select to authenticated using ((select public.authorize(
  allow_if_role_is_one_of => array['owner', 'admin', 'recorder', 'viewer']::public.team_member_role[],
  object_subject_id => id)));

create policy "insert_policy" on "public"."subject_notes" for insert to authenticated with check ((select public.authorize(
  allow_if_role_is_one_of => array['owner', 'admin', 'recorder']::public.team_member_role[],
  object_subject_id => id)));

create policy "update_policy" on "public"."subject_notes" for update to authenticated
  using ((select public.authorize(
    allow_if_role_is_one_of => array['owner', 'admin', 'recorder']::public.team_member_role[],
    object_subject_id => id)))
  with check ((select public.authorize(
    allow_if_role_is_one_of => array['owner', 'admin', 'recorder']::public.team_member_role[],
    object_subject_id => id)));

create policy "select_policy" on "public"."subject_tags" for select to authenticated using (true);

create policy "insert_policy" on "public"."subject_tags" for insert to authenticated with check ((select public.authorize(
  allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
  object_subject_id => subject_id)));

create policy "update_policy" on "public"."subject_tags" for update to authenticated
  using ((select public.authorize(
    allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
    object_subject_id => subject_id)))
  with check ((select public.authorize(
    allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
    object_subject_id => subject_id)));

create policy "delete_policy" on "public"."subject_tags" for delete to authenticated using ((select public.authorize(
  allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
  object_subject_id => subject_id)));

create policy "select_policy" on "public"."subjects" for select to authenticated using ((select public.authorize(
  allow_if_is_subject_client => true,
  allow_if_role_is_one_of => array['owner', 'admin', 'recorder', 'viewer']::public.team_member_role[],
  object_subject_id => id,
  object_team_id => team_id)));

create policy "insert_policy" on "public"."subjects" for insert to authenticated with check ((select public.authorize(
  allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
  object_team_id => team_id)));

create policy "update_policy" on "public"."subjects" for update to authenticated
  using ((select public.authorize(
    allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
    object_team_id => team_id)))
  with check ((select public.authorize(
    allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
    object_team_id => team_id)));

create policy "select_policy" on "public"."tags" for select to authenticated using ((select public.authorize(
  allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
  object_team_id => team_id)));

create policy "insert_policy" on "public"."tags" for insert to authenticated with check ((select public.authorize(
  allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
  object_team_id => team_id)));

create policy "update_policy" on "public"."tags" for update to authenticated
  using ((select public.authorize(
    allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
    object_team_id => team_id)))
  with check ((select public.authorize(
    allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
    object_team_id => team_id)));

create policy "delete_policy" on "public"."tags" for delete to authenticated using ((select public.authorize(
  allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
  object_team_id => team_id)));

create policy "select_policy" on "public"."team_member_subject_roles" for select to authenticated using ((select public.authorize(
  allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
  object_team_id => team_id)));

create policy "insert_policy" on "public"."team_member_subject_roles" for insert to authenticated with check (
  role != 'owner'::public.team_member_role and
  (select public.authorize(
    allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
    object_team_id => team_id)));

create policy "update_policy" on "public"."team_member_subject_roles" for update to authenticated
  using ((select public.authorize(
    allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
    object_team_id => team_id)))
  with check (
    role != 'owner'::public.team_member_role and
    (select public.authorize(
      allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
      object_team_id => team_id)));

create policy "delete_policy" on "public"."team_member_subject_roles" for delete to authenticated using ((select public.authorize(
  allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
  object_team_id => team_id)));

create policy "select_policy" on "public"."team_member_tag_roles" for select to authenticated using ((select public.authorize(
  allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
  object_team_id => team_id)));

create policy "insert_policy" on "public"."team_member_tag_roles" for insert to authenticated with check (
  role != 'owner'::public.team_member_role and
  (select public.authorize(
    allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
    object_team_id => team_id)));

create policy "update_policy" on "public"."team_member_tag_roles" for update to authenticated
  using ((select public.authorize(
    allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
    object_team_id => team_id)))
  with check (
    role != 'owner'::public.team_member_role and
    (select public.authorize(
      allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
      object_team_id => team_id)));

create policy "delete_policy" on "public"."team_member_tag_roles" for delete to authenticated using ((select public.authorize(
  allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
  object_team_id => team_id)));

create policy "select_policy" on "public"."team_members" for select to authenticated using ((select public.authorize(
  allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
  object_team_id => team_id)));

create policy "insert_policy" on "public"."team_members" for insert to authenticated with check ((select public.authorize(
  allow_if_role_is_one_of =>
    case
      when role = 'owner' then array['owner']::public.team_member_role[]
      else array['owner', 'admin']::public.team_member_role[]
    end,
  allow_if_team_has_no_owner => true,
  object_team_id => team_id)));

create policy "update_policy" on "public"."team_members" for update to authenticated
  using ((select public.authorize(
    allow_if_role_is_one_of =>
      case
        when role = 'owner' then array['owner']::public.team_member_role[]
        else array['owner', 'admin']::public.team_member_role[]
      end,
    object_team_id => team_id)))
  with check ((select public.authorize(
    allow_if_role_is_one_of =>
      case
        when role = 'owner' then array['owner']::public.team_member_role[]
        else array['owner', 'admin']::public.team_member_role[]
      end,
    object_team_id => team_id)));

create policy "delete_policy" on "public"."team_members" for delete to authenticated using ((select public.authorize(
  allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
  object_team_id => team_id)));

create policy "select_policy" on "public"."subscriptions" for select to authenticated using ((select public.authorize(
  allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
  object_team_id => team_id)));

create policy "select_policy" on "public"."teams" for select to authenticated using ((select public.authorize(
  allow_if_role_is_one_of => array['owner', 'admin', 'recorder', 'viewer']::public.team_member_role[],
  allow_if_team_has_no_owner => true,
  object_team_id => id)));

create policy "insert_policy" on "public"."teams" for insert to authenticated with check (true);

create policy "update_policy" on "public"."teams" for update to authenticated
  using ((select public.authorize(
    allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
    object_team_id => id)))
  with check ((select public.authorize(
    allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
    object_team_id => id)));

create policy "select_policy" on "public"."template_subjects" for select to authenticated using (true);

create policy "insert_policy" on "public"."template_subjects" for insert to authenticated with check ((select public.authorize(
  allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
  object_template_id => template_id)));

create policy "delete_policy" on "public"."template_subjects" for delete to authenticated using ((select public.authorize(
  allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
  object_template_id => template_id)));

create policy "select_policy" on "public"."template_tags" for select to authenticated using (true);

create policy "insert_policy" on "public"."template_tags" for insert to authenticated with check ((select public.authorize(
  allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
  object_template_id => template_id)));

create policy "update_policy" on "public"."template_tags" for update to authenticated
  using ((select public.authorize(
    allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
    object_template_id => template_id)))
  with check ((select public.authorize(
    allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
    object_template_id => template_id)));

create policy "delete_policy" on "public"."template_tags" for delete to authenticated using ((select public.authorize(
  allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
  object_template_id => template_id)));

create policy "select_policy" on "public"."templates" for select to authenticated using ((select public.authorize(
  allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
  object_team_id => team_id)));

create policy "insert_policy" on "public"."templates" for insert to authenticated with check ((select public.authorize(
  allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
  object_team_id => team_id)));

create policy "update_policy" on "public"."templates" for update to authenticated
  using ((select public.authorize(
    allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
    object_team_id => team_id)))
  with check ((select public.authorize(
    allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
    object_team_id => team_id)));

create policy "delete_policy" on "public"."templates" for delete to authenticated using ((select public.authorize(
  allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
  object_team_id => team_id)));

create policy "subjects_select_policy" on "storage"."objects" as permissive for select to authenticated using (
  (bucket_id = 'subjects'::text) and
  (select public.authorize(
    allow_if_is_subject_client => true,
    allow_if_role_is_one_of => array['owner', 'admin', 'recorder', 'viewer']::public.team_member_role[],
    object_subject_id => ((storage.foldername (objects.name))[1])::uuid)));

create policy "subjects_insert_policy" on "storage"."objects" as permissive for insert to authenticated with check (
  (bucket_id = 'subjects'::text) and
  (select public.authorize(
    allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
    object_subject_id => ((storage.foldername (objects.name))[1])::uuid)));

create policy "subjects_update_policy" on "storage"."objects" as permissive for update to authenticated
  using (
    (bucket_id = 'subjects'::text) and
    (select public.authorize(
      allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
      object_subject_id => ((storage.foldername (objects.name))[1])::uuid)))
  with check (
    (bucket_id = 'subjects'::text) and
    (select public.authorize(
      allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
      object_subject_id => ((storage.foldername (objects.name))[1])::uuid)));

create policy "subjects_delete_policy" on "storage"."objects" as permissive for delete to authenticated using (
  (bucket_id = 'subjects'::text) and
  (select public.authorize(
    allow_if_role_is_one_of => array['owner', 'admin']::public.team_member_role[],
    object_subject_id => ((storage.foldername (objects.name))[1])::uuid)));

create policy "profiles_select_policy" on "storage"."objects" as permissive for select to authenticated using
  (bucket_id = 'profiles'::text);

create policy "profiles_insert_policy" on "storage"."objects" as permissive for insert to authenticated with check (
  (bucket_id = 'profiles'::text) and
  (select public.authorize(
    allow_if_profile_id_is_user_id => true,
    object_profile_id => ((storage.foldername (objects.name))[1])::uuid)));

create policy "profiles_update_policy" on "storage"."objects" as permissive for update to authenticated
  using (
    (bucket_id = 'profiles'::text) and
    (select public.authorize(
      allow_if_profile_id_is_user_id => true,
      object_profile_id => ((storage.foldername (objects.name))[1])::uuid)))
  with check (
    (bucket_id = 'profiles'::text) and
    (select public.authorize(
      allow_if_profile_id_is_user_id => true,
      object_profile_id => ((storage.foldername (objects.name))[1])::uuid)));

create policy "profiles_delete_policy" on "storage"."objects" as permissive for delete to authenticated using (
  (bucket_id = 'profiles'::text) and
  (select public.authorize(
    allow_if_profile_id_is_user_id => true,
    object_profile_id => ((storage.foldername (objects.name))[1])::uuid)));

create policy "teams_select_policy" on "storage"."objects" as permissive for select to authenticated using (
  (bucket_id = 'teams'::text) and
  (select public.authorize(
    allow_if_role_is_one_of => array['owner', 'admin', 'recorder', 'viewer']::public.team_member_role[],
    object_team_id => ((storage.foldername (objects.name))[1])::uuid)));

create policy "teams_insert_policy" on "storage"."objects" as permissive for insert to authenticated with check (
  (bucket_id = 'teams'::text) and
  (select public.authorize(
    allow_if_role_is_one_of => array['owner']::public.team_member_role[],
    object_team_id => ((storage.foldername (objects.name))[1])::uuid)));

create policy "teams_update_policy" on "storage"."objects" as permissive for update to authenticated
  using (
    (bucket_id = 'teams'::text) and
    (select public.authorize(
      allow_if_role_is_one_of => array['owner']::public.team_member_role[],
      object_team_id => ((storage.foldername (objects.name))[1])::uuid)))
  with check (
    (bucket_id = 'teams'::text) and
    (select public.authorize(
      allow_if_role_is_one_of => array['owner']::public.team_member_role[],
      object_team_id => ((storage.foldername (objects.name))[1])::uuid)));

create policy "teams_delete_policy" on "storage"."objects" as permissive for delete to authenticated using (
  (bucket_id = 'teams'::text) and
  (select public.authorize(
    allow_if_role_is_one_of => array['owner']::public.team_member_role[],
    object_team_id => ((storage.foldername (objects.name))[1])::uuid)));

-- update indexes

alter table "public"."subject_clients" drop constraint "subject_clients_pkey";
drop index if exists "public"."subject_clients_subject_id_index";
drop index if exists "public"."team_members_team_id_index";
drop index if exists "public"."subject_clients_pkey";
create unique index subject_clients_pkey on public.subject_clients using btree (subject_id, profile_id);
alter table "public"."subject_clients" add constraint "subject_clients_pkey" primary key using index "subject_clients_pkey";
create index notifications_profile_id_created_at_index on public.notifications using btree (profile_id, created_at);
