# iCall Dashboard

iCall의 실시간 시장 데이터 대시보드

## 기능

- 💵 원/달러 환율
- 🪙 Bitcoin (BTC) 가격
- 💎 Ethereum (ETH) 가격  
- 🛢️ WTI 유가
- 😨😀 공포 & 탐욕 지수
- 📰 주요 뉴스 헤드라인

## 설치 및 실행

### 1. 의존성 설치

```bash
cd ~/www/dashboard
npm install
```

### 2. 서버 실행

```bash
npm start
```

또는 개발 모드 (자동 재시작):
```bash
npm run dev
```

### 3. 대시보드 접속

브라우저에서:
```
http://localhost:3000
```

또는 Apache를 통해:
```
http://localhost/dashboard/
```

## 사용법

1. **자동 로드**: 페이지 열 때 마지막 저장된 데이터 표시
2. **수동 업데이트**: "🔄 업데이트" 버튼 클릭 → 최신 데이터 가져옴
3. **데이터 저장**: 모든 데이터는 `data/marketData.json`에 저장

## 파일 구조

```
dashboard/
├── public/              # 정적 파일 (Apache에서 서빙)
│   ├── index.html      # 메인 페이지
│   ├── css/
│   │   └── style.css   # 스타일시트
│   └── js/
│       └── app.js      # 프론트엔드 로직
├── server/             # Node.js 서버
│   ├── server.js       # 메인 서버 파일
│   └── api/
│       └── fetchData.js # 데이터 수집 모듈
├── data/               # 데이터 저장소
│   └── marketData.json # 시장 데이터 JSON
└── package.json        # Node.js 설정
```

## 데이터 소스

- Yahoo Finance API (환율, 암호화폐, 유가)
- Alternative.me API (공포 & 탐욕 지수)
- 뉴스 헤드라인 (수동 업데이트 또는 RSS)

## 문제 해결

### CORS 에러 발생 시
브라우저에서 직접 Yahoo Finance API를 호출할 수 없으므로,
반드시 Node.js 서버를 통해 데이터를 가져와야 합니다.

### 데이터 업데이트 안 될 때
1. 서버가 실행 중인지 확인: `ps aux | grep node`
2. 서버 재시작: `Ctrl+C` 후 `npm start`
3. 로그 확인: 서버 터미널에서 에러 메시지 확인

## 라이선스

© 2026 iCall. All rights reserved.