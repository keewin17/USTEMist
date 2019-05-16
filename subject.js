
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

(function(sid,name,age,rs,sd){
var SubjectSchema = new Schema({
    subjectId: {type: Number, required: true, unique: true},
    name: {type: String, required: true},
    age: {type: Number},
    reqsport: {type: Number},
    finsport: {type: Number}
});

var Subject = mongoose.model('Subject', SubjectSchema);

var newsubject = new Subject({
	subjectId : {sid},
	nam : {name},
	age : {age},
	reqsport : {rs},
	finsport : {sd}
});

newsubject.save(function (err) {
    console.log('save status:',err?'failed':'success');
});

}).call(this);