<p align="center">
  <img src="public/favicon.svg" alt="AniStream Logo" width="80" height="80" />
</p>

<h1 align="center">AniStream</h1>

<p align="center">
  <b>A modern anime streaming interface built for educational purposes</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/License-Educational-yellow" />
</p>

---

## ⚠️ Disclaimer

> **This project is strictly for educational and learning purposes only.**
>
> - This project does **NOT** host, store, or distribute any copyrighted anime content.
> - It acts as an interface that interacts with publicly available third-party APIs.
> - **I do NOT support, encourage, or promote piracy in any form.**
> - If you choose to use this project, you are solely responsible for ensuring you comply with all applicable laws and regulations in your jurisdiction.
> - This project is intended to demonstrate full-stack web development concepts including React, Express, API integration, proxy handling, and modern UI/UX design.
>
> **If you are a content owner and have concerns, please open an issue and I will address it promptly.**

---

## 📖 About

AniStream is a full-stack anime streaming interface built with **React + TypeScript** on the frontend and **Express + TypeScript** on the backend. It fetches anime metadata from [AniList](https://anilist.co/) (a free, public API) and provides a sleek, modern UI for browsing and watching anime.

This project is meant as a **learning resource** for developers interested in:
- Building modern React applications with TypeScript
- Creating Express.js backend APIs
- Working with third-party APIs (AniList GraphQL)
- Implementing HLS video stream proxying
- Designing beautiful, responsive anime-themed UIs

---

## ✨ Features

- 🔍 **Browse & Search** — Explore trending anime powered by the AniList API
- 📄 **Anime Details** — View detailed info, ratings, genres, and episode lists
- 🎬 **Multi-Server Playback** — Switch between multiple streaming providers
- 📱 **Responsive Design** — Works on desktop and mobile browsers
- ⚡ **Fast & Modern** — Built with Vite for instant HMR and lightning-fast builds

---

## 🛠️ Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 19, TypeScript, Vite 8        |
| Backend    | Express.js, TypeScript, tsx         |
| API        | AniList GraphQL, Consumet Extensions|
| Styling    | Vanilla CSS with CSS Variables      |
| Routing    | React Router DOM v7                 |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **[Node.js](https://nodejs.org/)** — v18 or higher
- **[npm](https://www.npmjs.com/)** — comes bundled with Node.js
- **[Git](https://git-scm.com/)** — to clone the repository

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/<your-username>/AniStreammm.git
cd AniStreammm
```

**2. Install frontend dependencies**

```bash
npm install
```

**3. Install backend dependencies**

```bash
cd server
npm install
cd ..
```

### Running the Project

> ⚡ **This project runs on localhost only.** You need to start **both** the backend server and the frontend dev server.

**Step 1 — Start the Backend Server**

Open a terminal and run:

```bash
cd server
npm run dev
```

The backend API will start at `http://localhost:3000`

**Step 2 — Start the Frontend Dev Server**

Open a **second terminal** and run:

```bash
npm run dev
```

The frontend will start at `http://localhost:5173`

**Step 3 — Open in Browser**

Navigate to **[http://localhost:5173](http://localhost:5173)** in your browser. That's it! 🎉

---

## 📁 Project Structure

```
AniStreammm/
├── public/               # Static assets (favicon, icons)
├── src/                  # Frontend source code
│   ├── assets/           # Images
│   ├── components/       # Reusable UI components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── AnimeCard.tsx
│   │   └── HeroCarousel.tsx
│   ├── pages/            # Page-level components
│   │   ├── Home.tsx
│   │   ├── Catalog.tsx
│   │   ├── AnimeDetail.tsx
│   │   └── WatchUrl.tsx
│   ├── styles/           # Global CSS styles & variables
│   ├── utils/            # API helpers & utilities
│   ├── App.tsx           # Root application component
│   └── main.tsx          # React entry point
├── server/               # Backend source code
│   ├── src/
│   │   └── index.ts      # Express API server
│   ├── package.json
│   └── tsconfig.json
├── index.html            # Vite HTML entry point
├── vite.config.ts        # Vite configuration
├── package.json          # Frontend dependencies
├── tsconfig.json         # TypeScript configuration
└── README.md             # You are here!
```

---

## 🔧 Configuration

The Vite dev server is configured to proxy `/api` requests to the backend at `http://127.0.0.1:3000`. This is set up in `vite.config.ts` — no manual CORS configuration needed during development.

If you want to access the app from other devices on your local network (e.g., your phone), the Vite server is configured with `host: true`, so you can access it via your machine's local IP address.

---

## 🤝 Contributing

This is a personal educational project, but contributions are welcome! If you'd like to improve the code, fix bugs, or add features:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

This project is provided **as-is** for educational purposes only. No license is granted for commercial use or redistribution of copyrighted content.

---

<p align="center">
  <sub>Built with ❤️ for learning. <b>Say no to piracy.</b></sub>
</p>
