create unique index event_types_subject_id_name_index on public.event_types using btree (subject_id, name);
create unique index missions_subject_id_name_index on public.missions using btree (subject_id, name);
