block('traffic-light')(
    js()(true),
    content()([
        {
            elem: 'stop',
            mods: { status: 'off' },
            mix: { elem: 'projector' }
        },
        {
            elem: 'slow',
            mods: { status: 'off' },
            mix: { elem: 'projector' }
        },
        {
            elem: 'go',
            mods: { status: 'off' },
            mix: { elem: 'projector' }
        },
        {
            elem: 'reset'
        }
    ])
);
