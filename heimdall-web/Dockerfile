# specify the node base image with your desired version node:<version>
FROM node:8

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
RUN chown -R node:node /usr/src/app

COPY . .
RUN chown -R node:node /usr/src/app

USER node
RUN yarn install --only=production
RUN yarn run build 


# replace this with your application's default port
EXPOSE 3010

CMD ["node", "server.js"]
