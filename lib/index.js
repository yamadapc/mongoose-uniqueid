'use strict';
/**
 * mongoose-uniqueid
 * github.com/mongoose-uniqueid
 *
 * Copyright (c) 2013 Pedro Yamada
 * Licensed under the MIT license.
 */

/**
 * Dependencies
 * -------------------------------------------------------------------------*/

var mongoose    = require('mongoose'),
    async       = require('async'),
    _           = require('underscore');

/**
 * Plugin
 * -------------------------------------------------------------------------*/

exports.plugin = function(schema, options) {
  options || (options = {});

  if(!schema.paths._id)
    schema.add({
      '_id': { type: mongoose.Schema.ObjectId , unique: true }
    });

  schema.pre('save', function(next) {
    if(!this.isNew) return next();

    var target_models = mongoose.models;
    if(options.models)
      target_models = _.pick(target_models, options.models);

    exports._genUniqueId(target_models, function(err, id) {
      if(err) return next(err);
      this._id = id;
      next();
    }.bind(this));
  });
};

/**
 * Utility Functions
 * -------------------------------------------------------------------------*/

exports._genUniqueId = function(models, cb) {
  var id = new mongoose.Types.ObjectId();
  async.parallel(
      _.map(models, _.partial(exports._isTaken, id)),
      function(err, results) {
        if(err) return cb(err);

        if(_.any(results, _.identity))
          exports._genUniqueId(models, cb);
        else
          cb(undefined, id);
      });
};

exports._isTaken = function(id, model) {
  return function(cb) {
    model
      .count({_id: id})
      .limit(1)
      .exec(function(err, count) {
        if(err) return cb(err);
        if(count > 0) cb(undefined, true);
        else          cb(undefined, false);
      });
  };
};
