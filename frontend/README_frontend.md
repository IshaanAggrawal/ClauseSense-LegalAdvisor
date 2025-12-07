# 🌐 Clause Sense Frontend

Frontend for **Clause Sense**, built using **Next.js + TypeScript**.  
Focuses on smooth interaction design, scroll-triggered animations, and typographic clarity.

---

## 🧩 Overview

This frontend provides the user interface for uploading documents, viewing AI-generated summaries, and interacting with the Clause Sense assistant.

**Core Libraries:**
- **Next.js** — Core framework
- **TailwindCSS** — Styling
- **Tailwind CSS** — Styling with utility classes
- **Lucide React** — Icon library
- **React Bits / Custom Components** — Interactive UI blocks


---

## 🧱 Folder Structure

```
frontend/
├── public/
├── app/                  # Next.js App Router structure
│   ├── app/              # Main application route
│   ├── components/       # Custom UI components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   └── styles/           # Global styles
├── package.json
├── next.config.mjs
└── README.md
```

---

## ⚙️ Setup

```bash
pnpm install
pnpm dev
```

App runs at: **http://localhost:3000**

> Note: This project uses pnpm as the package manager. Make sure you have pnpm installed: `npm install -g pnpm`

---

## 🔗 Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

---

## 🧠 Features

- Animated parallax hero section  
- Interactive pricing & feature capsules  
- AI chat dock and upload interface  
- Responsive and accessible design  
- Framer Motion-based section transitions

---

## 🧩 API Integration

The frontend communicates with the FastAPI backend through REST endpoints.  
Create a `.env.local` file in the frontend directory with the backend URL:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Example usage:

```typescript
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function analyzeDocument(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE}/api/analyze`, {
    method: "POST",
    body: formData,
  });
  return res.json();
}
```

---

## 🚀 Deployment

- **Platform:** Vercel recommended  
- **Build Command:** `pnpm build`  
- **Output Directory:** `.next`  
- Ensure environment variables are configured in Vercel settings.

---

## 🎨 Design Philosophy

Whitespace, minimal motion, clean gradients.  
The interface should *breathe*, not *blink* — inspired by Gentlerain.ai & Cluely.

---

> “Clause Sense Frontend — where trust meets interaction.”
