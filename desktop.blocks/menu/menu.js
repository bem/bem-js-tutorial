// TODO: fixme
modules.define('menu', ['i-bem-dom', 'jquery'], function(provide, bemDom, $) {

provide(bemDom.declBlock(this.name, {

    onElemSetMod : {

        'item' : {

            'state': {

                'current' : function(elem, modName, modVal, oldModVal) {

                    if (oldModVal == 'disabled') return false;

                    var prev = this.elem('item', 'state', 'current');
                    this
                        .delMod(prev, 'state')
                        .emit('current', {
                            prev    : prev,
                            current : elem
                        });
                }
            }
        }
    },
    onItemSelectorClick : function(e) {

        var item = this._getItemByEvent(e);
        this.setMod(item, 'state', 'current');

    },

    _getItemByEvent : function(e) {
        return $(e.currentTarget).closest(this.buildSelector('item'));
    }

}, {

    live : function() {
        this.liveBindTo('item-selector', 'click', function(e) {
            this.onItemSelectorClick(e);
        });
    }

}));

});
