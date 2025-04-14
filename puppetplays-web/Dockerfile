# Install dependencies only when needed
FROM node:lts-alpine AS deps

WORKDIR /opt/app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
# This is where because may be the case that you would try
# to build the app based on some `X_TAG` in my case (Git commit hash)
# but the code hasn't changed.
FROM node:lts-alpine AS builder

ENV NODE_ENV=production
ARG NEXT_PUBLIC_API_URL
WORKDIR /opt/app
COPY . .
COPY --from=deps /opt/app/node_modules ./node_modules
RUN yarn build
# Workaround for next-translate part 1: Create empty files and folders to replicate the structure of the pages in the app
RUN find /opt/app/pages \( -type d -exec mkdir -p "dist/{}" \; -o -type f -exec touch "dist/{}" \; \)
RUN find ./pages \( -type d -exec mkdir -p "/opt/app/translateSrc/{}" \; -o -type f -exec touch "/opt/app/translateSrc/{}" \; \)

# Production image, copy all the files and run next
FROM node:lts-alpine AS runner

ARG X_TAG
WORKDIR /opt/app
ENV NODE_ENV=production
COPY --from=builder /opt/app/next.config.js ./
COPY --from=builder /opt/app/next-i18next.config.js ./
COPY --from=builder /opt/app/public ./public
COPY --from=builder /opt/app/.next ./.next
COPY --from=builder /opt/app/node_modules ./node_modules
# Workaround for next-translate part 2: Copy the empty files and folders to the run environment so next-translate can figure out how the pages are laid out.
COPY --from=builder /opt/app/translateSrc ./

CMD ["node_modules/.bin/next", "start"]