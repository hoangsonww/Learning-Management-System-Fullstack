##
## ─────────────────────────────────────────────────────────
##  Angular 18 Front-end – multi-stage production image
## ─────────────────────────────────────────────────────────
##

# ── Builder stage ────────────────────────────────────────
FROM node:18.19-alpine AS builder

WORKDIR /app

# only the manifests first → better layer-caching
COPY app/package*.json ./
RUN npm ci --quiet

# copy the actual source and compile
COPY app/ ./
RUN npm run build -- --configuration production

# ── Runtime stage (Nginx) ────────────────────────────────
FROM nginx:1.27-alpine

# remove the default landing page
RUN rm -rf /usr/share/nginx/html/*

# copy the compiled artefacts from the previous stage
## (the build ends up in   /app/dist/<project-name> )
# if your Angular project name differs, just adjust the * below.
COPY --from=builder /app/dist/* /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
