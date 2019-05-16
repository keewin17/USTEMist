



var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({extended: false});
var mongoose = require('mongoose');
var mongoDB = 'mongodb+srv://user:1234@cluster0-357al.mongodb.net/test?retryWrites=true';
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);


app.use(urlencodedParser);
// Setting Up Connection - - - - - - - - - - - - - - - - - - - - - -
// erasing the connectoin made to my own database for checking purposes
//mongoose.connect('mongodb://:@localhost/csci2720');
var db = mongoose.connection;

// Handling Connections - - - - - - - - - - - - - - - - - - - - - -
db.on('error', console.error.bind(console,
    'Connection error:'));

db.once('open', function(){
    console.log('Connection is open...');
});

// Creating Schema Needed - - - - - - - - - - - - - - - - - - - - - -




var SubjectSchema = mongoose.Schema({
    subjectId: {type: Number, required: true, unique: true},
    name: {type: String, required: true},
    age: {type: Number},
    reqsport: {type: Number},
    finsport: {type: Number}
});

var Subject = mongoose.model('Subject', SubjectSchema);

// Handling Requests - - - - - - - - - - - - - - - - - - - - - - - - - -

app.get('/',function(req,res){
    res.send('Hello!');
})

//
app.get('/subject/:sid',function(req,res) {
    Patient.findOne(
        {sid: req.params.sid},'patientId name age reqsport finsport',
        function(err, e) {
            if(err)
                res.send(err);
            if(!e)      // If entry with requested eventId doesn't exist, print error message that it doesn't exist
                res.send("Entry doesn't exist");
            else
            
            {res.send(
            "Patient ID: " + e.sid + "<br>\n" +
            "Patient name: " + e.name + "<br>\n" +
            "Age: "+ e.age + "<br>\n" +
            "Amount of sports required: "+ e.rs + "<br>\n" +
            "Amount of sports completed: " + e.sd + "<br>\n")}

            
        }
    )
})


// need to build restful API to handle all things
app.post('/subject', function(req,res){
    // Event -> eventId(number),name(string),loc(obj type),quota(number)
    // Find whether there are any events, if no events-> eventid = 0 , or else eventid = max+1

    // find all
    Patient.find( {} , 'sid -_id', function(err, patients){
        if(err) return next(err);

        var sid = 0
        if(sid.length < 1) { // if length 0, contains nothing
            sid = 0;
        }
        else {
             // if not, then you can create event and save it(store it to database)
            var e = new subject({
                subjectId: req.body['sid'],
                name: req.body['name'],
                age: req.body['age'],
                reqsport: req.body['rs'],
                finsport: req.body['sd']
            });

                e.save(function(err){
                    if(err)
                        res.send(err);

                    else{
                      
                        {res.status(201).send("Succesfully input patient:"+"<br>\n" +
                            "Patient ID: " + e.sid+ "<br>\n" +
                            "Patient Name: " + e.name + "<br>\n" +
                            "Age: " + e.age + "<br>\n" +
                            "Amount of sports required: " + e.rs + "<br>\n" +
                            "Amount of sports completed: " + e.sd +"<br>\n"
                        )}
                        
                    }
                });

                }

            

        });



// Handling Delete Request - - - - - - - - - - - - - - - - - - - -

app.delete('/subject/:sid', function(req,res){

    Patient.findOneAndRemove({sid: req.params['sid']}, function(err, deleted){

        if(err)
            return res.status(500).send(err);
        console.log(deleted);

        if(!deleted)
            res.status(500).send("Subject not found");
        // deleted contains the data

        else
        {{



            res.send("Succesfully deleted entry:" + "<br>\n" +
            "Subject ID: " + deleted.sid + "<br>\n" +
            "Subject name: "+ deleted.name + "<br>\n" 
           

            ) // end of res.send

        };}

    });


}); //  Delete Request Done

// GET REQUEST, listing all events available - - - - - - - - - - - - - - - - - - - -

app.get('/subject', function(req,res) {

    Subject.find({})
    .exec(function(err, events){
        if(subject.length < 1 ){
            // If there are no events listed
            res.send("Cannot find any entry stored in database");
        }
        else
        {var buffer = "" // buffer of empty string
        for(let subject of subjects){
            buffer = buffer +
            "Subject ID: " + subject.sid + "<br>\n" +
            "Subject name: " + subject.name + "<br>\n" +
            "Age: " + subject.age + "<br>\n" +
            "Amount of sports required :" + subject.rq + "<br>\n" + 
            "Amount of sports completed :" + subject.sd + "<br>\n" 
            +"------------------------------------------"+ "<br>\n";
        }
        res.send(buffer);}
    });

}) // end of get req

// GET http://server address/loc/location ID - - - - - - - - - - - - - - - - - -

var server = app.listen(3000);
});

