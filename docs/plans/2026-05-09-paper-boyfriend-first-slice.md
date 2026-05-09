# Paper Boyfriend First Slice Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a runnable Next.js App Router foundation for Paper Boyfriend with Google-only login, `/home`, and `/chat/[boyfriend_id]`.

**Architecture:** Use Next.js App Router with Auth.js and Google Provider. Keep character data in a typed local seed module for now, and protect product pages with server-side `auth()` checks.

**Tech Stack:** Next.js, React, TypeScript, Auth.js, Vitest, Testing Library, CSS Modules/global CSS.

---

### Task 1: Scaffold The App

**Files:**
- Create: Next.js app files generated in repository root
- Create: `.env.example`

**Step 1: Generate the scaffold**

Run:

```bash
npx create-next-app@latest . --ts --eslint --app --src-dir false --import-alias "@/*" --use-npm
```

Expected: Next.js files are created in the empty repository.

**Step 2: Add environment placeholders**

Create `.env.example` with:

```env
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
NEXTAUTH_URL=http://localhost:3000
```

**Step 3: Verify scaffold**

Run:

```bash
npm run lint
npm run build
```

Expected: both commands complete successfully.

### Task 2: Add Character Seed Data With Tests

**Files:**
- Create: `src/lib/boyfriends.ts`
- Create: `src/lib/boyfriends.test.ts`
- Modify: `package.json`
- Create: `vitest.config.ts`

**Step 1: Write the failing tests**

Test:

```ts
import { describe, expect, it } from "vitest";
import { boyfriends, getBoyfriendById } from "./boyfriends";

describe("boyfriend seed data", () => {
  it("contains the four locked v1 boyfriends", () => {
    expect(boyfriends.map((boyfriend) => boyfriend.id)).toEqual([
      "shen_xingzhou",
      "gu_chengye",
      "lin_ting",
      "zhou_yan",
    ]);
  });

  it("finds a boyfriend by id", () => {
    expect(getBoyfriendById("lin_ting")?.name).toBe("林听");
  });

  it("returns undefined for an unknown id", () => {
    expect(getBoyfriendById("unknown")).toBeUndefined();
  });
});
```

**Step 2: Run test to verify it fails**

Run:

```bash
npm test -- src/lib/boyfriends.test.ts
```

Expected: FAIL because the module does not exist yet.

**Step 3: Implement seed data**

Create `lib/boyfriends.ts` with the four character definitions and `getBoyfriendById`.

**Step 4: Run test to verify it passes**

Run:

```bash
npm test -- src/lib/boyfriends.test.ts
```

Expected: PASS.

### Task 3: Add Google-Only Auth

**Files:**
- Create: `src/auth.ts`
- Create: `src/app/api/auth/[...nextauth]/route.ts`
- Create: `src/components/auth-buttons.tsx`

**Step 1: Install Auth.js**

Run:

```bash
npm install next-auth
```

**Step 2: Configure Auth.js**

Create `auth.ts` with Google Provider only.

**Step 3: Add route handlers**

Create `app/api/auth/[...nextauth]/route.ts` exporting `GET` and `POST`.

**Step 4: Add auth buttons**

Create client components that call `signIn("google")` and `signOut()`.

**Step 5: Verify**

Run:

```bash
npm run build
```

Expected: build succeeds. Real sign-in requires Google OAuth credentials.

### Task 4: Build The First Product Pages

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/app/home/page.tsx`
- Create: `src/app/chat/[boyfriendId]/page.tsx`
- Modify: `src/app/globals.css`

**Step 1: Landing page**

Add the product name, short value proposition, and Google sign-in button.

**Step 2: Home page**

Protect with `auth()`. Render four character cards and a sign-out button.

**Step 3: Chat page**

Protect with `auth()`. Resolve `boyfriendId`, show `notFound()` for invalid ids, and render a chat shell with starter messages.

**Step 4: Responsive styling**

Style mobile first, then desktop. Keep the app usable at 375px and 1440px.

**Step 5: Verify**

Run:

```bash
npm run lint
npm test
npm run build
```

Expected: all commands pass.

### Task 5: Run Locally

**Files:**
- No file changes expected

**Step 1: Start dev server**

Run:

```bash
npm run dev
```

Expected: local app starts on `http://localhost:3000`.

**Step 2: Browser smoke test**

Open:

```text
http://localhost:3000
```

Expected: landing page renders. Google sign-in button is visible. With credentials configured, Google login can be tested.
