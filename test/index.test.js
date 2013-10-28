'use strict';

var uniqueId = require('..'),
    mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    should   = require('should'),
    qc       = require('quickcheck');

describe('uniqueId', function() {
  var Test, doc;

  // Connect to mongo
  before(function() {
    mongoose.connect('mongodb://localhost/test');
  });

  // Register testing model
  before(function() {
    var TestSchema = new Schema({}, { _id: false });
    TestSchema.plugin(uniqueId.plugin, {
      collections: ['Test']
    });
    Test = mongoose.model('Test', TestSchema);
  });

  describe('when creating a document', function() {
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

  describe('#isTaken', function() {
    var fn;

    it('should return a new function', function() {
      fn = uniqueId._isTaken(doc._id, Test);
      fn.should.be.instanceof(Function);
    });

    it('should pass on whether the id is taken to a callback', function(done) {
      fn(function(err, result) {
        should.not.exist(err);
        should.exist(result);
        result.should.equal(true);
        done();
      });
    });
  });

  describe('#genUniqueId', function() {
    var ids = [];
    function propertyUnique() {
      uniqueId._genUniqueId([Test], function(err, id) {
        should.not.exist(err);
        should.exist(id);
        ids.should.not.contain(id);
        ids.push(id);
      });
      return true;
    }

    it('should never pass on a duplicated id', function(done) {
      try { qc.forAll(propertyUnique); } finally { done(); }
    });
  });
});
