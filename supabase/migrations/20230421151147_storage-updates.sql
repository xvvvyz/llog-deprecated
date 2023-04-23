drop function if exists "storage"."can_insert_object"(bucketid text, name text, owner uuid, metadata jsonb);

alter table "storage"."objects" drop column "version";
