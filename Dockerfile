FROM node

COPY . /usr/app
WORKDIR /usr/app

RUN npm install --global serve
RUN npm install
RUN npm run build

ENTRYPOINT [ "serve", "-s", "-p", "80", "dist" ]
EXPOSE 80