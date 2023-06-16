FROM node:lts-alpine as node

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build --prod

FROM nginx:latest
COPY --from=node /app/dist/dietplannerapp /usr/share/nginx/html

EXPOSE 80
