alter type "public"."input_type" rename to "input_type__old_version_to_be_dropped";
create type "public"."input_type" as enum ('checkbox', 'duration', 'multi_select', 'number', 'select', 'stopwatch');
alter table "public"."inputs" alter column type type "public"."input_type" using type::text::"public"."input_type";
drop type "public"."input_type__old_version_to_be_dropped";

drop index if exists "public"."event_inputs_event_id_input_id_input_option_id_index";
create index event_inputs_event_id_input_id_input_option_id_index on public.event_inputs using btree (event_id, input_id, input_option_id);
