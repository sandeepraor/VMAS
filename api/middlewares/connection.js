const mongoose = require('mongoose');

async function connection() {
  const data = await mongoose.connect(
    process.env.MONGODB_URL,
    (err, client) => {
      if (err) {
        console.log(err);
      }
      console.log('Connection is succesful');
    }
  );
}

module.exports = connection;
