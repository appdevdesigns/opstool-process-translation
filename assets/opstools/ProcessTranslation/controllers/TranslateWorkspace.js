
steal(
// List your Controller's dependencies here:
    'appdev',
    'OpsPortal/classes/OpsButtonBusy.js',
    'OpsPortal/classes/OpsWidget.js',
    function () {
        // Namespacing conventions:
        // AD.Control.extend('[application].[controller]', [{ static },] {instance} );
        AD.Control.extend('opstools.ProcessTranslation.TranslateWorkspace', {

            init: function (element, options) {
                var self = this;
                options = AD.defaults({
                    eventItemAccepted: 'TR_Transaction.Accepted'
                }, options);
                this.options = options;

                // Call parent init
                this._super(element, options);

                this.TRRequest = AD.Model.get('opstools.ProcessTranslation.TRRequest');
                this.dataSource = this.options.dataSource; // AD.models.Projects;

                this.transaction = null;
                this.buttons = {};
                this.data = {};
                this.data.languageData = new can.Map({});

                this.initDOM();
            },

            initDOM: function () {
                this.dom = {};

                var template = this.domToTemplate(this.element);
                can.view.ejs('TR_TranslateForm', template);

                this.element.html(can.view('TR_TranslateForm', {}));
            },

            setTransaction: function (transaction, fromLanguageCode, toLanguageCode) {
                var _this = this;

                this.transaction = transaction;
                this.data.languageData.attr('fromLanguageCode', fromLanguageCode);
                this.data.languageData.attr('toLanguageCode', toLanguageCode);

                this.element.html(can.view('TR_TranslateForm', { transaction: transaction }));
                this.element.find('.tr-instructionsPanel').hide();
                this.element.find('.tr-translateform').show();
                this.element.find('.tr-translateform-submit').each(function (index, btn) {
                    var status = $(btn).attr('tr-status');
                    _this.buttons[status] = new AD.op.ButtonBusy(btn);
                });

                this.embeddTemplate('.tr-translateform-relatedTemplate', transaction.objectData.form);
                this.form = new AD.op.Form(this.element.find('.tr-translateform-relatedTemplate'));
                this.dom.FormWidget = new AD.op.Widget(this.element.find('.tr-translateform-relatedTemplate'));
                if (this.data.screenHeight)
                    this.resize(this.data.screenHeight);
            },

            embeddTemplate: function (sel, templateInfo) {
                var $el = this.element.find(sel);

                try {
                    $el.html(can.view(templateInfo.view, { data: templateInfo.data, languageData: this.data.languageData }));
                } catch (e) {
                    // This is most likely a template reference error.
                    AD.error.log('Error displaying template:' + templateInfo.view, { error: e });

                    var errorDisplay = [
                        'Error displaying provided object template (' + templateInfo.view + ')',
                        'Here is the raw data:'
                    ];

                    for (var f in templateInfo.data.fields.attr()) {
                        errorDisplay.push(f + ' : ' + templateInfo.data.fields[f]);
                    }

                    $el.html(errorDisplay.join('<br>'));
                }
            },

            setFromLanguageCode: function (fromLanguageCode) {
                this.data.languageData.attr('fromLanguageCode', fromLanguageCode);
            },

            clearWorkspace: function () {
                this.transaction = null;
                this.element.find('.tr-translateform-relatedTemplate').html('');
                this.element.find('.tr-translateform').hide();
                this.element.find('.tr-instructionsPanel').show();
            },

            buttonsEnable: function () {
                for (var b in this.buttons) {
                    if (this.buttons[b])
                        this.buttons[b].enable();
                }
            },

            buttonsDisable: function () {
                for (var b in this.buttons) {
                    if (this.buttons[b])
                        this.buttons[b].disable();
                }
            },

            populateTransactionValues: function () {
                
                // save form values to the object
                var formValues = this.form.values();
                for (var key in formValues) {
                    if (key.indexOf('.')) {
                        var fieldName = key.split('.')[0];
                        var languageCode = key.split('.')[1];

                        this.transaction.objectData.form.data.fields[fieldName].attr(languageCode, formValues[key]);
                    }
                }
            },

            resize: function (height) {
                this.data.screenHeight = height;

                if (this.dom.FormWidget) {
                    // TODO : Custom how minus height
                    this.dom.FormWidget.resize({ height: height - 230 });
                }
            },

            '.tr-translateform-submit click': function ($btn) {
                var _this = this;

                var status = $btn.attr('tr-status');

                this.buttonsDisable();
                this.buttons[status].busy();

                switch (status) {
                    case 'accept':
                        // TODO : confirm box ??
                    
                        this.populateTransactionValues();
                        this.transaction.attr('status', 'processed');
                        this.transaction.save().then(function () {
                            _this.clearWorkspace();

                            _this.element.trigger(_this.options.eventItemAccepted, _this.transaction);

                            _this.buttons[status].ready();
                            _this.buttonsEnable();
                        });
                        break;
                    case 'save':
                        this.populateTransactionValues();
                        this.transaction.save().then(function () {
                            _this.buttons[status].ready();
                            _this.buttonsEnable();
                        });
                        break;
                    case 'cancel':
                        AD.op.Dialog.Confirm({
                            fnYes: function () {
                                _this.embeddTemplate('.tr-translateform-relatedTemplate', _this.transaction.objectData.form);
                                _this.buttons[status].ready();
                                _this.buttonsEnable();
                            },
                            fnNo: function () {
                                _this.buttons[status].ready();
                                _this.buttonsEnable();
                            }
                        });
                        break;
                    default:
                        this.buttons[status].ready();
                        this.buttonsEnable();
                        break;
                }
            }

        });

    });