/**
 * TRRequestController
 *
 * @description :: Server-side logic for managing Trrequests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    _config: {
        model: "trrequest",
        actions: true,
        shortcuts: false,
        rest: true
    },

    lock: function (req, res) {
        var id = req.param('id');
        console.log('... lock:', id);
        if (id) {
            TRRequest.message(id, { locked: true }, req);
            res.AD.success({ locked: id });
        } else {
            res.AD.error(new Error('must provide an id'));
        }
    },

    unlock: function (req, res) {
        var id = req.param('id');
        console.log('... unlock:', id);
        if (id) {
            TRRequest.message(id, { locked: false }, req);
            res.AD.success({ unlocked: id });
        } else {
            res.AD.error(new Error('must provide an id'));
        }
    }


};

