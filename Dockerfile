FROM node:12-alpine

RUN mkdir /home/node/app/ && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

RUN chown node:node package.json && chown node:node package-lock.json

RUN npm install && npm cache clean --force --loglevel=error
COPY index.js .

RUN chown node:node index.js

USER node
CMD [ "node", "index.js"]



