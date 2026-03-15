# iCalling Website - Project Structure & Work Log

## 📁 Folder Structure

```
/home/dalai/www/
├── index.html                 # Home page (English)
├── css/
│   └── style.css             # Home page styles
├── js/                       # (empty - for future use)
├── img/                      # Images (icalling.256.jpg, etc.)
│
├── dashboard/
│   ├── index.html            # Dashboard page
│   ├── css/
│   │   └── style.css        # Dashboard styles
│   ├── js/
│   │   └── dashboard.js     # Data loader (fetches JSON)
│   └── data/
│       └── market-data.json # ← UPDATE THIS FILE ONLY
│
└── assets/                   # Old files (backup)
```

## 📝 How to Update Data

### For Future iCall (when Calling asks for data update):

**File to modify:** `/home/dalai/www/dashboard/data/market-data.json`

**Format:**
```json
{
  "lastUpdated": "Mar 15, 2025 10:52 AM",
  "usdKrw": {
    "price": "₩1,448.5",
    "change": "+0.3%",
    "isPositive": true
  },
  "btc": {
    "price": "$84,127",
    "change": "+1.8%",
    "isPositive": true
  },
  "eth": {
    "price": "$1,945",
    "change": "-0.5%",
    "isPositive": false
  },
  "wti": {
    "price": "$67.18",
    "change": "-1.2%",
    "isPositive": false
  },
  "fearGreed": {
    "score": 24,
    "text": "Extreme Fear",
    "rotation": -46.8
  },
  "headlines": [
    {
      "text": "Bitcoin hits new milestone...",
      "url": "https://finance.yahoo.com/quote/BTC-USD"
    }
  ]
}
```

**Steps:**
1. Read the current `market-data.json`
2. Update values (get from Yahoo Finance, CoinGecko, etc.)
3. Write back to file
4. Calculate Fear & Greed rotation: `(score/100)*180 - 90`
5. Update headlines if requested

**Example update:**
```bash
# When Calling says: "Update BTC to $85,230"
# Just change in JSON:
"btc": {
  "price": "$85,230",
  "change": "+1.3%",
  "isPositive": true
}
```

## 🎨 Design Notes

### Home Page
- Purple gradient background (#667eea → #764ba2)
- iCalling image: circular with soft shadow (like moon)
- Navigation: Home | Dashboard | Blog
- English text only

### Dashboard
- Sample data warning displayed prominently
- Fear & Greed gauge (0-100 scale)
- Cards: USD/KRW, BTC, ETH, WTI Oil
- Headlines section

## ⚠️ Important Reminders

1. **Always say "Sample Data"** on dashboard - not real-time
2. **English only** for external-facing pages
3. **iCalling** (not iCall) for branding
4. **Images:** Use `/home/dalai/www/img/` (copied, not symlinked)
5. **Cache issues:** Tell Calling to Ctrl+Shift+R after updates

## 🔄 When Calling Asks for Updates

**Typical requests:**
- "Update morning data" → Update all prices + headlines
- "Change BTC to $X" → Just update BTC value
- "Add this headline" → Add to headlines array
- "Update Fear & Greed" → Check alternative.me

**Data Sources:**
- Yahoo Finance: Stocks, Oil, Forex
- CoinGecko: BTC, ETH prices
- Alternative.me: Fear & Greed Index

---
*Last updated by: iCall (Mar 15, 2025)*
*Project: iCalling Website v2.0*
