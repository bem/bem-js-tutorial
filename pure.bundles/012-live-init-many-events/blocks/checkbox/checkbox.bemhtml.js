block('checkbox')(

    def()(function(){
        var attrs = this.ctx.checkboxAttrs || {};
            this.ctx.mods = this.ctx.mods || {};
        if (attrs.checked) {
            this.ctx.mods.checked = true;
        }
        if (this.ctx.mods.checked) {
            attrs.checked = 'checked'
        }
        return applyNext();
    }),

    tag()('span'),

    js()(true),

    content()(function(){
        var attrs = this.ctx.checkboxAttrs || {};
        attrs.type = 'checkbox';
        attrs.value = attrs.value || 'on';
        return [
            {
                elem: 'control',
                attrs: attrs
            },
            {
                elem: 'label',
                attrs: {
                    for: this.ctx.checkboxAttrs.id
                }
            }
        ]
    }),

    elem('control')(

        tag()('input')

    ),

    elem('label')(

        tag()('label')

    )

);
