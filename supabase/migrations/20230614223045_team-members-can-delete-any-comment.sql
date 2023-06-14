drop policy "Owners can delete." on "public"."comments";

create policy "Owners and team members can delete." on "public"."comments" as permissive
  for delete to authenticated
    using (((profile_id = auth.uid ()) or (exists (
      select 1
      from team_members tm
      where ((tm.team_id = (
        select s.team_id
        from subjects s
        where (s.id = (
          select e.subject_id
          from events e
          where (e.id = comments.event_id))))) and (tm.profile_id = auth.uid ()))))));
