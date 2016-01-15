// Dependencies
steal(
    "opstools/ProcessTranslation/models/TRRequest.js"
)

// Initialization
.then(function(){


    //Define the unit tests
    describe('testing model AD.models.opstools.ProcessTranslation.TRRequest ', function(){


        before(function(){


        });


        it('model definition exists ', function(){
            assert.isDefined(AD.models.opstools , ' :=> should have been defined ');
            assert.isDefined(AD.models.opstools.ProcessTranslation , ' :=> should have been defined ');
            assert.isDefined(AD.models.opstools.ProcessTranslation.TRRequest, ' :=> should have been defined ');
               assert.isNotNull(AD.Model.get("opstools.ProcessTranslation.TRRequest"), ' :=> did not return null');
        });

    });


});