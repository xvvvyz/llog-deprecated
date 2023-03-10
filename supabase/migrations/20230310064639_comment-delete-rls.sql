create policy "Owners can delete." on "public"."comments" as permissive
  for delete to authenticated
    using ((profile_id = auth.uid ()));
