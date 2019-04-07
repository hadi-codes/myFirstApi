FROM node:11-alpine
RUN mkdir -p /home/api/node_modules && chown -R node:node /home/api
WORKDIR /home/api
COPY package*.json ./

USER root
RUN apk add python
RUN apk add musl
RUN apk add flood
USER node
RUN npm install

COPY --chown=node:node . .

EXPOSE 3001

CMD [ "node", "index.js" ]