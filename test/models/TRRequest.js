var assert = require('chai').assert;

describe('TRRequest', function () {


    it('should be there', function () {

        assert.isDefined(TRRequest, ' --> TRRequest should be defined!');

    });


    it('should load the TRRequest fixtures', function (done) {

        TRRequest.find()
            .exec(function (err, list) {
                assert.isAbove(list.length, 0, ' --> should be more than 0 entries.');
                done();
            });
    });

});