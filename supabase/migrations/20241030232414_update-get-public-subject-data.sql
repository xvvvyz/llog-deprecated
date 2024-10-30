create or replace function public.get_public_subject(public_subject_id uuid)
  returns json
  language plpgsql
  security definer
  as $$
  begin
    return (
      select json_build_object(
        'data', s.data,
        'id', s.id,
        'image_uri', s.image_uri,
        'name', s.name
      )
      from subjects s
      where s.id = public_subject_id and s.public = true
    );
  end;
  $$;
