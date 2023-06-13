alter table "public"."subject_managers" drop constraint "subject_managers_profile_id_fkey";
alter table "public"."subject_managers" add constraint "subject_managers_profile_id_fkey" foreign key (profile_id) references profiles(id) on delete cascade not valid;
alter table "public"."subject_managers" validate constraint "subject_managers_profile_id_fkey";
