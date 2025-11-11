# 로컬 개발 환경 설정 가이드

이 문서는 KONO 클라이언트를 로컬에서 실행하는 방법을 설명합니다.

## 필요 사항

- Node.js 18 이상 및 npm
- TypeScript로 작성된 백엔드 서버 (API 명세는 [BACKEND_API.md](./BACKEND_API.md) 참조)

## 프론트엔드 설정

### 1. 저장소 클론

```bash
git clone https://github.com/hyogshin/kono-client.git
cd kono-client
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env.example` 파일을 복사하여 `.env.development` 파일을 생성합니다:

```bash
cp .env.example .env.development
```

`.env.development` 파일을 열어 다음 값들을 수정합니다:

```env
# 백엔드 API URL - 로컬 TypeScript 백엔드 주소로 설정
VITE_API_URL=http://localhost:8080

# 카카오 OAuth API 키 (선택사항 - 카카오 개발자 콘솔에서 발급)
VITE_KAKAO_API_KEY=your_kakao_api_key_here
```

### 4. 개발 서버 실행

```bash
npm run dev
```

개발 서버가 `http://localhost:5173`에서 실행됩니다.

### 5. 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `dist/` 디렉토리에 생성됩니다.

## 백엔드 서버 구현

프론트엔드가 동작하려면 백엔드 API 서버가 필요합니다. TypeScript로 간단한 백엔드를 만들어야 합니다.

### 빠른 시작

[BACKEND_STARTER.md](./BACKEND_STARTER.md) 파일에 복사해서 바로 사용할 수 있는 Express + TypeScript 백엔드 템플릿이 제공됩니다.

### 백엔드 요구사항

상세한 API 명세는 [BACKEND_API.md](./BACKEND_API.md) 파일을 참조하세요.

**주요 기능:**

1. **인증 시스템**
   - 쿠키 기반 세션 인증
   - 카카오 OAuth2 로그인 (선택사항)
   
2. **코인 관리**
   - 코인 목록 조회 (`/api/v1/coins`)
   - 코인 상세 정보 (`/api/v1/coins/:ticker`)
   
3. **거래 시스템**
   - 매수/매도 주문 (`/api/v1/coins/orders`)
   
4. **지갑 관리**
   - 현금 잔액 조회 (`/api/v1/wallets/cash`)
   - 보유 코인 조회 (`/api/v1/wallets/coins`)
   - 거래 내역 조회 (`/api/v1/wallets/transactions`)
   
5. **관심 코인**
   - 관심 코인 추가/삭제/조회 (`/api/v1/users/favorites`)
   
6. **랭킹 시스템**
   - 일간/전체 랭킹 조회 (`/api/v1/rankings`)

### 초기 데이터

- 신규 사용자에게 초기 현금: **₩10,000,000**
- 빈 코인 보유 내역
- 빈 거래 내역

### CORS 설정

백엔드 서버는 다음 origin을 허용해야 합니다:
- `http://localhost:5173` (Vite 개발 서버)

### WebSocket (권장)

실시간 가격 업데이트를 위해 WebSocket 구현을 권장합니다:

```
ws://localhost:8080/ws/prices
```

메시지 형식:
```json
{
  "ticker": "BTC",
  "price": 50000000,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## 백엔드 구현 예시 (Express + TypeScript)

간단한 백엔드 서버 구조 예시:

```
backend/
├── src/
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── coins.ts
│   │   ├── wallets.ts
│   │   ├── rankings.ts
│   │   └── favorites.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Coin.ts
│   │   ├── Wallet.ts
│   │   └── Transaction.ts
│   ├── middleware/
│   │   └── auth.ts
│   ├── services/
│   │   └── priceService.ts
│   └── server.ts
├── package.json
└── tsconfig.json
```

### 추천 라이브러리

- **Express**: 웹 프레임워크
- **ws**: WebSocket 서버
- **express-session**: 세션 관리
- **axios**: 외부 API 호출 (실시간 코인 가격)
- **sqlite3** 또는 **PostgreSQL**: 데이터베이스

## 실시간 코인 가격 데이터

실제 코인 가격 데이터를 얻기 위해 다음 API를 사용할 수 있습니다:

- **Binance API**: https://api.binance.com/api/v3/ticker/price
- **CoinGecko API**: https://www.coingecko.com/api/documentations/v3
- **Upbit API**: https://docs.upbit.com/reference

## 개발 팁

1. **Mock 데이터**: 초기 개발 시 하드코딩된 코인 목록과 가격을 사용할 수 있습니다
2. **세션 관리**: 간단한 메모리 기반 세션으로 시작 (나중에 Redis로 확장 가능)
3. **데이터베이스**: 초기에는 SQLite로 시작하여 빠르게 프로토타입 제작
4. **실시간 가격**: WebSocket 대신 폴링으로 시작해도 됩니다

## 문제 해결

### 프론트엔드가 백엔드에 연결되지 않는 경우

1. `.env.development` 파일의 `VITE_API_URL`이 올바른지 확인
2. 백엔드 서버가 실행 중인지 확인 (`http://localhost:8080`)
3. CORS가 올바르게 설정되어 있는지 확인
4. 브라우저 개발자 도구의 Network 탭에서 요청 확인

### CORS 오류가 발생하는 경우

백엔드에서 다음과 같이 CORS를 설정:

```typescript
import cors from 'cors';

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

## 추가 문서

- [BACKEND_API.md](./BACKEND_API.md) - 전체 API 명세서
- [README.md](./README.md) - 프로젝트 개요
