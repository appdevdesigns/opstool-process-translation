var assert = require('chai').assert;
var fs = require("fs");
var path = require("path");

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

    it('should actionKey field is required', function (done) {
        var data = fs.readFileSync(path.join(__dirname, '..', 'fixtures', 'TRRequest.json'));
        var fixtureData = JSON.parse(data);
        var trData = fixtureData[0];
        trData.id = Math.random();
        delete trData.actionKey;

        TRRequest.create(trData).exec(function (err, result) {
            assert.isNotNull(err, ' --> should show required field error');
            assert.isUndefined(result, ' --> should not return result');
            done();
        });
    });
    
     it('should userID field is required', function (done) {
        var data = fs.readFileSync(path.join(__dirname, '..', 'fixtures', 'TRRequest.json'));
        var fixtureData = JSON.parse(data);
        var trData = fixtureData[0];
        trData.id = Math.random();
        delete trData.userID;

        TRRequest.create(trData).exec(function (err, result) {
            assert.isNotNull(err, ' --> should show required field error');
            assert.isUndefined(result, ' --> should not return result');
            done();
        });
    });
    
     it('should callback field is required', function (done) {
        var data = fs.readFileSync(path.join(__dirname, '..', 'fixtures', 'TRRequest.json'));
        var fixtureData = JSON.parse(data);
        var trData = fixtureData[0];
        trData.id = Math.random();
        delete trData.callback;

        TRRequest.create(trData).exec(function (err, result) {
            assert.isNotNull(err, ' --> should show required field error');
            assert.isUndefined(result, ' --> should not return result');
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
        var data = fs.readFileSync(path.join(__dirname, '..', 'fixtures', 'TRRequest.json'));
        var fixtureData = JSON.parse(data);
        var updatedData = fixtureData[0];
        updatedData.status = 'processed';

        TRRequest.update({ id: updatedData["id"] }, updatedData).exec(function (err, result) {
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

    it('should callback to sender when translate data complates', function (done) {
        var data = fs.readFileSync(path.join(__dirname, '..', 'fixtures', 'TRRequest.json'));
        var fixtureData = JSON.parse(data);
        var updatedData = fixtureData[0];
        updatedData.status = 'processed';
        updatedData.objectData.form.data.fields.caption[updatedData.toLanguageCode] = "It's edited";
        updatedData.objectData.form.data.fields.description[updatedData.toLanguageCode] = "It's edited";

        ADCore.queue.subscribe(updatedData.callback, function (callbackName, returnData) {
            assert.deepEqual(returnData.reference, updatedData.reference, ' --> should match reference data');
            assert.equal(returnData.language_code, updatedData.toLanguageCode, ' --> should match language code');
            assert.equal(returnData.fields['caption'], updatedData.objectData.form.data.fields.caption[updatedData.toLanguageCode], ' --> should match caption value');
            assert.equal(returnData.fields['description'], updatedData.objectData.form.data.fields.description[updatedData.toLanguageCode], ' --> should match description value');
            done();
        });

        TRRequest.update({ id: updatedData["id"] }, updatedData).exec(function (err, result) {
            assert.isNull(err, ' --> should not show any error');
        });
    });

    it('should not callback when save translate data', function (done, test) {
        var data = fs.readFileSync(path.join(__dirname, '..', 'fixtures', 'TRRequest.json'));
        var fixtureData = JSON.parse(data);
        var updatedData = fixtureData[0];
        updatedData.status = 'pending';
        updatedData.objectData.form.data.fields.caption[updatedData.toLanguageCode] = "It's edited";
        updatedData.objectData.form.data.fields.description[updatedData.toLanguageCode] = "It's edited";

        ADCore.queue.subscribe(updatedData.callback, function (callbackName, returnData) {
            done('Should not publish callback');
        });

        TRRequest.update({ id: updatedData["id"] }, updatedData).exec(function (err, result) {
            assert.isNull(err, ' --> should not show any error');

            setTimeout(function () {
                done();
            }, 1900);
        });

    });

});