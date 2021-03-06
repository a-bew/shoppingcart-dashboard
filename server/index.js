// server.js
const jsonServer = require('json-server')
var express = require('express');

const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
const port = process.env.PORT || 4000;
const path = require('path')


const FileSync = require('lowdb/adapters/FileSync')
const lodashId = require('lodash-id')
const low = require('lowdb')
const adapter = new FileSync('db.json')
const db = low(adapter)
//db._.mixin(lodashId)

const fs = require('fs')
const fetch = require('isomorphic-unfetch');

// const fileType = require('file-type');
var jqupload = require('jquery-file-upload-middleware');
// server.use('/static', express.static(__dirname + '/node_modules/jquery/dist'));
server.use(middlewares)

// Add custom routes before JSON Server router
server.get('/echo', (req, res) => {
  res.jsonp(req.query)
})

server.use('/upload', function(req, res, next){
  var now = Date.now();
  jqupload.fileHandler({
	  uploadDir: function(){
	    return __dirname + './../public/uploads/' + now;
	},
    uploadUrl: function(){ 
      return '/uploads/' + now;
    },
  })(req, res, next);
});

jqupload.on('end', function(fileInfo, req, res){
	console.log(fileInfo)
	var s = "";
	fetch(`http://localhost:${port}/api/image_url`, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
	    name: fileInfo.name,
	    url: fileInfo.url,
	    size: fileInfo.size,
	    type: fileInfo.type
		})
	}).then(res=>res.json())
	.then(data=>{s=data;console.log(data)})
	.catch(error=>console.log(error))
})
  
// remove TmpDir
server.delete('/uploads/:filename', function(req, res, next){
	filename = req.params.filename;
	console.log(filename);
	fs.unlink(path.join(__dirname, './../public/upload/' + filename), function(err) {
	if (err) {
	  return console.error(err);
	}
    console.log("File deleted successfully!");
	res.status(200).json({success: true});
  });
})

server.use('/updates/user/lastlogin/:id', function(req, res, next){
	id = req.params.id;
	console.log(id)
    object = db.get('users')
    	  .find({ id: +id})
	      .value()

    console.log(object)

	user = db.get('users')
	  .find({last_login: object.last_login})
	  .assign({ last_login: Date.now()})
	  .write()

	if (!user) {
	  return console.error(user);
	}

//	db.setState(db.getState())
	res.status(200).json({success: true});

})

server.use('/updates/user/:id/:password', function(req, res, next){
	id = req.params.id;
    password = req.params.password;

    object = db.get('users')
   	  .find({ id: +id})
      .value()

	user = db.get('users')
	  .find({password: object.password})
	  .assign({ password: password})
	  .write()

	if (!user) {
	  return console.error(user);
	}

//	db.setState(db.getState())
	res.status(200).json({success: true});
})

// remove file
server.delete('/uploads/:date/:filename', function(req, res, next){
  date = req.params.date
  filename = req.params.filename 
  console.log(filename, date)
  fs.unlink(path.join(__dirname, './../public/uploads/'+date+'/'+ filename), function(err) {
	if (err) {
	  return console.error(err);
	}
	  // remove dir
	  fs.rmdir(path.join(__dirname, './../public/uploads/'+date), function(err) {
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


server.use('/404', (req, res) => {
   filename = '404'
  res.sendFile(path.join(__dirname, `./../public/${filename}.html`))
})

//products

server.use('/admin/:page', (req, res) => {
   filename = req.params.page
  res.sendFile(path.join(__dirname, `./../public/admin/${filename}.html`))
})

// server.use('/admin/users', (req, res) => {
//   res.sendFile(path.join(__dirname, './../public/admin/users.html'))
// })

// server.use('/admin/change-password', (req, res) => {
//   res.sendFile(path.join(__dirname, './../public/admin/change-password.html'))
// })

// server.use('/admin/categories', (req, res) => {
//   res.sendFile(path.join(__dirname, './../public/admin/categories.html'))
// })

// server.use('/admin/brands', (req, res) => {
//   res.sendFile(path.join(__dirname, './../public/admin/brand.html'))
// })

// server.use('/admin/archive', (req, res) => {
//   res.sendFile(path.join(__dirname, './../public/admin/archive.html'))
// })


server.use('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, './../public/admin/index.html'))
})

// server.use('^(/?!\.*api)/', (req, res) => {
//   res.sendFile(path.join(__dirname, './../public/404.html'))
// })

server.use('/api', router)

server.listen(port, () => {
  console.log('JSON Server is running')
})