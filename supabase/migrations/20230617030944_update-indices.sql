drop index if exists "public"."event_types_subject_id_session_id_deleted_order_index";

create index event_types_subject_id_session_id_deleted_name_index on public.event_types using btree (subject_id, session_id, deleted, name);

create index subjects_id_deleted_index on public.subjects using btree (id, deleted);
