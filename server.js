const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/search-diamonds', async (req, res) => {
    try {
        const filterParams = req.body; 
        const targetUrl = 'https://www.abovediamond.com/api/product-diamond';

        const response = await axios.post(targetUrl, filterParams, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        const rawDiamondsData = response.data;
        const markupPercent = 0.95; // 💡 ถูกกว่า above diamond 5%
        
        if (rawDiamondsData && rawDiamondsData.diamonds) {
            const customizedDiamonds = rawDiamondsData.diamonds.map(diamond => {
                return {
                    id: diamond.id,
                    shape: diamond.shape,
                    carat: diamond.carat,
                    color: diamond.color,
                    clarity: diamond.clarity,
                    cut: diamond.cut,
                    certificate: diamond.certificate,
                    cert_number: diamond.cert_number,
                    image_url: diamond.image_url,
                    video_url: diamond.video_url,
                    price: Math.round(diamond.price * markupPercent) 
                };
            });
            res.json({ success: true, diamonds: customizedDiamonds, total: rawDiamondsData.total });
        } else {
            res.json({ success: false, diamonds: [], total: 0 });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ success: false, message: 'คลังสินค้าขัดข้องชั่วคราว' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
