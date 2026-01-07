# 🔗 URL Shortener

A modern, fast, and scalable **URL Shortener** built using the **MERN stack (React, Express, Node.js)** with **Redis** for high-performance caching.  
This application allows users to convert long URLs into short, shareable links and redirect instantly.

---

## ✨ Features

- 🚀 Shorten long URLs instantly
- 🔁 Fast redirection using Redis caching
- 🧠 Collision-free unique short IDs
- 📊 Scalable backend architecture
- 🎨 Clean & responsive UI
- ⚡ Built with modern web technologies

---

## 🛠️ Tech Stack

### Frontend
- ⚛️ React
- 🎨 Tailwind CSS
- 🌐 Next.js (App Router)

### Backend
- 🟢 Node.js
- 🚂 Express.js
- 🍃 MongoDB (URL storage)
- ⚡ Redis (caching & fast lookup)

---

## 📁 Project Structure
urlShortner/
│
├── src/
│ ├── app/
│ │ ├── api/shorten/route.ts
│ │ ├── [shortId]/page.tsx
│ │ ├── layout.tsx
│ │ └── page.tsx
│ │
│ ├── components/
│ │ ├── ShortenerForm.tsx
│ │ └── ShortenedLink.tsx
│ │
│ ├── lib/
│ │ ├── mongodb.ts
│ │ └── redis.ts
│ │
│ ├── models/
│ │ └── Url.ts
│ │
│ └── styles/
│ └── globals.css
│
├── public/
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md


---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Shivay7666/URL_SHORTNER.git
cd URL_SHORTNER

2️⃣ Install dependencies
npm install

3️⃣ Environment Variables

Create a .env file in the root directory:

MONGODB_URI=your_mongodb_connection_string
REDIS_URL=your_redis_connection_url
BASE_URL=http://localhost:3000

4️⃣ Run the project
npm run dev


📍 App will run at:
👉 http://localhost:3000

🔄 How It Works

User enters a long URL

Backend generates a unique short ID

URL is stored in MongoDB

Short ID is cached in Redis

On access:

Redis is checked first (⚡ fast)

If not found, MongoDB is queried

User is redirected instantly

🚀 Future Enhancements

🔐 User authentication

📈 Click analytics dashboard

⏳ URL expiration

🧾 Custom short URLs

🌍 Deployment with Docker & CI/CD

🤝 Contributing

Contributions are welcome!
Feel free to fork the repository and submit a pull request.

📜 License

This project is licensed under the MIT License.

👨‍💻 Author

Shivam Singh
🔗 GitHub: Shivay7666










