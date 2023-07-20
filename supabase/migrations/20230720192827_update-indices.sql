drop index if exists "public"."events_event_type_id_index";
drop index if exists "public"."events_subject_id_created_at_index";
drop index if exists "public"."sessions_mission_id_deleted_draft_order_scheduled_for_index";
create index events_event_type_id_created_at_index on public.events using btree (event_type_id, created_at);
create index sessions_mission_id_deleted_order_draft_scheduled_for_index on public.sessions using btree (mission_id, deleted, "order" desc, draft, scheduled_for);
create index events_subject_id_created_at_index on public.events using btree (subject_id, created_at desc);
