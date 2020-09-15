var Revision = require('../model/revisions');
var request = require('request');
var fs  = require("fs");
var request = require('request');
var concat = require('concat');


module.exports = function(app) {
    app.get('/api/individual/all-articles', allArticles);
    app.post('/api/individual/article-details', restFunction);
}

function allArticles(req, res) {
    if (req.session) {
        Revision.aggregate([
            {$group: {_id: "$title", rev: {$sum:1}}},
            {$sort: {_id: 1}}], function(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    return res.status(200).send(result);
                }
        });
    } else {
        return res.status(500).send({message: 'Unauthorized Access'});
    }
}

function titleDate(title) {
  var sync = true;
  var listData = [];

  Revision.aggregate([
    {$match:{title:title}},
    {$sort:{timestamp:-1}}],function(err, result) {
      if(err) {
        console.log(err);
      } else {
          listData.push(result[0].timestamp);
          listData.push(result);
          sync = false;
        }
    });
  while(sync) {require("deasync").sleep(2000);}
  return listData;
 }

function dateDifference(oldDate) {
  var oldDate = new Date(oldDate);
  var todaysDate = new Date();
  var diffDays = parseInt((todaysDate - oldDate) / (1000 * 60 * 60 * 24)); //gives day difference
  return diffDays;
 }

function restFunction(req,res) {
    if (req.session) {
        var title = req.body.title;
        var fromDate = req.body.fromDate;
        var toDate = req.body.toDate;
        var newList = req.body.yearList;
        var date = titleDate(title);
        var article = date[1];

        compareDate = dateDifference(date[0])
        stringDate = JSON.stringify(date[0]);
        stringDate = stringDate.replace(/["']/g, "");
        var endDate = new Date();
        endDate.setDate(endDate.getDate() - 1);
        stringEndDate = JSON.stringify(endDate);
        stringEndDate = stringEndDate.replace(/["']/g,"");
        var rev = APIData(title, stringDate, stringEndDate, article, fromDate, toDate, newList);
        return res.status(200).send({rev});
    } else {
        return res.status(500).send({message: 'Unauthorized Access'});
    }
}

function APIData(title, startDate, endDate, article, fromDate, toDate, newList) {
    let individualBarData = {};
    let individualPieData = {};
    let individualUser = {};
    let mergedObject = {};
    let yearList = [];
    let firstUser =[];
    let secondUser = [];
    let thirdUser = [];
    let fourthUser = [];
    let fifthUser = [];
    var sync = true;
    var finalUser = {};
    var wikiEndpoint = "https://en.wikipedia.org/w/api.php";
    var parameters = [
        "rvdir=newer",
        "action=query",
        "prop=revisions",
        "rvlimit=500",
        "rvprop=ids|flags|user|userid|timestamp",
        "formatversion=2",
        "format=json"
    ]
    parameters.unshift("rvend=" + endDate);
    parameters.unshift("rvstart=" + startDate);
    parameters.unshift("titles=" + title);

    var url = wikiEndpoint + "?" + parameters.join("&");
    var options = {
        url: url,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        }
    };
    request(options, function (err, res, data){
        if (err) {
            console.log('Error:', err);
        } else if (res.statusCode !== 200) {
            console.log('Error status code:', res.statusCode);
        } else {
            json = JSON.parse(data);
            pages = json.query.pages
            revisions = pages[Object.keys(pages)[0]].revisions;
            if(revisions.length == 500) {
                var last = revisions[revisions.length - 1].timestamp;
                new_data  = APIData(title,last,endDate);
                var data3 = Object.assign({}, revisions, new_data);
                return data3;
            } else 
            {
                var users=[];
                var rev = [];
                var timestamp = [];
                for (i in revisions){
                    users.push(revisions[i].user);
                    rev.push(revisions[i].revid);
                    timestamp.push(revisions[i].timestamp);
                }
                uniqueUsers = new Set(users);
                var beforeMerge = {};
                finalLength = article.length + revisions.length;
                var k = 0;
                for(let j = revisions.length; j < finalLength; j++) {
                    beforeMerge[j] = article[k];
                    k += 1;
                }
                mergedObject = Object.assign({}, revisions, beforeMerge);
                var merged = [];
                let admin_merge = [];
                var botUsers = [];
                concat(['admins/admin_active.txt', 'admins/admin_former.txt', 'admins/admin_inactive.txt', 'admins/admin_semi_active.txt'])
                    .then((result) => {
                        admin_merge = result.split('\n');
                        fs.readFile('admins/bot.txt', function(err, f){
                            botUsers = f.toString().split('\n');
                            merged = admin_merge.concat(botUsers);
                            count = 0;
                            uniqueUser = [];
                            if (toDate) {
                                let newObject = mergedObject;
                                mergedObject = {}
                                Object.values(newObject).forEach((element, i) => {
                                    year = parseInt(element.timestamp)
                                    if (newList.indexOf(year) > -1) {
                                        mergedObject[i] = element;
                                    }
                                });
                            }
                            Object.values(mergedObject).forEach(element => {
                                if(merged.indexOf(element.user) === -1) {
                                    if(!element.anon){
                                        if(uniqueUser[element.user]){
                                            uniqueUser[element.user] += 1;
                                        } else {
                                            uniqueUser[element.user] = 1;
                                        }
                                    }
                                }
                            });
                            admin = {};
                            bot = {};
                            regular = {};
                            anon = {};
                            Object.values(mergedObject).forEach(elementBar => {
                                year = parseInt(elementBar.timestamp)
                                if (yearList.indexOf(year) === -1) {
                                    yearList.push(year);
                                }
                                if (admin_merge.indexOf(elementBar.user) > -1) {
                                    if (admin[year]) {
                                        admin[year] = {'_id': year, rev: admin[year].rev + 1}
                                    } else {
                                        admin[year] = {'_id': year, rev: 1}
                                    }
                                } else if (botUsers.indexOf(elementBar.user) > -1) {
                                    if (bot[year]) {
                                        bot[year] = {'_id': year, rev: bot[year].rev + 1}
                                    } else {
                                        bot[year] = {'_id': year, rev: 1}
                                    }
                                } else if (merged.indexOf(elementBar.user) === -1) {
                                    if (!elementBar.anon) {
                                        if (regular[year]) {
                                            regular[year] = {'_id': year, rev: regular[year].rev + 1}
                                        } else {
                                            regular[year] = {'_id': year, rev: 1}
                                        }
                                    } else {
                                        if (anon[year]) {
                                            anon[year] = {'_id': year, rev: anon[year].rev + 1}
                                        } else {
                                            anon[year] = {'_id': year, rev: 1}
                                        }
                                    }
                                }  
                            });
                            for (let i = 0; i < yearList.length; i++) {
                                if (!(yearList[i] in admin)) {
                                    admin[yearList[i]] = {'_id': yearList[i], rev: 0}
                                }
                                if (!(yearList[i] in bot)) {
                                    bot[yearList[i]] = {'_id': yearList[i], rev: 0}
                                }
                                if (!(yearList[i] in regular)) {
                                    regular[yearList[i]] = {'_id': yearList[i], rev: 0}
                                }
                                if (!(yearList[i] in anon)) {
                                    anon[yearList[i]] = {'_id': yearList[i], rev: 0}
                                }
                            }
                            individualBarData['Admin'] = admin;
                            individualBarData['Bot'] = bot;
                            individualBarData['Regular'] = regular;
                            individualBarData['Anonymous'] = anon;
                            adminRev = {};
                            botRev = {};
                            regularRev = {};
                            anonRev = {};
                            Object.values(mergedObject).forEach((elementPie) => {
                                if (admin_merge.indexOf(elementPie.user) > -1) {
                                    if(adminRev[0]) {
                                        adminRev[0] = {'_id': 'Administrator', rev: adminRev[0].rev + 1};
                                    } else {
                                        adminRev[0] = {'_id': 'Administrator', rev: 1};
                                    }
                                } else if (botUsers.indexOf(elementPie.user) > -1) {
                                    if (botRev[0]) {
                                        botRev[0] = {'_id': 'Bot', rev: botRev[0].rev + 1};
                                    } else {
                                        botRev[0] = {'_id': 'Bot', rev: 1};
                                    }
                                } else if (merged.indexOf(elementPie.user) === -1) {
                                    if (!elementPie.anon) {
                                        if (regularRev[0]) {
                                            regularRev[0] = {'_id': 'Regular User', rev: regularRev[0].rev + 1};
                                        } else {
                                            regularRev[0] = {'_id': 'Regular User', rev: 1};
                                        }
                                    } else {
                                        if (anonRev[0]) {
                                            anonRev[0] = {'_id': 'Anonymous', rev: anonRev[0].rev + 1};
                                        } else {
                                            anonRev[0] = {'_id': 'Anonymous', rev: 1};
                                        }
                                    }
                                }
                            });
                            individualPieData = {adminRev, botRev, regularRev, anonRev};
                            keysSorted = Object.keys(uniqueUser).sort(function(a,b){return uniqueUser[a]-uniqueUser[b]});
                            var sortedUser = keysSorted.reverse();
                            var revUser = sortedUser.splice(0,5);
                            firstUser.push(revUser[0]);
                            secondUser.push(revUser[1]);
                            thirdUser.push(revUser[2]);
                            fourthUser.push(revUser[3]);
                            fifthUser.push(revUser[4]);
                            var userList = [firstUser, secondUser, thirdUser, fourthUser, fifthUser];
                            for (i in revUser) {
                                finalUser[i] ={user: revUser[i], revisions: uniqueUser[revUser[i]]};
                            }
                            Object.values(mergedObject).forEach((elementInd, i) => {
                                year = parseInt(elementInd.timestamp)
                                if (firstUser.indexOf(elementInd.user) > -1) {
                                    if (individualUser[year]) {
                                        individualUser[year] = {_id: elementInd.user, rev: individualUser[year].rev + 1}
                                    } else {
                                        individualUser[year] = {_id: elementInd.user, rev: 1}
                                    } 
                                }  
                            });
                        sync = false;
                    });
                });
            }
        }
    });
    while(sync) {require("deasync").sleep(5000);}
    return [finalUser, revisions.length, finalLength, individualBarData, individualPieData, individualUser, yearList, Object.values(mergedObject).length];
}
