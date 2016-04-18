/**
 * TRRequestController
 *
 * @description :: Server-side logic for managing Trrequests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var lockedItems = [];

ADCore.queue.subscribe('opsportal.socket.disconnect', function(message, socket) {
    var socketId = socket.id;

    _.forEach(lockedItems, function(lockedItem) {
        if (lockedItem.socketId === socketId) {
            TRRequest.message(lockedItem.id, { locked: false }, {});
        }
    });

    _.remove(lockedItems, function(lockedItem) {
        return lockedItem.socketId === socketId;
    });
});

module.exports = {

    _config: {
        model: "trrequest",
        actions: true,
        shortcuts: false,
        rest: true
    },

    // get opstool-process-translation/trrequest/trlive/:id   
    trlive: function(req, res) {
        var id = req.param('id');

        TRRequest.findOne(id)
            .then(function(request) {
                // pull out the model, and modelCondition
                // get model from sails
                var Model = sails.models[request.model];
                if (Model) {
                    // filter fields
                    var selectFields = Object.keys(request.objectData.form.data.fields);
                    selectFields.push('language_code');
					selectFields.push('updatedAt');

                    Model.find(request.modelCond, { select: selectFields })
                        .then(function(transList) {
                            var returnData = {};

                            // Convert to TRRequest format
                            _.forEach(transList, function(tran) {
								_.forOwn(tran, function(value, key) {
									if (key !== 'language_code') {
										if (!returnData[key]) returnData[key] = {};

										if (key === 'updatedAt')
											return;

										// Populate saved translate value
										if (request.updatedAt > tran.updatedAt && key !== 'id') {
											var savedValue = request.objectData.form.data.fields[key];
											returnData[key][tran['language_code']] = savedValue[tran['language_code']] ? savedValue[tran['language_code']] : value;
										}
										else {
											returnData[key][tran['language_code']] = value;
										}
									}
								});
                            });

                            return res.AD.success(returnData);
                        })
                } else {

                    var err = new Error('Model [' + request.model + '] not found.');
                    res.AD.error(err);
                }

                return null;

            })
            .catch(function(err) {
                res.AD.error(err)
            })
    },

    lock: function(req, res) {
        var id = req.param('id');
        if (id) {
            var socketId = req.socket.id;

            if (!lockedItems[id]) {
                lockedItems.push({
                    socketId: socketId,
                    id: id
                });
            }

            TRRequest.message(id, { locked: true }, req);
            res.AD.success({ locked: id });
        } else {
            res.AD.error(new Error('must provide an id'));
        }
    },

    unlock: function(req, res) {
        var id = req.param('id');
        if (id) {
            _.remove(lockedItems, function(lockedItem) {
                return lockedItem.id === id;
            });

            TRRequest.message(id, { locked: false }, req);
            res.AD.success({ unlocked: id });
        } else {
            res.AD.error(new Error('must provide an id'));
        }
    },

    wholock: function(req, res) {
        res.AD.success(_.map(lockedItems, function(item) { return parseInt(item.id); }));
    }

};

