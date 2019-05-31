FROM node:12
RUN mkdir -p /home/api/node_modules && chown -R node:node /home/api
WORKDIR /home/api
COPY package*.json ./

USER root

USER node
RUN npm install
RUN npm i python
RUN npm i express

RUN npm i flood
COPY --chown=node:node . .

EXPOSE 3001

CMD [ "node", "index.js" ]