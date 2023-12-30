alter table "public"."profiles" add column "image_uri" text;

create or replace function public.handle_insert_or_update_object ()
  returns trigger
  language plpgsql
  security definer
  set search_path to 'public'
  as $$
  begin
    if (new.bucket_id = 'subjects' and storage.filename (new.name) = 'avatar') then
      update public.subjects
        set image_uri = new.bucket_id || '/' || new.name || '?c=' || substr(md5(random()::text), 0, 5)
        where id::text = (storage.foldername (new.name))[1];
    end if;
    if (new.bucket_id = 'profiles' and storage.filename (new.name) = 'avatar') then
      update auth.users
        set raw_user_meta_data = jsonb_set(raw_user_meta_data, '{image_uri}', to_jsonb (new.bucket_id || '/' || new.name || '?c=' || substr(md5(random()::text), 0, 5)))
        where id::text = (storage.foldername (new.name))[1];
    end if;
    return new;
  end;
  $$;

create or replace function public.handle_update_user ()
  returns trigger
  language plpgsql
  security definer
  as $$
  begin
    update public.profiles
      set (first_name, last_name, image_uri) = (new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data ->> 'last_name', new.raw_user_meta_data ->> 'image_uri')
      where id = new.id;
    return new;
  end;
  $$;

drop trigger on_update_user on auth.users;

create trigger on_update_user
  after update on auth.users
  for each row
  execute function handle_update_user();

insert into storage.buckets (id, name, public)
  values ('profiles', 'profiles', true);

create policy "Authenticated users can select." on "storage"."objects" as permissive
  for select to authenticated using (bucket_id = 'profiles'::text);

create policy "Owners can insert." on "storage"."objects" as permissive
  for insert to authenticated with check ((bucket_id = 'profiles'::text) and (auth.uid() = ((storage.foldername(name))[1])::uuid));

create policy "Owners can update." on "storage"."objects" as permissive
  for update to authenticated using ((bucket_id = 'profiles'::text) and (auth.uid() = ((storage.foldername(name))[1])::uuid))
  with check ((bucket_id = 'profiles'::text) and (auth.uid() = ((storage.foldername(name))[1])::uuid));
