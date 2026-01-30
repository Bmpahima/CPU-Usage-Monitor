FROM node:24

WORKDIR /backend

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8000

CMD ["node", "app.js"]

# BUILD:
# docker build -t faddom-backend .   

# RUN:
# docker run --name f-backend -d --env-file ./.env -p 8000:8000 faddom-backend

