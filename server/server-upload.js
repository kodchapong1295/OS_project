const express = require('express');
const multer = require('multer');
const uuid = require('uuid').v4;
const exec = require('child_process').exec;

var fileName="";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) =>{
        const {originalname} =file;
        fileName = file.originalname;
        cb(null, originalname);
    }
});
const upload = multer({ storage })


const app = express()
app.use(express.static('public'));


app.post('/upload', upload.single('avatar'), (req, res) => {
    exec(`cp ~/Desktop/OS_Project/server/uploads/${fileName} ~/Desktop/test`, (e, stdout, stderr)=>{
        if(e instanceof Error){
            console.error(e);
        }
        console.log(stdout);
        console.log('stderr', stderr);
    });
    console.log(fileName);
    return res.json({ status: 'OK' });
});


app.listen(3002, () => {
    console.log('App is running on port 3002');
});
