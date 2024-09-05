alter table "public"."templates" add column "author" uuid default auth.uid();
alter table "public"."templates" add column "description" text;
alter table "public"."templates" add constraint "templates_author_fkey" foreign key (author) references profiles(id) on update cascade on delete cascade not valid;
alter table "public"."templates" validate constraint "templates_author_fkey";
update "public"."templates" set "author" = "team_id";
alter table "public"."templates" alter column "author" set not null;
