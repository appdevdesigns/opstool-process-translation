
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

                    _this.element.html(can.view(_this.options.templateDOM, { fromLanguagesList: _this.data.availableLanguages, toLanguagesList: _this.data.availableLanguages, fromLanguageCode: _this.options.fromLanguageCode, toLanguageCode: _this.options.toLanguageCode }));
                });
            },

            selectLanguage: function ($el) {
                var trans = $el.attr('trrequest-trans');
                var val = $el.find('option:selected').val();

                this.element.trigger(this.options.eventLanguageSelected, { language_code: val, trans: trans });
            },

            'select.language-selector change': function ($el, ev) {
                this.selectLanguage($el);
            }

        });


    });