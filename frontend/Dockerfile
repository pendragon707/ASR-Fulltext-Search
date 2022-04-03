FROM node:17.3.0-alpine

RUN mkdir /frontend

COPY package.json package-lock.json /frontend/
# COPY node_modules /frontend/node_modules
COPY server /frontend/server
COPY src /frontend/src

# EXPOSE 3000

CMD [ "node", "server" ]
