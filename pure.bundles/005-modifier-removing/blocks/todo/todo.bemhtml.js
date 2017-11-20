block('todo')(

    tag()('ul'),

    js()(true),

    elem('task')(
        tag()('li'),
        mix()({ mods: { visible: 'yes' } }),
        attrs()({ title: 'Click to remove' }),
        content()(function() {
            var ctx = this.ctx;

            return {
                elem: 'task-inner',
                tag: 'a',
                content: [
                    { tag: 'h2', bem: false, content: ctx.title },
                    ctx.text
                ]
            };
        })
    )

);
