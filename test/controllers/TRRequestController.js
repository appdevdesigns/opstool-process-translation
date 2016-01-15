var assert = require('chai').assert;

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
        var updateModel = {
            "status": 'processed',
            "objectData": {
                "menu": {
                    "icon": "icon-edit",
                    "action": {
                        "key": "key-edit",
                        "context": "context-edit"
                    },
                    "fromLanguage": "fromLanguage-edit",
                    "toLanguage": "toLanguage-edit"
                }
            }
        };

        request
            .put('/opstool-process-translation/trrequest/' + id)
            .send(updateModel)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function (err, res) {
                assert.isNull(err);

                assert.equal(updateModel.status, res.body.status);
                assert.equal(updateModel.status, res.body.status);

                done(err);
            });

    });

});