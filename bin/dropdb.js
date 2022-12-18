const mongoose = require('mongoose');

require('dotenv').config();

const URL = process.argv.length > 2 ? process.argv[2] : process.env.MONGODB_URI;
if (!URL) {
  console.error('URL not valid: ' + URL);
  process.exit(1);
}
console.log('Dropping DB at URL: ' + URL);

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

// ask for confirmation
await readline.question(
  'Are you sure you want to drop the database? (y/n) ',
  async answer => {
    if (answer !== 'y') {
      console.log('Aborting');
      process.exit(0);
    }

    console.log('Dropping database...');
    try {
      await mongoose.connect(URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    } catch (err) {
      console.error('Error connecting to database: ' + err);
      process.exit(1);
    }

    try {
      await mongoose.connection.db.dropDatabase();
      console.log('✅ Database dropped');
      process.exit(0);
    } catch (err) {
      console.error('Error dropping database: ' + err);
      process.exit(1);
    }
  }
);
