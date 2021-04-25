const express = require('express');
const multer = require('multer');
const execSync = require('child_process').execSync;

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
    execSync(`cp ${req.file.path} ~/inputs`, (e, stdout, stderr)=>{
        if(e instanceof Error){
            console.error(e);
        }
        console.log(stdout);
        console.log('stderr', stderr);
    });
    execSync(`rm ${req.file.path}`, (e, stdout, stderr)=>{
        if(e instanceof Error){
            console.error(e);
        }
        console.log(stdout);
        console.log('stderr', stderr);
    });
    execSync(`cd ~ && hadoop fs -put ~/inputs/${fileName} /input`, (e, stdout, stderr)=>{
        if(e instanceof Error){
            console.error(e);
        }
        console.log(stdout);
        console.log('stderr', stderr);
    });
    execSync(`hadoop jar WordCount.jar WordCount /input /output`, (e, stdout, stderr)=>{
        if(e instanceof Error){
            console.error(e);
        }
        console.log(stdout);
        console.log('stderr', stderr);
    });
    execSync(`hadoop fs -cat /output/part-r-00000`, (e, stdout, stderr)=>{
        if(e instanceof Error){
            console.error(e);
        }
        console.log(stdout);
        return res.json({ status: 'OK', message: stdout });
        console.log('stderr', stderr);
    });
    // console.log(fileName);
    
});


app.listen(3002, () => {
    console.log('App is running on port 3002');
});
