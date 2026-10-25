const path = require('node:path');
const express = require('express');
const ejs = require('ejs');
const nodemailer = require('nodemailer');
require('dotenv').config();
const email = process.env.APP_EMAIL;
const password = process.env.APP_PASSWORD;

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: email,
    pass: password
  }
});
const PORT = process.env.PORT || 3000;

const app = express();
const fs = require('node:fs');
const fileUpload = require('express-fileupload');


app.use(express.static(path.join(__dirname, 'public')));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.urlencoded({ extended: true }));

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});



app.get('/contact', (req, res) => {
  console.log(req, req.body);
  
  res.render('contact', {isSent: false});
  
});

app.post('/contact', (req, res) => {
  console.log(req, req.body);
  
const mailOptions = {
  from: email,
  to: 'mirdel.shadi@gmail.com',
  subject: req.body.title,
  text: req.body.content
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log('Error sending email:', error);
    res.status(500).send('Error sending email');
  } else {
    console.log('Email sent:', info.response);
    res.render('contact', {isSent: true});
  }
});
  
});


app.post('/post', (req, res) => {
  console.log(req.files);


const dir = Date.now();
const dirPath = __dirname + '/uploads/' + dir;
const filePath = dirPath + '/image.jpg';

if (!fs.existsSync(dirPath)){
  fs.mkdir(dirPath, {recursive: true}, function(err){
    if (err){
      
      return res.status(500).send(err);
    }
  })
}

req.files.image.mv(filePath, function(err){
  if (err){
    
    return res.status(500).send(err);
  }
});
});

app.get('/post/:id', (req, res) => {

  console.log(req.params);

  
  
  res.render('template', { id: req.params.id, text: 'hello', arr: ['item1', 'item2', 'item3'] });

});




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});