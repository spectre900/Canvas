const express = require('express');
const bodyParser = require('body-parser');
const { jsPDF } = require('jspdf');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(cors());
app.use(bodyParser.json())
app.use(express.static('client/build'));

app.get('/download/:file', function(req, res){
  const filePath = path.resolve(__dirname, 'pdf', req.params.file)
  fs.access(filePath, error => {
    if (!error) {
        res.sendFile(filePath);
    } else {
        res.sendStatus(404);
    }
  });
});

app.post('/generate', function(req, res){
  var pdf = new jsPDF(req.body.orientation, 'px', [req.body.width, req.body.height]);
  pdf.addImage(req.body.data, 'PNG', 0, 0, req.body.width, req.body.height);
  pdf.save(path.resolve(__dirname, 'pdf', req.body.name));
  res.sendStatus(200);
});

app.get('*', function(req, res){
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});