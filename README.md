# Fatuus Server (scaffold)

This is a minimal Node + TypeScript server scaffold intended to host connector adapters for other projects.

Quick start (PowerShell)

```powershell
# from workspace root
Set-Location -LiteralPath 'W:\Data\JitHuzz\fatuus-server'
npm install
npm run dev
```

Endpoints
- GET /health — health check
- POST /api/echo — echoes JSON body
- WebSocket endpoint: ws://localhost:4000/ws

Connector adapters
Place connector modules under `src/connectors` that export a registration function which receives an object with `{ app, wss, config }`.

Next steps
- Adjust connector API to match your other project's connectors (read README of the other project)
- Add more robust auth, validation, logging, and tests
# fatuus-server
Server side repository for creating your own server for [Fatuus](https://github.com/NikNikovsky/fatuus).
