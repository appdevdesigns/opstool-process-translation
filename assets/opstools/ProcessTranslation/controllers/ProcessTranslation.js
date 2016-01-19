
steal(
// List your Controller's dependencies here:
    'appdev',
    '//OpsPortal/classes/OpsTool.js',
    '/opstools/ProcessTranslation/models/TRRequest.js',
    '/opstools/ProcessTranslation/controllers/LanguageSelector.js',
    '/opstools/ProcessTranslation/controllers/PendingTransactions.js',
    '/opstools/ProcessTranslation/controllers/TranslateWorkspace.js',
    '/opstools/ProcessTranslation/views/ProcessTranslation/ProcessTranslation.ejs',
    function () {

        // Namespacing conventions:
        // AD.Control.OpsTool.extend('[ToolName]', [{ static },] {instance} );
        AD.Control.OpsTool.extend('ProcessTranslation', {
            CONST: {
                LANGUAGE_SELECTED: 'TR_Language.Selected',
                ITEM_ACCEPTED: 'TR_Transaction.Accepted',
                ITEM_SELECTED: 'TR_Transaction.Selected'
            },

            init: function (element, options) {
                var self = this;
                options = AD.defaults({
                    templateDOM: '//opstools/ProcessTranslation/views/ProcessTranslation/ProcessTranslation.ejs',
                    resize_notification: 'ProcessTranslation.resize',
                    tool: null   // the parent opsPortal Tool() object
                }, options);
                this.options = options;

                // Call parent init
                this._super(element, options);

                this.data = {
                    fromLanguageCode: "ko", // TODO : Get default
                    toLanguageCode: AD.lang.currentLanguage
                };

                this.initDOM();
                this.initControllers();
                this.initEvents();
                this.loadListData();
            },

            initDOM: function () {

                this.element.html(can.view(this.options.templateDOM, {}));

            },
            initControllers: function () {

                this.controllers = {};  // hold my controller references here.

                var LanguageSelector = AD.Control.get('opstools.ProcessTranslation.LanguageSelector');
                var PendingTransactions = AD.Control.get('opstools.ProcessTranslation.PendingTransactions');
                var TranslateWorkspace = AD.Control.get('opstools.ProcessTranslation.TranslateWorkspace');

                this.controllers.LanguageSelector = new LanguageSelector(this.element.find('.tr-languageselector'), { eventLanguageSelected: this.CONST.LANGUAGE_SELECTED, fromLanguageCode: this.data.fromLanguageCode, toLanguageCode: this.data.toLanguageCode });
                this.controllers.PendingTransactions = new PendingTransactions(this.element.find('.tr-pendingtransactions'), { eventItemSelected: this.CONST.ITEM_SELECTED });
                this.controllers.TranslateWorkspace = new TranslateWorkspace(this.element.find('.tr-translateworkspace'), { eventItemAccepted: this.CONST.ITEM_ACCEPTED, fromLanguageCode: this.data.fromLanguageCode, toLanguageCode: this.data.toLanguageCode });
            },

            initEvents: function () {

                var _this = this;

                // When leave the page
                this.on('opsportal.tool.hide', function () {
                    _this.controllers.PendingTransactions.clearSelectItems();
                });

                this.controllers.PendingTransactions.element.on(this.CONST.ITEM_SELECTED, function (event, transaction) {
                    _this.controllers.TranslateWorkspace.setTransaction(transaction, _this.data.fromLanguageCode, _this.data.toLanguageCode);
                });

                this.controllers.TranslateWorkspace.element.on(this.CONST.ITEM_ACCEPTED, function (event, transaction) {
                    _this.controllers.PendingTransactions.clearSelectItems();
                });

                this.controllers.LanguageSelector.element.on(this.CONST.LANGUAGE_SELECTED, function (event, selectedLanguage) {
                    if (selectedLanguage.trans === 'fromLanguage') {
                        _this.data.fromLanguageCode = selectedLanguage.language_code;
                        _this.controllers.TranslateWorkspace.setFromLanguageCode(_this.data.fromLanguageCode)
                    }
                    else {
                        _this.data.toLanguageCode = selectedLanguage.language_code;
                        _this.loadListData();
                    }
                })
            },

            loadListData: function () {
                var _this = this;

                this.PARequest = AD.Model.get('opstools.ProcessTranslation.TRRequest');
                this.PARequest.findAll({ status: 'pending', toLanguageCode: _this.data.toLanguageCode })
                    .fail(function (err) {
                        console.error('!!! Dang.  something went wrong:', err);
                    })
                    .then(function (list) {
                        _this.controllers.PendingTransactions.clearSelectItems();
                        _this.controllers.TranslateWorkspace.clearWorkspace();


                        _this.controllers.PendingTransactions.setList(list);

                        _this.data.list = list;

                        console.log('... here is our list of pending transactions:', list);
                    });
            },

            resize: function (data) {

                this._super(data);

                this.controllers.PendingTransactions.resize(data.height);
                this.controllers.TranslateWorkspace.resize(data.height);
            }

        });


    });