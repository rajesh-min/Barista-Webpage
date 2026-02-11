# RailGo Train Booking App Repository

This folder is now prepared as a **separate repository root**.

## Repository status

- Local Git repository initialized at: `train-booking-app/.git`
- Default branch: `main`

## Store this repository remotely

Run from inside `train-booking-app/`:

```bash
git add .
git commit -m "Initial RailGo train booking app"
git remote add origin <your-new-repository-url>
git push -u origin main
```

## Run locally

### Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:4000`.

### Frontend

Serve `frontend/index.html` with any static server.

Example:

```bash
cd frontend
python3 -m http.server 5173
```

Then open `http://localhost:5173`.
