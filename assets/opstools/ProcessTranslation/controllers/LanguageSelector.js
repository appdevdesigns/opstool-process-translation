
steal(
    'appdev',
    '//opstools/ProcessTranslation/views/LanguageSelector/LanguageSelector.ejs',
    function () {
        // Namespacing conventions:
        AD.Control.extend('opstools.ProcessTranslation.LanguageSelector', {

            init: function (element, options) {
                var self = this;
                options = AD.defaults({
                    toLanguageCode: 'en',
                    eventLanguageSelected: 'LANGUAGE_SELECTED',
                    templateDOM: '//opstools/ProcessTranslation/views/LanguageSelector/LanguageSelector.ejs'
                }, options);
                this.options = options;

                // Call parent init
                this._super(element, options);

                // Get available languages
                AD.lang.list().then(function (languages) {
                    self.data.availableLanguages = languages;

                    self.data.fromLanguagesList = new can.Map(self.data.availableLanguages);
                    self.data.toLanguagesList = new can.Map(self.data.availableLanguages);
                    self.data.toLanguageCode = self.options.toLanguageCode;

                    // Set default from language when it's not specified
                    for (var code in self.data.availableLanguages) {
                        if (code !== self.data.toLanguageCode) {
                            self.data.fromLanguageCode = code;
                            break;
                        }
                    }

                    self.refreshLanguagesList();

                    self.initDOM();
                });

                this.data = {};
                this.dataSource = this.options.dataSource; // AD.models.Projects;
            },

            initDOM: function () {
                var _this = this;
                _this.element.html(can.view(_this.options.templateDOM, { fromLanguagesList: _this.data.fromLanguagesList, toLanguagesList: _this.data.toLanguagesList }));

                _this.element.find('#translateFromLanguage').val(_this.data.fromLanguageCode);
                _this.element.find('#translateToLanguage').val(_this.data.toLanguageCode);
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