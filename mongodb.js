var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var mongoose = require('mongoose');

app.use(urlencodedParser);
// Setting Up Connection - - - - - - - - - - - - - - - - - - - - - -
// erasing the connectoin made to my own database for checking purposes
//mongoose.connect('mongodb://:@localhost/csci2720');
var db = mongoose.connection;

// Handling Connections - - - - - - - - - - - - - - - - - - - - - -
db.on('error', console.error.bind(console,
    'Connection error:'));

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
                res.send("Entry doesnt exist");
            else
            
            {res.send(
            "Patient ID: " + e.patientId + "<br>\n" +
            "Patient name: " + e.name + "<br>\n" +
            "Age: "+ e.age + "<br>\n" +
            "Amount of sports required: "+ e.reqsport + "<br>\n" +
            "Amount of sports Completed: " + e.finsport + "<br>\n")}

            
        }
    )
})


// need to build restful API to handle all things
app.post('/patient', function(req,res){
    // Event -> eventId(number),name(string),loc(obj type),quota(number)
    // Find whether there are any events, if no events-> eventid = 0 , or else eventid = max+1

    // find all
    Event.find( {} , 'patientId -_id', function(err, events){
        if(err) return next(err);

        var eventid = 0
        if(patients.length < 1) { // if length 0, contains nothing
            patientid = 0;
        }
        else {
            // if length >=1 , get the max and add by 1
            var array = [];
            for(let num of patients){
                array.push(num.patientId);
            }
            // var tempMaxId = Math.max(...array);
            // eventid = tempMaxId + 1;
            patientid = Math.max.apply(null,array) + 1; // finding maximum event
        }

        // We can get name immediately from the req.body
        // location and event quota is related to one another
        // find the loc from locId,
        Location.findOne( {locId : req.body['locId']}, function(err, result){
            if(err) console.log(err);

            // if not found, say no such location found
            if(!result)
                res.send("Your requested location does not exist");
            else {
                // if location is found, then check validity, ( whether result.quota <= event_quota)
                if(result.quota < req.body['quota'] ){
                    //if location quota < requested event quota, send response that event can't be created
                    res.send("Such event can't be created: Event quota exceed location quota!");
                }
                else {
                    // if not, then you can create event and save it(store it to database)
                    var e = new Event({
                        eventId: eventid,
                        name: req.body['name'],
                        loc: result._id,
                        quota: req.body['quota']
                    });

                    e.save(function(err){
                        if(err)
                            res.send(err);

                        // use e.loc to findbyId
                        Location.findById(e.loc, function(err,location)
                        {res.status(201).send("Succesfully Created an event:"+"<br>\n" +
                            "Event ID: " + e.eventId + "<br>\n" +
                            "Event Name: " + e.name + "<br>\n" +
                            "Location ID: " + location.locId + "<br>\n" +
                            "Location Name: " + location.name + "<br>\n" +
                            "Event Quota: " + e.quota +"<br>\n"
                        )}
                        )
                    });

                }

            }

        });


    });

});

// Handling Delete Request - - - - - - - - - - - - - - - - - - - -

app.delete('/event/:eventId', function(req,res){

    Event.findOneAndRemove({eventId: req.params['eventId']}, function(err, deleted){

        if(err)
            return res.status(500).send(err);
        console.log(deleted);

        if(!deleted)
            res.status(500).send("Event not found");
        // deleted contains the data

        else
        {Location.findById(deleted.loc, function(err, location ){



            res.send("Succesfully deleted Event:" + "<br>\n" +
            "Event name: " + deleted.name + "<br>\n" +
            "Location ID: "+ location.locId + "<br>\n" +
            "Location Name: "+ location.name + "<br>\n" +
            "Event Quota: " + deleted.quota + "<br>\n"

            ) // end of res.send

        });}

    });


}); //  Delete Request Done

// GET REQUEST, listing all events available - - - - - - - - - - - - - - - - - - - -

app.get('/event', function(req,res) {

    Event.find({})
    .populate('loc')
    .exec(function(err, events){
        if(events.length<1 ){
            // If there are no events listed
            res.send("We can't find any event stored in the database");
        }
        else
        {var buffer = "" // buffer of empty string
        for(let event of events){
            buffer = buffer +
            "Event Name: " + event.name + "<br>\n" +
            "Location ID: " + event.loc.locId + "<br>\n" +
            "Location Name: " + event.loc.name + "<br>\n" +
            "Event Quota :" + event.quota + "<br>\n"
            +"------------------------------------------"+ "<br>\n";
        }
        res.send(buffer);}
    });

}) // end of get req


// GET REQUEST for /localhost:3000/loc with or without query (? .. ) - - - - - - - - - - - - - - - -
app.get('/loc', function(req,res) {

    if(Object.keys(req.query).length == 0)  // If you Query nothing then list out everything
        {
        Location.find({})
        .exec(function(err,locations){
            if(!locations)
                res.send("You Have Not allocated any event");
            var buffer = ""; // Empty string
            for(let location of locations){
                buffer = buffer +
                "Location ID: " + location.locId + "<br>\n" +
                "Location Name: "+ location.name +"<br>\n" +
                "Location Quota: "+ location.quota + "<br>\n"+
                "---------------------------------------" + "<br>\n";
            }
        res.send(buffer);
    });
        }       // end of if condition on 0 query

    else{
        //if you have query ?quota -> find locations that have >= minimum
        var minimum = req.query.quota;

        Location
        .find({
            quota: { $gte: minimum}
        })
        .exec(function(err, locations) {

            if(locations.length < 1)
                res.send("No such location with quota of at least " + minimum + " found in database");
            else {
                var buffer = ""; // Empty string
            for(let location of locations){
                buffer = buffer +
                "Location ID: " + location.locId + "<br>\n" +
                "Location Name: "+ location.name +"<br>\n" +
                "Location Quota: "+ location.quota + "<br>\n"+
                "---------------------------------------" + "<br>\n";
            }
                res.send(buffer);
            } // end else
        })


    }



}); // end of event handler


// GET http://server address/loc/location ID - - - - - - - - - - - - - - - - - -

var server = app.listen(3000);
