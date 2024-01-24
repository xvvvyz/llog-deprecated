create index sessions_mission_id_order_draft_index on public.sessions using btree (mission_id, "order", draft);
