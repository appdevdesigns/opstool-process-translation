/**
 * Bootstrap
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */
var path = require('path');
var AD = require('ad-utils');
var _ = require('lodash');

module.exports = function (cb) {

    // handle our common bootstrap setup instructions:
        // - verify permissions are created
        // - verify opsportal tool definitions are defined.
    AD.module.bootstrap(__dirname, cb);


    ////
    //// Setup the Queue listeners here
    ////
    ADCore.queue.subscribe('opsportal.translation.create', function (message, data) {
        ProcessTranslation.create(data);
    });

    ADCore.queue.subscribe('opsportal.translation.multilingual.create', function (message, data) {
        ProcessTranslation.createMultilingual(data);
    });

};