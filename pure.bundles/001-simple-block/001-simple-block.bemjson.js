({
    block: 'page',
    title: 'A simple JavaSscript empowered BEM block',
    favicon: '/favicon.ico',
    head: [
        { elem: 'css', url: '_001-simple-block.css', ie: false },
        { elem: 'css', url: '_001-simple-block.ie.css', ie: true },
        { elem: 'meta', attrs: { name: 'description', content: '' }}
    ],
    content:[
        {
            block: 'my-block',
            js: true
        },
        { elem: 'js', url: '_001-simple-block.js' }
    ]
})
