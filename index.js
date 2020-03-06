const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Data = require('./models/Data')
const codesJson = require('./codes.json');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, GET');
      return res.status(200).json({});
  }
  next();
});

app.use('/api/v1/get', require('./routes/get.routes'));
app.use('/api/v1/put', require('./routes/put.routes'));

const PORT = process.env.PORT || config.get('port');

async function initData() {
  const dataCount = await Data.countDocuments({});
  if (dataCount !== 0) {
    console.log(`Database has ${dataCount} rows`);
    return;
  }
  Data.insertMany(codesJson).then(rows => {
    console.log(`Inserting done! Results: ${rows.length} rows`);
  })
  .catch(err => {
    console.log(`Error: ${err}`);
  });
}


async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    app.listen(PORT, () => {
      console.log(`Server has been started on port ${PORT}...`);
    });
    initData();
  } catch(e) {
    console.log('Server Error', e.message);
    process.exit(1);
  }
}

start();
