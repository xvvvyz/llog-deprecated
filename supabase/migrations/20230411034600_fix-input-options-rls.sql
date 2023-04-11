drop policy "Team members can insert." on "public"."input_options";

create policy "Team members & subject managers can insert." on "public"."input_options" as permissive
  for insert to authenticated
    with check ((exists (
      select 1
      from inputs
      where (input_options.input_id = inputs.id))));
