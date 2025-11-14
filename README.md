<div align="center">

# 🎮 KONO - Crypto Trading Simulator

> **"From Korean '코인 놀이터' (Coin Playground)"**  
> Where crypto curiosity meets zero-risk practice. Born from the idea that everyone should experience trading without the fear of losing real money.

[![Website](https://img.shields.io/badge/🌐_Live_Demo-playkono.com-4CAF50?style=for-the-badge)](https://playkono.com/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

**Practice crypto trading with ₩10,000,000 virtual assets • Real-time market data • Zero risk**

[🚀 Try Now](https://playkono.com/) • [📖 Documentation](#) • [🐛 Report Bug](#) • [✨ Request Feature](#)

---

<img src="https://github.com/100-hours-a-week/7-team-kono-fe/blob/develop/assets/1.png" alt="KONO App Preview" width="90%"/>

</div>

<br/>
<br/>

## 1. Project Overview

> **KONO** (short for _Coin Noriteo_, meaning “Coin Playground”) is a **crypto trading simulator** where users can experience real-time cryptocurrency trading using **virtual assets**.
> Users can practice buying and selling various coins without risking real money, allowing them to safely overcome the challenges of the crypto market such as **mindless investing, high entry barriers, and real-trade risks** within a learning environment.

### Core Features

- **Coin Explorer**: Real-time prices and sorting for 163 cryptocurrencies
- **User Portfolio**: Visualized profit rate and list of owned coins <img src="https://github.com/100-hours-a-week/7-team-kono-fe/blob/develop/assets/2.png" width="100%"/>
- **Coin Details**: Provides charts, price info (open, high, low), and more
- **Trading System**: Receive ₩10,000,000 in virtual assets upon signup, trade in real time
- **Watchlist**: Quick access to favorite coins and live prices <img src="https://github.com/100-hours-a-week/7-team-kono-fe/blob/develop/assets/3.png" width="100%"/>
- **Global/Daily Rankings**: Leaderboards based on investment performance <img src="https://github.com/100-hours-a-week/7-team-kono-fe/blob/develop/assets/4.png" width="100%"/>

<br/>
<br/>

## 2. Team Members

<div align="center">
<table>
  <tr>
    <td align="center">
      <img src="https://github.com/hyogshin.png" width="100" height="100" style="border-radius: 50%;"/><br/>
      <b><a href="https://github.com/hyogshin">Hayden</a></b>
    </td>
    <td align="center">
      <img src="https://github.com/from-minju.png" width="100" height="100" style="border-radius: 50%;"/><br/>
      <b><a href="https://github.com/from-minju">Jenny</a></b>
    </td>
    <td align="center">
      <img src="https://github.com/keen1014.png" width="100" height="100" style="border-radius: 50%;"/><br/>
      <b><a href="https://github.com/keen1014">Keen</a></b>
    </td>
    <td align="center">
      <img src="https://github.com/yosep98.png" width="100" height="100" style="border-radius: 50%;"/><br/>
      <b><a href="https://github.com/yosep98">Sep</a></b>
    </td>
    <td align="center">
      <img src="https://github.com/availrum.png" width="100" height="100" style="border-radius: 50%;"/><br/>
      <b><a href="https://github.com/availrum">June</a></b>
    </td>
  </tr>
  <tr>
    <td align="center">FE | DevOps | PM</td>
    <td align="center">BE</td>
    <td align="center">Fullstack</td>
    <td align="center">BE</td>
    <td align="center">DevOps</td>
  </tr>
  <tr>
    <td align="center">WebSocket-based<br/>real-time price collector,<br/>frontend implementation</td>
    <td align="center">Ranking API,<br/>Redis caching</td>
    <td align="center">Buy/Sell logic,<br/>API integration</td>
    <td align="center">OAuth2,<br/>Presigned URL,<br/>Rate limiting</td>
    <td align="center">CI/CD,<br/>Docker,<br/>Grafana</td>
  </tr>
</table>
</div>

<br/>
<br/>

## 3. Development Workflow

- **Sprint 1:** Planning and design (UI, ERD, API specifications)
- **Sprint 2:** MVP development and environment setup
- **Sprint 3:** Launch and performance optimization
- **Sprint 4:** Trading competition event and user feedback integration

<br/>

## 4. Tech Stack

<div align=center> 
  <img src="https://img.shields.io/badge/java-007396?style=for-the-badge&logo=java&logoColor=white"> 
  <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"> 
  <img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black"> 
  <img src="https://img.shields.io/badge/spring boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white"> 
  <img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white"> 
  <img src="https://img.shields.io/badge/redis-DC382D?style=for-the-badge&logo=redis&logoColor=white">
  <img src="https://img.shields.io/badge/amazon aws-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white">
  <img src="https://img.shields.io/badge/github actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white">
  <img src="https://img.shields.io/badge/prometheus-E6522C?style=for-the-badge&logo=prometheus&logoColor=white">
  <img src="https://img.shields.io/badge/grafana-F46800?style=for-the-badge&logo=grafana&logoColor=white">
</div>

<br/>

## 5. Commit Convention

| Type     | Description                                                               |
| -------- | ------------------------------------------------------------------------- |
| feat     | Add a new feature                                                         |
| fix      | Fix a bug                                                                 |
| docs     | Documentation updates                                                     |
| style    | Code style changes (formatting, missing semicolons, etc.)                 |
| refactor | Code refactoring without changing functionality (e.g., variable renaming) |
| chore    | Build or configuration changes                                            |
| build    | Build-related changes                                                     |
| test     | Add or modify test code                                                   |
