drop index if exists "public"."templates_team_id_type_updated_at_index";
create index templates_team_id_type_name_index on public.templates using btree (team_id, type, name);
