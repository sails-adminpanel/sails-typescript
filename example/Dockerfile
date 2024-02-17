###################################
#### NPM CACHE
FROM node:18-alpine as planner
WORKDIR /app
COPY ./package.json .
COPY ./package-lock.json .
FROM node:18-alpine as cacher
RUN apk add git bash
WORKDIR /app
COPY --from=planner /app/package.json package.json
COPY --from=planner /app/package-lock.json package-lock.json
RUN npm install


###################################
#### POSTGRES TEST
FROM postgres:14-alpine AS test
RUN apk add nodejs npm
ENV DATASTORE postgres
ENV POSTGRES_PASSWORD postgres
ENV POSTGRES_USER postgres
ENV POSTGRES_DB postgres
ENV DATASTORE postgres
ENV PG_HOST localhost

RUN npm i -g typescript

WORKDIR /app
COPY --from=npm_cacher /app/node_modules node_modules
COPY . .
RUN tsc || true
RUN bash -c "nohup docker-entrypoint.sh postgres &" && sleep 3 && bash /app/.ci/bootstrap test

###################################
#### RELEASE
FROM keymetrics/pm2:18-alpine AS release

ARG BUILD_ENV
ENV PORT 1337
EXPOSE 1337

RUN apk update && apk upgrade && \
    apk add --no-cache imagemagick git bash

# fix gitlab.com problem
RUN git config --global http.sslverify "false"

COPY --from=test /app /app

WORKDIR /app
COPY ./.ci/bootstrap .
RUN npx gulp prod
ENTRYPOINT ["/bin/bash","bootstrap"]
CMD ["start"]
