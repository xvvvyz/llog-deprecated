create type "public"."template_type" as enum ('event_type', 'module', 'session', 'training_plan');
alter table "public"."templates" add column "type" template_type not null default 'event_type'::template_type;
alter table "public"."templates" alter column "type" drop default;
drop index if exists "public"."templates_team_id_name_index";
create unique index templates_team_id_type_name_index on public.templates using btree (team_id, type, name);
