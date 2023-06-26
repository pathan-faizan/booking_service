FROM node:14

WORKDIR /flurn_assignment
COPY package.json .
RUN npm install 
COPY . .

CMD ["node","index.js"]