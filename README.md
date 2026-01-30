
# CPU Monitor

The tool monitors the CPU utilization of an AWS instance by AWS CloudWatch and displays statistics and a graph of CPU utilization percentages over time. Built as part of a homework assignment in the admissions track for the position of Full Stack Engineer at Faddom.

## How to Run?

## Prerequisites

- Node.js & npm
  
## Run Backend (without Docker)

```bash
cd app/backend
cp .env.example .env 
npm install
npm start                    
# → http://localhost:8000
```

## Run Frontend (without Docker)

```bash
cd ../frontend
cp .env.example .env         
npm install
npm start                  
# → http://localhost:3000
```

---

## Run Backend (Docker)

```bash
cd ../backend
docker build -t faddom-backend:latest .
docker run --name f-backend -d --env-file ./.env -p 8000:8000 faddom-backend
# → http://localhost:8000
```

## Run Frontend (Docker)
```bash
cd ../frontend
docker build -t faddom-frontend:latest .
docker run --name f-frontend -d --env-file ./.env -it -p 3000:3000 faddom-frontend
# → http://localhost:3000
```

## Run Both with Docker Compose (from project root)

```bash
cd ..
docker compose up -d --build
# Frontend: http://localhost:3000
# Backend:  http://localhost:8000
# Stop:
# docker compose down
```


