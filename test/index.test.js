'use strict';

var uniqueId = require('..'),
    mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    should   = require('should');

mongoose.connect('mongodb://localhost/test');

describe('uniqueId', function() {
  var Test;

  // Register testing model
  before(function() {
    var TestSchema = new Schema({}, { _id: false });
    TestSchema.plugin(uniqueId, {
      collections: ['Test']
    });
    Test = mongoose.model('Test', TestSchema);
  });

  describe('when creating a document', function() {
    var doc;
    before(function() {
      doc = new Test();
      should.exist(doc);
    });

    it('shouldn\'t imediatelly attach an _id', function() {
      doc.should.not.have.property('_id');
    });

    it('should attach an _id on save', function(done) {
      doc.save(function(err, _doc) {
        should.not.exist(err);
        should.exist(doc);
        doc.should.have.property('_id');
        done();
      });
    });
  });
});
