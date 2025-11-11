# TypeScript Backend Starter Template

This is a minimal Express + TypeScript backend template to get started with local development.

## Quick Start

1. **Create a new directory for your backend:**
   ```bash
   mkdir kono-backend
   cd kono-backend
   ```

2. **Initialize npm project:**
   ```bash
   npm init -y
   ```

3. **Install dependencies:**
   ```bash
   npm install express cors express-session cookie-parser
   npm install -D typescript @types/express @types/cors @types/express-session @types/cookie-parser ts-node-dev
   ```

4. **Create tsconfig.json:**
   ```json
   {
     "compilerOptions": {
       "target": "ES2020",
       "module": "commonjs",
       "lib": ["ES2020"],
       "outDir": "./dist",
       "rootDir": "./src",
       "strict": true,
       "esModuleInterop": true,
       "skipLibCheck": true,
       "forceConsistentCasingInFileNames": true,
       "resolveJsonModule": true
     },
     "include": ["src/**/*"],
     "exclude": ["node_modules"]
   }
   ```

5. **Create package.json scripts:**
   ```json
   {
     "scripts": {
       "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
       "build": "tsc",
       "start": "node dist/server.js"
     }
   }
   ```

6. **Create src/server.ts:**
   ```typescript
   import express from 'express';
   import cors from 'cors';
   import session from 'express-session';
   import cookieParser from 'cookie-parser';

   const app = express();
   const PORT = process.env.PORT || 8080;

   // Middleware
   app.use(cors({
     origin: 'http://localhost:5173',
     credentials: true
   }));
   app.use(express.json());
   app.use(cookieParser());
   app.use(session({
     secret: 'your-secret-key',
     resave: false,
     saveUninitialized: false,
     cookie: {
       secure: false, // set to true if using https
       httpOnly: true,
       maxAge: 24 * 60 * 60 * 1000 // 24 hours
     }
   }));

   // In-memory data stores (replace with database in production)
   const users = new Map();
   const wallets = new Map();
   const transactions = new Map();
   const favorites = new Map();

   // Mock coin data
   const mockCoins = [
     {
       ticker: 'BTC',
       kr_coin_name: '비트코인',
       en_coin_name: 'Bitcoin',
       current_price: 50000000,
       opening_price: 49000000,
       high_price: 51000000,
       low_price: 48000000,
       change_24h: 2.04,
       volume_24h: 1000000000
     },
     {
       ticker: 'ETH',
       kr_coin_name: '이더리움',
       en_coin_name: 'Ethereum',
       current_price: 3000000,
       opening_price: 2950000,
       high_price: 3100000,
       low_price: 2900000,
       change_24h: 1.69,
       volume_24h: 500000000
     }
     // Add more coins as needed
   ];

   // Authentication middleware
   const requireAuth = (req: any, res: any, next: any) => {
     if (!req.session.userId) {
       return res.status(401).json({ message: 'Unauthorized' });
     }
     next();
   };

   // Routes

   // Get all coins
   app.get('/api/v1/coins', (req, res) => {
     res.json({ data: mockCoins });
   });

   // Get coin detail
   app.get('/api/v1/coins/:ticker', (req, res) => {
     const coin = mockCoins.find(c => c.ticker === req.params.ticker);
     if (!coin) {
       return res.status(404).json({ message: 'Coin not found' });
     }
     res.json(coin);
   });

   // Get user profile
   app.get('/api/v1/users', requireAuth, (req: any, res) => {
     const user = users.get(req.session.userId);
     if (!user) {
       return res.status(404).json({ message: 'User not found' });
     }
     res.json({
       nickname: user.nickname,
       profileImageUrl: user.profileImageUrl
     });
   });

   // Update nickname
   app.put('/api/v1/users/nickname', requireAuth, (req: any, res) => {
     const user = users.get(req.session.userId);
     if (!user) {
       return res.status(404).json({ message: 'User not found' });
     }
     user.nickname = req.body.nickname;
     res.json({ message: 'Nickname updated successfully' });
   });

   // Get cash balance
   app.get('/api/v1/wallets/cash', requireAuth, (req: any, res) => {
     const wallet = wallets.get(req.session.userId) || { cash: 10000000 };
     res.json({ data: { cash: wallet.cash } });
   });

   // Get holding coins
   app.get('/api/v1/wallets/coins', requireAuth, (req: any, res) => {
     const wallet = wallets.get(req.session.userId) || { coins: [] };
     res.json({ data: wallet.coins || [] });
   });

   // Get specific coin holding
   app.get('/api/v1/wallets/coins/:ticker', requireAuth, (req: any, res) => {
     const wallet = wallets.get(req.session.userId) || { coins: [] };
     const holding = wallet.coins?.find((c: any) => c.ticker === req.params.ticker);
     res.json({ 
       data: holding || { ticker: req.params.ticker, holdingQuantity: 0 } 
     });
   });

   // Get transactions
   app.get('/api/v1/wallets/transactions', requireAuth, (req: any, res) => {
     const userTransactions = transactions.get(req.session.userId) || [];
     res.json({ data: userTransactions });
   });

   // Place order (buy/sell)
   app.post('/api/v1/coins/orders', requireAuth, (req: any, res) => {
     const { ticker, orderType, orderAmount, orderQuantity } = req.body;
     const coin = mockCoins.find(c => c.ticker === ticker);
     
     if (!coin) {
       return res.status(404).json({ message: 'Coin not found' });
     }

     // Implement buy/sell logic here
     const orderId = Date.now().toString();
     const transaction = {
       id: orderId,
       ticker,
       type: orderType,
       price: coin.current_price,
       quantity: orderType === 'buy' 
         ? orderAmount / coin.current_price 
         : orderQuantity,
       total: orderType === 'buy' 
         ? orderAmount 
         : orderQuantity * coin.current_price,
       timestamp: new Date().toISOString(),
       status: 'completed'
     };

     // Save transaction
     const userTransactions = transactions.get(req.session.userId) || [];
     userTransactions.push(transaction);
     transactions.set(req.session.userId, userTransactions);

     res.json(transaction);
   });

   // Get favorites
   app.get('/api/v1/users/favorites', requireAuth, (req: any, res) => {
     const userFavorites = favorites.get(req.session.userId) || [];
     res.json({ data: userFavorites });
   });

   // Check if coin is favorite
   app.get('/api/v1/users/favorites/:ticker', requireAuth, (req: any, res) => {
     const userFavorites = favorites.get(req.session.userId) || [];
     const isFavorite = userFavorites.some((f: any) => f.ticker === req.params.ticker);
     res.json({ data: isFavorite });
   });

   // Add favorite
   app.post('/api/v1/users/favorites/:ticker', requireAuth, (req: any, res) => {
     const userFavorites = favorites.get(req.session.userId) || [];
     const coin = mockCoins.find(c => c.ticker === req.params.ticker);
     
     if (!coin) {
       return res.status(404).json({ message: 'Coin not found' });
     }

     userFavorites.push({
       ticker: coin.ticker,
       kr_coin_name: coin.kr_coin_name
     });
     favorites.set(req.session.userId, userFavorites);
     res.json({ message: 'Added to favorites' });
   });

   // Remove favorite
   app.delete('/api/v1/users/favorites/:ticker', requireAuth, (req: any, res) => {
     const userFavorites = favorites.get(req.session.userId) || [];
     const filtered = userFavorites.filter((f: any) => f.ticker !== req.params.ticker);
     favorites.set(req.session.userId, filtered);
     res.json({ message: 'Removed from favorites' });
   });

   // Get rankings (mock data)
   app.get('/api/v1/rankings', requireAuth, (req, res) => {
     res.json({ data: [] }); // Implement ranking logic
   });

   app.get('/api/v1/rankings/daily', requireAuth, (req, res) => {
     res.json({ data: [] }); // Implement daily ranking logic
   });

   app.get('/api/v1/rankings/me', requireAuth, (req, res) => {
     res.json({ data: [] }); // Implement user ranking
   });

   app.get('/api/v1/rankings/daily/me', requireAuth, (req, res) => {
     res.json({ data: [] }); // Implement user daily ranking
   });

   // Simple login endpoint for testing (create a user and session)
   app.post('/api/v1/auth/login', (req: any, res) => {
     const { email, password } = req.body;
     
     // Simple mock authentication
     const userId = email; // Using email as userId for simplicity
     let user = users.get(userId);
     
     if (!user) {
       // Create new user
       user = {
         id: userId,
         email,
         nickname: email.split('@')[0],
         profileImageUrl: 'https://via.placeholder.com/150'
       };
       users.set(userId, user);
       
       // Initialize wallet with 10,000,000 won
       wallets.set(userId, {
         cash: 10000000,
         coins: []
       });
     }
     
     req.session.userId = userId;
     res.json({ message: 'Login successful', user });
   });

   // Logout
   app.post('/api/v1/auth/logout', (req: any, res) => {
     req.session.destroy();
     res.json({ message: 'Logout successful' });
   });

   app.listen(PORT, () => {
     console.log(`Server is running on http://localhost:${PORT}`);
     console.log('CORS enabled for http://localhost:5173');
   });
   ```

7. **Run the server:**
   ```bash
   npm run dev
   ```

The backend will start on `http://localhost:8080`.

## Next Steps

1. **Add database:** Replace in-memory storage with SQLite, PostgreSQL, or MongoDB
2. **Implement real authentication:** Add proper password hashing and validation
3. **Add real-time prices:** Integrate with Binance, CoinGecko, or Upbit API
4. **WebSocket support:** Add WebSocket for real-time price updates
5. **Add validation:** Use libraries like `express-validator` or `joi`
6. **Error handling:** Add proper error handling middleware
7. **Logging:** Add logging with `winston` or `morgan`

## Testing with Frontend

1. Start the backend: `npm run dev`
2. In the frontend directory, start the dev server: `npm run dev`
3. Open `http://localhost:5173` in your browser
4. Use the login form to create a test user

## API Documentation

See [BACKEND_API.md](../BACKEND_API.md) for the complete API specification.
