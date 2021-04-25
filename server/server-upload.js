const express = require('express');
const multer = require('multer');
const execSync = require('child_process').execSync;
var fs = require('fs');

var fileName = "";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        const { originalname } = file;
        fileName = file.originalname;
        cb(null, originalname);
    }
});
const upload = multer({ storage })


const app = express()
app.use(express.static('public'));


app.post('/upload', upload.single('avatar'), (req, res) => {
    execSync(`cp ${req.file.path} ~/inputs`, (e, stdout, stderr) => {
        if (e instanceof Error) {
            console.error(e);
        }
        console.log('KUY');
        console.log(stdout);
        console.log('stderr', stderr);
    });
    execSync(`rm ${req.file.path}`, (e, stdout, stderr) => {
        if (e instanceof Error) {
            console.error(e);
        }
        console.log(stdout);
        console.log('stderr', stderr);
    });
    execSync(`~/hadoop/hadoop-3.1.4/bin/hadoop fs -mkdir /input`, (e, stdout, stderr) => {
        if (e instanceof Error) {
            console.error(e);
        }
        console.log(stdout);
        console.log('stderr', stderr);
    });
    execSync(`~/hadoop/hadoop-3.1.4/bin/hadoop fs -put ~/inputs/${fileName} /input`, (e, stdout, stderr) => {
        if (e instanceof Error) {
            console.error(e);
        }
        console.log(stdout);
        console.log('stderr', stderr);
    });
    execSync(`cd ~ && ~/hadoop/hadoop-3.1.4/bin/hadoop jar WordCount.jar WordCount /input /output`, (e, stdout, stderr) => {
        if (e instanceof Error) {
            console.error(e);
        }
        console.log('KU JA BA TAI');
        console.log(stdout);
        console.log('stderr', stderr);
    });
    execSync(`cd ~ && ~/hadoop/hadoop-3.1.4/bin/hadoop fs -cat /output/part-r-00000 > temp`, (e, stdout, stderr) => {
        console.log('Hey');
        if (e instanceof Error) {
            console.error(e);
        }
        if (stderr) {
            console.log(stderr);
        }
        console.log('hello');
        console.log(stdout);
        //   return res.json({ status: 'OK', message: stdout });
        console.log('stderr', stderr);
    });
    execSync(`~/hadoop/hadoop-3.1.4/bin/hadoop fs -rm -R /input`, (e, stdout, stderr) => {
        if (e instanceof Error) {
            console.error(e);
        }
        console.log(stdout);
        console.log('stderr', stderr);
    });
    execSync(`~/hadoop/hadoop-3.1.4/bin/hadoop fs -rm -R /output`, (e, stdout, stderr) => {
        if (e instanceof Error) {
            console.error(e);
        }
        console.log(stdout);
        console.log('stderr', stderr);
    });
    fs.readFile('/home/hadoop/temp', 'utf8', function (err, data) {
        if (err) throw err;
        console.log(data);
        res.set('Content-Type', 'text/html');
let text =data;

text = text.split('\n');
text = text.map(el => {
    return { word: el.split('\t')[0], count: el.split('\t')[1] };
});
text = text.slice(0,text.length-1);
let html = text.map(el => {
    return `<tr><td style=border: 1px solid #ddd;
    padding: 8px;>${el.word}</td><td>${el.count}</td></tr>`;
})
let ans = "";
html.forEach(el=>{
    ans+=el;
});
html = `<table style="font-family: Arial, Helvetica, sans-serif;
border-collapse: collapse;
width: 100%;"><tr><th style="border: 1px solid #ddd;
padding: 8px; padding-top: 12px;
padding-bottom: 12px;
text-align: left;
background-color: #4CAF50;
color: white;">Items</th><th style="border: 1px solid #ddd;
padding: 8px; padding-top: 12px;
padding-bottom: 12px;
text-align: left;
background-color: #4CAF50;
color: white;">Amount</th></tr>`+ans+`</table>`;
	res.send(Buffer.from(html));
    });
    console.log(fileName);
    //	return res.json({status: 'OK'});    
    
});


app.listen(3002, () => {
    console.log('App is running on port 3002');
});
