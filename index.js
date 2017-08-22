/*
 *
 * Add header info here
 *
 */

'use strict';

var fs = require('fs'),
  ar = require('archiver'),
  utils = require('svift-utils')

var bundle = (function () {
 
  var module = {}

  /**
  * ZIP a folder, name it like the folder and move it into the folder after its done, then invoke the callback
  *
  * @param {String} `folder` Path to the folder that should be zipped
  * @param {Function} `callback` Callback function when its done
  * @param {Boolean} `delete` true > zipped folder is deleted after zipping, false > move zip into the folder
  * @api public
  */

  module.bundle = function (folder, del, callback) {
    var split = folder.split('/'),
      name = split[split.length-1],
      path = folder.substr(0,folder.length-name.length),
      output = fs.createWriteStream(path + name + '.zip')

      var archive = ar('zip', {
          zlib: { level: 9 }
      })

      output.on('close', function() {
        if(del){
          utils.deleteFolderRecursive(path + name)
        }else{
          fs.renameSync(path + name + '.zip', path + name + '/' + name + '.zip')
        }
        callback()
      })

      archive.on('warning', function(err) {
        if (err.code === 'ENOENT') {
            // log warning 
        } else {
            throw err
        }
      })

      archive.on('error', function(err) {
        throw err
      })

      archive.pipe(output)

      archive.directory(folder, false);
  };

  return module;
 
})();

module.exports = bundle;