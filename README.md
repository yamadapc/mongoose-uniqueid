# mongoose-uniqueid [![Build Status](https://secure.travis-ci.org/yamadapc/mongoose-uniqueid.png?branch=master)](http://travis-ci.org/yamadapc/mongoose-uniqueid)

A mongoose plugin for having a unique ObjectId (the '\_id' property) across
several collections.

## Getting Started
Install the module with: `npm install mongoose-uniqueid`

```javascript
var mongoose = require('mongoose'),
    Schema   = mongoose.Schema
    uniqueid = require('mongoose-uniqueid');

var UserSchema = new Schema({}, {_id: false});

UserSchema.plugin(uniqueid, {
  models: ['users', 'organizations']
});

var OrganizationSchema = new Schema({}, {_id: false});

```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding
style. Add unit tests for any new or changed functionality.

## License
Copyright (c) 2013 Pedro Yamada. Licensed under the MIT license.

## Donations
Would you like to buy me a beer? Send bitcoin to 3JjxJydvoJjTrhLL86LGMc8cNB16pTAF3y
