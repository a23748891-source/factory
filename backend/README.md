# factory-backend (Spring Boot + JWT)

## Run (IntelliJ)
- Open `backend` folder
- Run `FactoryApplication`

## Run (CLI)
```bash
cd backend
mvn spring-boot:run
```

Demo account:
- admin / 1234

Endpoints:
- POST /auth/register
- POST /auth/login
- GET /api/status (JWT 필요)
- GET/PUT /api/settings (JWT 필요)
- GET /api/events (JWT 필요)
- GET /api/events/stream (SSE 데모; 브라우저 제약으로 token query 허용)
