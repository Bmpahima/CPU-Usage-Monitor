FROM node:24

WORKDIR /backend

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8000

CMD ["node", "app.js"]

# BUILD:
# docker build -t cpumonitor-backend .   

# RUN:
# docker run --name cpu-backend -d --env-file ./.env -p 8000:8000 cpumonitor-backend

