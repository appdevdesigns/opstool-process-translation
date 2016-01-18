
steal(
    'appdev',
    'OpsPortal/classes/OpsWidget.js',
    '/opstools/ProcessTranslation/models/TRRequest.js',
    function () {

        // Namespacing conventions:
        // AD.Control.extend('[application].[controller]', [{ static },] {instance} );
        AD.Control.extend('opstools.ProcessTranslation.PendingTransactions', {


            init: function (element, options) {
                var self = this;
                options = AD.defaults({
                    eventItemSelected: 'TR_Transaction.Selected'
                }, options);
                this.options = options;

                // Call parent init
                this._super(element, options);


                this.dataSource = this.options.dataSource; // AD.models.Projects;

                this.initDOM();

                this.data = {};
                this.data.listTransactions = null;
                this.data.selectedRequest = null;
                
                // now get access to the TRRequest Model:
                this.TRRequest = AD.Model.get('opstools.ProcessTranslation.TRRequest');
                    
                // listen for updates to any of our TRRequest models:
                this.TRRequest.bind('updated', function (ev, request) {

                    // only do something if this is no longer 'pending'
                    if (request.status != 'pending') {

                        // verify this request is in our displayed list
                        var atIndex = self.data.listTransactions.indexOf(request);
                        if (atIndex > -1) {

                            // if so, remove the entry.
                            self.data.listTransactions.splice(atIndex, 1);


                            // decide which remaining element we want to click:
                            var clickIndx = atIndex;  // choose next one if there.
                            if (self.data.listTransactions.attr('length') <= clickIndx) {

                                // not enough entries, so choose the last one then:
                                clickIndx = self.data.listTransactions.attr('length') - 1;

                            }

                            // if there is one to select
                            if (clickIndx >= 0) {

                                // get that LI item:
                                var allLIs = self.element.find('li');
                                var indexLI = allLIs[clickIndx];

                                // now select this LI:
                                self.selectLI($(indexLI));

                            }

                        }
                    }
                });

                this.TRRequest.on('messaged', function (ev, data) {
                    // one of our transactions was messaged

                    // see if we have an LI for this transaction:
                    var foundEL = self.element.find('[trrequest-id="' + data.id + '"]');
                    if (data.data.locked) {
                        foundEL.addClass('trrequest-locked');
                    } else {
                        foundEL.removeClass('trrequest-locked');
                    }
                });
            },

            initDOM: function () {
                // this.element.html(can.view(this.options.templateDOM, {} ));

                // keep a reference to our list area:
                this.dom = {};
                this.dom.list = this.element.find('ul.op-list');

                var template = this.domToTemplate(this.dom.list);
                can.view.ejs('PendingTranslateTransactions_List', template);

                // and don't forget to clear the List area:
                this.dom.list.html('');


                this.dom.ListWidget = new AD.op.Widget(this.element);
            },

            setList: function (list) {
                this.data.listTransactions = list;
                this.dom.list.html(can.view('PendingTranslateTransactions_List', { items: this.data.listTransactions, data: this.data }));
                if (this.data.screenHeight)
                    this.resize(this.data.screenHeight);
            },

            resize: function (height) {
                this.dom.ListWidget.resize({ height: height });
            },

            selectLI: function ($el) {
                this.clearSelectItems();

                $el.addClass('active');

                var model = $el.data('item');
                this.data.selectedRequest = model;

                // lock the newly selected model:
                this.data.selectedRequest.lock();

                this.element.trigger(this.options.eventItemSelected, model);
            },

            updateTransaction: function (transaction) {
                this.data.listTransactions.forEach(function (tran) {
                    if (tran.id === transaction.id) {
                        tran.objectData.form.data.fromLanguage = transaction.objectData.form.data.fromLanguage;
                        tran.objectData.form.data.toLanguage = transaction.objectData.form.data.toLanguage;
                        return;
                    }
                });

                this.setList(this.data.listTransactions);
            },

            clearSelectItems: function () {
                if (this.data.selectedRequest) {
                    this.data.selectedRequest.unlock();
                    this.data.selectedRequest = null;
                }

                this.element.find('.active').removeClass('active');
            },

            'li click': function ($el, ev) {
                if (!$el.hasClass('trrequest-locked')) {
                    this.selectLI($el);
                }

                ev.preventDefault();
            }

        });


    });