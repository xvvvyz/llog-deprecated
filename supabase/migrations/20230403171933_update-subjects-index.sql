drop index if exists "public"."subjects_team_id_deleted_updated_at_index";
create index subjects_team_id_deleted_name_index on public.subjects using btree (team_id, deleted, name);
