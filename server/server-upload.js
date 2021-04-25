const express = require('express');
const multer = require('multer');
const execSync = require('child_process').execSync;
var fs = require('fs');

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
	console.log('KUY');
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
execSync(`~/hadoop/hadoop-3.1.4/bin/hadoop fs -mkdir /input`, (e, stdout, stderr)=>{
        if(e instanceof Error){
            console.error(e);
        }
        console.log(stdout);
        console.log('stderr', stderr);
    });
    execSync(`~/hadoop/hadoop-3.1.4/bin/hadoop fs -put ~/inputs/${fileName} /input`, (e, stdout, stderr)=>{
        if(e instanceof Error){
            console.error(e);
        }
        console.log(stdout);
        console.log('stderr', stderr);
    });
    execSync(`cd ~ && ~/hadoop/hadoop-3.1.4/bin/hadoop jar WordCount.jar WordCount /input /output`, (e, stdout, stderr)=>{
       if(e instanceof Error){
            console.error(e);
        }
	console.log('KU JA BA TAI');
        console.log(stdout);
        console.log('stderr', stderr);
    });
    execSync(`cd ~ && ~/hadoop/hadoop-3.1.4/bin/hadoop fs -cat /output/part-r-00000 > temp`, (e, stdout, stderr)=>{
	console.log('Hey');       
 if(e instanceof Error){
            console.error(e);
        }
	if(stderr){
	console.log(stderr);
}
	console.log('hello');
        console.log(stdout);
    //   return res.json({ status: 'OK', message: stdout });
        console.log('stderr', stderr);
    }); 
execSync(`~/hadoop/hadoop-3.1.4/bin/hadoop fs -rm -R /input`, (e, stdout, stderr)=>{
        if(e instanceof Error){
            console.error(e);
        }
        console.log(stdout);
        console.log('stderr', stderr);
    });
execSync(`cd ~ && ls -l > 1`, (e, stdout, stderr)=>{
        console.log('Hey');
 if(e instanceof Error){
            console.error(e);
        }
        if(stderr){
        console.log(stderr);
}
        console.log('hello');
        console.log(stdout);
  //     return res.json({ status: 'OK', message: stdout });
        console.log('stderr', stderr);
    });
execSync(`~/hadoop/hadoop-3.1.4/bin/hadoop fs -rm -R /output`, (e, stdout, stderr)=>{
        if(e instanceof Error){
            console.error(e);
        }
        console.log(stdout);
        console.log('stderr', stderr);
    });
fs.readFile('/home/hadoop/temp', 'utf8', function(err, data) {
    if (err) throw err;
    console.log(data);
    return res.html(data);
});
     console.log(fileName);
//	return res.json({status: 'OK'});    
});


app.listen(3002, () => {
    console.log('App is running on port 3002');
});
