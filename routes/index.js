
/*
 * GET home page.
 */

//exports.index = function(req, res){
//  res.render('index', { title: 'Express' })
//};

exports.index = function(req, res){
  var obj = [];
  for (var prop in req) {
    obj.push(prop); 
  }
  //res.render('index', { x: JSON.stringify(obj) })
  res.render('index', { x: req.url })
};
