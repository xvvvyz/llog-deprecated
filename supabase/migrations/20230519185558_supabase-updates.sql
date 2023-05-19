create type "auth"."code_challenge_method" as enum (
    's256',
    'plain'
    );

drop index if exists "auth"."refresh_tokens_token_idx";

create table "auth"."flow_state" (
  "id" uuid not null,
  "user_id" uuid,
  "auth_code" text not null,
  "code_challenge_method" auth.code_challenge_method not null,
  "code_challenge" text not null,
  "provider_type" text not null,
  "provider_access_token" text,
  "provider_refresh_token" text,
  "created_at" timestamp with time zone,
  "updated_at" timestamp with time zone,
  "authentication_method" text not null
);

create unique index flow_state_pkey on auth.flow_state using btree (id);
create index idx_auth_code on auth.flow_state using btree (auth_code);
create index idx_user_id_auth_method on auth.flow_state using btree (user_id, authentication_method);
alter table "auth"."flow_state" add constraint "flow_state_pkey" primary key using index "flow_state_pkey";
set check_function_bodies = off;

create or replace function storage.can_insert_object (bucketid text, name text, owner uuid, metadata jsonb)
  returns void
  language plpgsql
  as $function$
  begin
    insert into "storage"."objects" ("bucket_id", "name", "owner", "metadata")
    values (bucketid, name, owner, metadata);
    -- hack to rollback the successful insert
    raise sqlstate 'PT200'
      using message = 'ROLLBACK', detail = 'rollback successful insert';
  end
  $function$;
