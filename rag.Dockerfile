FROM node:24-alpine as dependencies_installer
WORKDIR /app
COPY package* ./
RUN npm ci --include=dev

FROM node:24-alpine as base
WORKDIR /app
RUN npm i -g tsx
COPY --from=dependencies_installer /app/node_modules ./node_modules

COPY . ./
RUN npx prisma generate
RUN npm run generate:ws-doc
CMD npm run dev


FROM base as indexer
RUN npm install -g nodemon
CMD nodemon --exec 'npm run dev:indexing' --watch documents
