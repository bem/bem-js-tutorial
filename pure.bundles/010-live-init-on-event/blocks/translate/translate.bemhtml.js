block('translate')(

    tag()('span'),

    js()(function() { return { prompt: this.ctx.prompt }; }),

    content()(function() {
        return [
            applyNext(),
            { elem: 'prompt' }
        ];
    }),

    elem('prompt')(

        tag()('i')

    )

);
