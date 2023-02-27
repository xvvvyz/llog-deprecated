alter table "public"."input_options" drop constraint "input_options_label_length";
alter table "public"."input_options" add constraint "input_options_label_length" check (length(label) > 0) not valid;
