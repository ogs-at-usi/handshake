const mongoose = require('mongoose');

require('dotenv').config();

const URL = process.argv.length > 2 ? process.argv[2] : process.env.MONGODB_URI;
if (!URL) {
  console.error('URL not valid: ' + URL);
  process.exit(1);
}
console.log('Dropping DB at URL: ' + URL);

// ask for confirmation
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});
readline.question(
  'Are you sure you want to drop the database? (y/n) ',
  (answer) => {
    if (answer === 'y') {
      console.log('Dropping database...');
      mongoose
        .connect(URL, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        .then(() => {
          mongoose.connection.db
            .dropDatabase()
            .then(() => {
              console.log('✅ Database dropped');
              process.exit(0);
            })
            .catch((err) => {
              console.error('Error dropping database: ' + err);
              process.exit(1);
            });
        })
        .catch((err) => {
          console.error('Error connecting to database: ' + err);
          process.exit(1);
        });
    } else {
      console.log('Aborting');
      process.exit(0);
    }
  }
);
