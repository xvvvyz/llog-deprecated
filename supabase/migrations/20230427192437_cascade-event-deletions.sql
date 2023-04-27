alter table "public"."comments" drop constraint "comments_event_id_fkey";
alter table "public"."event_inputs" drop constraint "event_inputs_event_id_fkey";
alter table "public"."comments" add constraint "comments_event_id_fkey" foreign key (event_id) references events(id) on delete cascade not valid;
alter table "public"."comments" validate constraint "comments_event_id_fkey";
alter table "public"."event_inputs" add constraint "event_inputs_event_id_fkey" foreign key (event_id) references events(id) on delete cascade not valid;
alter table "public"."event_inputs" validate constraint "event_inputs_event_id_fkey";
