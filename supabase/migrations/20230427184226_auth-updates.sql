alter table "auth"."flow_state" drop constraint "flow_state_pkey";
drop index if exists "auth"."flow_state_pkey";
drop index if exists "auth"."idx_auth_code";
drop index if exists "auth"."idx_user_id_auth_method";
drop table "auth"."flow_state";
drop type "auth"."code_challenge_method";
create index refresh_tokens_token_idx on auth.refresh_tokens using btree (token);
