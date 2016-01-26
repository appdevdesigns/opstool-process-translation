steal(
    'appdev',
    'opstools/ProcessTranslation/models/base/TRRequest.js'
    ).then(function () {

        // Namespacing conventions:
        // AD.Model.extend('[application].[Model]', {static}, {instance} );  --> Object
        AD.Model.extend('opstools.ProcessTranslation.TRRequest', {
            useSockets: true,
            wholock: function (cb) {
                return AD.comm.service.get({ url: '/opstool-process-translation/trrequest/wholock' }, cb);
            } 
            /*
                    findAll: 'GET /trrequest',
                    findOne: 'GET /trrequest/{id}',
                    create:  'POST /trrequest',
                    update:  'PUT /trrequest/{id}',
                    destroy: 'DELETE /trrequest/{id}',
                    describe: function() {},   // returns an object describing the Model definition
                    fieldId: 'id',             // which field is the ID
                    fieldLabel:'actionKey'      // which field is considered the Label
            */
        }, {
                getLiveTrData: function (cb) {
                    return AD.comm.service.get({ url: '/opstool-process-translation/trrequest/trlive/' + this.getID() }, cb);
                },
                lock: function () {
                    return AD.comm.socket.get({ url: '/opstool-process-translation/trrequest/lock/' + this.getID() });
                },

                unlock: function () {
                    return AD.comm.socket.get({ url: '/opstool-process-translation/trrequest/unlock/' + this.getID() });
                }
                /*
                        // Already Defined:
                        model: function() {},   // returns the Model Class for an instance
                        getID: function() {},   // returns the unique ID of this row
                        getLabel: function() {} // returns the defined label value
                */
            });


    });