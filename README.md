# 🗳️ Pollverse

**Pollverse** is an interactive polling and quiz web app built with **React + Firebase**, styled using **Tailwind CSS** and **Shadcn UI**.  
It allows users to **create polls**, **vote**, **view results in real time**, and **analyze poll performance**.

---

## 🚀 Features

✅ Create and manage interactive polls  
✅ Multiple question types — text, multiple choice, scale, ranking  
✅ Real-time voting results via Firestore listeners  
✅ Anonymous or authenticated voting options  
✅ Beautiful UI built with **Shadcn + Tailwind**  
✅ Firebase authentication (email/password, Google login optional)  
✅ Dashboard for viewing and managing your polls  
✅ Responsive design for all devices  

---

## 🧩 Tech Stack

| Category | Technologies |
|-----------|--------------|
| **Frontend** | React + Vite + TypeScript |
| **UI Library** | Shadcn/UI + Tailwind CSS |
| **Backend & Database** | Firebase Firestore |
| **Auth** | Firebase Authentication |
| **Toast & Notifications** | Sonner |
| **Icons** | Lucide React |

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/<your-username>/pollverse.git
cd pollverse
````

### 2️⃣ Install dependencies

```bash
npm install
```

> This installs React, Tailwind, Firebase, Shadcn components, Sonner, and other dependencies.

---

## 🔥 Firebase Setup

### Step 1 — Create a Firebase project

* Visit [Firebase Console](https://console.firebase.google.com/)
* Create a new project → Enable Firestore Database + Authentication.

### Step 2 — Add your Firebase config

Create a file at:

```
src/integrations/firebase/config.ts
```

Paste your Firebase credentials:

```ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

---

### Step 3 — Set Firestore Rules

Go to **Firestore → Rules tab** and paste:

```bash
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /polls/{pollId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.creator_id;
    }
    match /questions/{questionId} {
      allow read: if true;
      allow create: if request.auth != null;
    }
    match /votes/{voteId} {
      allow read: if true;
      allow create: if true;
    }
    match /users/{userId} {
      allow read: if true;
      allow create, update, delete: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

### Step 4 — Enable Authentication

In Firebase Console → Authentication → Sign-in method → enable **Email/Password**.

---

## 🧱 Project Structure

```
pollverse/
├── src/
│   ├── assets/              # Static images and icons
│   ├── components/
│   │   ├── ui/              # Shadcn UI components (Button, Card, Input, etc.)
│   │   └── Navbar.tsx
│   ├── integrations/
│   │   └── firebase/config.ts
│   ├── pages/
│   │   ├── Auth.tsx
│   │   ├── Dashboard.tsx
│   │   ├── CreatePoll.tsx
│   │   ├── PollVote.tsx
│   │   ├── PollResults.tsx
│   │   └── Index.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🧠 Available Scripts

| Command           | Description                   |
| ----------------- | ----------------------------- |
| `npm run dev`     | Starts development server     |
| `npm run build`   | Builds the app for production |
| `npm run preview` | Serves built app locally      |
| `npm run lint`    | Runs ESLint for code quality  |

---

## 🪄 UI Components (Shadcn)

This project uses **Shadcn UI** components for clean, accessible styling.
You can add new components anytime:

```bash
npx shadcn@latest add <component-name>
```

Example:

```bash
npx shadcn@latest add button card input label textarea select switch tabs toast
```

---

## 💬 Toasts & Notifications

To display success/error messages:

```ts
import { toast } from "sonner";
toast.success("Poll created successfully!");
toast.error("Something went wrong!");
```

Make sure you include the `<Toaster />` in your `App.tsx`.

---

## 🧪 Deployment

You can deploy easily to:

* **Firebase Hosting**
* **Vercel**
* **Netlify**

For Firebase Hosting:

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

---

## 🤝 Contributing

Pull requests are welcome!
If you’d like to add new features (like analytics, leaderboard, or comments), fork the repo and submit a PR.

---

## 📄 License

This project is licensed under the **MIT License**.

---

## ✨ Author

👩‍💻 **Whitney Shisia**
🎓 Journalism Student & Certified Software Developer
📧 shisiawhitney215@gmail.com
---

### 💡 “Create. Vote. Analyze — with Pollverse.”
