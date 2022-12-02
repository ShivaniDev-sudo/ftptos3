var anyfile = require(__dirname + '/..')();
var fs = require('fs')
var Client = require('ftp');
const async = require("async");
var config = {
  host: 'http://172.16.3.4', // your ftp host
  port: '4444',
  user: 'test@ftp', //username
  password: 'ab' // password
};
const source = ""; // Source Location
const destination = ""; // Destination

var c = new Client();
//timeout, auth, ...
c.on('error', function (err) {
  return callback(err, false);
});
c.on('ready', function () {

  var presentInFtpAndNotInS3 = JSON.parse(fs.readFileSync('filesnotins3.txt'))
  async.mapLimit(presentInFtpAndNotInS3, 1, function (file, callback) {
    if (file == '.' || file == '..') { // ftp folder also lists . and .. as file
      return callback(null, false);
    } else {
      try {
        fromFile = source + '/' + file;
        console.log('copy from ', fromFile)
        toFile = destination + '/' + file;
        console.log('copy to ', toFile)
        anyfile.from(fromFile).to(toFile, function (err, res) {
          console.log('res', res);
          return callback(null, res);
        });
      } catch (err) {
        console.log('error', err);
        return callback(null, false);
      }
    }
  }, function (err, results) {
    console.log('results', results)
    c.end();
    process.exit();
  });
});
c.connect(config);