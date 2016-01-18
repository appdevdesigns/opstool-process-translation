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

    it('should show error when set invalid status', function (done) {

        TRRequest.update({ id: 1 }, {
            status: 'invalid'
        }).exec(function (err, result) {
            assert.isNotNull(err, ' --> should show invalid status error');
            assert.isUndefined(result, ' --> should return null result');
            done();
        });
    });

    it('should allow when set pending status', function (done) {
        TRRequest.update({ id: 1 }, {
            status: 'pending'
        }).exec(function (err, result) {
            assert.isNull(err, ' --> should not show any errors');
            assert.isNotNull(result, ' --> should return result');
            done();
        });

    });

    it('should allow when set processed status', function (done) {
        TRRequest.update({ id: 1 }, {
            status: 'processed'
        }).exec(function (err, result) {
            assert.isNull(err, ' --> should not show any errors');
            assert.isNotNull(result, ' --> should return result');
            done();
        });

    });

    it('should not allow when set toLanguageCode value more than 10 characters', function (done) {
        TRRequest.update({ id: 1 }, {
            toLanguageCode: '12345678910'
        }).exec(function (err, result) {
            assert.isNotNull(err, ' --> should show a error');
            done();
        });

    });

});