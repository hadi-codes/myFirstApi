FROM node:10
RUN mkdir -p /home/api/node_modules && chown -R node:node /home/api
WORKDIR /home/api
COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 3001

CMD [ "node", "index.js" ]