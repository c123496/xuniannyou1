# Paper Boyfriend First Slice Design

## Scope

Build the first runnable slice of Paper Boyfriend in the empty `xuniannyou1` repository. This slice proves the main product path without taking on payment, email recovery, long-term memory, image generation, or production database work yet.

The login requirement is Google only. Apple login and password login are out of scope.

## User Flow

1. A visitor opens `/` and sees a quiet landing/login screen.
2. The visitor signs in with Google.
3. After sign-in, the user lands on `/home`.
4. `/home` shows four boyfriend cards: Shen Xingzhou, Gu Chengye, Lin Ting, and Zhou Yan.
5. Selecting a card opens `/chat/[boyfriend_id]`.
6. The chat page shows a relationship-oriented chat shell with starter messages and a disabled/mock response path until the LLM is connected.

## Architecture

Use Next.js App Router as the product foundation. Auth.js handles Google OAuth with a JWT session for the first slice, so the app can run before PostgreSQL is added.

Character data lives in a local typed seed module. This keeps the first version simple and gives the future database seed script a clear source of truth.

Protected pages check `auth()` on the server. Unauthenticated users are redirected to `/`.

## Components

- `src/app/page.tsx`: login/landing page.
- `src/app/home/page.tsx`: protected character list.
- `src/app/chat/[boyfriendId]/page.tsx`: protected chat shell.
- `components/auth-buttons.tsx`: sign in and sign out controls.
- `src/lib/boyfriends.ts`: four static boyfriend definitions.
- `src/auth.ts`: Auth.js Google-only configuration.
- `src/app/api/auth/[...nextauth]/route.ts`: Auth.js route handlers.

## Data

First slice data is static:

- `id`
- `name`
- `age`
- `positioning`
- `tags`
- `openingLine`
- `tone`

Future slices will move this into PostgreSQL and add relationships, messages, quota, and summaries.

## Error Handling

Missing Google OAuth environment variables should not crash local UI work. The app will include `.env.example` and clear placeholder names so the user can add real credentials when ready.

Unknown `boyfriendId` routes show `notFound()`.

## Testing And Verification

Use a minimal test setup for pure logic first:

- Test character lookup by id.
- Test invalid ids return `undefined`.

Then verify:

- `npm run lint`
- `npm test`
- `npm run build`
- Start the dev server and open the app locally.
