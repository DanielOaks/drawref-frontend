FROM node:20.15-alpine
RUN mkdir -p /opt/app
WORKDIR /opt/app

# we copy package.json and yarn.lock first so that the same cached stage can
# be used here if only code changes
COPY package.json yarn.lock ./
RUN yarn

# copy other files
COPY *.ts *.js *.json docker/startup.sh ./
COPY index.html ./
COPY public ./public
COPY src ./src

EXPOSE 3000
RUN yarn build
CMD [ "./startup.sh" ]
