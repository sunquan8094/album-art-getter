var http = require('http');
var https = require('https');
var xml2js = require('xml2js');
var child_process = require('child_process');
var Jimp = require("jimp");

var exports = module.exports = {};
var valid_img_types = ["jpg", "jpeg", "png", "bmp"];

exports.artist = "";
exports.song = "";
exports.size = 0;
exports.size_param_index = -1;
exports.api_index = -1;
exports.endOfNum = 0;
exports.size_param = "";
exports.api_param = "";
exports.resize_type = "";
exports.output_filename_index = "";
exports.output_filename = "";

exports.MIN_NUM_PARAMS = 4;
exports.MAX_NUM_PARAMS = 7;

exports.amountGreaterThan = function(array, n) {
  var retval = 0;
  for (var p = 0; p < array.length; p++) {
    if (array[p] > n) {
      retval++;
    }
  }
  return retval;
}

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
  if (params.length < exports.MIN_NUM_PARAMS || params.length > exports.MAX_NUM_PARAMS) {
    console.log("Usage: <artist> <song name> [ <new size in pixels>px | <scale>x ] [-<1 (default) | 2>] [<output filename>.<format>]" );
    return false;
  }

  exports.artist = params[2];
  exports.song = params[3];

  exports.size_param_index = exports.firstIndexOfRegexInArray(params, /(^\d+(\.\d+)?x$)|(^\d+px$)/);
  exports.api_index = exports.firstIndexOfRegexInArray(params, /^\-[12]$/);
  exports.output_filename_index = exports.firstIndexOfRegexInArray(params, /^([A-Za-z0-9 \-_+.()]+\.)?(jpeg|jpg|png|bmp)$/);

  for (var r = exports.MIN_NUM_PARAMS + 1; r <= exports.MAX_NUM_PARAMS; r++) {
    if (exports.amountGreaterThan([exports.size_param_index, exports.api_index, exports.output_filename_index], -1) < r - exports.MIN_NUM_PARAMS && params.length >= r) {
      console.log("Parameters are in the wrong format.");
      return false;
    }
  }

  if (exports.size_param_index > -1) {
    exports.size_param = params[exports.size_param_index];
    exports.endOfNum = (exports.size_param.indexOf("p") > -1) ? exports.size_param.indexOf("p") : exports.size_param.indexOf("x");

    var num = exports.size_param.substring(0, exports.endOfNum);

    exports.size = Number(num);
    exports.resize_type = (exports.size_param.indexOf("p") > -1) ? "px" : "x";
  }

  if (exports.api_index > -1) {
    exports.api_param = params[exports.api_index];
    exports.api_mode = Number(exports.api_param.substring(1));
  }

  if (exports.output_filename_index > -1) {
    exports.output_filename = params[exports.output_filename_index];
  }

  return true;
}

exports.manipulateImage = function(err, img) {
  if (err) {
    console.error(err);
  }
  var name = exports.artist + ' - ' + exports.song + ((exports.size_param > 0) ? ("_" + exports.size_param) : "") + '.jpeg';
  if (exports.output_filename !== "") {
    if (valid_img_types.indexOf(exports.output_filename) === -1) {
      name = exports.output_filename;
    }
    else {
      name = exports.artist + ' - ' + exports.song + ((exports.size_param > 0) ? ("_" + exports.size_param) : "") + '.' + exports.output_filename;
    }
  }
  if (exports.size !== 0) {
    console.log("Resizing image...");
    if (exports.resize_type === "px") {
      img.clone().resize(exports.size,Jimp.AUTO).quality(60).write(name);
    }
    else if (exports.resize_type === "x") {
      img.clone().scale(exports.size).quality(100).write(name);
    }
  }
  else img.clone().write(name);
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
