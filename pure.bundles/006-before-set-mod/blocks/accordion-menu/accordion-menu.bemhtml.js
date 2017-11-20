block('accordion-menu')(

    tag()('ul'),

    js()(true),

    content()(function(){
        var content = [];
        this.ctx.items.forEach(function(item){

            var sub = [],
                num = 0;

            item.items.forEach(function(subItem, i){
                num += subItem.number;
                sub.push({
                    elem: 'sub-item',
                    content: {
                        elem: 'link',
                        url: subItem.url,
                        content: [
                            {
                                elem: 'i',
                                content: i+1
                            },
                            subItem.title,
                            {
                                elem: 'num',
                                content: subItem.number
                            }
                        ]
                    }
                });
            });

            content.push({
                elem: 'item',
                mods: { current: item.current, disabled: item.disabled },
                content: [
                        {
                        elem: 'link',
                        content: [
                            item.title,
                            {
                                elem: 'num',
                                content: num
                            }
                        ]
                    },
                    {
                        elem: 'sub-menu',
                        content: sub
                    }
                ]
            })
        });
        return content;
    }),

    elem('item')(

        tag()('li')

    ),

    elem('link')(

        tag()('a'),

        attrs()(function(){
            var attrs = {};

            this.ctx.url && (attrs.href = this.ctx.url);

            return attrs;

        })

    ),

    elem('num')(

        tag()(function(){
            return this.ctx.content ? 'span' : '';
        })

    ),

    elem('sub-menu')(

        tag()('ul')

    )

);
