create type "public"."subscription_status" as enum ('active', 'expired');

create table "public"."customers" (
  "id" uuid not null,
  "customer_id" text not null,
  "subscription_status" subscription_status not null
);

alter table "public"."customers" enable row level security;
create unique index customers_pkey on public.customers using btree (id);
alter table "public"."customers" add constraint "customers_pkey" primary key using index "customers_pkey";
alter table "public"."customers" add constraint "public_customers_id_fkey" foreign key (id) references auth.users(id) on update cascade on delete cascade not valid;
alter table "public"."customers" validate constraint "public_customers_id_fkey";

create policy "Owners can select."
  on "public"."customers"
  as permissive
  for select
  to authenticated
  using ((id = auth.uid()));
