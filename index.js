// import packages into the app. Express, body-parser, 
//const sql=require("./app/Database/db")
const express = require('express');
const app = express();
const bodyparser = require('body-parser');
app.use(bodyparser.json());
const cors = require("cors");

app.use(cors()); 
const path = require('path')
const fileUpload=require('express-fileupload')
app.use(fileUpload())
// set static folder
app.use(express.static(path.join(__dirname, 'public')));
const axios = require('axios')
const sendemail = require('./app/Helpers/emailhelper.js');
const dotenv=require('dotenv');

dotenv.config();



const cron = require('node-cron');

function delay() {
  return new Promise(resolve => setTimeout(resolve, 1800000));
}
var validatePayment = cron.schedule('*/8 * * * *', async function() {
 console.log("i ran 3");
  validatePayment.stop();
  
   try{
      const array = ["one"]
       init2 = await  processArrayFinalPayment()
     //  console.log(init2[0].length)
       if(init2 === "done"){
      //   validatePayment.start();
         console.log("i am re-starting validate")
        }else{
         console.log("error from return statement")
        }
  
   }catch(err){
       console.log(err) 
       
   }finally{

   }


})
//validatePayment.start();


  //  loop handler
  async function processArrayFinalPayment() {
   
    // for (const item of array) {
      console.log("processArrayFinalPayment")
      
      await delayedLog();
    // }
   return "done"
  }
async function delayedLog() { 
   
  
   const headers = {
    'Content-Type': 'application/json',
    'X-Phantombuster-Key-1': process.env.agentKey
  }
 params = {
   "output": "first-result-object",
   "id": process.env.agentId,
   "argument":{
       "spreadsheetUrl":"Restaurant New york",
       "numberOfResultsPerSearch":500,
       "numberOfLinesPerLaunch":20,
       "specifyLanguage":"en",
       "extractCoordinates":false,
       "csvName":"restaurant"
       }
   }
        console.log("dalayed log")

        try{
          const   postSearch = await axios.post('https://api.phantombuster.com/api/v2/agents/launch?output=json', params,  {headers: headers})
          
          
         if(postSearch.data){
           console.log(postSearch.data) 
            await delay();
            const   getResult = await axios.get('https://api.phantombuster.com/api/v1/agent/7590881100908317/output?containerId='+postSearch.data.containerId+'',   {headers: headers})
            console.log(getResult.data.data.output) 
           const emailFrom ="phantumbuster@admin.com";
            const subject = "Result phantunbuster";
            const emailTo = "admin@onclinical.com"
            const text = getResult.data.data.output
         

         processEmail(emailFrom, emailTo, subject, text)

           

          }else{

          }
          

        }catch(err){
          console.log(err)
            return err
          
        }

    }
    
   


    //  try{


    //     const emailFrom ="phantumbuster@admin.com";
    //     const subject = req.body.subject;
    //      const emailTo = req.body.email
    //     const text = req.body.subject
         

    //      processEmail(emailFrom, emailTo, subject, text)


           
           
        
 
    //  }catch(err){
    //      console.log(err)
    //     res.status(500).send({message:"Error while sending email"}) 

    //  }






async function processEmail(emailFrom, emailTo, subject, text){
    try{

       const sendmail =  await sendemail.emailUtility(emailFrom, emailTo, subject, text);
       console.log(sendmail)
        return sendmail
    }catch(err){
        console.log(err)
        return err
    }

}

const port = process.env.PORT || 7000     

app.listen(port, ()=> console.log(`listening on port ${port}...`)); 