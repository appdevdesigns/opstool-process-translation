/**
 * ProcessTranslation
 *
 * @module      :: Service
 * @description :: This is a collection of Permission routines for our applications.
 *
 */
var AD = require('ad-utils');
var _ = require('lodash');


module.exports = {


    /**
     * ProcessTranslation.create()
     *
     * create a translation request.
     *
     * @param {json} data
     */
    create:function(data) {


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
                return null;
            })
            .catch(function (err) {
                ADCore.error.log('unable to create this TRRequest entry', {
                    error: err,
                    data: trRequest,
                    module: 'opstool-process-translation'
                })
                return null;
            });
        }

    },


    /**
     * ProcessTranslation.createMultilingual()
     *
     * create a translation request from a given multilingual object.
     *
     * @param {json} data
     */
    createMultilingual:function(data) {
        // data:
        // {

        //     actionKey:'site.permission.action.translate',   // user has to have this action key
        //     userID:'*',                                     // not tied to a specific user who created the entry
        //     callback:PERMISSION_TRANSLATION_DONE,           // the event to trigger when translation is done
        //     reference:{ id:object.id },                     // (optional) likewise, don't need to provide a reference

        //     //// MENU options:
        //     icon:'fa-lock',                                 // (optional) 
        //     menuKey:'permission.new.action',                // the multilingual text.key for this object
        //     menuContext: 'appdev',                          // the multilingual context for the actionKey label
        //     itemName:object.action_key,                     // (optional) itemName printed directly
        //     createdBy: 'system',                            // (optional) who is it by?
        //     date: AD.util.moment(new Date()).format('L'),   // (optional) what date reference to use

        //     //// The actual model instance 
        //     object: object,                                 // the instance of the BASE model (not TRANS)
        //     fromLanguage: options.fromLanguage,             // which lang was the original

        //     fieldsToLabelKeys: { 'action_description':'permission.action.description' },
        //     labelContext: 'appdev'
        // }


        // get a set of Multilingual Object Info for our given object
        var objectSummary = Multilingual.model.summary(data.object);

        var object = data.object;

        var objectModel = object;
        if (objectModel._Klass) objectModel = objectModel._Klass();

        var allLanguages = {};
        var fields = {};
        var labels = {};

        var reference = data.reference || {};
        if (!data.reference) {
            reference[objectSummary.pk] = object[objectSummary.pk];
        }


        var model = objectSummary.transModelKey;
        var modelCond = {};
        modelCond[objectSummary.modelKey] = object[objectSummary.pk];

        var fieldNames = [];  // ['action_description'];
        objectSummary.transFields.forEach(function(f){
            if (f != 'language_code') {
                fieldNames.push(f);
            }
        })


        async.series([


            // make sure we have a fullly translated object:
            function(done) {
                if ((object.translations) && (object.translations.length > 0)) {
                    done();
                } else {

                    objectModel.findOne(object[objectSummary.pk])
                    .populate('translations')
                    .then(function(a){
                        if (a) {
                            object = a;
                            done();
                        } else {
                            var err = new Error('Cant find '+objectSummary.modelKey+'.'+objectSummary.pk+'='+object[objectSummary.pk]);
                            done(err);
                        }
                        return null;
                    })
                    .catch(function(err){
                        done(err);
                        return null;
                    })

                }
            },


            // compile fields
            function(done) {

                /*
                    {
                        "caption": {
                            "languageCode": "translation",
                            "en": "my english translation 1",
                            "ko": "[ko]my english translation 1",
                            "zh-hans": "[zh-hans]my english translation 1",
                            "th": "[th]my english translation 1"
                        },
                        "description": {
                            "languageCode": "translation",
                            "en": "my english translation 1",
                            "ko": "[ko]my english translation 1",
                            "zh-hans": "[zh-hans]my english translation 1",
                            "th": "[th]my english translation 1"
                        }
                    }
                */

                fieldNames.forEach(function(key) {
                    fields[key] = {};
                    object.translations.forEach(function(trans){
                        fields[key][trans.language_code] = trans[key];
                    })
                })

                done();
            },


            // compile labels
            function(done) {


                var numDone = 0;
                fieldNames.forEach(function(key){
                    labels[key] = {};
                    var cond = {label_key:data.fieldsToLabelKeys[key], label_context:data.labelContext };
                  
                    SiteMultilingualLabel.find(cond)
                    .then(function(list){
                        list.forEach(function(label){
                            labels[key][label.language_code] = label.label_label
                        })

                        numDone ++;
                        if (numDone >= fieldNames.length) {
                            done();
                        }
                        return null;
                    })
                    // .catch(function(err){

                    //     ADCore.error.log('Failed to lookup SiteMultilingualLabels', { error: err, cond:cond });
                    //     done(err);
                    // })
                })

            },



            // get all the Languages in the system:
            function(done){

                Multilingual.languages.hash()
                .then(function(hash){

                    allLanguages = hash;
                    done();
                })
                .fail(function(err){
                    ADCore.error.log('Error looking up Multilingual.languages.hash():',{ error: err });
                    done(err);
                })
            }


        ], function(err, results) {

            if (err) {
                console.error('*** Yikes!:', err);
            }

            // //// TODO: register a translation request for new Action descriptions
            var request = {
                actionKey:  data.actionKey,             // user has to have this action key
                userID:     data.userID,                // not tied to a specific user who created the entry
                callback:   data.callback,              // the event to trigger when translation is done
                reference:  reference,                  // likewise, don't need to provide a reference

                model:      model,                      // the multilingual model!  (not the base model)
                modelCond:  modelCond,                  // the id of the instance we are translating

                "menu": {
                    "icon": data.icon || 'fa-table',
                    "action": {
                        "key": data.menuKey,
                        "context": data.menuContext
                    },
                    "fromLanguage": allLanguages[data.fromLanguage],
                    'itemName':     data.itemName,
                    "createdBy":    data.createdBy,
                    "date":         data.date || AD.util.moment(object.createdAt).format('L')
                },

                "form": {
                    "data": {
                        "fields": fields,
                        "labels": labels,
                        "optionalInfo": ''
                    },
                    "view": ''
                }

//// also, update the translation tool if I leave out userID: then auto add a "*"
//// Permissions.limitRouteToUserActionScope() should also take a 'catchAll' param that gets added :  eg our '*' 
//// and translation/config/policies.js should add a catchAll:'*' param.
            };


            object.translations.forEach(function(trans){

                // if not sourceLang
                if (trans.language_code != data.fromLanguage) {

                    // generate a request for this as toLanguage
                    var currReq = _.cloneDeep(request);
                    currReq.toLanguageCode = trans.language_code;
                    currReq.menu.toLanguage = allLanguages[trans.language_code]

// console.log('... Translation Request:', currReq);
                    ProcessTranslation.create(currReq);
                    
                } // end if

            }) // next

        });


    }


}

