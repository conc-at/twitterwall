FROM mhart/alpine-node:9

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .
RUN npm run build

EXPOSE 5000

ENTRYPOINT [ "npm", "run", "server" ]
