var express = require('express')
var app = express()
var request = require('request')
var fs = require('fs')

function getPotd() {
  requestInfo()
  function requestInfo() {
    var now = new Date() 
    request('http://www.nationalgeographic.com/photography/photo-of-the-day/_jcr_content/.gallery.json', function(error, response, body) {
    if (!error && response.statusCode == 200) {
        var imgurl = 'http://yourshot.nationalgeographic.com' + JSON.parse(body).items[0].originalUrl
        var author = JSON.parse(body).items[0].credit
        var title = JSON.parse(body).items[0].title + ' ' + now.getMonth() + '-' + now.getDate() + '-' + now.getFullYear()
        var imagePath = 'images/' + title + '.jpg'
        var objNatGeo = {
          ogImg: imgurl,
          hostedUrl: '',
          credit: author
        }
    fs.open(imagePath, "w", function (err, fd) {
    if (err) {console.log(err)}
    request(imgurl).pipe(fs.createWriteStream(imagePath))
    sendAPICall(objNatGeo, imagePath);
    });
    
      }
      else {
        console.log(error)
      }
    })
  }
    var now = new Date() 
    if (now.getHours() === 0 || now.getSeconds() === 20) {
    requestInfo()
    console.log('Image checked')
  }
}
getPotd()

function sendAPICall(objNatGeo, imagePath) {
  app.get('/', function(req, res) {
    res.send(objNatGeo)
  })
  app.get('/POTD', function(req, res) {
    res.set('Content-Type', 'image/jpeg')
    res.sendfile(imagePath)
  })
}
app.listen(process.env.PORT, process.env.IP)