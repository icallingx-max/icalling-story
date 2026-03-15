// Dashboard Data Loader
// Fetches market data from JSON and updates the DOM

async function loadDashboardData() {
    try {
        const response = await fetch('data/market-data.json');
        const data = await response.json();
        
        // Update timestamp
        document.getElementById('lastUpdate').textContent = data.lastUpdated;
        
        // Update USD/KRW
        updateCard('usdkrw', 'usdkrwChange', data.usdKrw);
        
        // Update BTC
        updateCard('btc', 'btcChange', data.btc);
        
        // Update ETH
        updateCard('eth', 'ethChange', data.eth);
        
        // Update WTI
        updateCard('wti', 'wtiChange', data.wti);
        
        // Update Fear & Greed
        updateFearGreed(data.fearGreed);
        
        // Update Headlines
        updateHeadlines(data.headlines);
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

function updateCard(valueId, changeId, data) {
    const valueEl = document.getElementById(valueId);
    const changeEl = document.getElementById(changeId);
    
    if (valueEl) valueEl.textContent = data.price;
    if (changeEl) {
        changeEl.textContent = data.change;
        changeEl.className = 'card-change ' + (data.isPositive ? 'positive' : 'negative');
    }
}

function updateFearGreed(data) {
    const scoreEl = document.getElementById('fearGreedScore');
    const textEl = document.getElementById('fearGreedText');
    const needleEl = document.getElementById('gaugeNeedle');
    
    if (scoreEl) scoreEl.textContent = data.score;
    if (textEl) textEl.textContent = data.text;
    if (needleEl) {
        needleEl.style.transform = `translateX(-50%) rotate(${data.rotation}deg)`;
    }
}

function updateHeadlines(headlines) {
    const listEl = document.getElementById('headlines');
    if (!listEl) return;
    
    listEl.innerHTML = headlines.map(h => `
        <li>
            <span class="headline-text">${h.text}</span>
            <a href="${h.url}" target="_blank" class="headline-link">Read →</a>
        </li>
    `).join('');
}

// Load data when page loads
document.addEventListener('DOMContentLoaded', loadDashboardData);
