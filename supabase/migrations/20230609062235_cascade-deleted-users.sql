alter table "public"."profiles"
  drop constraint "profiles_id_fkey";

alter table "public"."team_members"
  drop constraint "team_members_profile_id_fkey";

alter table "public"."teams"
  drop constraint "teams_owner_fkey";

alter table "public"."teams"
  alter column "owner" drop default;

alter table "public"."profiles"
  add constraint "profiles_id_fkey" foreign key (id) references auth.users (id) on delete cascade not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."team_members"
  add constraint "team_members_profile_id_fkey" foreign key (profile_id) references profiles (id) on delete cascade not valid;

alter table "public"."team_members" validate constraint "team_members_profile_id_fkey";

alter table "public"."teams"
  add constraint "teams_owner_fkey" foreign key (owner) references profiles (id) on delete cascade not valid;

alter table "public"."teams" validate constraint "teams_owner_fkey";
