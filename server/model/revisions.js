var mongoose = require('./db')

var RevisionSchema = new mongoose.Schema(
		{title: {type:String},
		 timestamp:{type:Date},
		 user:{type:String},
		 anon:{type:String}},
		 {
		 	versionKey: false
		});


RevisionSchema.index({title: 1, user: 1});

RevisionSchema.statics.findTopArticles = function(sort, callback) {
	return this.aggregate([
		{$group: {_id: "$title", rev:{$sum: 1}}},
		{$sort: {rev: sort}},
	]).exec(callback);
}

RevisionSchema.statics.findTitleLatestRev = function(title, callback){

	return this.find({'title':title})
	.sort({'timestamp':-1})
	.limit(1)
	.exec(callback)
}

RevisionSchema.statics.topTwoArticlesLongestHistory = function(callback){
	return this.aggregate([
    {$group:{_id:"$title",timestamp:{"$min":"$timestamp"}}},
    {$sort:{timestamp:1}},
    {$limit:2}
]).exec(callback);
}





var Revision = mongoose.model('Revision', RevisionSchema, 'revisions')

module.exports = Revision