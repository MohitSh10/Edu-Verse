# EduVerse — Full-Stack EdTech Platform

A production-ready online learning platform built from scratch with React, Node.js, MongoDB, and Cloudinary. Inspired by and significantly improved over StudyNotion.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Redux Toolkit, TailwindCSS, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (httpOnly cookies) + OTP verification |
| File Storage | Cloudinary |
| Payments | Razorpay |
| Email | Nodemailer (SMTP) |
| Security | Helmet, express-rate-limit, bcryptjs |

---

## 📁 Project Structure

```
edtech-platform/
├── server/                     ← Express REST API
│   ├── config/                 ← DB, Cloudinary, Razorpay
│   ├── controllers/            ← Auth, Course, Profile, Payment, etc.
│   ├── middlewares/            ← JWT auth, role guards
│   ├── models/                 ← Mongoose schemas
│   ├── routes/                 ← API route definitions
│   ├── utils/                  ← mailSender, fileUpload
│   ├── mail/templates/         ← HTML email templates
│   └── index.js                ← Entry point
│
├── src/                        ← React SPA
│   ├── components/
│   │   ├── common/             ← Navbar, Footer, CourseCard, UI primitives
│   │   └── core/
│   │       ├── Auth/           ← OpenRoute, PrivateRoute, ProfileDropdown
│   │       ├── Dashboard/      ← All dashboard pages + course builder
│   │       └── ViewCourse/     ← Video player page
│   ├── pages/                  ← Home, Login, Signup, CourseDetails, etc.
│   ├── redux/slices/           ← auth, profile, course, cart, viewCourse
│   ├── services/               ← API call functions
│   └── utils/                  ← Constants, formatters
└── public/
```

---

## ⚙️ Setup Instructions

### 1. Clone & Install

```bash
# Root (React frontend deps)
npm install

# Backend deps
cd server && npm install && cd ..
```

### 2. Configure Environment Variables

**Frontend** — copy `.env.example` to `.env`:
```env
REACT_APP_BASE_URL=http://localhost:4000/api/v1
REACT_APP_RAZORPAY_KEY=your_razorpay_key_id
```

**Backend** — copy `server/.env.example` to `server/.env`:
```env
PORT=4000
NODE_ENV=development
MONGODB_URL=mongodb+srv://<user>:<pass>@cluster.mongodb.net/edtech
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=10
CLOUD_NAME=your_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
FOLDER_NAME=edtech
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password
RAZORPAY_KEY=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
FRONTEND_URL=http://localhost:3000
```

### 3. Run Development Servers

```bash
# Run both frontend + backend simultaneously
npm run dev

# Or separately:
npm start          # React on :3000
npm run server     # Express on :4000
```

---

## 🔑 API Endpoints

### Auth (`/api/v1/auth`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/send-otp` | Send OTP to email |
| POST | `/signup` | Register new user |
| POST | `/login` | Login user |
| POST | `/logout` | Logout (clears cookie) |
| POST | `/forgot-password` | Send password reset link |
| POST | `/reset-password` | Reset using token |
| POST | `/change-password` | Change password (auth required) |

### Profile (`/api/v1/profile`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/me` | Get current user |
| PUT | `/update` | Update profile info |
| PUT | `/picture` | Update profile picture |
| DELETE | `/delete` | Delete account |
| GET | `/enrolled-courses` | Student: enrolled courses |
| GET | `/instructor-stats` | Instructor: dashboard stats |

### Courses (`/api/v1/course`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Get all published courses |
| GET | `/:courseId` | Get course details |
| POST | `/` | Create course (instructor) |
| PUT | `/:courseId` | Edit course (instructor) |
| DELETE | `/:courseId` | Delete course (instructor) |
| GET | `/categories/all` | Get all categories |
| POST | `/review` | Submit review (student) |

### Payment (`/api/v1/payment`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/capture` | Create Razorpay order |
| POST | `/verify` | Verify payment & enroll |
| POST | `/enroll-free` | Enroll in free course |
| POST | `/progress` | Update lecture progress |

---

## 🔒 Security Improvements over Original

| Issue | Original (StudyNotion) | This Project |
|-------|----------------------|--------------|
| Rate limiting | ❌ None | ✅ 100 req/15min, 20 auth/15min |
| HTTP headers | ❌ None | ✅ Helmet.js |
| Password in response | ❌ Sometimes leaked | ✅ `select: false` + `toJSON` |
| Reset token storage | ❌ Plain text in DB | ✅ SHA-256 hashed |
| Email enumeration | ❌ Reveals if email exists | ✅ Neutral response |
| Cookie security | ❌ Basic | ✅ httpOnly + sameSite + secure |
| File size limits | ❌ None | ✅ 50MB max |
| Request logging | ❌ None | ✅ Morgan |

---

## 🆕 New Features Added

- **Resume where you left off** — tracks last accessed lecture
- **Course level & language** filtering
- **Free course enrollment** (zero-price flow)
- **Instructor social links** in profile
- **Sub-section resources** (attach PDFs, links)
- **Course completion tracking** with percentage
- **Newsletter subscription** UI in footer
- **Catalog filtering** by level, price, search query
- **Pagination** on course listings
- **View count** tracking per course
- **Confirmation modals** for destructive actions

---

## 🚢 Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy /build to Vercel
```

### Backend (Railway / Render)
Set all environment variables in dashboard.  
Set `NODE_ENV=production` and `FRONTEND_URL=https://your-app.vercel.app`

---

## 📄 License

MIT — free to use, modify, and distribute.
