# EcoMind AI - Carbon Twin Platform

EcoMind AI is a production-ready, AI-powered carbon footprint awareness and simulation platform. By constructing a digital **Carbon Twin** that mirrors real-life transportation, diet, home energy, and shopping choices, users can experiment with lifestyle changes, interact with a Google Gemini-powered Sustainability Coach, and join gamified weekly challenges to reduce their carbon impact.

---

## 🚀 Key Features

* **Carbon Twin Simulator**: Interactive playground with range sliders to simulate lifestyle modifications and view long-term emissions projections in real-time.
* **AI Sustainability Coach**: A context-aware chatbot powered by Google Gemini delivering personalized, low-cost, high-impact suggestions based on actual carbon footprint scores.
* **Interactive Dashboard**: Stripe/Vercel-inspired data analytics displaying annualized tons offset requirements, weekly progress lines, and categories distribution charts.
* **Weekly Challenges**: Gamified micro-actions (e.g. "Meatless Mondays", "Pedestrian Commutes") to increase user Eco Score.
* **Premium Design System**: Fully responsive mobile menu support and a persistent Light/Dark theme toggle featuring white card layouts with soft shadows.

---

## 🛠️ Technology Stack

* **Frontend**: Next.js 16.2.9, React 19, TypeScript, Tailwind CSS v4, Framer Motion, Recharts, Lucide Icons.
* **Backend**: Python 3.13, FastAPI, Pydantic (data validations).
* **Database & Auth**: Firebase Firestore (caching and sync) & Firebase Auth (Google Login).
* **AI & API Services**: Google Gemini 1.5 (structured AI responses) & Google Maps API (commute distance carbon calculations).
* **Containerization**: Multi-stage Docker builds.
* **Hosting / Deployment**: Google Cloud Run.

---

## 📂 Project Structure

```
EcoMind-AI/
├── backend/                   # FastAPI backend service
│   ├── app/
│   │   ├── api/               # Endpoint routers (/footprint, /coach)
│   │   ├── services/          # Business logic (Calculator, Gemini SDK)
│   │   └── main.py            # App startup entry point
│   ├── tests/                 # Pytest unit & integration suites
│   ├── Dockerfile             # Container configuration for Cloud Run
│   └── requirements.txt       # Backend dependencies
├── frontend/                  # Next.js frontend application
│   ├── app/                   # App Router views (dashboard, simulator, coach)
│   ├── components/            # Reusable UI cards and shared headers
│   ├── lib/                   # API clients and Firebase wrappers
│   ├── tests/                 # Vitest typescript test files
│   ├── Dockerfile             # Multi-stage production container build
│   └── next.config.ts         # Standalone build settings
└── README.md                  # Root documentation
```

---

## ⚙️ Local Development Setup

### 1. Backend Setup (FastAPI)
Navigate to the backend directory:
```bash
cd backend
```
Create a virtual environment and activate it:
```bash
# Windows
python -m venv .venv
.\.venv\Scripts\activate

# macOS / Linux
python3 -m venv .venv
source .venv/bin/activate
```
Install dependencies:
```bash
pip install -r requirements.txt
```
Copy environment file template and populate keys:
```bash
cp .env.example .env
```
Start development server:
```bash
python -m uvicorn app.main:app --port 8080 --reload
```

### 2. Frontend Setup (Next.js)
Navigate to the frontend directory:
```bash
cd ../frontend
```
Install dependencies:
```bash
npm install --legacy-peer-deps
```
Copy environment file template and configure credentials:
```bash
cp .env.example .env.local
```
Start development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) inside your web browser.

---

## 🧪 Testing Guidelines

### Run Backend Tests (`pytest`)
From the `backend` directory, execute tests with module resolution pathing:
```bash
.\.venv\Scripts\python -m pytest
```

### Run Frontend Tests (`vitest`)
From the `frontend` directory, execute tests in run-once mode:
```bash
npx vitest run
```

---

## ☁️ Deployment to Google Cloud Run

Both frontend and backend are configured for simple, containerized deployment to Google Cloud Run.

### 1. Build and Deploy Backend Service
```bash
cd backend
gcloud builds submit --tag gcr.io/your-project-id/ecomind-backend
gcloud run deploy ecomind-backend \
  --image gcr.io/your-project-id/ecomind-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_key_here
```

### 2. Build and Deploy Frontend App
Ensure `NEXT_PUBLIC_BACKEND_URL` is set to the deployed backend service URL:
```bash
cd ../frontend
gcloud builds submit --tag gcr.io/your-project-id/ecomind-frontend
gcloud run deploy ecomind-frontend \
  --image gcr.io/your-project-id/ecomind-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NEXT_PUBLIC_BACKEND_URL=https://deployed-backend-url
```

---

## 📄 License

This project is licensed under the MIT License.
