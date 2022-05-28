const express = require('express');
app = express();
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended:false}));

app.get("/",function(request,response){
  response.sendFile(__dirname+"/index.html");
})
app.post("/failure",function(req,res){
  res.redirect("/")
})
app.post("/submit",function(req,res){
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var emailId = req.body.emailId;
  console.log(firstName,lastName,emailId);
  const data = {
    members: [
      {
        email_address:emailId,
        status:"subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };
  const jsonData = JSON.stringify(data);
  const url = "https://us18.api.mailchimp.com/3.0/lists/933e89be03"
  const options  = {
    method:"POST",
    auth: "Bhaskar:c59bd0cdd663e1e809a7ef52b2b69614-us18"
  }
  const request = https.request(url,options,function(response){
    response.on("data",function(data){
      console.log(JSON.parse(data));
      console.log(response.statusCode);
      errorCount = JSON.parse(data).error_count
      console.log(JSON.parse(data).error_count);
      if(errorCount == 0 && response.statusCode == 200){
          res.sendFile(__dirname+"/success.html");
      }
      else{
        res.sendFile(__dirname+"/failure.html");

      }

    })

  })
  request.write(jsonData);

  request.end();


})
//API id
//b2cee130437705e2610ae81b6f25fb84-us18
//User id
//mail id
//933e89be03

app.listen(process.env.PORT || 3000,function(){
  console.log("Server is connected with server 3000");
});
