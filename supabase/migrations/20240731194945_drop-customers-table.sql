drop policy "Owners can select." on "public"."customers";
alter table "public"."customers" drop constraint "public_customers_id_fkey";
alter table "public"."customers" drop constraint "customers_pkey";
drop index if exists "public"."customers_pkey";
drop table "public"."customers";
