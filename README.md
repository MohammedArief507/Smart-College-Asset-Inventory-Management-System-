# Smart College Asset & Inventory Management System

## ⚡ Quick Start (Windows)

### Step 1 — Backend
Open terminal in the `server` folder:
```powershell
npm install
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 Server running on http://localhost:5000
```

### Step 2 — Frontend
Open a NEW terminal in the `client` folder:
```powershell
npm install
npm run dev
```

Open browser: http://localhost:5173

### Step 3 — MongoDB Compass
- Open MongoDB Compass
- Connect to: `mongodb://localhost:27017`
- After server starts, `smart_asset_db` will appear automatically

---

## ✅ Test the API
Open browser and go to:
```
http://localhost:5000/api/health
```

You should see:
```json
{
  "success": true,
  "message": "✅ Smart Asset API is running!",
  "database": "MongoDB Local (Compass)"
}
```

---

## 📁 Project Structure
```
smart-asset-v2/
├── client/          ← React Frontend (port 5173)
│   ├── .env         ← Already configured ✅
│   └── src/
└── server/          ← Node.js Backend (port 5000)
    └── .env         ← Already configured ✅
```

---

## 🗂️ Module Progress
- [x] Module 1 — Project Setup ✅
- [ ] Module 2 — Mongoose Models
- [ ] Module 3 — Authentication
- [ ] Module 4 — Dashboard
- [ ] Module 5 — User Management
- [ ] ... and more
