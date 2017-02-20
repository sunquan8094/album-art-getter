var http = require('http');
var xml2js = require('xml2js');
var child_process = require('child_process');
var Jimp = require("jimp");

var exports = module.exports = {};

exports.validateParams = function(params) {
  // Print usage if argument count there are fewer than 4 arguments or more than 5 arguments and exit
  if (params.length < 4 || params.length > 5) {
    console.log("Usage: <artist> <song name> [<new size in pixels>px | <scale>x]");
    return false;
  }

  if (params.length === 5) {
    if (!params[4].endsWith("px") && !params[4].endsWith("x")) {
      console.log("Error: Size in wrong format.");
      return false;
    }

    var endOfNum = (params[4].indexOf("p") > -1) ? params[4].indexOf("p") : params[4].indexOf("x");

    if (Number(params[4].substring(0, endOfNum)) !== NaN) {
      if (Number(params[4].substring(0, endOfNum)) <= 0) {
        console.log("Error: Size must be nonzero and nonnegative.");
        return false;
      }
      if (params[4].endsWith("px") && Math.floor(Number(params[4].substring(0, endOfNum))) < Number(params[4].substring(0, endOfNum))) {
        console.log("Error: Size must be an integer for pixels.");
        return false;
      }
    }
    else {
      console.log("Error: Size in wrong format.");
      return false;
    }
  }
  return true;
}

exports.getPictures = function(params) {
  // Get command line arguments

  var artist = params[2], song = params[3], endOfNum = (params.length === 5) ? (params[4].indexOf("p") > -1) ? params[4].indexOf("p") : params[4].indexOf("x") : 0,
      size = (params.length === 5) ? Number(params[4].substring(0, endOfNum)) : 0, resize_type = (params.length === 5) ? (params[4].endsWith('px') ? "px" : "x") : "";

  // Make request
  var req = http.get('http://api.lololyrics.com/0.5/getLyric?artist=' + encodeURIComponent(artist) + '&track=' + encodeURIComponent(song), (res) => {

  });

  // Make strings for storing raw and parsed responses
  var doc = "", parsed = "";

  req.on('response', function(response) {
    response.on('data', function(chunk) {
      doc += chunk;
    });

    response.on('end', function() {
      parsed = xml2js.parseString(doc, function(err, result) {
        console.log(result.result.cover[0]);
        if (result.result.status[0] === 'OK') {
          console.log("Status OK. Obtaining album art...");
          Jimp.read(result.result.cover[0], function(err, img) {
            if (err) {
              console.error(err); return false;
            }
            if (size !== 0) {
              console.log("Resizing image...");
              console.log(size);
              if (resize_type === "px") {
                img.clone().resize(size,Jimp.AUTO).quality(60).write(artist + ' - ' + song + "_" + params[4] + '.jpeg');
              }
              else if (resize_type === "x") {
                img.clone().scale(size).quality(100).write(artist + ' - ' + song + "_" + params[4] + '.jpeg');
              }
            }
            else img.clone().write(artist + ' - ' + song + '.jpeg');
          }).catch(function(err) {
            console.error(err);
            console.log("There was an error processing your image.");
            return false;
          });
          console.log("Album art obtained.");
          return true;
        }
        else if (result.result.status[0] === 'ERROR') {
          console.error("There was an error.");
          return false;
        }
      });
    });
  });
}

exports.main = function() {
  if (exports.validateParams(process.argv)) exports.getPictures(process.argv);
}

exports.main(process.argv);
