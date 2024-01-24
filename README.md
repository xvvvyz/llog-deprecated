# llog

## Development Setup

Install [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git),
[Node](https://nodejs.org/en/download), [bun](https://bun.sh/docs/installation)
and [Docker](https://docs.docker.com/engine/install), then:

```shell
git clone git@github.com:xvvvyz/llog.git
cd llog
bun i
bun db:start # outputs supabase url & key
```

Add the following to your `.env` file:

```dotenv
# required
NEXT_PUBLIC_SUPABASE_ANON_KEY=<SUPABASE_ANON_KEY>
NEXT_PUBLIC_SUPABASE_URL=<SUPABSE_API_URL>

# optional
NEXT_PUBLIC_SUPABASE_PRO=1
```

Generate types and start the dev server:

```shell
bun db:types
bun start
```

If you modify the database schema:

```shell
bun db:types
bun db:diff -- migration-description
```

## Production Notes

- Update next.config.js remotePatterns
- Update auth providers
- Update email templates
- Update url config
- Add custom SMTP server
- Enable realtime (notifications)
- Remove GraphQL api
- Github environment secrets:
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
  - NEXT_PUBLIC_SUPABASE_PRO
  - NEXT_PUBLIC_SUPABASE_URL
  - SUPABASE_DB_PASSWORD
  - SUPABASE_PROJECT_ID
