drop policy "Team members can delete." on "public"."templates";
drop policy "Team members can insert." on "public"."templates";
drop policy "Team members can select." on "public"."templates";
drop policy "Team members can update." on "public"."templates";

create policy "Team members = full access." on "public"."templates" as permissive
  for all to authenticated
    using ((exists (
      select 1
      from team_members tm
      where ((tm.team_id = templates.team_id) and (tm.profile_id = auth.uid ())))));
