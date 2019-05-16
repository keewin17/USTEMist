


var express = require('express');
var app = express();


var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
app.use(urlencodedParser);


var mongoose = require('mongoose');
var mongoDB = 'mongodb+srv://user:1234@cluster0-357al.mongodb.net/test?retryWrites=true';
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

var Schema = mongoose.Schema;

var db = mongoose.connection;
db.on('error', console.error.bind(console,
    'Connection error:'));

db.once('open', function(){
    console.log('Connection is open...');
});


app.get('/',function(req,res){
    res.send('Hello!');
});


var SubjectSchema = new Schema({
    sid: {type: Number, required: true, unique: true},
    name: {type: String, required: true},
    age: {type: Number},
    rs: {type: Number},
    sd: {type: Number}
});

var Subject = mongoose.model('Subject', SubjectSchema);

//show all the data
app.get('/', function(req,res) {

    Subject.find({},function(err, docs){
        if(db.length < 1 ){
            // If there are no events listed
            res.send("Cannot find any entry stored in database");
        }
        else

        {var buffer = "" // buffer of empty string
        for(let doc of docs){

            buffer = buffer +
            "Subject ID: " + doc.sid + "<br>\n" +
            "Subject name: " + doc.name + "<br>\n" +
            "Age: " + doc.age + "<br>\n" +
            "Amount of sports required :" + doc.rs + "<br>\n" + 
            "Amount of sports completed :" + doc.sd + "<br>\n" 
            +"------------------------------------------"+ "<br>\n";
        }

        res.send(buffer);
    	}
    });

});


app.post('/show',function(req,res) {
	var sid = req.body.sid;
	var name = req.body.name;
	var search;
	if (name != '' && sid != ''){
		search = {sid:sid, name:name};

	}
	else if (name != ''){
		search = {name:name};
	}
	else if (sid != ''){
		search = {sid:sid};
	}
	else res.send("Please enter a value");


    Subject.find(search, function(err, e){

            if(err)
                res.send(err);
            if(!e)      // If entry with requested eventId doesn't exist, print error message that it doesn't exist
                res.send("Entry doesn't exist");
            else
  
		        {var buffer = "" // buffer of empty string
		        for(let es of e){

		            buffer = buffer +
		            "Subject ID: " + es.sid + "<br>\n" +
		            "Subject name: " + es.name + "<br>\n" +
		            "Age: " + es.age + "<br>\n" +
		            "Amount of sports required :" + es.rs + "<br>\n" + 
		            "Amount of sports completed :" + es.sd + "<br>\n" 
		            +"------------------------------------------"+ "<br>\n";
		        }

		        res.send(buffer);
		    	}
		            
	        }
    )
})

//search repeat id or not
// add new user
app.post('/add', function(req,res){
    Subject.find( {} , 'sid -_id', function(err, subjects){
        if(err) return next(err);

        var sid = 0
        if(sid.length < 1) { // if length 0, contains nothing
            sid = 0;
        }
        else {
             // if not, then you can create event and save it(store it to database)
            var e = new Subject({
                sid: req.body.sid,
                name: req.body.name,
                age: req.body.age,
                rs: req.body.rs,
                sd: req.body.sd
            });

                e.save(function(err){
                    if(err)
                        res.send(err);

                    else{
                      
                        {res.status(201).send("Succesfully input:"+"<br>\n" +
                            "ID: " + e.sid+ "<br>\n" +
                            "Name: " + e.name + "<br>\n" +
                            "Age: " + e.age + "<br>\n" +
                            "Amount of sports required: " + e.rs + "<br>\n" +
                            "Amount of sports completed: " + e.sd +"<br>\n"
                        )}
                        
                    }
                });

                }

            

        });
});

app.listen(4000, function() {
  console.log('Example app listening on port 4000!');
});


