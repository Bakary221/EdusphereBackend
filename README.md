# README Backend EduSphere - Module 0 (Sans Docker - Local)

## 🚀 Initialisation Locale (Sans Docker)

### 1. PostgreSQL Local
```bash
sudo apt install postgresql
sudo -u postgres psql
CREATE DATABASE edusphere;
CREATE USER postgres WITH PASSWORD 'password';
\q
```

### 2. Backend
```bash
cd edusphere-backend
npm install
npx prisma db push
npm run start:dev
```

**API prête sur http://localhost:3000**

*(Docker supprimé - DB locale)*
