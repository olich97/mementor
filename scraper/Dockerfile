FROM node:14-alpine

ARG START_PAGE=0
ARG END_PAGE=0

ENV SCRAP_START_PAGE=START_PAGE
ENV SCRAP_END_PAGE=END_PAGE

WORKDIR /app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 3000
RUN chown -R node /app
USER node
CMD ["node", "dist/app.js"]
