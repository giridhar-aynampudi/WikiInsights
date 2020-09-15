var Revision = require('../model/revisions');
var User = require('../model/user');
var fs  = require("fs");
var concat = require('concat');
var sess;

module.exports = function(app) {
  app.post('/api/user/register', register);
  app.post('/api/user/login', login);
  app.get('/api/overall/top-most', getTopMost);
  app.get('/api/overall/large-registered-users',larGroupOfRegisteredUser);
  app.get('/api/overall/small-registered-users', smallGroupOfRegisteredUser);
  app.get('/api/overall/longest-history', ArticlesLongestHistory);
  app.get('/api/overall/smallest-history', ArticlesSmallestHistory);
  app.get('/api/overall/bar-chart', distributionByYearAndUserType);
  app.get('/api/overall/pie-chart', distributionByUserType);
  app.post('/api/user/logout', logout);
}

function register(req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;

  const user = new User();
  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  user.createPasswordHash(password);
  return user.save()
    .then(() => {
      return res.status(200).send({message: 'Success'});
    })
    .catch(() => {
      return res.status(500).send({message: 'Error in registering'});
    });
}

function login(req, res) {
  const email = req.body.username;
  const password = req.body.password;
  return User.findOne({email})
    .then((user) => {
      if(!(user.checkPassword(password))) {
        return res.send({message: 'Incorrect Password'});
      } else {
        return res.status(200).send(user);
      }
    })
    .catch(() => {
      return res.status(500).send({message: 'User not found'});
    })
}

function getTopMost(req, res) {
  sort = req.query.sortNum;
  if(req.session) {
    Revision.findTopArticles(parseInt(sort), function(err, result) {
      if(err) {
        console.log('Err');
      } else {
        return res.status(200).send(result);
      }
    });
  } else {
    return res.status(500).send({message: 'Unauthorized Access'});
  }
}

function larGroupOfRegisteredUser(req,res){
  if(req.session) {
    Revision.aggregate([
      {$match:{anon:{$exists:false}}},
            {$group:{_id:"$title",rev:{$sum:1},uniqueValues:{$addToSet:"$user"}}},
            {$project: {title: 1, rev: 1, numberOfUsers: {$cond: {if: {$isArray: "$uniqueValues"}, then: {$size: "$uniqueValues"}, else: "NA"}}}},
            {$sort: {numberOfUsers:-1}},
            {$limit:1}
    ], function(err, result) {
      if(err) {
        console.log(err);
      } else {
        return res.status(200).send(result);
      }
    });
  } else {
    return res.status(500).send({message: 'Unauthorized Access'});
  }
}

function smallGroupOfRegisteredUser(req,res) {
  if (req.session) {
    Revision.aggregate([
      {$match:{anon:{$exists:false}}},
            {$group:{_id:"$title",rev:{$sum:1},uniqueValues:{$addToSet:"$user"}}},
            {$project: {title: 1, rev: 1, numberOfUsers: {$cond: {if: {$isArray: "$uniqueValues"}, then: {$size: "$uniqueValues"}, else: "NA"}}}},
            {$sort: {numberOfUsers: 1}},
            {$limit:1}
    ], function(err, result) {
      if(err) {
        console.log(err);
      } else {
        return res.status(200).send(result);
      }
    });
  } else {
    return res.status(500).send({message: 'Unauthorized Access'});
  }
}

function dateDifference(oldDate) {
  var todaysDate = Date.now();
  var diffDays = parseInt((todaysDate - oldDate) / (1000 * 60 * 60 * 24)); //gives day difference
  return diffDays;
}

function ArticlesLongestHistory(req,res) {
  if (req.session) {  
    Revision.aggregate([
      {$group:{_id:"$title",timestamp:{"$min":"$timestamp"}}},
      {$sort:{timestamp:1}},
      {$limit:2}],function(err, result) {
        if(err) {
          console.log(err);
        } else {
          var dateOne = new Date(result[0].timestamp);
          var dateTwo = new Date(result[1].timestamp);
          var newData = [];
          newData.push([result[0]._id, dateDifference(dateOne)]);
          newData.push([result[1]._id, dateDifference(dateTwo)]);
          return res.status(200).send(newData);
        }
      });
  } else {
    return res.status(500).send({message: 'Unauthorized Access'});
  }
}
function ArticlesSmallestHistory(req,res) {
  if (req.session) {
    Revision.aggregate([
      {$group:{_id:"$title",timestamp:{"$min":"$timestamp"}}},
      {$sort:{timestamp: -1}},
      {$limit:2}],function(err, result) {
        if(err) {
          console.log(err);
        } else {
        var dateOne = new Date(result[0].timestamp);
        var dateTwo = new Date(result[1].timestamp);
        var newData = [];
        newData.push([result[0]._id, dateDifference(dateOne)]);
        newData.push([result[1]._id, dateDifference(dateTwo)]);
        return res.status(200).send(newData);
        }
      });
  } else {
    return res.status(500).send({message: 'Unauthorized Access'});
  }
}



function distributionByYearAndUserType(req, res) {
  var merged = [];
  var admin_merge = [];
  concat(['admins/admin_active.txt', 'admins/admin_former.txt', 'admins/admin_inactive.txt', 'admins/admin_semi_active.txt'])
    .then((result) => {
        admin_merge = result.split('\n');
        Revision.aggregate([
          {$match: {user:{"$in": admin_merge}}},
          {$project:{year:{$year:{$dateFromString: {
            dateString: "$timestamp"}}}}},
          {$group:{ _id: "$year", rev:{$sum:1}}},
          {$sort: {_id: 1}}
          ], function(err, result) {
            if (err) {
              console.log(err);
            } else {
              var admins = result;
              fs.readFile('admins/bot.txt', function(err, f){
                var bot = f.toString().split('\n');
                var concat1 = admin_merge.concat(bot);
                Revision.aggregate([
                  {$match: {user:{"$in": bot}}},
                  {$project:{year:{$year:{$dateFromString: {
                    dateString: "$timestamp"}}}}},
                  {$group:{ _id: "$year", rev:{$sum:1}}},
                  {$sort: {_id: 1}}
                  ], function(err, result2) {
                    if (err) {
                      console.log(err);
                    } else {
                      var bot_user = result2;
                      merged = [].concat.apply([], concat1);
                      Revision.aggregate([
                        {$match: {user:{"$nin": merged}, anon:{$exists:false}}},
                        {$project:{year:{$year:{$dateFromString: {
                          dateString: "$timestamp"}}}}},
                        {$group:{ _id: "$year", rev:{$sum:1}}},
                        {$sort: {_id: 1}}
                        ], function(err, result3) {
                          if (err) {
                            console.log(err);
                          } else {
                            var regular = result3;
                            Revision.aggregate([
                              {$match: {anon:{$exists:true}}},
                              {$project:{year:{$year:{$dateFromString: {
                                dateString: "$timestamp"}}}}},
                              {$group:{ _id: "$year", rev:{$sum:1}}},
                              {$sort: {_id: 1}}
                              ], function(err, result4) {
                                if (err) {
                                  console.log(err);
                                } else {
                                  var anonymous = result4;
                                  res.send({Admin: admins, Bot: bot_user, Regular: regular, Anonymous: anonymous});
                                }
                              })
                          }
                        })
                    }
                  });
              });
            }
          });
          
      });
}

function distributionByUserType(req, res) {
  var merged = [];
  var admin_merge = [];
  concat(['admins/admin_active.txt', 'admins/admin_former.txt', 'admins/admin_inactive.txt', 'admins/admin_semi_active.txt'])
    .then((result) => {
      admin_merge = result.split('\n');
      Revision.aggregate([
        {$match: {user:{"$in": admin_merge}}},
        {$group:{ _id: "Administrator", rev:{$sum:1}}},
        {$sort: {_id: 1}}
        ], function(err, result) {
          if (err){
            console.log(err);
          } else {
            var adminRev = result;
            fs.readFile('admins/bot.txt', function(err, f){
              var bot = f.toString().split('\n');
              var concat1 = admin_merge.concat(bot);
              Revision.aggregate([
                {$match: {user:{"$in": bot}}},
                {$group:{ _id: "Bot", rev:{$sum:1}}},
                {$sort: {_id: 1}}
                ], function(err, result2) {
                  if (err){
                    console.log(err);
                  } else {
                    var botRev = result2;
                    merged = [].concat.apply([], concat1);
                    Revision.aggregate([
                      {$match: {user:{"$nin": merged}, anon:{$exists:false}}},
                      {$group:{ _id: "Regular User", rev:{$sum:1}}},
                      ], function(err, result3) {
                        if (err){
                          console.log(err);
                        } else {
                          var regularRev = result3;
                          Revision.aggregate([
                            {$match: {anon: true}},
                            {$group: {_id: "Anonymous", rev: {$sum: 1}}}
                          ], function(err, result4) {
                            if (err) {
                              console.log(err);
                            } else {
                              anonRev = result4;
                              return res.send({adminRev, botRev, regularRev, anonRev});
                            }
                          })
                        }
                    })
                  }
              })
            });
          }
        })
      });
}

function logout(req, res) {
  req.session.destroy((err) => {
    if(err) {
        return console.log(err);
    } else {
      return res.status(200).send({message: 'Successfully logged out'});
    }
    
});
} 