📊 FinBoard – Finance Dashboard

🚀 Live Demo: https://financedashboard-git-main-vencasmets-projects.vercel.app/

FinBoard is a customizable, widget-based finance dashboard that allows users to track stock market data interactively. Users can add, remove, and rearrange widgets to monitor stock prices, OHLC data, and visual charts across multiple time intervals.

Unlike simple data viewers, FinBoard is designed around real-world constraints such as unreliable third-party APIs, rate limits, UI resilience, and user experience — making it closer to an industry-grade financial dashboard.

🧠 Project Overview

FinBoard enables users to build their own stock tracking dashboard using modular widgets. Each widget operates independently, ensuring that failures in one data source or component do not crash the entire application.

The application is built with Next.js (App Router) and React, deployed on Vercel, and integrates multiple financial APIs with intelligent fallback mechanisms to ensure reliability. 



🚀 Core Features

📦 Dynamic widgets (Card, Table, Chart)

🔄 Drag-and-drop widget reordering

💾 Persistent dashboard state

📈 Line & candlestick stock charts

⏱ Interval switching (Daily / Weekly / Monthly)

🌙 Dark / Light theme toggle

🔁 Multi-API fallback strategy

🚫 Graceful loading & error handling

📱 Fully responsive UI



🛠️ Tech Stack (With Purpose)

Frontend

Next.js (App Router) – Production-ready React framework with routing, env handling, and seamless Vercel deployment

React (Hooks) – Component-driven UI and dynamic rendering

TypeScript – Type safety, better API handling, reduced runtime errors

Styling & Themes

Tailwind CSS v3 – Utility-first styling with responsive design

next-themes – Dark/Light mode with system preference detection

State Management & Interaction

Zustand – Lightweight global state management without Redux overhead

dnd-kit – Modern drag-and-drop support with precise control

Charts

Recharts – Declarative charting for line and candlestick visualizations

APIs (With Fallback Strategy)

Alpha Vantage – Primary source for stock prices & OHLC

Finnhub – Fallback API when primary fails

TwelveData – Dedicated provider for time-series chart data

Deployment

Vercel – Hosting, environment variables, and CI-friendly deployment



⚙️ How the Application Works

1️⃣ Dashboard Initialization

Loads saved widget configuration from Zustand (and localStorage if available)

Applies theme based on user or system preference

2️⃣ Adding Widgets

User selects widget type (Card / Table / Chart)

Enters stock symbol and widget title

Widget is stored in global state

3️⃣ Widget Rendering

Each widget functions independently:

Card Widget → Latest stock price

Table Widget → OHLC data

Chart Widget → Time-series visualization

4️⃣ Chart Interaction

Interval switching: Day / Week / Month

Chart type: Line / Candle

Each change triggers a fresh API fetch

5️⃣ Drag & Drop

Widgets can be reordered via drag-and-drop

Layout is persisted across reloads

6️⃣ Error Handling & API Fallback

If an API fails, another provider supplies data

UI never crashes; graceful fallback messages are shown



🧩 Problems Faced & Solutions

Problem	Solution

API rate limits--------------->	Multi-API fallback strategy

Inconsistent API formats------>	Normalized service layer

Charts breaking on refresh---->	Controlled loading & refetching

Drag conflicts with buttons---> Pointer event handling

Theme visibility issues------->	Explicit Tailwind color control



📚 What I Learned

Designing UIs that fail gracefully

Handling unreliable third-party APIs

Building scalable frontend architecture

Managing global state efficiently

Debugging real deployment issues

Importance of UX during loading & errors



🔮 Future Enhancements

User authentication & saved dashboards

Real-time updates via WebSockets

Technical indicators (RSI, MACD)

Server-side caching (Redis)

Alerts & notifications

Export dashboard as PDF

Crypto & forex market support





▶️ Run the Project Locally

    npm install
    npm run dev


Then open:
👉 http://localhost:3000
