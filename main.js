var http = require('http');
var xml2js = require('xml2js');
var child_process = require('child_process');

// Print usage if argument count there are fewer than 4 arguments and exit
if (process.argv.length < 4 || process.argv.length > 4) {
  console.log("Usage: <artist> <song name>");
  return;
}

// Get command line arguments
var artist = process.argv[2], song = process.argv[3];

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
          if (err) { console.error(err); return;}
        });
        console.log("Album art obtained.");
      }
      else if (result.result.status[0] === 'ERROR') {
        console.error("There was an error.");
        return;
      }
    });
  });
});
