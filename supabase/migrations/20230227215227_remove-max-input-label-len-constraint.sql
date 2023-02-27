alter table "public"."inputs" drop constraint "inputs_label_length";
alter table "public"."inputs" add constraint "inputs_label_length" check (length(label) > 0) not valid;
