create policy "Team members can delete." on "public"."events" as permissive
  for delete to authenticated
    using ((exists (
      select 1
      from team_members tm
      where ((tm.team_id = (
        select s.team_id
        from subjects s
        where (s.id = events.subject_id))) and (tm.profile_id = auth.uid ())))));
