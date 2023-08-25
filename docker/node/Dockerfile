FROM node:16.19.0-alpine3.17 as app_node

WORKDIR /srv/app

COPY --link assets/ ./assets/

COPY --link package*.json ./

COPY --link *.config.js ./

COPY --link tsconfig*.json ./

COPY --link client.env ./

RUN npm install

#RUN npm install @symfony/webpack-encore --save-dev

#FROM app_node as app_node_prod

#RUN npm run build

#FROM app_node as app_node_dev

#RUN npm run dev
