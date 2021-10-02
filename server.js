const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('public'));

app.get('/punctuation-analysis', function (_req, _res) {
  _res.sendFile(path.resolve(__dirname, './views/index.html'));
});

app.listen((process.env.PORT || 3000), function () {
  console.log('App listening on port ' + (process.env.PORT || 3000));
});
