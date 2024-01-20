FROM fedora:39 as dev

RUN dnf install -y nodejs

WORKDIR /app

ADD package.json .
ADD package-lock.json .

RUN npm ci

ADD . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

FROM dev as build

RUN npm run build

ENTRYPOINT [ "bash" ]