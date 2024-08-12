FROM node:alpine
WORKDIR /usr/mhis-api
COPY package.json .
RUN npm install typescript yarn prisma -g --force 
RUN yarn install

COPY . .
RUN yarn add prisma --dev
RUN yarn prisma:generate
RUN yarn build
EXPOSE 8080
EXPOSE 5555
CMD ["node", "./build/index.js"]