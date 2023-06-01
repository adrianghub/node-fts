const readline = require('readline');
const { callGpt } = require('./call-gpt');

function askQuestion() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('Enter your question (or type "x" to quit): ', (question) => {
      rl.close();
      resolve(question);
    });
  });
}

async function main() {
  while (true) {
    const question = await askQuestion();

    if (question.toLowerCase() === 'x') {
      console.log('Exiting the program...');
      break;
    }

    // Connect to the SQLite database
    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database('context.db');

    try {
      const keywords = await callGpt(`return up to 2 keywords (only nouns) separated by spaces for this sentence: ${question}`);
      const cleanedKeywords = keywords.replace(/[,.]+/g, ' ');

      // Execute the query to find the first record matching the keywords
      const row = await new Promise((resolve, reject) => {
        db.get(`select * from context where body match('${cleanedKeywords}')`, (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(row);
        });
      });

      if (row && row.body) {
        const answer = await callGpt(`Answer the following question using only context:\n${question}\n###\nContext:\n${row.body}.`);
        console.log(answer);
      } else {
        console.log("I don't know :(((");
      }
    } catch (error) {
      console.error(error);
    } finally {
      // Close the database connection
      db.close();
    }
  }
}

main();
