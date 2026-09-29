# Setting up a new GitHub repo and Vercel project

Step-by-step guide for moving this project (Peak Process Partners onboarding and careers app) to a **new GitHub account/repo** and a **new Vercel project**.

**What the app needs in production:**

| Piece | What it is | Where it lives |
|---|---|---|
| Code | Next.js 16 app | GitHub → Vercel |
| Database | **MySQL** (Prisma) | A hosted MySQL provider. Vercel does not host MySQL. |
| File storage | Resumes and onboarding documents | An **S3-compatible bucket** (MinIO, Cloudflare R2, etc.). Vercel can't store uploaded files on disk. |
| Secrets | `ENCRYPTION_KEY` etc. | Vercel → Settings → Environment Variables |

Commands below are for **Git Bash on Windows**, run from the project folder (e.g. `cd /e/peak_process_101`).

---

## 0. Before you start

- Install **Git**, and **Node.js 20 or newer** (the project is tested on 22). Check with `node -v` and `git --version`.
- Have your working local copy on the branch you want to go live, and make sure it runs (`npm run dev`).
- Decide which code goes live. The finished Canopy design is on `claude/canopy-design`, and `master` is the older design. The simplest route is to publish `claude/canopy-design` as the new repo's `main` branch (step 2).

---

## 1. Create the new GitHub repository

1. Sign in to the new GitHub account → **New repository**.
2. Name it (e.g. `peak_process_101`) and choose **Private**.
3. **Do not** add a README, .gitignore or licence. The repo must start empty.
4. Click **Create repository** and copy its URL, e.g. `https://github.com/NEW-ACCOUNT/peak_process_101.git`.

---

## 2. Push the code to the new repo

```bash
cd /e/peak_process_101
git status                      # must say "working tree clean"
git checkout claude/canopy-design
git pull                        # get the latest

# keep the old GitHub as "old-origin", add the new one as "origin"
git remote rename origin old-origin
git remote add origin https://github.com/NEW-ACCOUNT/peak_process_101.git

# publish the Canopy branch as the new repo's main branch
git push -u origin claude/canopy-design:main
```

- Git will ask you to sign in to the **new** GitHub account. Use the browser pop-up, or a Personal Access Token as the password.
- Optional, to copy every branch as well: `git push origin --all`.
- Check on GitHub that the files are there. `.env` must **not** be there: it's in `.gitignore` and must never be committed.

From now on work on `main` locally:

```bash
git checkout -b main origin/main
```

---

## 3. Create the production MySQL database

Vercel doesn't provide MySQL, so use a hosted MySQL provider, for example Aiven for MySQL, TiDB Cloud (MySQL-compatible), Railway or DigitalOcean Managed MySQL.

1. Create a MySQL database (e.g. `peak_process`).
2. Copy its **connection string** in this form:
   ```
   mysql://USER:PASSWORD@HOST:PORT/DATABASE?sslaccept=strict
   ```
   Use the SSL options your provider documents (most require SSL). If the password contains special characters (`@ : / # ?`), URL-encode them.
3. In the provider's network/firewall settings, **allow connections from anywhere (`0.0.0.0/0`)**. Vercel's servers don't have fixed IP addresses, so otherwise the app can't connect.

---

## 4. Create the tables and the admin account

Run this once from your PC against the **new production database**, putting the values inline so your local `.env` stays pointed at XAMPP.

```bash
# 4a. Create all tables (applies prisma/migrations)
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE?sslaccept=strict" \
  npx prisma migrate deploy
```

**4b. Generate a new encryption key** (used to encrypt Aadhaar, PAN and UAN):

```bash
node.exe -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Save the output somewhere safe, such as a password manager. **If you lose this key, the encrypted data can't be read again.** If you are moving existing data (step 9), don't generate a new key: reuse the old environment's key.

```bash
# 4c. Create the HR admin login (and the demo data — see note)
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE?sslaccept=strict" \
ENCRYPTION_KEY="THE-KEY-FROM-4b" \
ADMIN_SEED_EMAIL="hr@yourcompany.com" \
ADMIN_SEED_PASSWORD="a-long-strong-password" \
  npx prisma db seed
```

The seed also adds **three demo employees** (Priya Sharma, Rahul, Ananya) for testing. For a real production database, remove them afterwards in your provider's SQL console:

```sql
DELETE FROM employees WHERE id IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333');
```

Re-running the seed later with a new `ADMIN_SEED_PASSWORD` resets the admin password.

---

## 5. Create the file storage bucket

Resumes and documents go to an S3-compatible bucket, such as your existing MinIO server, Cloudflare R2 or Backblaze B2.

1. Create a **private** bucket (e.g. `peak-process-documents`).
2. Create an access key with read/write access to that bucket only.
3. Note these four values:
   - `MINIO_ENDPOINT`: the host only, **no `https://`** (e.g. `minio.yourcompany.com`). The app adds `https://` itself and uses path-style URLs.
   - `MINIO_ACCESS_KEY`
   - `MINIO_SECRET_KEY`
   - `MINIO_BUCKET`

---

## 6. Create the Vercel project

1. Sign in to Vercel (ideally *Continue with GitHub*, using the new GitHub account).
2. **Add New… → Project** → import the new `peak_process_101` repo. If it's not listed, click *Adjust GitHub App Permissions* and give Vercel access to it.
3. **Framework preset:** Next.js (auto-detected). Leave the Build Command, Output Directory and Install Command as the defaults. `npm run build` automatically runs `prisma generate` first (the `prebuild` script).
4. Before clicking Deploy, open **Environment Variables** and add:

| Name | Value | Required |
|---|---|---|
| `DATABASE_URL` | connection string from step 3 | yes |
| `ENCRYPTION_KEY` | key from step 4b | yes |
| `MINIO_ENDPOINT` | host only, no `https://` | yes |
| `MINIO_ACCESS_KEY` | from step 5 | yes |
| `MINIO_SECRET_KEY` | from step 5 | yes |
| `MINIO_BUCKET` | from step 5 | yes |
| `SESSION_COOKIE_NAME` | `ppp_session` | optional (default) |
| `ADMIN_SESSION_COOKIE_NAME` | `ppp_admin_session` | optional (default) |

- Set them for **Production**. Also tick **Preview** if you want preview deployments (other branches) to work. Without these variables, preview sites show errors.
- **Don't** set `NEXT_PUBLIC_PERSISTENCE_MODE` (that's only for offline demos).
- `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD` aren't needed on Vercel. The seed runs from your PC (step 4).

5. Click **Deploy** and wait for "Ready".
6. **Settings → Git → Production Branch** must be `main`. Only that branch updates the live site; other branches get preview URLs.

---

## 7. Check the live site

Open the Vercel URL and test each area:

- [ ] `/jobs`: careers page loads, with the Canopy design.
- [ ] `/admin/login`: sign in with the step 4c email and password (the eye button shows the password).
- [ ] `/admin/jobs/new`: create a job, set it to **Published**, and save.
- [ ] `/jobs`: the new job appears. Open it and **apply with a resume** (this tests the database and file storage).
- [ ] `/admin/jobs` → Applications: the application is listed and the resume **downloads**.
- [ ] `/onboarding/welcome` → go through a step and reload; the data is still there.
- [ ] `/onboarding/documents`: upload a file (this tests storage again).

---

## 8. Custom domain (optional)

Vercel → Project → **Settings → Domains** → add e.g. `careers.yourcompany.com`, then add the DNS record Vercel shows at your domain registrar. HTTPS is set up automatically.

---

## 9. Moving existing data (optional)

Only needed if the old environment has real data worth keeping.

1. **Database:** export from the old MySQL and import into the new one:
   ```bash
   mysqldump -h OLD_HOST -u USER -p OLD_DB > backup.sql
   mysql -h NEW_HOST -u USER -p NEW_DB < backup.sql
   ```
   Do this *instead of* steps 4a/4c.
2. **`ENCRYPTION_KEY`:** use the **same key** as the old environment, or the encrypted Aadhaar/PAN/UAN values can't be read.
3. **Files:** copy all objects from the old bucket to the new one (e.g. `mc mirror` for MinIO, or `rclone copy`). Keep the same object keys, because the database stores them.

---

## 10. Day-to-day workflow after the move

```bash
git checkout -b my-change        # work on a branch
# ...edit, test locally with npm run dev...
git add -A && git commit -m "Describe the change"
git push -u origin my-change     # Vercel builds a preview URL
```

Open a Pull Request on GitHub → check the preview → **merge into `main`**, and Vercel updates the live site automatically.

Local development keeps using your own `.env` (XAMPP MySQL). Never point local development at the production database.

---

## Troubleshooting

| Symptom | Likely cause and fix |
|---|---|
| Build fails: `@prisma/client did not initialize yet` | `prisma generate` didn't run. Keep the default build command (`npm run build`, which runs `prebuild`). |
| `P1001: Can't reach database server` | The database firewall is blocking Vercel. Allow `0.0.0.0/0` (step 3), and check the host/port and SSL options in `DATABASE_URL`. |
| `P1000: Authentication failed` | Wrong user/password, or special characters in the password that aren't URL-encoded. |
| Error pages mentioning `ENCRYPTION_KEY` | The variable is missing or isn't a 32-byte base64 key (step 4b). |
| Upload or download fails | One of the `MINIO_*` variables is missing or wrong. The endpoint must have **no** `https://`; check the bucket name and key permissions. |
| `/jobs` shows 404 or the old design | The wrong branch is deployed. Check Settings → Git → Production Branch = `main`, then redeploy. |
| Preview deployment errors, production fine | The environment variables are only set for Production. Also tick **Preview** (step 6). |
| Admin login says invalid credentials | Re-run step 4c with the email/password you want. |
| Changed an environment variable but nothing changed | Redeploy: Deployments → ⋯ → **Redeploy**. Variables only apply to new deployments. |
