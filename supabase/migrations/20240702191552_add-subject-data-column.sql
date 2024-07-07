alter table subjects add column "data" jsonb;
update subjects set data = '{}' where data is null;
update subjects set data = jsonb_set(data, '{banner}', to_jsonb(banner)) where banner is not null;
alter table subjects drop column banner;

create or replace function public.get_public_subject(public_subject_id uuid)
  returns json
  language plpgsql
  security definer
  as $$
  begin
    return (
      select json_build_object(
        'id', s.id,
        'image_uri', s.image_uri,
        'name', s.name
      )
      from subjects s
      where s.id = public_subject_id and s.public = true
    );
  end;
  $$;
