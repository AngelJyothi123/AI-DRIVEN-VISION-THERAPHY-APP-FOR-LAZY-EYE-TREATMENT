# Vision Therapy AI Platform - Cloud Deployment Guide

This project is now configured for **Zero-Cost Deployment** on the public internet. Follow the steps below to take your clinical platform live.

## 1. Database Setup (Aiven - Free MySQL)
Aiven provides a persistent MySQL instance that does not sleep.
1.  Sign up at [aiven.io](https://aiven.io/).
2.  Create a **Free Plan MySQL** service.
3.  Once the service is "Running", click on **"Quick Connect"**.
4.  Use **MySQL Workbench** or a similar tool to connect and run the provided [**schema.sql**](./schema.sql) to build your tables.
5.  Copy the **Service URI**, **Username**, and **Password**.

## 2. AI & Backend Setup (Render - Free Web Services)
Render hosts your Java and Python services for free. Note: They auto-sleep after 15 mins of inactivity.
1.  Sign up at [render.com](https://render.com/).
2.  **AI Service (Python):**
    *   Create a "New Web Service".
    *   Link your GitHub repository.
    *   **Root Directory:** `ai-service`
    *   **Runtime:** `Python 3.12+` (or standard)
    *   **Build Command:** `pip install -r requirements.txt`
    *   **Start Command:** `gunicorn -w 4 -b 0.0.0.0:5000 src.api.ml_service:app`
    *   Once deployed, copy the **Render URL** (e.g., `https://ai-service.onrender.com`).
3.  **Backend (Spring Boot):**
    *   Create a "New Web Service".
    *   Link your GitHub repository.
    *   **Root Directory:** `backend/vision-app-backend`
    *   **Runtime:** `Docker` (or Java/Maven if supported). **Recommended:** Add a `Dockerfile` for easy Java deployment.
    *   **Environment Variables:**
        *   `SPRING_DATASOURCE_URL`: (Your Aiven JDBC URL)
        *   `SPRING_DATASOURCE_USERNAME`: (Aiven Username)
        *   `SPRING_DATASOURCE_PASSWORD`: (Aiven Password)
        *   `AI_SERVICE_URL`: (The URL from step 2)
        *   `ALLOWED_ORIGINS`: (Your Vercel URL from step 3)

## 3. Frontend Setup (Vercel - Free)
Vercel is the gold standard for React deployment.
1.  Sign up at [vercel.com](https://vercel.com/).
2.  Add a New Project and link your GitHub repository.
3.  **Root Directory:** `frontend/Vision_App_Frontend`
4.  **Framework Preset:** `Vite`
5.  **Environment Variables:**
    *   `VITE_API_URL`: (Your Render Backend URL, e.g., `https://vision-backend.onrender.com/api`)
6.  Click **Deploy**.

## Local Development vs. Production
The codebase now automatically detects the environment:
- If no environment variables are present, it defaults to `localhost`.
- If environment variables are set (on Vercel/Render), it seamlessly communicates across the cloud.

---
**Congratulations!** Your clinical vision therapy system is now live for patients and doctors worldwide.
