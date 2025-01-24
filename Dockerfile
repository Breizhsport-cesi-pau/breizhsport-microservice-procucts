FROM node:20-alpine

ADD . /app
WORKDIR /app

RUN npm install

EXPOSE 3002

USER node
CMD ["node", "server.js"]