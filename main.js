var http = require('http');
var xml2js = require('xml2js');
var child_process = require('child_process');

var exports = module.exports = {};

exports.validateParams = function(params) {
  // Print usage if argument count there are fewer than 4 arguments or more than 5 arguments and exit
  if (params.length < 4 || params.length > 5) {
    console.log("Usage: <artist> <song name> [<new size in pixels>px | <scale>x]");
    return false;
  }

  if (params.length === 5) {
    if (!params[4].endsWith(/(px)|x/i)) {
      console.log("Error: Size in wrong format.");
      return false;
    }
    if (Number(params[4].substring(0, params[4].indexOf(/[px]/i))) !== NaN) {
      if (size <= 0) {
        console.log("Error: Size must be nonzero and nonnegative.");
        return false;
      }
      if (resize_type === "px" && Math.floor(size) < size) {
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
  var artist = params[2], song = params[3], size = (params.length === 5) ? Number(params[4].substring(0, params[4].indexOf(/[px]/i))) : 0, resize_type = (params.length === 5) ? (params[4].endsWith('px') ? "px" : "x") : "";

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
          child_process.exec('curl ' + result.result.cover[0] + ' -o "' + artist + ' - ' + song + '.jpeg"', function(error, stdout, stderr) {
            if (err) { console.error(err); return true;}
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
