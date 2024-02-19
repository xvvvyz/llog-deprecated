drop policy "Team members & subject managers can insert." on "storage"."objects";
drop policy "Team members & subject managers can select." on "storage"."objects";
drop policy "Team members & subject managers can update." on "storage"."objects";

drop policy "Authenticated users can select." on "storage"."objects";
drop policy "Owners can insert." on "storage"."objects";
drop policy "Owners can update." on "storage"."objects";

create policy "Team members can insert (subjects)." on "storage"."objects" as permissive
  for insert to authenticated
    with check ((bucket_id = 'subjects'::text) and (exists (
      select 1
      from team_members tm
      where ((tm.profile_id = auth.uid ()) and (tm.team_id = (
        select subjects.team_id
        from subjects
        where (subjects.id = ((storage.foldername (objects.name))[1])::uuid)))))));

create policy "Team members can delete (subjects)." on "storage"."objects" as permissive
  for delete to authenticated
    using ((bucket_id = 'subjects'::text) and (exists (
      select 1
      from team_members tm
      where ((tm.profile_id = auth.uid ()) and (tm.team_id = (
        select subjects.team_id
        from subjects
        where (subjects.id = ((storage.foldername (objects.name))[1])::uuid)))))));

create policy "Team members & subject managers can select (subjects)." on "storage"."objects" as permissive
    for select to authenticated
    using ((bucket_id = 'subjects'::text) and (exists (
    select 1
    from team_members tm
    where ((tm.profile_id = auth.uid ()) and (tm.team_id = (
        select subjects.team_id
        from subjects
        where (subjects.id = ((storage.foldername (objects.name))[1])::uuid))))) or (exists (
    select 1
    from subject_managers sm
    where ((sm.profile_id = auth.uid ()) and (sm.subject_id = ((storage.foldername (objects.name))[1])::uuid))))));

create policy "Team members can update (subjects)." on "storage"."objects" as permissive
  for update to authenticated
    using ((bucket_id = 'subjects'::text) and (exists (
      select 1
      from team_members tm
      where ((tm.profile_id = auth.uid ()) and (tm.team_id = (
        select subjects.team_id
        from subjects
        where (subjects.id = ((storage.foldername (objects.name))[1])::uuid)))))))
        with check ((bucket_id = 'subjects'::text) and (exists (
          select 1
          from team_members tm
          where ((tm.profile_id = auth.uid ()) and (tm.team_id = (
            select subjects.team_id
            from subjects
            where (subjects.id = ((storage.foldername (objects.name))[1])::uuid)))))));

create policy "Everyone can select (profiles)." on "storage"."objects" as permissive
  for select using (bucket_id = 'profiles'::text);

create policy "Owners can insert (profiles)." on "storage"."objects" as permissive
  for insert to authenticated with check ((bucket_id = 'profiles'::text) and (auth.uid() = ((storage.foldername(name))[1])::uuid));

create policy "Owners can delete (profiles)." on "storage"."objects" as permissive
  for delete to authenticated using ((bucket_id = 'profiles'::text) and (auth.uid() = ((storage.foldername(name))[1])::uuid));

create policy "Owners can update (profiles)." on "storage"."objects" as permissive
  for update to authenticated using ((bucket_id = 'profiles'::text) and (auth.uid() = ((storage.foldername(name))[1])::uuid))
  with check ((bucket_id = 'profiles'::text) and (auth.uid() = ((storage.foldername(name))[1])::uuid));
