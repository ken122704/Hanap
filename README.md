# Hanap 🔍

## 📌 Project Overview

**Hanap** is a secure, cloud-based masterlist and role management system designed to organize and manage member records. The name comes from the Filipino word for **"to look"** or **"to search,"** reflecting the app’s core mission: making information accessible, organized, and secure.

This project has evolved from a basic CRUD application into a **fully secured full-stack web app**, implementing industry-standard security practices for Firebase and React.

---

## 🎯 Purpose

The main goals of Hanap are to:

- Maintain a **centralized, authenticated masterlist** of members.
- Provide **Data Isolation**: Users only see and manage the records they created.
- Implement **Backend Security**: Protecting sensitive data via server-side rules.
- Practice **Professional DevOps**: Managing API secrets and automated deployments.

---

## ✨ Key Features

- **Secure Authentication**
  - Google Sign-In integration via Firebase Auth.
- **Privacy-First Masterlist**
  - Personal data isolation (User A cannot see User B's records).
- **Role-Based Organization**
  - Categorize members by specific duties and roles.
- **Real-time Data Tracking**
  - Instant updates using Firestore, with precise date tracking using Timestamps.
- **Automated Deployment**
  - Fully integrated GitHub Actions pipeline for seamless updates.

---

## 🛠 Tech Stack

- **Frontend:** React.js (JavaScript)
- **Backend (BaaS):** Firebase
  - **Firestore:** No-SQL Database with custom **Security Rules**.
  - **Authentication:** Google OAuth 2.0.
  - **Hosting:** Firebase Hosting.
- **DevOps/Security:**
  - **GitHub Actions:** CI/CD for automated builds.
  - **Dotenv (.env):** Local environment variable management.
  - **GitHub Secrets:** Secure injection of API keys during build-time.

---

## 🔐 Security Implementation

This project prioritizes data integrity through a multi-layered defense:

1. **Firestore Security Rules:** Server-side logic that validates `request.auth.uid` against document `userId` fields, preventing unauthorized data access.
2. **API Key Restrictions:** Google Cloud restrictions limiting API usage to specific authorized domains.
3. **Secret Management:** Sensitive Firebase credentials are never hardcoded in the repository; they are managed via GitHub Secrets and injected during the build process.

---

## 🚀 Deployment & CI/CD

Hanap uses a professional deployment workflow:

1. Code is pushed to the `main` branch.
2. **GitHub Actions** triggers a build, pulling API keys from **Encrypted Secrets**.
3. The production-ready build is automatically deployed to **Firebase Hosting**.

---

## 🔮 Future Improvements

- [ ] **Advanced Search:** Implementing fuzzy search for large masterlists.
- [ ] **Role-Based Access Control (RBAC):** Creating "Admin" roles for global data oversight.
- [ ] **Analytics Dashboard:** Visualizing trends across different roles and statuses.
- [ ] **AI Integration:** Using n8n or Gemini to automate member reporting and insights.

---

## 📚 Learning Focus

This project serves as a practical application of:

- **Cloud Security:** Moving beyond "Test Mode" to production rules.
- **Asynchronous Logic:** Handling real-time database streams in React.
- **DevOps Principles:** Managing environments (Local vs. Production) and secret masking.

---

## 📄 License

This project is for educational purposes as part of a 3rd-year Computer Science curriculum.
