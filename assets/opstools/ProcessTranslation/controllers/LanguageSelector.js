
steal(
    'appdev',
    '//opstools/ProcessTranslation/views/LanguageSelector/LanguageSelector.ejs',
    function () {
        // Namespacing conventions:
        AD.Control.extend('opstools.ProcessTranslation.LanguageSelector', {

            init: function (element, options) {
                var self = this;
                options = AD.defaults({
                    fromLanguageCode: 'zh-hans',
                    toLanguageCode: 'en',
                    eventLanguageSelected: 'LANGUAGE_SELECTED',
                    templateDOM: '//opstools/ProcessTranslation/views/LanguageSelector/LanguageSelector.ejs'
                }, options);
                this.options = options;

                // Call parent init
                this._super(element, options);

                this.data = {};
                this.data.fromLanguageCode = this.options.fromLanguageCode;
                this.data.toLanguageCode = this.options.toLanguageCode;

                this.dataSource = this.options.dataSource; // AD.models.Projects;

                self.initDOM();
            },

            initDOM: function () {
                var _this = this;
                AD.lang.list().then(function (languages) {
                    _this.data.availableLanguages = languages;
                    _this.data.availableLanguages['th'] = "Thai";

                    _this.data.fromLanguagesList = new can.Map(_this.data.availableLanguages);
                    _this.data.toLanguagesList = new can.Map(_this.data.availableLanguages);

                    _this.refreshLanguagesList();

                    _this.element.html(can.view(_this.options.templateDOM, { fromLanguagesList: _this.data.fromLanguagesList, toLanguagesList: _this.data.toLanguagesList }));
                    
                    _this.element.find('#translateFromLanguage').val(_this.data.fromLanguageCode);
                    _this.element.find('#translateToLanguage').val(_this.data.toLanguageCode);
                });
            },

            selectLanguage: function ($el) {
                var trans = $el.attr('trrequest-trans');
                var val = $el.find('option:selected').val();

                if (trans === 'fromLanguage') {
                    this.data.fromLanguageCode = val;
                } else {
                    this.data.toLanguageCode = val;
                }

                this.refreshLanguagesList();

                this.element.trigger(this.options.eventLanguageSelected, { language_code: val, trans: trans });
            },

            refreshLanguagesList: function () {
                for (var code in this.data.availableLanguages) {
                    if (!this.data.fromLanguagesList[code] && code !== this.data.toLanguageCode) {
                        this.data.fromLanguagesList.attr(code, this.data.availableLanguages[code]);
                    }

                    if (!this.data.toLanguagesList[code] && code !== this.data.fromLanguageCode) {
                        this.data.toLanguagesList.attr(code, this.data.availableLanguages[code]);
                    }
                }

                this.data.fromLanguagesList.removeAttr(this.data.toLanguageCode);
                this.data.toLanguagesList.removeAttr(this.data.fromLanguageCode);
            },

            'select.language-selector change': function ($el, ev) {
                this.selectLanguage($el);
            }

        });


    });