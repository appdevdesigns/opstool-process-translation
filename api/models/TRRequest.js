/**
* TRRequest.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

// connection:"appdev_default",
  
  tableName: "tr_request",

  attributes: {

    actionKey : { type: 'string' },

    userID : { type: 'string' },

    callback : { type: 'string' },
    
    reference : { type: 'json' },

    status : { type: 'string',
            in:[
            'pending',
            'processed'
            ],
            defaultsTo: 'pending'
    },
    
    model : { type: 'string' },
    
    modelCond : { type: 'json' },
    
    toLanguageCode : {
        type : "string",
        size : 10,
        maxLength: 10
    },

    objectData : { type: 'json' },
  },
  
  
  
  afterUpdate: function(updatedRecord, cb) {

    if (updatedRecord.status === 'processed') {

      // then this entry is finished being processed

      // Compile data to return to the calling application
      var returnData = {};
      returnData.id = updatedRecord.reference.id;
      returnData.toLanguageCode = updatedRecord.toLanguageCode;
      returnData.fields = updatedRecord.objectData.form.fields;

      ADCore.queue.publish(updatedRecord.callback, returnData);
    }

    cb();
  }
  
  
};