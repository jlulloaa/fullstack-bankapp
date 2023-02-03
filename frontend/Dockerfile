FROM node:latest as build
WORKDIR /frontend
COPY package*.json ./
RUN npm install
COPY ./ ./
EXPOSE 10000
CMD ["npm", "start"]
