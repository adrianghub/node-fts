const https = require('https');

require('dotenv').config(); 

function callGpt(query) {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.OPENAI_API_KEY;
    const apiUrl = 'api.openai.com';
    const path = '/v1/chat/completions';
    let responseData = '';

    const data = JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: query }],
      temperature: 0.7
    });

    const options = {
      hostname: apiUrl,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    };

    const req = https.request(options, (res) => {
      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(responseData);

          resolve(response.choices[0].message.content);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

module.exports = {
  callGpt
};
