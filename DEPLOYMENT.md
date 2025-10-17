# Deployment Guide

This guide covers deploying the Claude Code Leaderboard to OpenShift/Kubernetes.

## Prerequisites

- OpenShift or Kubernetes cluster access
- `oc` or `kubectl` CLI tool
- GitHub OAuth App credentials
- Container registry access (e.g., Quay.io, Docker Hub)

## Step 1: Create GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: Claude Code Leaderboard
   - **Homepage URL**: `https://your-domain.com`
   - **Authorization callback URL**: `https://your-domain.com/api/auth/github`
4. Save the Client ID and Client Secret

## Step 2: Build and Push Container Image

```bash
# Build the Docker image
docker build -t quay.io/your-org/cc-leaderboard:latest .

# Push to registry
docker push quay.io/your-org/cc-leaderboard:latest
```

## Step 3: Create Secrets

```bash
# Generate JWT secret
JWT_SECRET=$(openssl rand -base64 32)

# Create the secret
oc create secret generic cc-leaderboard-secrets \
  --from-literal=github-client-id=YOUR_GITHUB_CLIENT_ID \
  --from-literal=github-client-secret=YOUR_GITHUB_CLIENT_SECRET \
  --from-literal=jwt-secret=$JWT_SECRET \
  -n cc-leaderboard
```

Alternatively, edit `deployment/secret-template.yaml` and:

```bash
cp deployment/secret-template.yaml deployment/secret.yaml
# Edit deployment/secret.yaml with your values
oc apply -f deployment/secret.yaml -n cc-leaderboard
```

## Step 4: Configure Deployment

Edit `deployment/kustomization.yaml`:

```yaml
images:
  - name: cc-leaderboard
    newName: quay.io/your-org/cc-leaderboard
    newTag: latest
```

Edit `deployment/deployment.yaml` environment variables:

```yaml
- name: NUXT_PUBLIC_APP_URL
  value: "https://your-domain.com"
- name: NUXT_PUBLIC_REQUIRED_EMAIL_DOMAIN
  value: "@your-company.com"  # Or leave as @example.com for no restriction
```

## Step 5: Deploy

```bash
# Create namespace
oc new-project cc-leaderboard

# Deploy using Kustomize
oc apply -k deployment/

# Or deploy individual files
oc apply -f deployment/pvc.yaml
oc apply -f deployment/deployment.yaml
oc apply -f deployment/service.yaml
oc apply -f deployment/route.yaml
```

## Step 6: Verify Deployment

```bash
# Check pod status
oc get pods -n cc-leaderboard

# Check logs
oc logs -f deployment/cc-leaderboard -n cc-leaderboard

# Get route URL
oc get route cc-leaderboard -n cc-leaderboard
```

## Step 7: Update GitHub OAuth Callback

Once you have the route URL, update your GitHub OAuth App:

1. Go back to your GitHub OAuth App settings
2. Update the **Authorization callback URL** to: `https://your-actual-route.com/api/auth/github`

## Configuration Options

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NUXT_OAUTH_GITHUB_CLIENT_ID` | GitHub OAuth Client ID | Yes | - |
| `NUXT_OAUTH_GITHUB_CLIENT_SECRET` | GitHub OAuth Client Secret | Yes | - |
| `NUXT_JWT_SECRET` | Secret for signing API keys | Yes | - |
| `NUXT_PUBLIC_APP_URL` | Public URL of the app | Yes | - |
| `NUXT_PUBLIC_REQUIRED_EMAIL_DOMAIN` | Required email domain (e.g., @company.com) | No | - |
| `DATABASE_PATH` | Path to SQLite database | No | `/app/data/leaderboard.db` |

### Storage

The application uses a PersistentVolumeClaim for the SQLite database. Default size is 1Gi. To change:

Edit `deployment/pvc.yaml`:

```yaml
resources:
  requests:
    storage: 5Gi  # Increase as needed
```

### Scaling

Currently, the application is configured for a single replica due to SQLite limitations. For multiple replicas, consider:

1. Using PostgreSQL instead of SQLite
2. Implementing database connection pooling
3. Using a ReadWriteMany PVC

## Upgrading

```bash
# Build new image
docker build -t quay.io/your-org/cc-leaderboard:v2 .
docker push quay.io/your-org/cc-leaderboard:v2

# Update deployment
oc set image deployment/cc-leaderboard \
  cc-leaderboard=quay.io/your-org/cc-leaderboard:v2 \
  -n cc-leaderboard

# Or rollout
oc rollout restart deployment/cc-leaderboard -n cc-leaderboard
```

## Backup

The SQLite database is stored in the PersistentVolume. To backup:

```bash
# Create a backup pod
oc run backup --image=alpine --restart=Never \
  --overrides='{"spec":{"volumes":[{"name":"data","persistentVolumeClaim":{"claimName":"cc-leaderboard-data"}}],"containers":[{"name":"backup","image":"alpine","command":["sleep","3600"],"volumeMounts":[{"name":"data","mountPath":"/data"}]}]}}'

# Copy database
oc cp backup:/data/leaderboard.db ./leaderboard-backup-$(date +%Y%m%d).db

# Delete backup pod
oc delete pod backup
```

## Monitoring

The application exposes a health check endpoint:

```bash
curl https://your-domain.com/api/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Troubleshooting

### Pod not starting

```bash
oc describe pod <pod-name>
oc logs <pod-name>
```

### Database issues

```bash
# Check if PVC is bound
oc get pvc cc-leaderboard-data

# Check volume permissions
oc exec deployment/cc-leaderboard -- ls -la /app/data
```

### OAuth not working

1. Verify GitHub OAuth callback URL matches your route
2. Check secret values:
```bash
oc get secret cc-leaderboard-secrets -o yaml
```

## Security Recommendations

1. **Use HTTPS**: Always deploy with TLS enabled (OpenShift Route handles this)
2. **Restrict Email Domain**: Set `NUXT_PUBLIC_REQUIRED_EMAIL_DOMAIN` to your organization's domain
3. **Regular Backups**: Schedule regular database backups
4. **Update Dependencies**: Keep dependencies up to date
5. **Monitor Logs**: Set up log aggregation and monitoring
6. **Resource Limits**: Adjust resource requests/limits based on usage

## Support

For issues, please check:
- Pod logs: `oc logs deployment/cc-leaderboard`
- Events: `oc get events`
- GitHub Issues: https://github.com/jsell-rh/cc-leaderboard/issues
