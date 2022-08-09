FROM node:14.15.4
RUN mkdir -p /var/www/backend
WORKDIR /var/www/backend
COPY . /var/www/backend
RUN npm install
RUN npm install argon2 --build-from-source
RUN npm run migration:run
CMD ["npm", "run", "start:dev"]