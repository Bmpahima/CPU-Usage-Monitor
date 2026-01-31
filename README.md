# CPU Monitor

The tool monitors the CPU utilization of an AWS instance by AWS CloudWatch, and displays statistics and a graph of CPU utilization percentages over time.

## How to Run?

## Prerequisites

- Node.js & npm

## Run Backend (without Docker)

```bash
cd app/backend
cp .env.example .env # Fill the .env file with the required credentials.
npm install
npm start
# → http://localhost:8000
```

## Run Frontend (without Docker)

```bash
cd ../frontend
npm install
npm start
# → http://localhost:3000
```

---

## Run Backend (Docker)

```bash
cd app/backend
cp .env.example .env # Fill the .env file with the required credentials.
docker build -t cpumonitor-backend .
docker run --name cpu-backend -d --env-file ./.env -p 8000:8000 cpumonitor-backend
# → http://localhost:8000
```

## Run Frontend (Docker)

```bash
cd ../frontend
docker build -t cpumonitor-frontend .
docker run --name cpu-frontend -d --env-file ./.env -it -p 3000:3000 cpumonitor-frontend
# → http://localhost:3000
```

## Run Both with Docker Compose (from project root)

```bash
cd app/backend
cp .env.example .env # Fill the .env file with the required credentials.
cd ..
docker compose up -d --build
# Frontend: http://localhost:3000
# Backend:  http://localhost:8000
# Stop:
# docker compose down
```
