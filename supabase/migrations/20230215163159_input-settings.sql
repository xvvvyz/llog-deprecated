alter table "public"."inputs" add column "settings" jsonb;

drop policy "Team members can insert." on "public"."inputs";

create policy "Team members & subject managers can insert." on "public"."inputs" as permissive
  for insert to authenticated
    with check (((exists (
      select 1
      from team_members tm
      where ((tm.team_id = inputs.team_id) and (tm.profile_id = auth.uid ())))) or (exists (
        select 1
        from event_type_inputs eti
        where (eti.input_id = inputs.id)))));
