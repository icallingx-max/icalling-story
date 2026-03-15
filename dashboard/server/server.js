const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const fetchData = require('./api/fetchData');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Serve data directory
app.use('/data', express.static(path.join(__dirname, '../data')));

// API endpoint to update data
app.post('/api/update', async (req, res) => {
    try {
        console.log('Updating market data...');
        await fetchData.updateAll();
        console.log('Data updated successfully');
        res.json({ success: true, message: 'Data updated' });
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// API endpoint to get current data
app.get('/api/data', async (req, res) => {
    try {
        const dataPath = path.join(__dirname, '../data/marketData.json');
        const data = await fs.readFile(dataPath, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('Read data error:', error);
        res.status(500).json({ error: 'Failed to read data' });
    }
});

// Initialize data on startup
async function init() {
    try {
        const dataDir = path.join(__dirname, '../data');
        const dataPath = path.join(dataDir, 'marketData.json');
        
        // Create data directory if not exists
        await fs.mkdir(dataDir, { recursive: true });
        
        // Create initial data file if not exists
        try {
            await fs.access(dataPath);
        } catch {
            const initialData = {
                usdkrw: null,
                btc: null,
                eth: null,
                wti: null,
                fearGreed: null,
                headlines: [],
                lastUpdate: null
            };
            await fs.writeFile(dataPath, JSON.stringify(initialData, null, 2));
            console.log('Created initial data file');
        }
        
        console.log('Server initialized');
    } catch (error) {
        console.error('Init error:', error);
    }
}

// Start server
app.listen(PORT, async () => {
    await init();
    console.log(`iCall Dashboard server running on http://localhost:${PORT}`);
    console.log('Press Ctrl+C to stop');
});