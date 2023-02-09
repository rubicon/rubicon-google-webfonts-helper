/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /fonts              ->  index
 * POST    /fonts              ->  create
 * GET     /fonts/:id          ->  show
 * PUT     /fonts/:id          ->  update
 * DELETE  /fonts/:id          ->  destroy
 */
'use strict';

var _ = require('lodash');
var stream = require('stream');

var core = require('./../../logic/core');

// Get list of fonts
exports.index = function (req, res) {

  core.getAll(function (items) {
    res.json(items);
  })

};

// Get specific fonts including links
exports.show = function (req, res) {

  // get the subset string if it was supplied... 
  // e.g. "subset=latin,latin-ext," will be transformed into ["latin","latin-ext"] (non whitespace arrays)
  var subsetsArr = _.isUndefined(req.query.subsets) ? null : _.without(req.query.subsets.split(/[,]+/), '');
  var variantsArr = _.isUndefined(req.query.variants) ? null : _.without(req.query.variants.split(/[,]+/), '');
  var formatsArr = _.isUndefined(req.query.formats) ? null : _.without(req.query.formats.split(/[,]+/), '');

  if (req.query.download === "zip") {
    var url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    core.getDownload(req.params.id, subsetsArr, variantsArr, formatsArr, function (archiveStream, filename) {

      if (_.isNil(archiveStream)) {
        // files not found.
        res.status(404)
          .send('Not found');
        return;
      }

      // Tell the browser that this is a zip file.
      res.writeHead(200, {
        'Content-Type': 'application/zip',
        'Content-disposition': 'attachment; filename=' + filename
      });

      stream.pipeline(archiveStream, res, function (err) {
        if (err) {
          console.error(`${url}: error while piping archive to the response stream`, err);
        }
      });
      return;
    });
    return;
  }

  core.get(req.params.id, subsetsArr, function (item) {
    if (item === null) {
      res.status(404)
        .send('Not found');
      return;
    }
    res.json(item);
  });
};
