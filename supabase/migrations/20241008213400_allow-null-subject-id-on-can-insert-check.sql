drop policy "Team members can insert." on "public"."subjects";
drop function public.can_insert_subject_on_current_plan(subject_id uuid);

create or replace function public.can_insert_subject_on_current_plan (subject_id uuid default null)
  returns boolean
  language plpgsql
  as $$
  declare
    subject_count int;
    subscription_status text;
  begin
    select count(*)
      into subject_count
      from subjects s
      where s.team_id = auth.uid()
        and s.deleted = false
        and s.archived = false
        and s.id is distinct from subject_id;
    select coalesce(auth.jwt() -> 'app_metadata' ->> 'subscription_status')
      into subscription_status;
    return (subject_count < 2 or subscription_status = 'active') is true;
  end;
  $$;

  create policy "Team members can insert." on "public"."subjects" as permissive
  for insert to authenticated
    with check (((exists (
      select 1
      from team_members tm
      where ((tm.team_id = subjects.team_id) and (tm.profile_id = auth.uid())))) and (not is_client()) and can_insert_subject_on_current_plan(id)));
