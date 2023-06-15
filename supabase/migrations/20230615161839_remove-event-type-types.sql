drop index if exists "public"."event_types_subject_id_session_id_deleted_type_order_index";
drop index if exists "public"."templates_team_id_type_name_index";
alter table "public"."event_types" drop column "type";
alter table "public"."templates" drop column "type";
drop type "public"."event_type";
drop type "public"."template_type";
create index event_types_subject_id_session_id_deleted_order_index on public.event_types using btree (subject_id, session_id, deleted, "order");
