const express = require('express');
const jspdf = require('jspdf');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());

app.use(express.static('client/build'));

app.get('*', function(req, res){
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});