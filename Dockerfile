# build stage
FROM node:16 as build-stage

WORKDIR /app

COPY package*.json tsconfig.json ./

RUN npm ci

COPY src ./src

RUN npm run build

RUN npm prune --production

# production stage
FROM node:16 as production-stage

WORKDIR /usr/src/app

COPY --from=build-stage /app/package.json /usr/src/app
COPY --from=build-stage /app/node_modules /usr/src/app/node_modules
COPY --from=build-stage /app/dist /usr/src/app/dist
COPY --from=build-stage /app/src /usr/src/app/src

EXPOSE 3000

CMD [ "npm", "start" ]
