.PHONY: help build push deploy deploy-ephemeral clean logs port-forward status

# Default values
IMAGE_REGISTRY ?= quay.io
IMAGE_ORG ?= cloudservices
IMAGE_NAME ?= cc-leaderboard
IMAGE_TAG ?= latest
IMAGE ?= $(IMAGE_REGISTRY)/$(IMAGE_ORG)/$(IMAGE_NAME)

# Local development image (using OpenShift internal registry)
INTERNAL_REGISTRY ?= default-route-openshift-image-registry.apps.crc-eph.r9lp.p1.openshiftapps.com
LOCAL_IMAGE ?= $(INTERNAL_REGISTRY)/$(BONFIRE_NAMESPACE)/cc-leaderboard
LOCAL_IMAGE_TAG ?= $(APP_VERSION)-$(GIT_COMMIT)

# Deployment values
ENV_NAME ?= ephemeral
NAMESPACE ?= $(shell oc project -q 2>/dev/null || echo "cc-leaderboard-dev")
BONFIRE_NAMESPACE ?= $(shell bonfire namespace list --mine 2>/dev/null | awk 'NR==3 {print $$1}' || echo "$(shell whoami)-cc-leaderboard")

# ClowdApp parameters
APP_PUBLIC_URL ?= https://cloud.redhat.com

# GitHub OAuth configuration (required)
GITHUB_CLIENT_ID ?=
GITHUB_CLIENT_SECRET ?=

# Required email domain (optional - leave empty to allow all domains)
REQUIRED_EMAIL_DOMAIN ?= @redhat.com

# Version info for Docker builds
GIT_COMMIT ?= $(shell git rev-parse --short HEAD 2>/dev/null || echo "unknown")
APP_VERSION ?= $(shell node -p "require('./web/package.json').version" 2>/dev/null || echo "0.0.0")

# Working directory (where web app is)
WEB_DIR = web

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-25s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

bonfire-namespaces: ## List available bonfire namespaces
	@echo "Available bonfire namespaces:"
	@bonfire namespace list --mine 2>/dev/null || echo "No namespaces found or bonfire not available"
	@echo ""
	@echo "Current namespace (BONFIRE_NAMESPACE): $(BONFIRE_NAMESPACE)"
	@echo ""
	@echo "To use a different namespace:"
	@echo "  make deploy-ephemeral-local BONFIRE_NAMESPACE=<namespace-name>"

build: ## Build the container image
	@echo "Building image: $(IMAGE):$(IMAGE_TAG)"
	@echo "Version: $(APP_VERSION)+$(GIT_COMMIT)"
	docker build \
		--build-arg GIT_COMMIT=$(GIT_COMMIT) \
		--build-arg APP_VERSION=$(APP_VERSION) \
		-f $(WEB_DIR)/Dockerfile \
		-t $(IMAGE):$(IMAGE_TAG) .

build-local: ## Build and push to internal registry
	@echo "Building image: $(LOCAL_IMAGE):$(LOCAL_IMAGE_TAG)"
	@echo "Version: $(APP_VERSION)+$(GIT_COMMIT)"
	docker build \
		--build-arg GIT_COMMIT=$(GIT_COMMIT) \
		--build-arg APP_VERSION=$(APP_VERSION) \
		-f $(WEB_DIR)/Dockerfile \
		-t $(LOCAL_IMAGE):$(LOCAL_IMAGE_TAG) .
	@echo "Logging into internal registry..."
	@docker login -u $(shell oc whoami) -p $(shell oc whoami -t) $(INTERNAL_REGISTRY)
	@echo "Pushing to internal registry..."
	docker push $(LOCAL_IMAGE):$(LOCAL_IMAGE_TAG)

push: ## Push the container image to registry
	@echo "Pushing image: $(IMAGE):$(IMAGE_TAG)"
	docker push $(IMAGE):$(IMAGE_TAG)

build-push: build push ## Build and push the container image

deploy-ephemeral-local: build-local ## Build and deploy locally to ephemeral namespace
	@echo "Deploying to ephemeral namespace: $(BONFIRE_NAMESPACE) with local image"
	@echo ""
	@echo "Available bonfire namespaces:"
	@bonfire namespace list --mine 2>/dev/null | head -5 || echo "  (bonfire command not available)"
	@echo ""
	@echo "Using namespace: $(BONFIRE_NAMESPACE)"
	@echo "  (Override with: make deploy-ephemeral-local BONFIRE_NAMESPACE=<name>)"
	@echo ""
	@echo "Switching to namespace..."
	oc project $(BONFIRE_NAMESPACE)
	@echo "Creating required secrets..."
	@echo "Creating JWT and session secrets..."
	@oc create secret generic cc-leaderboard-secrets \
		--from-literal=jwt-secret=$$(openssl rand -base64 32) \
		--from-literal=session-password=$$(openssl rand -base64 32) \
		--dry-run=client -o yaml | oc apply -f -
	@echo "Creating GitHub OAuth secrets..."
	@if [ -z "$(GITHUB_CLIENT_ID)" ] || [ -z "$(GITHUB_CLIENT_SECRET)" ]; then \
		echo "ERROR: GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET are required"; \
		echo "Set them as environment variables or in the make command:"; \
		echo "  make deploy-ephemeral-local GITHUB_CLIENT_ID=xxx GITHUB_CLIENT_SECRET=yyy"; \
		exit 1; \
	fi
	@oc create secret generic cc-leaderboard-github-oauth \
		--from-literal=client-id=$(GITHUB_CLIENT_ID) \
		--from-literal=client-secret=$(GITHUB_CLIENT_SECRET) \
		--dry-run=client -o yaml | oc apply -f -
	@echo "Processing and applying ClowdApp template..."
	@ENV_NAME=$$(oc get clowdenvironment -o jsonpath="{.items[?(@.spec.targetNamespace==\"$(BONFIRE_NAMESPACE)\")].metadata.name}" 2>/dev/null || echo "ephemeral"); \
	echo "Using ClowdEnvironment: $$ENV_NAME"; \
	oc process --local -f deploy/clowdapp.yaml \
		-p ENV_NAME=$$ENV_NAME \
		-p IMAGE=$(LOCAL_IMAGE) \
		-p IMAGE_TAG=$(LOCAL_IMAGE_TAG) \
		-p APP_PUBLIC_URL=$(APP_PUBLIC_URL) \
		-p APP_BASE_URL=/api/cc-leaderboard-web/ \
		-p REQUIRED_EMAIL_DOMAIN=$(REQUIRED_EMAIL_DOMAIN) \
		| oc apply -f -
	@echo ""
	@echo "Deployment complete! Waiting for resources to be ready..."
	@echo "Checking deployment status..."
	@oc rollout status deployment/cc-leaderboard-web --timeout=5m || true
	@echo ""
	@echo "Waiting for route to be created..."
	@for i in 1 2 3 4 5 6; do \
		ROUTE_HOST=$$(oc get route -l app=cc-leaderboard -o jsonpath='{.items[0].spec.host}' 2>/dev/null); \
		ROUTE_PATH=$$(oc get route -l app=cc-leaderboard -o jsonpath='{.items[0].spec.path}' 2>/dev/null); \
		if [ -n "$$ROUTE_HOST" ]; then \
			if [ -n "$$ROUTE_PATH" ]; then \
				ROUTE_URL="https://$$ROUTE_HOST$$ROUTE_PATH"; \
				BASE_PATH="$$ROUTE_PATH"; \
			else \
				ROUTE_URL="https://$$ROUTE_HOST/api/cc-leaderboard-web/"; \
				BASE_PATH="/api/cc-leaderboard-web/"; \
			fi; \
			echo "Detected route URL: $$ROUTE_URL"; \
			echo "Detected base path: $$BASE_PATH"; \
			if [ "$$ROUTE_URL" != "$(APP_PUBLIC_URL)" ]; then \
				echo "Updating ClowdApp with correct APP_PUBLIC_URL and APP_BASE_URL..."; \
				APP_URL_INDEX=$$(oc get clowdapp cc-leaderboard -o json | jq -r '.spec.deployments[0].podSpec.env | to_entries | .[] | select(.value.name == "NUXT_PUBLIC_APP_URL") | .key'); \
				BASE_URL_INDEX=$$(oc get clowdapp cc-leaderboard -o json | jq -r '.spec.deployments[0].podSpec.env | to_entries | .[] | select(.value.name == "NUXT_APP_BASE_URL") | .key'); \
				if [ -z "$$APP_URL_INDEX" ] || [ -z "$$BASE_URL_INDEX" ]; then \
					echo "WARNING: Could not find env vars in ClowdApp"; \
					echo "Falling back to direct deployment env update..."; \
					oc set env deployment/cc-leaderboard-web \
						NUXT_PUBLIC_APP_URL="$$ROUTE_URL" \
						NUXT_APP_BASE_URL="$$BASE_PATH" 2>/dev/null || true; \
				else \
					echo "Found NUXT_PUBLIC_APP_URL at index $$APP_URL_INDEX"; \
					echo "Found NUXT_APP_BASE_URL at index $$BASE_URL_INDEX"; \
					oc patch clowdapp cc-leaderboard --type=json -p="[{ \
						\"op\": \"replace\", \
						\"path\": \"/spec/deployments/0/podSpec/env/$$APP_URL_INDEX/value\", \
						\"value\": \"$$ROUTE_URL\" \
					}, { \
						\"op\": \"replace\", \
						\"path\": \"/spec/deployments/0/podSpec/env/$$BASE_URL_INDEX/value\", \
						\"value\": \"$$BASE_PATH\" \
					}]"; \
				fi; \
				echo "Waiting for Clowder to reconcile..."; \
				sleep 10; \
			fi; \
			echo ""; \
			echo "Application URL: $$ROUTE_URL"; \
			exit 0; \
		fi; \
		echo "Waiting for route (attempt $$i/6)..."; \
		sleep 10; \
	done; \
	echo "Warning: Could not detect route URL after 60 seconds"

status: ## Show deployment status
	@echo "==> ClowdApp Status"
	@oc get clowdapp cc-leaderboard -o wide 2>/dev/null || echo "ClowdApp not found"
	@echo ""
	@echo "==> Deployments"
	@oc get deployments -l app=cc-leaderboard
	@echo ""
	@echo "==> Pods"
	@oc get pods -l app=cc-leaderboard
	@echo ""
	@echo "==> Services"
	@oc get services -l app=cc-leaderboard
	@echo ""
	@echo "==> Routes"
	@oc get routes -l app=cc-leaderboard

logs: ## Tail logs from the web app
	oc logs -l deployment=cc-leaderboard-web -f --tail=100

port-forward: ## Port forward app to localhost:3003
	@echo "Forwarding cc-leaderboard-web to localhost:3003"
	@POD=$$(oc get pods -l deployment=cc-leaderboard-web -o jsonpath='{.items[0].metadata.name}' 2>/dev/null); \
	if [ -z "$$POD" ]; then \
		echo "No app pod found"; \
		exit 1; \
	fi; \
	oc port-forward $$POD 3003:3000

shell: ## Open shell in app pod
	@POD=$$(oc get pods -l deployment=cc-leaderboard-web -o jsonpath='{.items[0].metadata.name}' 2>/dev/null); \
	if [ -z "$$POD" ]; then \
		echo "No app pod found"; \
		exit 1; \
	fi; \
	oc rsh $$POD

clean: ## Delete the deployment
	@echo "Deleting deployment from namespace: $(NAMESPACE)"
	oc delete clowdapp cc-leaderboard --ignore-not-found=true
	oc delete pvc cc-leaderboard-db-pvc --ignore-not-found=true
	oc delete secret cc-leaderboard-secrets cc-leaderboard-github-oauth --ignore-not-found=true

restart: ## Restart the deployment
	@echo "Restarting deployment..."
	oc rollout restart deployment/cc-leaderboard-web

bonfire-clean: ## Remove bonfire ephemeral namespace
	bonfire namespace release $(BONFIRE_NAMESPACE)

# Development helpers
dev: ## Run local development server
	cd $(WEB_DIR) && npm run dev

lint: ## Run linter
	cd $(WEB_DIR) && npm run lint

format: ## Format code
	cd $(WEB_DIR) && (npm run format || npx prettier --write .)
