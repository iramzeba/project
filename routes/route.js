const express = require('express'),
ObjectId = require('mongodb').ObjectId,
mongodb     = require('mongodb'),
router = express.Router();

//viewAll
router.get("/show", (request, response) => {
  collection.find({}).toArray((error, result) => {
      if(error) {
          return response.status(500).send(error);
      }
      response.send(result);
  });
});
   
  //add
router.post("/add", (req, res) => {
  const tutorial = {UserId:req.body.UserId, 
     Name: req.body.Name, 
      Address:req.body.Address,
       Age: req.body.Age };
   console.log(req.body)
  collection.insert(tutorial, (error, result) => {
      if(error) {
          return res.status(500).send(error);
      }
     
      res.json({result})
  });
});

//view by id
router.get("/show/:id", (req, res) => {
  var id = req.params.id;
  collection.findOne({"_id": new ObjectId(id)} , (error, result) => {
      if(error) {
          return res.status(500).send(error);
      }
     res.json({result})
  });
});

//delete
router.delete('/delete/:id',(req,res)=>{
  var id = req.params.id;
  collection.deleteOne({"_id": new ObjectId(id)}, (error, result)=>{
    if(error) {
      return res.status(500).send(error);
  }
 res.json({result})
  });
});


//update
router.post('/edit/:id',(req,res)=>{
  var id = req.params.id;

  collection.update({"_id":new mongodb.ObjectId(id)}, {$set:req.body},(error,result)=>{
    if(error) {
      return res.status(500).send(error);
  }
  console.log(result)
 res.json({result})
  })


})

module.exports = router;