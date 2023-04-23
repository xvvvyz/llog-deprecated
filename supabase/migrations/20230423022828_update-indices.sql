drop index if exists "public"."missions_subject_id_deleted_updated_at_index";
drop index if exists "public"."sessions_mission_id_deleted_order_index";

create index event_types_subject_id_session_id_deleted_type_order_index on public.event_types using btree (subject_id, session_id, deleted, type, "order");
create index events_event_type_id_index on public.events using btree (event_type_id);
create index missions_subject_id_deleted_name_index on public.missions using btree (subject_id, deleted, name);
create index sessions_mission_id_deleted_scheduled_for_order_index on public.sessions using btree (mission_id, deleted, scheduled_for, "order");
