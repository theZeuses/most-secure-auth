FROM node:14.15.4
RUN mkdir -p /var/www/frontend
WORKDIR /var/www/frontend
COPY . /var/www/frontend
RUN npm install
CMD npm run dev