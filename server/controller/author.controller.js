var Revision = require('../model/revisions');

module.exports = function(app) {
  app.get('/api/author/author-details', authorsArticles);
}

function authorsArticles(req,res) {
  author_name = req.query.author;
  if (req.session) {
    Revision.aggregate([
        {$match:{user:author_name}},
        {$group:{_id:"$title",rev:{$sum:1}, timelist:{$addToSet: "$timestamp"}}},
        {$project: {_id:1, rev:1, timelist:1}},
        {$sort:{rev:-1}}
        ],function(err, result) {
          if(err) {
            console.log('err');
          } else {
            if (result.length !== 0) {
              return res.status(200).send(result);
            } else {
              return res.status(500).send({message: 'User not found'});
            }
      }
    });
  } else {
    return res.status(500).send({message: 'Unauthorized Access'});
  }

}
