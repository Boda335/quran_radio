FROM node:20-bookworm-slim

# Build tools + libs for `canvas` and `better-sqlite3`
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ pkg-config ca-certificates \
    libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# package-lock.json is git-ignored in this repo, so use `npm install`, not `npm ci`
COPY package.json ./
RUN npm install --omit=dev

COPY . .

ENV NODE_ENV=production

# Dashboard socket (SOCKET_PORT). The audio server (3040) is internal only.
EXPOSE 3030

# start.js runs BOTH processes in this one container:
#   audio-server.js  (binds 127.0.0.1:3040)
#   shard.js         (the bot, talks to the audio server over 127.0.0.1)
CMD ["node", "start.js"]
