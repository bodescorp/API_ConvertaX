FROM node:20-slim

WORKDIR /home/node/app

RUN apt-get update -y && apt-get install -y openssl
RUN yarn global add @nestjs/cli

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

WORKDIR /home/node/app

USER node

CMD ["sh", "-c", "yarn migration:run && yarn start:dev"]