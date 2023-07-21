drop index if exists "public"."sessions_mission_id_deleted_order_draft_scheduled_for_index";
create index sessions_mission_id_deleted_order_draft_scheduled_for_index on public.sessions using btree (mission_id, deleted, "order", draft desc, scheduled_for);
