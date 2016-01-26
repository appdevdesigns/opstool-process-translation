var assert = require('chai').assert;
var fs = require("fs");
var path = require("path");

var AD = require('ad-utils');
var request = null;

var superTest = require('supertest');
var requestNoPerm = null;

describe('TRRequestController', function () {

    before(function (done) {

        request = AD.test.request(function (err) {

            requestNoPerm = superTest.agent(sails.hooks.http.app);

            requestNoPerm
                .post('/site/login')
                .send({ username: 'testNoPerm', password: 'test' })
                .end(function (err, res) {
                    done(err);
                });

        });
    });

    it('should not be able to access our REST create route: ', function (done) {

        request
            .post('/opstool-process-translation/trrequest')
            .set('Accept', 'application/json')
            .expect(403)                        // should return a forbidden
            .end(function (err, res) {
                assert.isNull(err, ' --> there should be no error.');
                done(err);
            });

    });

    it('should not be able to access our REST delete route: ', function (done) {

        request
            .delete('/opstool-process-translation/trrequest')
            .set('Accept', 'application/json')
            .expect(403)                        // should return a forbidden 
            .end(function (err, res) {

                assert.isNull(err, ' --> there should be no error.');
                done(err);
            });

    });

    it('should not be able to access our shortcut route for find: ', function (done) {

        request
            .get('/opstool-process-translation/trrequest/find')
            .set('Accept', 'application/json')
            .expect(404)                        // should return a not found 
            .expect('Content-Type', /json/)     // should return json
            .end(function (err, res) {
                assert.isNull(err, ' --> there should be no error.');
                done(err);
            });

    });

    it('should return data on a request: ', function (done) {

        request
            .get('/opstool-process-translation/trrequest')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)     // should return json
            .expect(200)                        // should return a successful response.
            .end(function (err, res) {

                assert.isNull(err, ' --> there should be no error.');
                assert.isArray(res.body, ' --> should have gotten an array back. ');
                assert.isAbove(res.body.length, 0, ' --> should be more than 0 entries.');
                done(err);
            });

    });

    it('should reject unauthorized users: ', function (done) {

        requestNoPerm
            .get('/opstool-process-translation/trrequest')
            .set('Accept', 'application/json')
            .expect(403)                        // should return a forbidden
            .end(function (err, res) {
                assert.isNull(err, ' --> there should be no error.');
                done(err);
            });

    });

    it('should update data on our REST put route', function (done) {
        var id = '1';
        var data = fs.readFileSync(path.join(__dirname, '..', 'fixtures', 'TRRequest.json'));
        var fixtureData = JSON.parse(data);
        var updatedData = fixtureData[0];
        updatedData.status = 'processed';

        request
            .put('/opstool-process-translation/trrequest/' + id)
            .send(updatedData)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function (err, res) {
                assert.isNull(err);

                assert.equal(updatedData.status, res.body.status);

                done(err);
            });

    });

    it('should not allow when update invalid status on our REST put route', function (done) {
        var id = '1';
        var updateModel = {
            "status": 'invalid'
        };

        request
            .put('/opstool-process-translation/trrequest/' + id)
            .send(updateModel)
            .set('Accept', 'application/json')
            .expect(400) // Bad request
            .end(function (err, res) {
                done(err);
            });

    });

    it('should return latest data on our REST TRlive route', function (done) {
        var id = '1';
        var data = fs.readFileSync(path.join(__dirname, '..', 'fixtures', 'TRRequest.json'));
        var fixtureData = JSON.parse(data);
        var trData = fixtureData[0];

        request
            .get('/opstool-process-translation/trrequest/trlive/' + id)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function (err, res) {
                for (var fieldName in trData.objectData.form.data.fields) {
                    assert.isNotNull(res.body[fieldName]);
                }

                done(err);
            });
    });

});