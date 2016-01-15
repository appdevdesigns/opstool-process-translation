steal(
        'appdev'
).then( function(){

    // Namespacing conventions:
    // AD.Model.Base.extend("[application].[Model]" , { static }, {instance} );  --> Object
    AD.Model.Base.extend("opstools.ProcessTranslation.TRRequest", {
        findAll: 'GET /opstool-process-translation/trrequest',
        findOne: 'GET /opstool-process-translation/trrequest/{id}',
        create:  'POST /opstool-process-translation/trrequest',
        update:  'PUT /opstool-process-translation/trrequest/{id}',
        destroy: 'DELETE /opstool-process-translation/trrequest/{id}',
        describe: function() {
            return {
          "actionKey": "string",
          "userID": "string",
          "callback": "string",
          "status": "string",
          "fromLanguage": "string",
          "toLanguage": "string",
          "objectData": "json"
};
        },
        // associations:['actions', 'permissions'],
        // multilingualFields:['role_label', 'role_description'],
        // validations: {
        //     "role_label" : [ 'notEmpty' ],
        //     "role_description" : [ 'notEmpty' ]
        // },
        fieldId:'id',
        fieldLabel:'actionKey'
    },{
        // model: function() {
        //     return AD.Model.get('opstools.ProcessTranslation.TRRequest'); //AD.models.opstools.ProcessTranslation.TRRequest;
        // },
        // getID: function() {
        //     return this.attr(this.model().fieldId) || 'unknown id field';
        // },
        // getLabel: function() {
        //     return this.attr(this.model().fieldLabel) || 'unknown label field';
        // }
    });


});