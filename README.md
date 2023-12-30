# llog

> The ultimate platform for behavior consultants.

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
# required
NEXT_PUBLIC_SUPABASE_ANON_KEY=<SUPABASE_ANON_KEY>
NEXT_PUBLIC_SUPABASE_URL=<SUPABSE_API_URL>

# optional
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
- Add custom SMTP server
- Enable realtime
- Github environment secrets:
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
  - NEXT_PUBLIC_SUPABASE_PRO
  - NEXT_PUBLIC_SUPABASE_URL
  - SUPABASE_DB_PASSWORD
  - SUPABASE_PROJECT_ID

### Email Templates

<!-- prettier-ignore -->
```html
Hello,<br><br>Here is the link: <a href="{{ .ConfirmationURL }}">reset your password</a>.<br><br>If you did not make this request, ignore this email.<br><br>Best,<br>The llog team<style>div{padding:0!important}#made-with-supabase{display:none!important}</style>
```

<!-- prettier-ignore -->
```html
Hello,<br><br>Please <a href="{{ .ConfirmationURL }}">confirm your email address</a>.<br><br>If you did not sign up for llog, ignore this email.<br><br>Best,<br>The llog team<style>div{padding:0!important}#made-with-supabase{display:none!important}</style>
```

<!-- prettier-ignore -->
```html
Hello,<br><br>Please <a href="{{ .ConfirmationURL }}">confirm your new email address</a>.<br><br>If you did not initiate this change, ignore this email.<br><br>Best,<br>The llog team<style>div{padding:0!important}#made-with-supabase{display:none!important}</style>
```
