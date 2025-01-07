alter table "public"."templates"
    add column "source_id" uuid;

alter table "public"."templates"
    add column "updated_at" timestamp with time zone default (now() AT TIME ZONE 'utc'::text);

create index templates_public_updated_at_index on public.templates using btree (public, updated_at);

alter table "public"."templates"
    add constraint "templates_source_id_fkey" foreign key (source_id) references templates (id) on update cascade on delete set null not valid;

alter table "public"."templates" validate constraint "templates_source_id_fkey";

create or replace function public.list_community_templates()
  returns json
  language plpgsql
  security definer
  as $$
  begin
    return (
      select coalesce(
        json_agg(
          json_build_object(
            'id', t.id,
            'name', t.name,
            'type', t.type,
            'updated_at', t.updated_at,
            'author', json_build_object(
              'first_name', p.first_name,
              'id', p.id,
              'image_uri', p.image_uri,
              'last_name', p.last_name
            )
          )
          order by t.updated_at
        ), '[]'::json
      )
      from templates t
      left join profiles p on t.author = p.id
      where t.public = true
    );
  end;
  $$;

create or replace function public.get_community_template(public_template_id uuid)
  returns json
  language plpgsql
  security definer
  as $$
  declare
    template_data json;
    input_ids uuid[];
    inputs json;
    template_type text;
  begin
    select json_build_object(
        'author', json_build_object(
          'first_name', p.first_name,
          'id', p.id,
          'image_uri', p.image_uri,
          'last_name', p.last_name
        ),
        'data', t.data,
        'description', t.description,
        'id', t.id,
        'name', t.name,
        'source_id', t.source_id,
        'type', t.type,
        'updated_at', t.updated_at
      ),
      t.type
      into template_data, template_type
      from templates t
      left join profiles p on t.author = p.id
      where t.id = public_template_id and t.public = true;

    if template_data is not null then
      case template_type
        when 'event_type' then
          input_ids := (select array(select jsonb_array_elements_text((template_data->'data'->>'inputIds')::jsonb)::uuid));
        when 'module' then
          input_ids := (select array(select jsonb_array_elements_text((template_data->'data'->>'inputIds')::jsonb)::uuid));
        when 'session' then
          input_ids := (select array(
            select jsonb_array_elements_text(mod->>'inputIds')::uuid
              from jsonb_array_elements(template_data->'data'->'modules') as mod
          ));
        when 'protocol' then
          input_ids := (select array(
            select jsonb_array_elements_text(mod->>'inputIds')::uuid
              from jsonb_array_elements(template_data->'data'->'sessions') as session,
              jsonb_array_elements(session->'modules') as mod
          ));
        else
          input_ids := '{}';
      end case;
    else
      input_ids := '{}';
    end if;

    if input_ids is not null and array_length(input_ids, 1) > 0 then
      select json_agg(json_build_object('id', i.id, 'label', i.label, 'type', i.type))
        into inputs
        from inputs i
        where i.id = any(input_ids) and i.archived = false;
    else
      inputs := '[]'::json;
    end if;

    return json_build_object(
      'template', template_data,
      'inputs', inputs
    );
  end;
  $$;
