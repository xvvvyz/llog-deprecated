alter table "public"."sessions" add column "draft" boolean not null default false;

drop index if exists "public"."sessions_mission_id_deleted_scheduled_for_order_index";

create index sessions_mission_id_deleted_draft_order_scheduled_for_index on public.sessions using btree (mission_id, deleted, draft, "order", scheduled_for);
