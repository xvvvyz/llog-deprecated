update public.sessions set title = null where title = '';
alter table "public"."sessions" add constraint "sessions_title_length" check (((length(title) > 0) and (length(title) < 50))) not valid;
alter table "public"."sessions" validate constraint "sessions_title_length";
