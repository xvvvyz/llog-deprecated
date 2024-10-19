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
NEXT_PUBLIC_SUPABASE_ANON_KEY=<SUPABASE_ANON_KEY>
NEXT_PUBLIC_SUPABASE_URL=<SUPABSE_API_URL>
SUPABASE_SERVICE_KEY=<SUPABASE_SERVICE_KEY>
```

Generate types and start the dev server:

```shell
bun db:types
bun dev
```

If you modify the database schema:

```shell
bun db:types
bun db:diff -- -f migration-description
```

## Production Notes

Vercel common secrets:

- LEMON_SQUEEZY_STORE_ID

Vercel environment secrets:

- LEMON_SQUEEZY_API_KEY
- LEMON_SQUEEZY_VARIANT_ID_PRO
- LEMON_SQUEEZY_VARIANT_ID_TEAM
- LEMON_SQUEEZY_WEBHOOK_SECRET
- RESEND_API_KEY
- SUPABASE_SERVICE_KEY

GitHub repo secrets:

- SUPABASE_ACCESS_TOKEN
- VERCEL_ORG_ID
- VERCEL_PROJECT_ID
- VERCEL_TOKEN

GitHub environment secrets:

- NEXT_PUBLIC_SUPABASE_ANON_KEY
- NEXT_PUBLIC_SUPABASE_URL
- SUPABASE_DB_PASSWORD
- SUPABASE_PROJECT_ID

Supabase settings:

- Add custom SMTP server
- Update auth providers
- Update email templates
- Update url config
- Enable realtime (notifications table)
- Remove GraphQL api

Other settings:

- Update next.config.js remotePatterns
