drop index if exists "public"."inputs_team_id_deleted_updated_at_index";
create index inputs_team_id_deleted_label_index on public.inputs using btree (team_id, deleted, label);
