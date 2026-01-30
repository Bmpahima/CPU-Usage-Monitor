FROM node:24

WORKDIR /frontend

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8000

CMD ["npm", "start"]

# BUILD:
# docker build -t faddom-frontend .   

# RUN:
# docker run --name f-frontend -d --env-file ./.env -it -p 3000:3000 faddom-frontend

