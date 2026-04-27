# acme — deployed on EasyDeploy

This is a minimal Node.js app deployed to [EasyDeploy](https://github.com/easydeploytest/EasyDeploy).

**Live:**
- Dev → https://acme-dev.easy-deploy.135.181.177.246.nip.io
- Prod → https://acme-prod.easy-deploy.135.181.177.246.nip.io

---

## How this app was created

Four steps. No YAML. No platform tickets. No Kubernetes knowledge needed.

### Step 1 — Register with EasyDeploy

```bash
curl -sN -X POST https://portal-dev.easy-deploy.135.181.177.246.nip.io/api/create-app \
  -H "Content-Type: application/json" \
  -d '{"name":"acme","team":"easy-deploy","port":3000}'
```

This streams back what's being provisioned:

```
  [running]  create-repo     Creating GitHub repo...
  [done   ]  create-repo     github.com/easydeploytest/acme
  [running]  scaffold        Writing Dockerfile + CI workflow...
  [done   ]  scaffold
  [running]  argocd-app      Registering with ArgoCD...
  [done   ]  argocd-app
  ✓ App created!
    repo:    https://github.com/easydeploytest/acme
    dev url: https://acme-dev.easy-deploy.135.181.177.246.nip.io
```

One call. Everything provisioned: GitHub repo, CI pipeline, Kubernetes namespace, TLS certificate, Grafana dashboard, Infisical secrets project.

---

### Step 2 — Push your code

Clone the generated repo and push your source:

```bash
git clone https://github.com/easydeploytest/acme
cd acme
# put your code in src/
git add . && git commit -m "initial app"
git push
```

The CI pipeline picks it up immediately:

```bash
gh run list --repo easydeploytest/acme
```

```
  success    initial app       2025-04-27 14:01
```

**The app is live as soon as the run completes.**

---

### Step 3 — Add a secret

No `kubectl create secret`. Just open Infisical:

```
https://infisical.easy-deploy.135.181.177.246.nip.io
```

Open project **acme** → environment **dev** → add `GREETING = Hello from Infisical!`

The running pod picks it up as an env var within ~5 minutes. No redeploy.

---

### Step 4 — Promote to production

```bash
gh release create acme/v1.0.0 \
  --repo easydeploytest/acme \
  --title "v1.0.0" \
  --notes "First prod release"
```

The `promote-prod` workflow runs automatically — re-tags the image, updates `values-prod.yaml`, ArgoCD syncs the prod namespace.

```
https://acme-prod.easy-deploy.135.181.177.246.nip.io
```

---

## What's in this repo

```
app.yaml       # 3 lines: name, team, port
Dockerfile     # standard Node.js image
src/index.js   # the app
package.json
```

That's all a developer writes. Everything else — CI, Helm values, ArgoCD ApplicationSet, Grafana dashboard — is generated and managed by the platform.

---

## Files

### `app.yaml`
```yaml
name: acme
team: easy-deploy
port: 3000
```

### `Dockerfile`
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json .
COPY src/ src/
EXPOSE 3000
CMD ["node", "src/index.js"]
```
