const fs = require('fs');

const data = JSON.parse(fs.readFileSync('quotes.json', 'utf8'));

data.forEach((row) => {
  if (row.quoteAuthor !== '') {
    console.log(`${row.quoteAuthor} said: ${row.quoteText}`);
  }
});