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

var mongoose = require('mongoose'),
    async    = require('async'),
    _        = require('underscore');

/**
 * Plugin
 * -------------------------------------------------------------------------*/

module.exports = function(schema, options) {
  options || (options = {});

  if(!schema.paths._id)
    schema.add({
      '_id': { type: mongoose.Schema.ObjectId , unique: true }
    });

  schema.pre('save', function(next) {
    if(!this.isNew) return next();

    var target_models = mongoose.models;
    if(options.collections)
      target_models = _.pick(target_models, options.collections);

    uniqueId(target_models, function(err, id) {
      if(err) return next(err);
      this._id = id;
      next();
    }.bind(this));
  });

  function uniqueId(models, cb) {
    var id = new mongoose.Types.ObjectId();
    async.parallel(
        _.map(models, _.partial(isUnique, id)),
        function(err, results) {
          if(err) return cb(err);

          var failed = _.any(results, function(it) { return !it; });
          if(failed) uniqueId(models, cb);
          else cb(undefined, id);
        });
  }

  function isUnique(id, model) {
    return function(cb) {
      model
        .count({_id: id})
        .limit(1)
        .exec(function(err, count) {
          if(err) return cb(err);
          if(count > 0) cb(undefined, false);
          else          cb(undefined, true);
        });
    };
  }
};
