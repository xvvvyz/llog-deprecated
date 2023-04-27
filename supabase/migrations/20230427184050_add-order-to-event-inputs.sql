drop index if exists "public"."event_inputs_event_id_input_id_input_option_id_index";
drop index if exists "public"."event_inputs_input_id_index";
drop index if exists "public"."event_inputs_input_option_id_index";

alter table "public"."event_inputs" add column "order" smallint;
create index event_inputs_event_id_order_index on public.event_inputs using btree (event_id, "order");
