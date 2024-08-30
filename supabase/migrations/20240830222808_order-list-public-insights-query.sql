create or replace function public.list_public_insights(public_subject_id uuid)
  returns json
  language plpgsql
  security definer
as $$
declare
  result json;
begin
  select json_agg(insight)
  into result
  from (
    select json_build_object(
      'config', i.config,
      'id', i.id,
      'name', i.name,
      'order', i."order"
    ) as insight
    from insights i
    join subjects s on i.subject_id = s.id
    where i.subject_id = public_subject_id and s.public = true
    order by i."order"
  ) as ordered_insights;
  return result;
end;
$$;
