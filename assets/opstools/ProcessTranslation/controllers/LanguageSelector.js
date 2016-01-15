
steal(
    'appdev',
    '//opstools/ProcessTranslation/views/LanguageSelector/LanguageSelector.ejs',
    function () {

        // Namespacing conventions:
        AD.Control.extend('opstools.ProcessTranslation.LanguageSelector', {

            init: function (element, options) {
                var self = this;
                options = AD.defaults({
                    fromLanguageCode: 'en',
                    toLanguageCode: 'ko',
                    eventLanguageSelected: 'LANGUAGE_SELECTED',
                    templateDOM: '//opstools/ProcessTranslation/views/LanguageSelector/LanguageSelector.ejs'
                }, options);
                this.options = options;

                // Call parent init
                this._super(element, options);

                this.data = {};

                this.dataSource = this.options.dataSource; // AD.models.Projects;

                self.initDOM();
            },

            initDOM: function () {
                var _this = this;
                AD.lang.list().then(function (languages) {
                    _this.data.availableLanguages = languages;
                    _this.data.fromLanguagesList = new can.Map(_this.data.availableLanguages);
                    _this.data.toLanguagesList = new can.Map(_this.data.availableLanguages);

                    _this.refreshLanguagesList();

                    _this.element.html(can.view(_this.options.templateDOM, { fromLanguagesList: _this.data.fromLanguagesList, toLanguagesList: _this.data.toLanguagesList, fromLanguageCode: _this.options.fromLanguageCode, toLanguageCode: _this.options.toLanguageCode }));
                });
            },

            selectLanguage: function ($el) {
                var trans = $el.attr('trrequest-trans');
                var val = $el.find('option:selected').val();

                if (trans === 'fromLanguage') {
                    this.options.fromLanguageCode = val;
                } else {
                    this.options.toLanguageCode = val;
                }

                this.refreshLanguagesList();

                this.element.trigger(this.options.eventLanguageSelected, { language_code: val, trans: trans });
            },

            refreshLanguagesList: function () {
                for (var code in this.data.availableLanguages) {
                    if (!this.data.fromLanguagesList[code] && code !== this.options.toLanguageCode) {
                        this.data.fromLanguagesList.attr(code, this.data.availableLanguages[code]);
                    }

                    if (!this.data.toLanguagesList[code] && code !== this.options.fromLanguageCode) {
                        this.data.toLanguagesList.attr(code, this.data.availableLanguages[code]);
                    }
                }

                this.data.fromLanguagesList.removeAttr(this.options.toLanguageCode);
                this.data.toLanguagesList.removeAttr(this.options.fromLanguageCode);
            },

            'select.language-selector change': function ($el, ev) {
                this.selectLanguage($el);
            }

        });


    });