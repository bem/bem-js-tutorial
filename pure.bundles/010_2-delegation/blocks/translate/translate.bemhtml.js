block('translate')(

    tag()('span'),

    js()(function() { return { prompt: this.ctx.prompt }; }),

    content()(function() {
        return [
            this.ctx.content,
            { elem: 'prompt' }
        ];
    }),

    elem('prompt')(

        tag()('i')

    )

);
