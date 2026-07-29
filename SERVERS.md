# Wansom AI Development Servers

This document serves as a quick reference for restarting the development environment. Always refer to this file to quickly fire up the servers.

## 1. Frontend (Vite)
- **Directory**: `c:\Users\dell\Desktop\wansom-ai`
- **Command**: `npm run dev`
- **Local URL**: [http://localhost:3000](http://localhost:3000)

## 2. Backend Service (Express/Node.js)
- **Directory**: `c:\Users\dell\Desktop\wansom-ai\backend-service`
- **Command**: `npm run dev`
- **Local URL**: [http://localhost:5000](http://localhost:5000)

## 3. PageIndex Microservice (FastAPI/Python)
- **Directory**: `c:\Users\dell\Desktop\wansom-ai\services\PageIndex`
- **Command**: `._\venv\Scripts\python api_server.py`
- **Local URL**: [http://localhost:8000](http://localhost:8000)
- **Note**: Uses the local Python virtual environment (`venv`).

---

### Quick Restart Instructions for AI
To restart all servers, execute the following commands in the background:

1. **Backend**: 
   ```bash
   cd c:\Users\dell\Desktop\wansom-ai\backend-service
   npm run dev
   ```
2. **PageIndex**: 
   ```powershell
   cd c:\Users\dell\Desktop\wansom-ai\services\PageIndex
   .\venv\Scripts\python api_server.py
   ```
3. **Frontend**: 
   ```bash
   cd c:\Users\dell\Desktop\wansom-ai
   npm run dev
   ```
