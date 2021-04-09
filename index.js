const fs = require('fs');
 multer = require('multer'),
 express = require('express'),
 bodyParser= require('body-parser'),
MongoClient = require('mongodb').MongoClient,
mongoose = require('mongoose');
excelToJson = require('convert-excel-to-json'),
PORT = process.env.PORT || 3000,
keys = require('./config/key'),
url = "mongodb://localhost:27017/",
route = require('./routes/route'),
 app = express();

 app.use(bodyParser.urlencoded({ extended: true }))
 app.use(bodyParser.json())

 app.use('/',route)

global.__basedir = __dirname;
 var dbo;
 var database, collection;
// -> Multer Upload Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + '/uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
    }
});
 
const upload = multer({storage: storage});

app.post('/api/uploadfile', upload.single("uploadfile"), (req, res) =>{
    importExcelData2MongoDB(__basedir + '/uploads/' + req.file.filename);
    res.json({
        'msg': 'File uploaded/import successfully!', 'file': req.file
    });
});
 
// -> Import Excel File to MongoDB database
function importExcelData2MongoDB(filePath){
    // -> Read Excel File to Json Data
    const excelData = excelToJson({
        sourceFile: filePath,
        sheets:[{
            // Excel Sheet Name
            name: 'Customers',
 
           
            header:{
               rows: 1
            },
			
            // Mapping columns to keys
            columnToKey: {
                A: 'UserId',
                B: 'Name',
                C: 'Address',
                D: 'Age'
            }
        }]
    });
 
    
    console.log(excelData);
 
   
    // Insert Json-Object to MongoDB
    MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
        if (err) throw err;
         dbo = db.db("users");
     dbo.collection('customers').insertMany(excelData.Customers, (err, res) => {
            if (err) throw err;
           
            console.log("Number of documents inserted: " + res.insertedCount);
           
            
        });
    });
			
    fs.unlinkSync(filePath);
}
 
//handle error
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((req,res)=>{
console.error(err)
res.status(err.status || 500);
res.json({
  error:{
      message:err.message,
  },
})
})


// Create a Server
app.listen(PORT,()=>{
  console.log("port is listning at the port " +PORT)
})