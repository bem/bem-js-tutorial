block('checkbox')(

    content()(function() {
        var cnt = applyNext();
        return [
            cnt,
            this.ctx.icon
        ]
    }),

    elem('icon')(

        tag()('img'),

        attrs()(function() {
            return {
                src: '//yandex.st/lego/_/La6qi18Z8LwgnZdsAr1qy1GwCwo.gif'
            }
        })

    )
)
