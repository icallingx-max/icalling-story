// API endpoints
const API_BASE = 'https://query1.finance.yahoo.com/v8/finance/chart/';

// Symbols
const SYMBOLS = {
    USDKRW: 'KRW=X',
    BTC: 'BTC-USD',
    ETH: 'ETH-USD',
    WTI: 'CL=F'
};

// Fetch data from Yahoo Finance
async function fetchYahooData(symbol) {
    try {
        const response = await fetch(`${API_BASE}${symbol}?interval=1d&range=2d`);
        const data = await response.json();
        
        if (data.chart && data.chart.result && data.chart.result[0]) {
            const result = data.chart.result[0];
            const meta = result.meta;
            const current = meta.regularMarketPrice || meta.previousClose;
            const previous = meta.previousClose || meta.chartPreviousClose;
            const change = current - previous;
            const changePercent = (change / previous) * 100;
            
            return {
                price: current,
                change: change,
                changePercent: changePercent
            };
        }
        return null;
    } catch (error) {
        console.error(`Error fetching ${symbol}:`, error);
        return null;
    }
}

// Fetch Fear & Greed Index
async function fetchFearGreed() {
    try {
        const response = await fetch('https://api.alternative.me/fng/?limit=1');
        const data = await response.json();
        
        if (data.data && data.data[0]) {
            return {
                score: parseInt(data.data[0].value),
                text: data.data[0].value_classification
            };
        }
        return null;
    } catch (error) {
        console.error('Error fetching fear & greed:', error);
        return { score: 45, text: 'Neutral' };
    }
}

// Format currency
function formatCurrency(num) {
    return '$' + num.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

// Format change
function formatChange(change, changePercent) {
    const sign = change >= 0 ? '+' : '';
    const className = change >= 0 ? 'positive' : 'negative';
    return `<span class="${className}">${sign}${changePercent.toFixed(2)}%</span>`;
}

// Update card
function updateCard(elementId, changeId, data, formatter = formatCurrency) {
    if (!data) return;
    
    document.getElementById(elementId).innerHTML = formatter(data.price);
    document.getElementById(changeId).innerHTML = formatChange(data.change, data.changePercent);
}

// Update Fear & Greed
function updateFearGreed(data) {
    if (!data) return;
    
    document.getElementById('fearGreedScore').textContent = data.score;
    document.getElementById('fearGreedText').textContent = data.text;
    
    const angle = (data.score / 100) * 180 - 90;
    document.getElementById('gaugeNeedle').style.transform = 
        `translateX(-50%) rotate(${angle}deg)`;
}

// Update headlines
function updateHeadlines() {
    const headlines = [
        { text: '이란전쟁 격화로 유가 급등... WTI $99 돌파', url: 'https://finance.yahoo.com/quote/CL=F' },
        { text: '비트코인, $7만 선 회복하며 안정세', url: 'https://finance.yahoo.com/quote/BTC-USD' },
        { text: '미국 증시, 이란 리스크에 하세', url: 'https://finance.yahoo.com' }
    ];
    
    const listHtml = headlines.map(h => `
        <li>
            <span class="headline-text">${h.text}</span>
            <a href="${h.url}" target="_blank" class="headline-link">원문보기 →</a>
        </li>
    `).join('');
    
    document.getElementById('headlines').innerHTML = listHtml;
}

// Update timestamp
function updateTimestamp() {
    const now = new Date();
    const timeString = now.toLocaleString('ko-KR', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    document.getElementById('lastUpdate').textContent = timeString;
}

// Refresh all data
async function refreshData() {
    const btn = document.querySelector('.refresh-btn');
    btn.classList.add('loading');
    
    const usdkrw = await fetchYahooData(SYMBOLS.USDKRW);
    const btc = await fetchYahooData(SYMBOLS.BTC);
    const eth = await fetchYahooData(SYMBOLS.ETH);
    const wti = await fetchYahooData(SYMBOLS.WTI);
    const fearGreed = await fetchFearGreed();
    
    if (usdkrw) updateCard('usdkrw', 'usdkrwChange', usdkrw, 
        (p) => '₩' + p.toFixed(1));
    if (btc) updateCard('btc', 'btcChange', btc);
    if (eth) updateCard('eth', 'ethChange', eth);
    if (wti) updateCard('wti', 'wtiChange', wti);
    if (fearGreed) updateFearGreed(fearGreed);
    
    updateHeadlines();
    updateTimestamp();
    
    btn.classList.remove('loading');
}

// Auto refresh every 5 minutes
setInterval(refreshData, 5 * 60 * 1000);

// Initial load
document.addEventListener('DOMContentLoaded', refreshData);