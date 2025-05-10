FROM node:24.0.1-alpine3.21
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --silent
COPY . .
EXPOSE 5050
CMD ["npm", "start"]