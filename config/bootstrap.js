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
module.exports = function (cb) {

    AD.module.permissions(path.join(__dirname, '..', 'setup', 'permissions'), cb);

    ADCore.queue.subscribe('opsportal.translation.create', function (message, data) {
        var requiredProperties = ['actionKey', 'userID', 'callback', 'reference', 'model', 'modelCond', 'toLanguageCode', 'menu', 'form'];
        var allPropertiesFound = true;
        requiredProperties.forEach(function (prop) {
        
            /// NOTE: once Sails uses lodash v3.10.1, we can simply do this:
            /// allPropertiesFound = allPropertiesFound && _.has(data, prop);
        
            /// currently Sails uses v2.4.2 so we do this for now:
            var currData = data;

            allPropertiesFound = allPropertiesFound && _.has(currData, prop);
            if (currData) currData = currData[prop];
        });

        if (!allPropertiesFound) {
        
            // TODO : data provided not in valid format
        
        } else {
        
            // reformat the incoming data into a PARequest format:
            var trRequest = {};
            trRequest.actionKey = data.actionKey;
            trRequest.userID = data.userID;
            trRequest.callback = data.callback;
            trRequest.reference = data.reference;
            trRequest.status = 'pending';
            trRequest.model = data.model;
            trRequest.modelCond = data.modelCond;
            trRequest.toLanguageCode = data.toLanguageCode;
            trRequest.objectData = {
                'menu': data.menu,
                'form': data.form
            };

            TRRequest.create(trRequest)
                .then(function (newEntry) {
                    // tell all connected sockets that their info is "stale"
                    sails.sockets.broadcast('sails_model_create_trrequest', 'trrequest', { verb: 'stale' });
                })
                .catch(function (err) {
                    ADCore.error.log('unable to create this TRRequest entry', {
                        error: err,
                        data: trRequest,
                        module: 'opstool-process-translation'
                    })
                });
        }
    });

    setInterval(function () {
        console.log('TRRequest is broadcasting...');
        sails.sockets.broadcast('sails_model_create_trrequest', 'trrequest', { verb: 'stale' });
    }, 3000);

};