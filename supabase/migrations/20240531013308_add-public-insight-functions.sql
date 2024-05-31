create or replace function public.list_public_insights(public_subject_id uuid)
  returns json
  language plpgsql
  security definer
  as $$
declare
  result json;
begin
  select json_agg(
    json_build_object(
      'config', i.config,
      'id', i.id,
      'name', i.name
    )
  )
  into result
  from insights i
  join subjects s on i.subject_id = s.id
  where i.subject_id = public_subject_id and s.public = true;
  return result;
end;
$$;

create or replace function public.list_input_labels_by_id(ids uuid[])
  returns jsonb
  language plpgsql
  security definer
  as $$
declare
  result jsonb;
begin
  select jsonb_agg( -- Use JSONB functions
    jsonb_build_object(
      'id', i.id,
      'label', i.label
    )
  )
  into result
  from inputs i
  where i.id = any(ids);
  return result;
end;
$$;

create or replace function public.get_public_insight(public_insight_id uuid)
  returns json
  language plpgsql
  security definer
  as $$
  begin
    return (
      select json_build_object(
        'config', i.config,
        'id', i.id,
        'name', i.name
      )
      from insights i
      join subjects s on i.subject_id = s.id
      where i.id = public_insight_id and s.public = true
    );
  end;
  $$;
