const express = require('express');
const app = express();
const https = require('https');
const PORT = 3000;
const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,           
   optionSuccessStatus:200,
}

app.use(cors(corsOptions)) 
app.use(express.json());

app.get('/getTimeByIP', async (req, res) => {
  try {
    const clientIP = req.query.ip;
    const response = await new Promise((resolve, reject) => {
      https.get(`https://timeapi.io/api/Time/current/ip?ipAddress=${clientIP}`, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve(JSON.parse(data));
        });
      }).on('error', (err) => {
        reject(err);
      });
    });
    res.json(response);
  } catch (error) {
    console.error('Error fetching time:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
