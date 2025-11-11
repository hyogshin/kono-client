# 🚀 Quick Start Guide / 빠른 시작 가이드

## 한국어 (Korean)

이 프로젝트를 로컬에서 실행하기 위한 빠른 가이드입니다.

### 📋 필요한 것

1. **Node.js 18+** 및 npm
2. **TypeScript 백엔드 서버** (직접 구현 필요)

### ⚡ 5분 안에 시작하기

#### 1단계: 프론트엔드 설정

```bash
# 저장소 클론
git clone https://github.com/hyogshin/kono-client.git
cd kono-client

# 의존성 설치
npm install

# 환경 변수 파일 생성
cp .env.example .env.development

# 개발 서버 실행
npm run dev
```

프론트엔드가 `http://localhost:5173`에서 실행됩니다.

#### 2단계: 백엔드 설정

**Option A: 빠른 시작 템플릿 사용 (권장)**

1. [BACKEND_STARTER.md](./BACKEND_STARTER.md) 파일을 열어 복사/붙여넣기 가능한 백엔드 코드를 확인하세요
2. 새 폴더를 만들고 템플릿 코드를 따라 백엔드를 설정하세요
3. `npm run dev`로 백엔드를 실행하면 `http://localhost:8080`에서 시작됩니다

**Option B: 직접 구현**

[BACKEND_API.md](./BACKEND_API.md)에서 전체 API 명세를 확인하고 직접 구현하세요.

### 📚 상세 문서

- **[LOCAL_SETUP_KR.md](./LOCAL_SETUP_KR.md)** - 한국어 상세 설정 가이드
- **[BACKEND_API.md](./BACKEND_API.md)** - 전체 API 명세서
- **[BACKEND_STARTER.md](./BACKEND_STARTER.md)** - 백엔드 시작 템플릿

---

## English

Quick guide to run this project locally.

### 📋 Prerequisites

1. **Node.js 18+** and npm
2. **TypeScript backend server** (you need to implement this)

### ⚡ Get Started in 5 Minutes

#### Step 1: Frontend Setup

```bash
# Clone the repository
git clone https://github.com/hyogshin/kono-client.git
cd kono-client

# Install dependencies
npm install

# Create environment file
cp .env.example .env.development

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`.

#### Step 2: Backend Setup

**Option A: Use the Quick Start Template (Recommended)**

1. Open [BACKEND_STARTER.md](./BACKEND_STARTER.md) for copy-paste ready backend code
2. Create a new folder and follow the template to set up your backend
3. Run `npm run dev` to start the backend on `http://localhost:8080`

**Option B: Implement from Scratch**

See [BACKEND_API.md](./BACKEND_API.md) for the complete API specification and implement it yourself.

### 📚 Detailed Documentation

- **[README.md](./README.md)** - Project overview and setup instructions
- **[BACKEND_API.md](./BACKEND_API.md)** - Complete API specification
- **[BACKEND_STARTER.md](./BACKEND_STARTER.md)** - Backend starter template
- **[LOCAL_SETUP_KR.md](./LOCAL_SETUP_KR.md)** - Korean setup guide

---

## 🎯 What You Get

After following this guide, you'll have:

- ✅ Frontend running on `http://localhost:5173`
- ✅ Backend API running on `http://localhost:8080`
- ✅ Full crypto trading simulator experience
- ✅ Real-time price updates (if you implement WebSocket)
- ✅ User authentication and portfolio management
- ✅ Trading functionality with virtual ₩10,000,000

## 🔧 Troubleshooting

### Frontend can't connect to backend?

1. Check if backend is running on port 8080
2. Verify `.env.development` has `VITE_API_URL=http://localhost:8080`
3. Make sure CORS is enabled on the backend

### CORS errors?

Add this to your backend:
```typescript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

## 💡 Tips

- Start with the backend starter template - it has everything you need
- Use mock data initially, add real-time prices later
- SQLite is great for quick prototyping
- The frontend already has proxy configured in `vite.config.ts`

## 📞 Need Help?

- Check existing documentation files
- Review the backend starter template
- Look at the API specification

Happy coding! 즐거운 코딩 되세요! 🚀
