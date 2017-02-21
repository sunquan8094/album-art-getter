var http = require('http');
var https = require('https');
var xml2js = require('xml2js');
var child_process = require('child_process');
var Jimp = require("jimp");

var exports = module.exports = {};

exports.artist = "";
exports.song = "";
exports.size = 0;
exports.size_param_index = -1;
exports.api_index = -1;
exports.endOfNum = 0;
exports.size_param = "";
exports.api_param = "";
exports.resize_type = "";

exports.firstIndexOfRegexInArray = function(array, regex) {
  for (var a = 0; a < array.length; a++) {
    if (regex.test(array[a])) {
      return a;
    }
  }
  return -1;
}

exports.validateParams = function(params) {
  // Print usage if argument count there are fewer than 4 arguments or more than 5 arguments and exit
  if (params.length < 4 || params.length > 6) {
    console.log("Usage: <artist> <song name> [ <new size in pixels>px | <scale>x ] [-<1 (default) | 2>]" );
    return false;
  }

  exports.artist = params[2];
  exports.song = params[3];

  exports.size_param_index = exports.firstIndexOfRegexInArray(params, /^\d+(\.\d+)?p?x$/);
  exports.api_index = exports.firstIndexOfRegexInArray(params, /^\-[12]$/);

  if (exports.size_param_index <= -1 && (!(params.length == 5 && exports.api_index > -1))) {
    console.log("Error: Invalid size parameter.");
    return false;
  }
  else if (exports.size_param_index > -1){
    exports.size_param = params[exports.size_param_index];
    exports.endOfNum = (exports.size_param.indexOf("p") > -1) ? exports.size_param.indexOf("p") : exports.size_param.indexOf("x");

    if (Number(exports.size_param.substring(0, endOfNum)) !== NaN) {
      if (exports.size_param.endsWith("px") && Math.floor(Number(exports.size_param.substring(0, endOfNum))) < Number(exports.size_param.substring(0, endOfNum))) {
        console.log("Error: Size must be an integer for pixels.");
        return false;
      }
    }

    exports.resize_type = (exports.size_param.indexOf("p") > -1) ? "px" : "x";
  }

  if (exports.api_index <= -1 && (!(params.length == 5 && exports.size_param_index > -1))) {
    console.log("Error: Invalid API mode parameter.");
    return false;
  }
  else if (exports.api_index > -1) {
    exports.api_param = params[exports.api_index];
    exports.api_mode = Number(exports.api_param.substring(1));
  }

  return true;
}

exports.manipulateImage = function(err, img) {
  if (err) {
    console.error(err); return false;
  }
  if (exports.size !== 0) {
    console.log("Resizing image...");
    if (exports.resize_type === "px") {
      img.clone().resize(exports.size,Jimp.AUTO).quality(60).write(exports.artist + ' - ' + exports.song + "_" + exports.size_param + '.jpeg');
    }
    else if (exports.resize_type === "x") {
      img.clone().scale(exports.size).quality(100).write(exports.artist + ' - ' + exports.song + "_" + exports.size_param + '.jpeg');
    }
  }
  else img.clone().write(exports.artist + ' - ' + exports.song + '.jpeg');
  return true;
}

exports.getPictures = function() {
  // Make strings for storing raw and parsed responses as well as request
  var doc = "", parsed = "";
  var req = (exports.api_mode === 1) ? http.get('http://api.lololyrics.com/0.5/getLyric?artist=' + encodeURIComponent(exports.artist) + '&track=' + encodeURIComponent(exports.song), (res) => {}) : https.get('https://api.spotify.com/v1/search?q='  + encodeURIComponent(exports.artist + " " + exports.song) + "&type=track", (res) => {});

  req.on('response', function(response) {
    response.on('data', function(chunk) {
      doc += chunk;
    });

    response.on('end', function() {
      if (exports.api_mode === 1) {
        parsed = xml2js.parseString(doc, function(err, result) {
          console.log(result);
          if (result.result.status[0] === 'OK') {
            console.log("Status OK. Obtaining album art...");
            Jimp.read(result.result.cover[0], exports.manipulateImage).catch(function(err) {
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
      }
      else if (exports.api_mode === 2) {
        parsed = JSON.parse(doc);
        console.log(parsed.tracks.items);
        Jimp.read(parsed.tracks.items[0].album.images[0].url, exports.manipulateImage).catch(function(err) {
          console.error(err);
          console.log("There was an error processing your image.");
          return false;
        });
        console.log("Album art obtained.");
        return true;
      }
    });
  });
}

exports.main = function() {
  if (exports.validateParams(process.argv)) exports.getPictures(process.argv);
}

exports.main(process.argv);
