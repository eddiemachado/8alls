# 8alls API

Central FastAPI backend for the 8alls productivity suite.

## Features

- ✅ Task management (CRUD operations)
- ✅ Universal search
- ✅ Auto-generated API documentation (Swagger UI)
- ✅ CORS enabled for external apps
- ✅ SQLite (development) / PostgreSQL (production) support
- ✅ Docker ready

## Quick Start

### Local Development

1. **Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Create .env file:**
```bash
cp .env.example .env
# Edit .env with your settings
```

4. **Run the server:**
```bash
uvicorn app.main:app --reload
```

5. **Access API:**
- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- Health: http://localhost:8000/health

### Docker

```bash
# Build image
docker build -t 8alls-api .

# Run container
docker run -p 8000:8000 --env-file .env 8alls-api
```

## API Endpoints

### Tasks

- `GET /api/tasks` - List all tasks
- `GET /api/tasks/{id}` - Get specific task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

### Search

- `GET /api/search?q=query` - Search tasks

### System

- `GET /` - API info
- `GET /health` - Health check

## Database

### Development (SQLite)

Default configuration uses SQLite (no setup required):
```
DATABASE_URL=sqlite:///./8alls.db
```

### Production (PostgreSQL)

Update `.env`:
```
DATABASE_URL=postgresql://user:password@host:5432/8alls
```

## Deployment

### Recommended: Fly.io + Supabase (Both Free)

**Complete guide:** See [DEPLOYMENT.md](./DEPLOYMENT.md)

**Quick steps:**

1. **Create Supabase database** (https://supabase.com)
   - Free PostgreSQL with nice UI
   - Get connection string

2. **Deploy to Fly.io:**
```bash
fly auth login
fly launch --no-deploy
fly secrets set DATABASE_URL="your-supabase-url"
fly deploy
```

**Total cost: $0/month**

## Environment Variables

See [.env.example](.env.example) for all available options:

- `DATABASE_URL` - Database connection string
- `API_KEY` - API authentication key
- `CORS_ORIGINS` - Allowed origins for CORS
- `ENVIRONMENT` - development/production

## Development

### Project Structure

```
api/
├── app/
│   ├── core/           # Configuration and database
│   ├── models/         # SQLAlchemy models
│   ├── routes/         # API endpoints
│   ├── schemas/        # Pydantic schemas
│   └── main.py         # FastAPI application
├── requirements.txt    # Python dependencies
├── Dockerfile         # Docker configuration
└── README.md          # This file
```

### Adding New Endpoints

1. Create model in `app/models/`
2. Create schema in `app/schemas/`
3. Create routes in `app/routes/`
4. Register router in `app/main.py`

## Testing

Access the interactive API documentation at `/docs` to test all endpoints.

## Next Steps

- [ ] Add authentication middleware
- [ ] Add rate limiting
- [ ] Add calendar endpoints
- [ ] Add health tracking endpoints
- [ ] Add finance/budget endpoints
- [ ] Add WebSocket support for real-time updates

## License

MIT
