FROM fedora:39 as dev

RUN --mount=type=cache,target=/var/cache/dnf \
    dnf install -y nodejs git

WORKDIR /app

RUN --mount=source=package.json,target=package.json,z \
    --mount=source=package-lock.json,target=package-lock.json,z \
    --mount=type=cache,target=/root/.npm \
    npm ci --include-dev --verbose

ADD . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

FROM dev as build

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/out/ /usr/share/nginx/html