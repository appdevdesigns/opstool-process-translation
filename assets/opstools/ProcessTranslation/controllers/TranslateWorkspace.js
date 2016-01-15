
steal(
// List your Controller's dependencies here:
    'appdev',
    'OpsPortal/classes/OpsButtonBusy.js',
    function () {

        // Namespacing conventions:
        // AD.Control.extend('[application].[controller]', [{ static },] {instance} );
        AD.Control.extend('opstools.ProcessTranslation.TranslateWorkspace', {


            init: function (element, options) {
                var self = this;
                options = AD.defaults({
                }, options);
                this.options = options;

                // Call parent init
                this._super(element, options);


                this.dataSource = this.options.dataSource; // AD.models.Projects;

                this.data = {};
                this.transaction = null;
                this.buttons = {};

                this.initDOM();
            },

            initDOM: function () {
                // convert to template
                var template = this.domToTemplate(this.element);
                can.view.ejs('TR_TranslateForm', template); // clear the form
                this.element.html('');
            },

            setTransaction: function (transaction, fromLanguageCode, toLanguageCode) {
                var _this = this;

                this.transaction = transaction;
                this.data.languageData = new can.Map({
                    fromLanguageCode: fromLanguageCode,
                    toLanguageCode: toLanguageCode
                });

                this.element.html(can.view('TR_TranslateForm', { transaction: transaction }));

                this.embeddTemplate('.tr-translateform', transaction.objectData.form);
            },

            embeddTemplate: function (sel, templateInfo) {
                var $el = this.element.find(sel);

                try {
                    $el.html(can.view(templateInfo.view, { data: templateInfo.data, languageData: this.data.languageData }));
                } catch (e) {
                    // This is most likely a template reference error.
                    AD.error.log('Error displaying template:' + templateInfo.view, { error: e });

                    var displayData = data.data || data;
                    var errorDisplay = [
                        'Error displaying provided object template (' + templateInfo.view + ')',
                        'Here is the raw data:'
                    ];

                    for (var d in displayData.attr()) {
                        errorDisplay.push(d + ' : ' + displayData[d]);
                    }

                    $el.html(errorDisplay.join('<br>'));
                }
            },

            setFromLanguageCode: function (fromLanguageCode) {
                this.data.languageData.attr('fromLanguageCode', fromLanguageCode);
            },
            clearWorkspace: function () {
                this.element.html('');
            }

        });

    });