FROM node:latest
WORKDIR /backend
COPY package*.json ./
RUN npm install
COPY ./ ./
EXPOSE 10000
CMD ["npm", "start"]
