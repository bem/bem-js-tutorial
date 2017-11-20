block('call-button')(
    tag()('span'),
    content()(function() {
        return {
            elem: 'link',
            content: applyNext()
        };
    }),
    elem('link')(
        tag()('a')
    )
);
