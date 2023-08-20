# llog

> Collaborative, data-driven behavior modification.

## Development Setup

Install [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git),
[Node](https://nodejs.org/en/download), [pnpm](https://pnpm.io/installation) and
[Docker](https://docs.docker.com/engine/install), then:

```shell
git clone git@github.com:xvvvyz/llog.git
cd llog
pnpm i
pnpm run db:start # outputs supabase url & key
```

Add the following to your `.env` file:

```dotenv
CRISP_SECRET_KEY=<CRISP_SECRET_KEY>
OPENAI_API_KEY=<OPENAI_API_KEY>

NEXT_PUBLIC_CRISP_WEBSITE_ID=<CRISP_WEBSITE_ID>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<SUPABASE_ANON_KEY>
NEXT_PUBLIC_SUPABASE_URL=<SUPABSE_API_URL>

# optimize images with supabase instead of next
NEXT_PUBLIC_SUPABASE_PRO=1
```

Generate types and start the dev server:

```shell
pnpm run db:types
pnpm start
```

If you modify the database schema:

```shell
pnpm run db:types
pnpm run db:diff -- migration-description
```

## Production Notes

- Update next.config.js remotePatterns
- Update auth providers
- Update email templates
- Update url config
- Enable realtime
