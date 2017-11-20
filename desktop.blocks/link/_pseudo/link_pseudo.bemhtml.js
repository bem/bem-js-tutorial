block('link').match(function() { return this.mods.pseudo; })(

    js()(true),

    tag()(function() {
        return this.ctx.url? 'a' : 'span';
    }),

    attrs().match(function() { return !this.ctx.url; })({}),

    content().match(function() { return !this.mods.inner; })(function() {
        return {
            elem: 'inner',
            content: applyNext()
        };
    })

);
