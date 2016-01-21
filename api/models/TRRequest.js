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
      if (typeof(updatedRecord.reference) === 'string') {
          returnData.reference = JSON.parse(updatedRecord.reference); 
      } else {
          returnData.reference = updatedRecord.reference;
      }

      returnData.language_code = updatedRecord.toLanguageCode;
      
      var objData = updatedRecord.objectData;
      if (typeof(updatedRecord.objectData) === 'string') {
          objData = JSON.parse(updatedRecord.objectData);
      }

      var fields = {};
      _.forOwn(objData.form.data.fields, function(value, key) {
          fields[key] = value[returnData.language_code];
      });
      returnData.fields = fields;

      ADCore.queue.publish(updatedRecord.callback, returnData);
    }

    cb();
  }
  
  
};