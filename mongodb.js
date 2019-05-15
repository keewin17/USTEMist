var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var mongoose = require('mongoose');
var mongoDB = 'mongodb+srv://user:1234@cluster0-357al.mongodb.net/test?retryWrites=true';
mongoose.connect(mongoDB, { useNewUrlParser: true });

app.use(urlencodedParser);
// Setting Up Connection - - - - - - - - - - - - - - - - - - - - - -
// erasing the connectoin made to my own database for checking purposes
//mongoose.connect('mongodb://:@localhost/csci2720');
var db = mongoose.connection;

// Handling Connections - - - - - - - - - - - - - - - - - - - - - -
db.on('error', console.error.bind(console,
    'Cvnection error:'));

db.once('open', function(){
    console.log("Connection is open...");
});

// Creating Schema Needed - - - - - - - - - - - - - - - - - - - - - -

var PatientSchema = mongoose.Schema({
    patientId: {type: Number, required: true, unique: true},
    name: {type: String, required: true},
    age: {type: Number},
    reqsport: {type: Number},
    finsport: {type: Number}
});

var Patient = mongoose.model('Patient', PatientSchema);

// Handling Requests - - - - - - - - - - - - - - - - - - - - - - - - - -

app.get('/',function(req,res){
    res.send('Hello!');
})

//
app.get('/patient/:patientId',function(req,res) {
    Patient.findOne(
        {patientId: req.params.patientId},'patientId name age reqsport finsport',
        function(err, e) {
            if(err)
                res.send(err);
            if(!e)      // If entry with requested eventId doesn't exist, print error message that it doesn't exist
                res.send("Entry doesn't exist");
            else
            
            {res.send(
            "Patient ID: " + e.patientId + "<br>\n" +
            "Patient name: " + e.name + "<br>\n" +
            "Age: "+ e.age + "<br>\n" +
            "Amount of sports required: "+ e.reqsport + "<br>\n" +
            "Amount of sports completed: " + e.finsport + "<br>\n")}

            
        }
    )
})


// need to build restful API to handle all things
app.post('/patient', function(req,res){
    // Event -> eventId(number),name(string),loc(obj type),quota(number)
    // Find whether there are any events, if no events-> eventid = 0 , or else eventid = max+1

    // find all
    Patient.find( {} , 'patientId -_id', function(err, patients){
        if(err) return next(err);

        var patientid = 0
        if(patients.length < 1) { // if length 0, contains nothing
            patientid = 0;
        }
        else {
             // if not, then you can create event and save it(store it to database)
            var e = new Patient({
                patientId: req.body['patientid'],
                name: req.body['name'],
                age: req.body['age'],
                reqsport: req.body['reqsport'],
                finsport: req.body['finsport']
            });

                e.save(function(err){
                    if(err)
                        res.send(err);

                    else{
                      
                        {res.status(201).send("Succesfully input patient:"+"<br>\n" +
                            "Patient ID: " + e.patientId+ "<br>\n" +
                            "Patient Name: " + e.name + "<br>\n" +
                            "Age: " + e.age + "<br>\n" +
                            "Amount of sports required: " + e.reqsport + "<br>\n" +
                            "Amount of sports completed: " + e.finsport +"<br>\n"
                        )}
                        
                    }
                });

                }

            

        });



// Handling Delete Request - - - - - - - - - - - - - - - - - - - -

app.delete('/patient/:patientId', function(req,res){

    Patient.findOneAndRemove({patientId: req.params['patientId']}, function(err, deleted){

        if(err)
            return res.status(500).send(err);
        console.log(deleted);

        if(!deleted)
            res.status(500).send("Patient not found");
        // deleted contains the data

        else
        {{



            res.send("Succesfully deleted entry:" + "<br>\n" +
            "Patient ID: " + deleted.patientId + "<br>\n" +
            "Patient name: "+ deleted.name + "<br>\n" 
           

            ) // end of res.send

        };}

    });


}); //  Delete Request Done

// GET REQUEST, listing all events available - - - - - - - - - - - - - - - - - - - -

app.get('/patient', function(req,res) {

    Patient.find({})
    .exec(function(err, events){
        if(patients.length<1 ){
            // If there are no events listed
            res.send("Cannot find any entry stored in database");
        }
        else
        {var buffer = "" // buffer of empty string
        for(let patient of patients){
            buffer = buffer +
            "Patient ID: " + patient.patientId + "<br>\n" +
            "Patient name: " + patient.name + "<br>\n" +
            "Age: " + patient.age + "<br>\n" +
            "Amount of sports required :" + patient.reqsport + "<br>\n" + 
            "Amount of sports completed :" + patient.finsport + "<br>\n" 
            +"------------------------------------------"+ "<br>\n";
        }
        res.send(buffer);}
    });

}) // end of get req

// GET http://server address/loc/location ID - - - - - - - - - - - - - - - - - -

var server = app.listen(3000);
});