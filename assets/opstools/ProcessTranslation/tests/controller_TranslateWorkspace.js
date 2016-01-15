// Dependencies
steal(
    "opstools/ProcessTranslation/controllers/TranslateWorkspace.js"
)

// Initialization
.then(function(){

    // the div to attach the controller to
    var divID = 'test_TranslateWorkspace';

    // add the div to the window
    var buildHTML = function() {
        var html = [
                    '<div id="'+divID+'">',
                    '</div>'
                    ].join('\n');

        $('body').append($(html));
    }
    

    //Define the unit tests
    describe('testing controller AD.controllers.opstools.ProcessTranslation.TranslateWorkspace ', function(){

        var testController = null;

        before(function(){

            buildHTML();

            // Initialize the controller
            testController = new AD.controllers.opstools.ProcessTranslation.TranslateWorkspace($('#'+divID), { some:'data' });

        });



        it('controller definition exists ', function(){
            assert.isDefined(AD.controllers.opstools , ' :=> should have been defined ');
            assert.isDefined(AD.controllers.opstools.ProcessTranslation , ' :=> should have been defined ');
            assert.isDefined(AD.controllers.opstools.ProcessTranslation.TranslateWorkspace, ' :=> should have been defined ');
              assert.isNotNull(AD.Control.get('opstools.ProcessTranslation.TranslateWorkspace'), ' :=> returns our controller. ');
        });


    });


});