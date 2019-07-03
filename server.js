// server.js
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
const db = require('./db.json');
const path = require('path')
const fs = require('fs')
server.use(middlewares)

// Add custom routes before JSON Server router
server.get('/echo', (req, res) => {
  res.jsonp(req.query)
})

var jqupload = require('jquery-file-upload-middleware');
server.use('/upload', function(req, res, next){
  var now = Date.now();
  jqupload.fileHandler({
	  uploadDir: function(){
	    return __dirname + '/public/uploads/' + now;
	},
    uploadUrl: function(){ 
      return '/uploads/' + now;
    },
  })(req, res, next);
});

// remove TmpDir
server.delete('/uploads/:filename', function(req, res, next){
	filename = req.params.filename;
	console.log(filename);
	fs.unlink(path.join(__dirname, 'public/upload/' + filename), function(err) {
	if (err) {
	  return console.error(err);
	}
    console.log("File deleted successfully!");
	res.status(200).json({success: true});
  });
})

// remove file
server.delete('/uploads/:date/:filename', function(req, res, next){
  date = req.params.date
  filename = req.params.filename 
  console.log(filename, date)
  fs.unlink(path.join(__dirname, 'public/uploads/'+date+'/'+ filename), function(err) {
	if (err) {
	  return console.error(err);
	}
	  // remove dir
	  fs.rmdir(path.join(__dirname, 'public/uploads/'+date), function(err) {
		if (err) {
		  return console.error(err);
		}
	    console.log("Folder deleted successfully!");
	  })

  console.log("File deleted successfully!");
  res.status(200).json({success: true});
  })
})

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now()
  }
  // Continue to JSON Server router
  next()
})

server.use(router)
server.listen(3000, () => {
  console.log('JSON Server is running')
})