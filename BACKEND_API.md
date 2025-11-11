# Backend API Specification

This document outlines the backend API endpoints required to run the KONO crypto trading simulator locally.

## Base URL

Development: `http://localhost:8080`

## Authentication

The API uses cookie-based session authentication with `withCredentials: true`.

## API Endpoints

### Authentication & User Management

#### 1. OAuth2 - Kakao Login
- **Endpoint**: `GET /oauth2/authorization/kakao`
- **Description**: Initiates Kakao OAuth login flow
- **Response**: Redirects to Kakao OAuth page

#### 2. Get User Profile
- **Endpoint**: `GET /api/v1/users`
- **Description**: Get authenticated user's profile information
- **Response**:
```json
{
  "nickname": "string",
  "profileImageUrl": "string",
  "createdAt": "ISO8601 timestamp"
}
```

#### 3. Update Profile Image
- **Endpoint**: `PUT /api/v1/users/profile-image`
- **Description**: Update user's profile image
- **Request Body**:
```json
{
  "imageUrl": "string"
}
```

#### 4. Update Nickname
- **Endpoint**: `PUT /api/v1/users/nickname`
- **Description**: Update user's nickname
- **Request Body**:
```json
{
  "nickname": "string"
}
```

#### 5. Withdraw Account
- **Endpoint**: `DELETE /api/v1/users/withdraw`
- **Description**: Delete user account

#### 6. Get Presigned URL (S3)
- **Endpoint**: `POST /api/v1/s3/presigned-url`
- **Description**: Get presigned URL for S3 upload
- **Request Body**:
```json
{
  "fileName": "string",
  "contentType": "string"
}
```
- **Response**:
```json
{
  "presignedUrl": "string",
  "uploadedFileUrl": "string"
}
```

### Coin Management

#### 7. Get All Coins
- **Endpoint**: `GET /api/v1/coins`
- **Description**: Get list of all available cryptocurrencies
- **Response**:
```json
{
  "data": [
    {
      "ticker": "string",
      "kr_coin_name": "string",
      "en_coin_name": "string",
      "current_price": "number",
      "change_24h": "number"
    }
  ]
}
```

#### 8. Get Coin Detail
- **Endpoint**: `GET /api/v1/coins/:ticker`
- **Description**: Get detailed information for a specific coin
- **Response**:
```json
{
  "ticker": "string",
  "kr_coin_name": "string",
  "en_coin_name": "string",
  "current_price": "number",
  "opening_price": "number",
  "high_price": "number",
  "low_price": "number",
  "change_24h": "number",
  "volume_24h": "number"
}
```

### Trading

#### 9. Place Order
- **Endpoint**: `POST /api/v1/coins/orders`
- **Description**: Execute buy or sell order
- **Request Body**:
```json
{
  "ticker": "string",
  "orderType": "buy" | "sell",
  "orderAmount": "number (optional - for buy orders)",
  "orderQuantity": "number (optional - for sell orders)"
}
```
- **Response**:
```json
{
  "id": "string",
  "ticker": "string",
  "type": "buy" | "sell",
  "price": "number",
  "quantity": "number",
  "total": "number",
  "fee": "number",
  "timestamp": "ISO8601 timestamp",
  "status": "pending" | "completed" | "failed"
}
```

### Wallet Management

#### 10. Get Cash Balance
- **Endpoint**: `GET /api/v1/wallets/cash`
- **Description**: Get user's cash balance
- **Response**:
```json
{
  "data": {
    "cash": "number"
  }
}
```

#### 11. Get Holding Coins
- **Endpoint**: `GET /api/v1/wallets/coins`
- **Description**: Get list of user's coin holdings
- **Response**:
```json
{
  "data": [
    {
      "ticker": "string",
      "kr_coin_name": "string",
      "holdingQuantity": "number",
      "averagePrice": "number",
      "currentPrice": "number"
    }
  ]
}
```

#### 12. Get Specific Coin Holding
- **Endpoint**: `GET /api/v1/wallets/coins/:ticker`
- **Description**: Get user's holding information for a specific coin
- **Response**:
```json
{
  "data": {
    "ticker": "string",
    "holdingQuantity": "number",
    "averagePrice": "number"
  }
}
```

#### 13. Get Transactions
- **Endpoint**: `GET /api/v1/wallets/transactions`
- **Description**: Get user's transaction history
- **Response**:
```json
{
  "data": [
    {
      "id": "string",
      "ticker": "string",
      "type": "buy" | "sell",
      "quantity": "number",
      "price": "number",
      "total": "number",
      "timestamp": "ISO8601 timestamp"
    }
  ]
}
```

### Favorites

#### 14. Get Favorite List
- **Endpoint**: `GET /api/v1/users/favorites`
- **Description**: Get user's favorite coins
- **Response**:
```json
{
  "data": [
    {
      "ticker": "string",
      "kr_coin_name": "string"
    }
  ]
}
```

#### 15. Check Favorite Status
- **Endpoint**: `GET /api/v1/users/favorites/:ticker`
- **Description**: Check if a coin is in user's favorites
- **Response**:
```json
{
  "data": true | false
}
```

#### 16. Add Favorite
- **Endpoint**: `POST /api/v1/users/favorites/:ticker`
- **Description**: Add a coin to favorites
- **Response**: 200 OK

#### 17. Remove Favorite
- **Endpoint**: `DELETE /api/v1/users/favorites/:ticker`
- **Description**: Remove a coin from favorites
- **Response**: 200 OK

### Rankings

#### 18. Get Daily Rankings
- **Endpoint**: `GET /api/v1/rankings/daily`
- **Description**: Get daily ranking leaderboard
- **Response**:
```json
{
  "data": [
    {
      "nickname": "string",
      "profileImageUrl": "string",
      "badgeImageUrl": "string (optional)",
      "profileRate": "number",
      "rank": "number",
      "updatedAt": "ISO8601 timestamp"
    }
  ]
}
```

#### 19. Get User Daily Ranking
- **Endpoint**: `GET /api/v1/rankings/daily/me`
- **Description**: Get authenticated user's daily ranking
- **Response**: Same as endpoint 18

#### 20. Get All-Time Rankings
- **Endpoint**: `GET /api/v1/rankings`
- **Description**: Get all-time ranking leaderboard
- **Response**:
```json
{
  "data": [
    {
      "nickname": "string",
      "profileImageUrl": "string",
      "badgeImageUrl": "string (optional)",
      "totalAssets": "number",
      "rank": "number",
      "updatedAt": "ISO8601 timestamp"
    }
  ]
}
```

#### 21. Get User All-Time Ranking
- **Endpoint**: `GET /api/v1/rankings/me`
- **Description**: Get authenticated user's all-time ranking
- **Response**: Same as endpoint 20

## WebSocket Support

For real-time cryptocurrency price updates, consider implementing WebSocket support:

- **Endpoint**: `ws://localhost:8080/ws/prices`
- **Description**: Subscribe to real-time price updates
- **Message Format**:
```json
{
  "ticker": "string",
  "price": "number",
  "timestamp": "ISO8601 timestamp"
}
```

## Initial Data

New users should receive:
- Initial cash balance: ₩10,000,000
- Empty coin holdings
- Empty transaction history

## Notes

- All monetary values should be in Korean Won (₩)
- Prices should be updated in real-time or near real-time
- Consider implementing rate limiting for trading endpoints
- Implement proper error handling with appropriate HTTP status codes
- Use CORS configuration to allow requests from `http://localhost:5173` (Vite dev server)
