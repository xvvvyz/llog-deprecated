create type event_type as enum ('observation', 'routine');

create type input_type as enum ('checkbox', 'duration', 'multi_select', 'number', 'select', 'time');

create type template_type as enum ('observation', 'routine');

create table "public"."comments" (
  "id" uuid not null default uuid_generate_v4 (),
  "created_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
  "content" text not null default ''::text,
  "files" text[],
  "event_id" uuid not null,
  "profile_id" uuid not null default auth.uid (),
  "updated_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text)
);

alter table "public"."comments" enable row level security;

create table "public"."event_type_inputs" (
  "event_type_id" uuid not null,
  "input_id" uuid not null,
  "order" smallint not null
);

alter table "public"."event_type_inputs" enable row level security;

create table "public"."event_types" (
  "content" text not null default ''::text,
  "id" uuid not null default uuid_generate_v4 (),
  "mission_id" uuid,
  "name" text not null,
  "order" smallint not null,
  "session" smallint,
  "subject_id" uuid not null,
  "template_id" uuid,
  "type" event_type not null
);

alter table "public"."event_types" enable row level security;

create table "public"."event_inputs" (
  "id" uuid not null default uuid_generate_v4 (),
  "event_id" uuid not null,
  "input_option_id" uuid,
  "input_id" uuid not null,
  "value" jsonb
);

alter table "public"."event_inputs" enable row level security;

create table "public"."events" (
  "id" uuid not null default uuid_generate_v4 (),
  "created_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
  "event_type_id" uuid not null,
  "subject_id" uuid not null,
  "profile_id" uuid not null default auth.uid (),
  "updated_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text)
);

alter table "public"."events" enable row level security;

create table "public"."input_options" (
  "id" uuid not null default uuid_generate_v4 (),
  "input_id" uuid not null,
  "label" text not null,
  "order" smallint not null
);

alter table "public"."input_options" enable row level security;

create table "public"."inputs" (
  "id" uuid not null default uuid_generate_v4 (),
  "team_id" uuid not null default auth.uid (),
  "label" text not null,
  "type" input_type not null,
  "created_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
  "updated_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text)
);

alter table "public"."inputs" enable row level security;

create table "public"."missions" (
  "id" uuid not null default uuid_generate_v4 (),
  "name" text not null,
  "subject_id" uuid not null,
  "created_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
  "updated_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text)
);

alter table "public"."missions" enable row level security;

create table "public"."profiles" (
  "id" uuid not null,
  "first_name" text not null,
  "last_name" text not null
);

alter table "public"."profiles" enable row level security;

create table "public"."subject_managers" (
  "profile_id" uuid not null,
  "subject_id" uuid not null
);

alter table "public"."subject_managers" enable row level security;

create table "public"."subjects" (
  "id" uuid not null default uuid_generate_v4 (),
  "created_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
  "updated_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
  "name" text not null,
  "image_uri" text,
  "team_id" uuid not null default auth.uid ()
);

alter table "public"."subjects" enable row level security;

create table "public"."team_members" (
  "team_id" uuid not null default auth.uid (),
  "profile_id" uuid not null
);

alter table "public"."team_members" enable row level security;

create table "public"."teams" (
  "id" uuid not null default uuid_generate_v4 (),
  "name" text not null,
  "owner" uuid not null default auth.uid ()
);

alter table "public"."teams" enable row level security;

create table "public"."templates" (
  "id" uuid not null default uuid_generate_v4 (),
  "created_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
  "updated_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
  "public" boolean not null default false,
  "data" jsonb,
  "team_id" uuid not null default auth.uid (),
  "type" template_type not null,
  "name" text not null
);

alter table "public"."templates" enable row level security;

create index comments_event_id_created_at_index on public.comments using btree (event_id, created_at);

create unique index comments_pkey on public.comments using btree (id);

create unique index event_type_inputs_pkey on public.event_type_inputs using btree (event_type_id, input_id);

create unique index event_type_inputs_event_type_id_order_index on public.event_type_inputs using btree (event_type_id, "order");

create index event_type_inputs_input_id_index on public.event_type_inputs using btree (input_id);

create unique index event_types_pkey on public.event_types using btree (id);

create index event_types_mission_id_session_order_index on public.event_types using btree (mission_id, session, "order");

create unique index event_types_subject_id_mission_id_type_order_index on public.event_types using btree (subject_id, mission_id, type, "order");

create index event_types_template_id_index on public.event_types using btree (template_id);

create unique index event_inputs_pkey on public.event_inputs using btree (id);

create unique index event_inputs_event_id_input_id_input_option_id_index on public.event_inputs using btree (event_id, input_id, input_option_id);

create index event_inputs_input_id_index on public.event_inputs using btree (input_id);

create index event_inputs_input_option_id_index on public.event_inputs using btree (input_option_id);

create unique index events_pkey on public.events using btree (id);

create index events_subject_id_created_at_index on public.events using btree (subject_id, created_at);

create unique index input_options_input_id_order_index on public.input_options using btree (input_id, "order");

create unique index input_options_pkey on public.input_options using btree (id);

create unique index inputs_pkey on public.inputs using btree (id);

create index inputs_team_id_updated_at_index on public.inputs using btree (team_id, updated_at);

create unique index missions_pkey on public.missions using btree (id);

create index missions_subject_id_updated_at_index on public.missions using btree (subject_id, updated_at);

create unique index profiles_pkey on public.profiles using btree (id);

create unique index subject_managers_pkey on public.subject_managers using btree (profile_id, subject_id);

create index subject_managers_profile_id_index on public.subject_managers using btree (profile_id);

create index subject_managers_subject_id_index on public.subject_managers using btree (subject_id);

create unique index subjects_pkey on public.subjects using btree (id);

create index subjects_team_id_updated_at_index on public.subjects using btree (team_id, updated_at);

create unique index team_members_pkey on public.team_members using btree (team_id, profile_id);

create index team_members_profile_id_index on public.team_members using btree (profile_id);

create index team_members_team_id_index on public.team_members using btree (team_id);

create unique index team_pkey on public.teams using btree (id);

create unique index templates_pkey on public.templates using btree (id);

create unique index templates_team_id_name_index on public.templates using btree (team_id, name);

create index templates_team_id_type_index on public.templates using btree (team_id, type);

create index templates_team_id_type_updated_at_index on public.templates using btree (team_id, type, updated_at);

alter table "public"."comments"
  add constraint "comments_pkey" primary key using index "comments_pkey";

alter table "public"."comments"
  add constraint "comments_event_id_fkey" foreign key (event_id) references events (id) not valid;

alter table "public"."comments" validate constraint "comments_event_id_fkey";

alter table "public"."comments"
  add constraint "comments_profile_id_fkey" foreign key (profile_id) references profiles (id) not valid;

alter table "public"."comments" validate constraint "comments_profile_id_fkey";

alter table "public"."comments"
  add constraint "comments_content_length" check (((length(content) > 0) and (length(content) < 5000))) not valid;

alter table "public"."comments" validate constraint "comments_content_length";

alter table "public"."event_type_inputs"
  add constraint "event_type_inputs_pkey" primary key using index "event_type_inputs_pkey";

alter table "public"."event_type_inputs"
  add constraint "event_type_inputs_input_id_fkey" foreign key (input_id) references inputs (id) not valid;

alter table "public"."event_type_inputs" validate constraint "event_type_inputs_input_id_fkey";

alter table "public"."event_type_inputs"
  add constraint "event_type_inputs_event_type_id_fkey" foreign key (event_type_id) references event_types (id) not valid;

alter table "public"."event_type_inputs" validate constraint "event_type_inputs_event_type_id_fkey";

alter table "public"."event_type_inputs"
  add constraint "event_type_inputs_event_type_id_order_unique_constraint" unique using index "event_type_inputs_event_type_id_order_index";

alter table "public"."event_types"
  add constraint "event_types_subject_id_fkey" foreign key (subject_id) references subjects (id) not valid;

alter table "public"."event_types"
  add constraint "event_types_template_id_fkey" foreign key (template_id) references templates (id) not valid;

alter table "public"."event_types" validate constraint "event_types_subject_id_fkey";

alter table "public"."event_types"
  add constraint "event_types_subject_id_mission_id_type_order_unique_constraint" unique using index "event_types_subject_id_mission_id_type_order_index";

alter table "public"."event_types"
  add constraint "event_types_name_length" check (((length(name) > 0) and (length(name) < 50))) not valid;

alter table "public"."event_types" validate constraint "event_types_name_length";

alter table "public"."event_types"
  add constraint "event_types_content_length" check ((length(content) < 5000)) not valid;

alter table "public"."event_types" validate constraint "event_types_content_length";

alter table "public"."event_types"
  add constraint "event_types_pkey" primary key using index "event_types_pkey";

alter table "public"."event_types"
  add constraint "event_types_mission_id_fkey" foreign key (mission_id) references missions (id) not valid;

alter table "public"."event_types" validate constraint "event_types_mission_id_fkey";

alter table "public"."event_inputs"
  add constraint "event_inputs_pkey" primary key using index "event_inputs_pkey";

alter table "public"."event_inputs"
  add constraint "event_inputs_event_id_input_id_input_option_id_unique_constraint" unique using index "event_inputs_event_id_input_id_input_option_id_index";

alter table "public"."event_inputs"
  add constraint "event_inputs_event_id_fkey" foreign key (event_id) references events (id) not valid;

alter table "public"."event_inputs" validate constraint "event_inputs_event_id_fkey";

alter table "public"."event_inputs"
  add constraint "event_inputs_input_id_fkey" foreign key (input_id) references inputs (id) not valid;

alter table "public"."event_inputs" validate constraint "event_inputs_input_id_fkey";

alter table "public"."event_inputs"
  add constraint "event_inputs_input_option_id_fkey" foreign key (input_option_id) references input_options (id) not valid;

alter table "public"."event_inputs" validate constraint "event_inputs_input_option_id_fkey";

alter table "public"."events"
  add constraint "events_event_type_id_fkey" foreign key (event_type_id) references event_types (id) not valid;

alter table "public"."events" validate constraint "events_event_type_id_fkey";

alter table "public"."events"
  add constraint "events_subject_id_fkey" foreign key (subject_id) references subjects (id) not valid;

alter table "public"."events" validate constraint "events_subject_id_fkey";

alter table "public"."events"
  add constraint "events_pkey" primary key using index "events_pkey";

alter table "public"."input_options"
  add constraint "input_options_pkey" primary key using index "input_options_pkey";

alter table "public"."input_options"
  add constraint "input_options_input_id_fkey" foreign key (input_id) references inputs (id) not valid;

alter table "public"."input_options" validate constraint "input_options_input_id_fkey";

alter table "public"."input_options"
  add constraint "input_options_input_id_order_unique_constraint" unique using index "input_options_input_id_order_index";

alter table "public"."input_options"
  add constraint "input_options_label_length" check (((length(label) > 0) and (length(label) < 50))) not valid;

alter table "public"."input_options" validate constraint "input_options_label_length";

alter table "public"."inputs"
  add constraint "inputs_label_length" check (((length(label) > 0) and (length(label) < 50))) not valid;

alter table "public"."inputs" validate constraint "inputs_label_length";

alter table "public"."inputs"
  add constraint "inputs_team_id_fkey" foreign key (team_id) references teams (id) not valid;

alter table "public"."inputs" validate constraint "inputs_team_id_fkey";

alter table "public"."inputs"
  add constraint "inputs_pkey" primary key using index "inputs_pkey";

alter table "public"."missions"
  add constraint "missions_pkey" primary key using index "missions_pkey";

alter table "public"."missions"
  add constraint "missions_name_length" check (((length(name) > 0) and (length(name) < 50))) not valid;

alter table "public"."missions" validate constraint "missions_name_length";

alter table "public"."missions"
  add constraint "missions_subject_id_fkey" foreign key (subject_id) references subjects (id) not valid;

alter table "public"."missions" validate constraint "missions_subject_id_fkey";

alter table "public"."profiles"
  add constraint "profiles_first_name_length" check (((length(first_name) > 0) and (length(first_name) < 50))) not valid;

alter table "public"."profiles" validate constraint "profiles_first_name_length";

alter table "public"."profiles"
  add constraint "profiles_id_fkey" foreign key (id) references auth.users (id) not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."profiles"
  add constraint "profiles_last_name_length" check (((length(last_name) > 0) and (length(last_name) < 50))) not valid;

alter table "public"."profiles" validate constraint "profiles_last_name_length";

alter table "public"."profiles"
  add constraint "profiles_pkey" primary key using index "profiles_pkey";

alter table "public"."subject_managers"
  add constraint "subject_managers_pkey" primary key using index "subject_managers_pkey";

alter table "public"."subject_managers"
  add constraint "subject_managers_profile_id_fkey" foreign key (profile_id) references profiles (id) not valid;

alter table "public"."subject_managers" validate constraint "subject_managers_profile_id_fkey";

alter table "public"."subject_managers"
  add constraint "subject_managers_subject_id_fkey" foreign key (subject_id) references subjects (id) not valid;

alter table "public"."subject_managers" validate constraint "subject_managers_subject_id_fkey";

alter table "public"."subjects"
  add constraint "subjects_pkey" primary key using index "subjects_pkey";

alter table "public"."subjects"
  add constraint "subjects_image_uri_length" check ((length(image_uri) < 100)) not valid;

alter table "public"."subjects" validate constraint "subjects_image_uri_length";

alter table "public"."subjects"
  add constraint "subjects_name_length" check (((length(name) > 0) and (length(name) < 50))) not valid;

alter table "public"."subjects" validate constraint "subjects_name_length";

alter table "public"."subjects"
  add constraint "subjects_team_id_fkey" foreign key (team_id) references teams (id) not valid;

alter table "public"."subjects" validate constraint "subjects_team_id_fkey";

alter table "public"."team_members"
  add constraint "team_members_pkey" primary key using index "team_members_pkey";

alter table "public"."team_members"
  add constraint "team_members_profile_id_fkey" foreign key (profile_id) references profiles (id) not valid;

alter table "public"."team_members" validate constraint "team_members_profile_id_fkey";

alter table "public"."team_members"
  add constraint "team_members_team_id_fkey" foreign key (team_id) references teams (id) not valid;

alter table "public"."team_members" validate constraint "team_members_team_id_fkey";

alter table "public"."teams"
  add constraint "team_pkey" primary key using index "team_pkey";

alter table "public"."teams"
  add constraint "teams_name_length" check (((length(name) > 0) and (length(name) < 50))) not valid;

alter table "public"."teams" validate constraint "teams_name_length";

alter table "public"."teams"
  add constraint "teams_owner_fkey" foreign key (owner) references profiles (id) not valid;

alter table "public"."teams" validate constraint "teams_owner_fkey";

alter table "public"."templates"
  add constraint "templates_name_length" check (((length(name) > 0) and (length(name) < 50))) not valid;

alter table "public"."templates" validate constraint "templates_name_length";

alter table "public"."templates"
  add constraint "templates_pkey" primary key using index "templates_pkey";

alter table "public"."templates"
  add constraint "templates_team_id_fkey" foreign key (team_id) references teams (id) not valid;

alter table "public"."templates" validate constraint "templates_team_id_fkey";

set check_function_bodies = off;

create or replace function public.handle_insert_or_update_object ()
  returns trigger
  language plpgsql
  set search_path to 'public'
  as $$
  begin
    if (split_part(storage.filename (new.name), '.', 1) = 'image') then
      update
        public.subjects
      set image_uri = new.bucket_id || '/' || new.name || '?c=' || substr(md5(random()::text), 0, 5)
      where id::text = (storage.foldername (new.name))[1];
    end if;
    return new;
  end;
  $$;

create or replace function public.handle_insert_team ()
  returns trigger
  language plpgsql
  security definer
  as $$
  begin
    insert into public.team_members (team_id, profile_id)
      values (new.id, new.owner);
    return new;
  end;
  $$;

create or replace function public.handle_insert_user ()
  returns trigger
  language plpgsql
  security definer
  as $$
  begin
    insert into public.profiles (id, first_name, last_name)
      values (new.id, new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data ->> 'last_name');
    insert into public.teams (id, name, owner)
      values (new.id, 'Personal', new.id);
    return new;
  end;
  $$;

create or replace function public.handle_update_user ()
  returns trigger
  language plpgsql
  security definer
  as $$
  begin
    update
      public.profiles
    set (first_name,
        last_name) = (new.raw_user_meta_data ->> 'first_name',
        new.raw_user_meta_data ->> 'last_name')
    where id = new.id;
    return new;
  end;
  $$;

create trigger on_insert_or_update_object
  after insert or update on storage.objects
  for each row
  execute function handle_insert_or_update_object ();

create trigger on_insert_team
  after insert on public.teams
  for each row
  execute function handle_insert_team ();

create trigger on_insert_user
  after insert on auth.users
  for each row
  execute function handle_insert_user ();

create trigger on_update_user
  after insert on auth.users
  for each row
  execute function handle_update_user ();

create policy "Team members & subject managers can insert." on "public"."comments" as permissive
  for insert to public
    with check (profile_id = auth.uid ());

create policy "Team members & subject managers can select." on "public"."comments" as permissive
  for select to authenticated
    using ((exists (
      select 1
      from events e
      where (e.id = comments.event_id))));

create policy "Team members & subject managers can select." on "public"."event_type_inputs" as permissive
  for select to authenticated
    using ((exists (
      select 1
      from event_types et
      where (et.id = event_type_inputs.event_type_id))));

create policy "Team members can insert." on "public"."event_type_inputs" as permissive
  for insert to authenticated
    with check ((exists (
      select 1
      from team_members tm
      where (tm.team_id = (
        select s.team_id
        from subjects s
        where (s.id = (
          select et.subject_id
          from event_types et
          where (et.id = event_type_inputs.event_type_id))))))));

create policy "Team members can delete." on "public"."event_type_inputs" as permissive
  for delete to authenticated
    using ((exists (
      select 1
      from team_members tm
      where (tm.team_id = (
        select s.team_id
        from subjects s
        where (s.id = (
          select et.subject_id
          from event_types et
          where (et.id = event_type_inputs.event_type_id))))))));

create policy "Team members & subject managers can select." on "public"."event_types" as permissive
  for select to authenticated
    using ((exists (
      select 1
      from subjects s
      where (s.id = event_types.subject_id))));

create policy "Team members can insert." on "public"."event_types" as permissive
  for insert to authenticated
    with check ((exists (
      select 1
      from team_members tm
      where (tm.team_id = (
        select s.team_id
        from subjects s
        where (s.id = event_types.subject_id))))));

create policy "Team members can update." on "public"."event_types" as permissive
  for update to authenticated
    using ((exists (
      select 1
      from team_members tm
      where (tm.team_id = (
        select s.team_id
        from subjects s
        where (s.id = event_types.subject_id))))))
      with check ((exists (
        select 1
        from team_members tm
        where (tm.team_id = (
          select s.team_id
          from subjects s
          where (s.id = event_types.subject_id))))));

create policy "Team members & subject managers can delete." on "public"."event_inputs" as permissive
  for delete to authenticated
    using (true);

create policy "Team members & subject managers can insert." on "public"."event_inputs" as permissive
  for insert to authenticated
    with check (true);

create policy "Team members & subject managers can update." on "public"."event_inputs" as permissive
  for update to authenticated using (true)
    with check (true);

create policy "Team members & subject managers can select." on "public"."event_inputs" as permissive
  for select to authenticated
    using ((exists (
      select 1
      from events e
      where (event_inputs.event_id = e.id))));

create policy "Team members & subject managers can insert." on "public"."events" as permissive
  for insert to authenticated
    with check (profile_id = auth.uid ());

create policy "Team members & subject managers can update." on "public"."events" as permissive
  for update to authenticated using (profile_id = auth.uid ())
    with check (profile_id = auth.uid ());

create policy "Team members & subject managers can select." on "public"."events" as permissive
  for select to authenticated
    using ((exists (
      select 1
      from subjects s
      where (events.subject_id = s.id))));

create policy "Team members & subject managers can select." on "public"."input_options" as permissive
  for select to authenticated
    using ((exists (
      select 1
      from inputs
      where (input_options.input_id = inputs.id))));

create policy "Team members can insert." on "public"."input_options" as permissive
  for insert to authenticated
    with check ((exists (
      select 1
      from team_members tm
      where (tm.team_id = (
        select i.team_id
        from inputs i
        where (i.id = input_options.input_id))))));

create policy "Team members can update." on "public"."input_options" as permissive
  for update to authenticated
    using ((exists (
      select 1
      from team_members tm
      where (tm.team_id = (
        select i.team_id
        from inputs i
        where (i.id = input_options.input_id))))))
      with check ((exists (
        select 1
        from team_members tm
        where (tm.team_id = (
          select i.team_id
          from inputs i
          where (i.id = input_options.input_id))))));

create policy "Team members & subject managers can select." on "public"."inputs" as permissive
  for select to authenticated
    using (((exists (
      select 1
      from team_members tm
      where (tm.team_id = inputs.team_id))) or (exists (
        select 1
        from event_type_inputs eti
        where (eti.input_id = inputs.id)))));

create policy "Team members can insert." on "public"."inputs" as permissive
  for insert to authenticated
    with check ((exists (
      select 1
      from team_members tm
      where (tm.team_id = inputs.team_id))));

create policy "Team members can update." on "public"."inputs" as permissive
  for update to authenticated
    using ((exists (
      select 1
      from team_members tm
      where (tm.team_id = inputs.team_id))))
    with check ((exists (
      select 1
      from team_members tm
      where (tm.team_id = inputs.team_id))));

create policy "Team members & subject managers can select." on "public"."missions" as permissive
  for select to authenticated
    using (((exists (
      select 1
      from team_members tm
      where (tm.team_id = (
        select s.team_id
        from subjects s
        where (s.id = missions.subject_id))))) or (exists (
          select 1
          from subject_managers sm
          where (sm.subject_id = missions.subject_id)))));

create policy "Team members can insert." on "public"."missions" as permissive
  for insert to authenticated
    with check ((exists (
      select 1
      from team_members tm
      where (tm.team_id = (
        select s.team_id
        from subjects s
        where (s.id = missions.subject_id))))));

create policy "Team members can update." on "public"."missions" as permissive
  for update to authenticated
    using ((exists (
      select 1
      from team_members tm
      where (tm.team_id = (
        select s.team_id
        from subjects s
        where (s.id = missions.subject_id))))))
      with check ((exists (
        select 1
        from team_members tm
        where (tm.team_id = (
          select s.team_id
          from subjects s
          where (s.id = missions.subject_id))))));

create policy "Authenticated users can select." on "public"."profiles" as permissive
 for select to authenticated
   using (true);

create policy "Subject managers can select." on "public"."subject_managers" as permissive
  for select to authenticated
    using ((profile_id = auth.uid ()));

create policy "Team members & subject managers can select." on "public"."subjects" as permissive
  for select to authenticated
    using (((exists (
      select 1
      from team_members tm
      where (tm.team_id = subjects.team_id))) or (exists (
        select 1
        from subject_managers sm
        where (sm.subject_id = subjects.id)))));

create policy "Team members & subject managers can update." on "public"."subjects" as permissive
  for update to authenticated
    using (((exists (
      select 1
      from team_members tm
      where (tm.team_id = subjects.team_id))) or (exists (
        select 1
        from subject_managers sm
        where (sm.subject_id = subjects.id)))))
      with check (((exists (
        select 1
        from team_members tm
        where (tm.team_id = subjects.team_id))) or (exists (
          select 1
          from subject_managers sm
          where (sm.subject_id = subjects.id)))));

create policy "Team members can insert." on "public"."subjects" as permissive
  for insert to authenticated
    with check ((exists (
      select 1
      from team_members tm
      where (tm.team_id = subjects.team_id))));

create policy "Team members can select." on "public"."team_members" as permissive
  for select to authenticated
    using ((profile_id = auth.uid ()));

create policy "Team members & subject managers can insert." on "storage"."objects" as permissive
  for insert to authenticated
    with check ((((bucket_id = 'subjects'::text) and (exists (
      select 1 from team_members tm
      where ((tm.profile_id = auth.uid ()) and (tm.team_id = (
        select subjects.team_id
        from subjects
        where (subjects.id = ((storage.foldername (objects.name))[1])::uuid))))))) or (exists (
          select 1
          from subject_managers sm
          where ((sm.profile_id = auth.uid ()) and (sm.subject_id = ((storage.foldername (objects.name))[1])::uuid))))));

create policy "Team members & subject managers can select." on "storage"."objects" as permissive
  for select to authenticated
    using ((((bucket_id = 'subjects'::text) and (exists (
      select 1
      from team_members tm
      where ((tm.profile_id = auth.uid ()) and (tm.team_id = (
        select subjects.team_id
        from subjects
        where (subjects.id = ((storage.foldername (objects.name))[1])::uuid))))))) or (exists (
          select 1
          from subject_managers sm
          where ((sm.profile_id = auth.uid ()) and (sm.subject_id = ((storage.foldername (objects.name))[1])::uuid))))));

create policy "Team members & subject managers can update." on "storage"."objects" as permissive
  for update to authenticated
    using ((((bucket_id = 'subjects'::text) and (exists (
      select 1
      from team_members tm
      where ((tm.profile_id = auth.uid ()) and (tm.team_id = (
        select subjects.team_id
        from subjects
        where (subjects.id = ((storage.foldername (objects.name))[1])::uuid))))))) or (exists (
          select 1
          from subject_managers sm
          where ((sm.profile_id = auth.uid ()) and (sm.subject_id = ((storage.foldername (objects.name))[1])::uuid))))))
        with check ((((bucket_id = 'subjects'::text) and (exists (
          select 1
          from team_members tm
          where ((tm.profile_id = auth.uid ()) and (tm.team_id = (
            select subjects.team_id
            from subjects
            where (subjects.id = ((storage.foldername (objects.name))[1])::uuid))))))) or (exists (
              select 1
              from subject_managers sm
              where ((sm.profile_id = auth.uid ()) and (sm.subject_id = ((storage.foldername (objects.name))[1])::uuid))))));

create policy "Team members can delete." on "public"."templates" as permissive
  for delete to authenticated
    using ((exists (
      select 1
      from team_members tm
      where (tm.team_id = templates.team_id))));

create policy "Team members can insert." on "public"."templates" as permissive
  for insert to authenticated
    with check ((exists (
      select 1
      from team_members tm
      where (tm.team_id = templates.team_id))));

create policy "Team members can select." on "public"."templates" as permissive
  for select to authenticated
    using ((public or (exists (
      select 1
      from team_members tm
      where (tm.team_id = templates.team_id)))));

create policy "Team members can update." on "public"."templates" as permissive
  for update to authenticated
    using ((exists (
      select 1
      from team_members tm
      where (tm.team_id = templates.team_id))))
    with check ((exists (
      select 1
      from team_members tm
      where (tm.team_id = templates.team_id))));

insert into storage.buckets (id, name, public)
  values ('subjects', 'subjects', true);
