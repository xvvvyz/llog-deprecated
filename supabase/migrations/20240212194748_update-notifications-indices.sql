drop index if exists "public"."notifications_created_at_index";
drop index if exists "public"."notifications_read_index";
create index notifications_read_created_at_index on public.notifications using btree (read, created_at desc);
