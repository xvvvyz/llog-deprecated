alter table "public"."insights" add column "order" smallint;
create index insights_subject_id_order_index on public.insights using btree (subject_id, "order");
