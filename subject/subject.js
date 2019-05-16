
function(){
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
}
