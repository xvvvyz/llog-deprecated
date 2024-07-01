drop index if exists "public"."subjects_id_deleted_index";
drop index if exists "public"."subjects_team_id_deleted_name_index";
alter table "public"."subjects" add column "archived" boolean not null default false;
create index subjects_team_id_deleted_archived_name_index on public.subjects using btree (team_id, deleted, name, archived);
