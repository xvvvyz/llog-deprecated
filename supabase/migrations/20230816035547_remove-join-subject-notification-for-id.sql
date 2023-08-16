create or replace function join_subject_as_manager (share_code text)
  returns void
  language plpgsql
  security definer
  as $$
    # variable_conflict use_variable
  declare
    existing_manager boolean;
    profile_id uuid;
    subject_id uuid;
    team_member_profile_ids uuid[];
  begin
    select id into subject_id
      from subjects
      where subjects.share_code = share_code;
    if subject_id is not null then
      select exists(select true from subject_managers
        where profile_id = auth.uid() and subject_id = subject_id)
        into existing_manager;
      if not existing_manager then
        insert into subject_managers (profile_id, subject_id)
          values (auth.uid(), subject_id);
        if auth.uid() != '70045ed0-b03c-46d8-a784-e05c15a770af' then
          select array_agg(tm.profile_id) into team_member_profile_ids
            from subjects s join team_members tm on s.team_id = tm.team_id
            where s.id = subject_id;
          for profile_id in (select unnest(team_member_profile_ids)) loop
            insert into notifications (profile_id, type, source_profile_id, source_subject_id)
              values (profile_id, 'join_subject', auth.uid (), subject_id);
          end loop;
        end if;
      end if;
    end if;
  end;
  $$;
