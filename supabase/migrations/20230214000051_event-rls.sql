drop policy "Owners can update." on "public"."events";

alter table "public"."events" add constraint "events_profile_id_fkey" foreign key (profile_id) references profiles (id) not valid;
alter table "public"."events" validate constraint "events_profile_id_fkey";

create policy "Team members & subject managers can update." on "public"."events" as permissive
  for update to authenticated
    using (true)
    with check (true);
