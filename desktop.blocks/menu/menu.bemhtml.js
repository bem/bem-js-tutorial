block('menu')(

    content()(function() {
        return [
            this.ctx.title,
            {
                elem: 'layout',
                content: applyNext()
            }
        ];
    }),

    elem('layout').tag()('ul'),

    elem('item').wrap()(function() {
        return applyNext({
            position: this.position - 1,
            ctx: {
                elem: 'layout-unit',
                content: [this.ctx, this.ctx['item-content']]
            }
        });
    }),

    elem('layout-unit')(
        tag()('li'),

        mix()(function() {
            var mix = [];

            this.isFirst() && mix.push({ elemMods: { position: 'first' } });
            this.isLast() && mix.push({ elemMods: { position: 'last' } });

            return mix;
        })
    ),

    elem('item-selector').tag()('span'),

    elem('submenu').tag()('ul')

);
