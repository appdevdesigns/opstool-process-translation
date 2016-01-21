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

    actionKey : { type: 'string', required: true },

    userID : { type: 'string', required: true },

    callback : { type: 'string', required: true },
    
    reference : { type: 'json', required: true },

    status : { type: 'string',
            in:[
            'pending',
            'processed'
            ],
            defaultsTo: 'pending'
    },
    
    model : { type: 'string', required: true },
    
    modelCond : { type: 'json', required: true },
    
    toLanguageCode : {
        type : "string",
        required: true,
        size : 10,
        maxLength: 10
    },

    objectData : { type: 'json', required: true },
  },
  
  
  
  afterUpdate: function(updatedRecord, cb) {

    if (updatedRecord.status === 'processed') {

      // then this entry is finished being processed

      // Compile data to return to the calling application
      var returnData = {};

      // afterUpdate does not provide the json fields as a object
      // so we have to convert them with JSON.parse() before using them:
      returnData.reference = JSON.parse( updatedRecord.reference );
      returnData.language_code = updatedRecord.toLanguageCode;

      // convert objectData:
      var objData = updatedRecord.objectData;
      if (typeof objData == 'string') {
        objData = JSON.parse(objData);
      }

      // we only want to send back the specific fields being updated:
      // {
      //     'fieldName1' : 'translation 1',
      //     'fieldName2' : 'translation 2'
      // }
      var fields = {};

      // Current objData.form.fields are in format:
      //   {
      //       "activity_name": {
      //           "th": "test.Q",
      //           "en": "test.Q",
      //           "undefined": "[object Object]"
      //       },
      //       "activity_description": {
      //           "th": "asdf",
      //           "en": "asdf",
      //           "undefined": "[object Object]"
      //   }
    
      // convert to desired fields format:
      _.forOwn(objData.form.data.fields, function(value, key) {
        fields[key] = value[returnData.language_code];
      });


      returnData.fields = fields;

      ADCore.queue.publish(updatedRecord.callback, returnData);
    }

    cb();
  }
  
  
};