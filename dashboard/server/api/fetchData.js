const https = require('https');
const fs = require('fs').promises;
const path = require('path');

// Yahoo Finance API helper
function fetchYahooData(symbol) {
    return new Promise((resolve, reject) => {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=2d`;
        
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json.chart && json.chart.result && json.chart.result[0]) {
                        const result = json.chart.result[0];
                        const meta = result.meta;
                        const current = meta.regularMarketPrice || meta.previousClose;
                        const previous = meta.previousClose || meta.chartPreviousClose;
                        const change = current - previous;
                        const changePercent = (change / previous) * 100;
                        
                        resolve({
                            price: current,
                            change: change,
                            changePercent: changePercent
                        });
                    } else {
                        reject(new Error('Invalid data structure'));
                    }
                } catch (error) {
                    reject(error);
                }
            });
        }).on('error', reject);
    });
}

// Fetch Fear & Greed Index
function fetchFearGreed() {
    return new Promise((resolve, reject) => {
        const url = 'https://api.alternative.me/fng/?limit=1';
        
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json.data && json.data[0]) {
                        resolve({
                            score: parseInt(json.data[0].value),
                            text: json.data[0].value_classification
                        });
                    } else {
                        reject(new Error('Invalid fear greed data'));
                    }
                } catch (error) {
                    reject(error);
                }
            });
        }).on('error', reject);
    });
}

// Fetch headlines (simplified for now)
function fetchHeadlines() {
    // In production, this would fetch from RSS or news API
    // For now, returning sample data
    return [
        {
            text: '이란전쟁 격화로 유가 급등... WTI $100 돌파 우려',
            url: 'https://finance.yahoo.com/quote/CL=F'
        },
        {
            text: '비트코인, $7만 선 회복하며 안정세 지속',
            url: 'https://finance.yahoo.com/quote/BTC-USD'
        },
        {
            text: '미국 증시, 이란 리스크에 하띱세',
            url: 'https://finance.yahoo.com'
        }
    ];
}

// Update all data
async function updateAll() {
    try {
        console.log('Fetching market data...');
        
        // Fetch all data in parallel
        const [usdkrw, btc, eth, wti, fearGreed] = await Promise.all([
            fetchYahooData('KRW=X').catch(err => {
                console.error('USDKRW error:', err.message);
                return null;
            }),
            fetchYahooData('BTC-USD').catch(err => {
                console.error('BTC error:', err.message);
                return null;
            }),
            fetchYahooData('ETH-USD').catch(err => {
                console.error('ETH error:', err.message);
                return null;
            }),
            fetchYahooData('CL=F').catch(err => {
                console.error('WTI error:', err.message);
                return null;
            }),
            fetchFearGreed().catch(err => {
                console.error('FearGreed error:', err.message);
                return { score: 50, text: 'Neutral' };
            })
        ]);
        
        const headlines = fetchHeadlines();
        
        // Prepare data object
        const marketData = {
            usdkrw,
            btc,
            eth,
            wti,
            fearGreed,
            headlines,
            lastUpdate: new Date().toISOString()
        };
        
        // Save to JSON file
        const dataPath = path.join(__dirname, '../../data/marketData.json');
        await fs.writeFile(dataPath, JSON.stringify(marketData, null, 2));
        
        console.log('Data saved successfully');
        console.log(`USD/KRW: ${usdkrw ? usdkrw.price : 'N/A'}`);
        console.log(`BTC: ${btc ? btc.price : 'N/A'}`);
        console.log(`ETH: ${eth ? eth.price : 'N/A'}`);
        console.log(`WTI: ${wti ? wti.price : 'N/A'}`);
        console.log(`Fear&Greed: ${fearGreed.score}`);
        
    } catch (error) {
        console.error('Update error:', error);
        throw error;
    }
}

module.exports = {
    updateAll
};