FROM fedora:39 as deps

RUN dnf install -y nodejs

WORKDIR /app

ADD package.json .
ADD package-lock.json .

RUN npm ci

FROM deps as dev

ADD . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

FROM dev as build

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/out/ /usr/share/nginx/html