# Tutorial on JavaScript in BEM terms

One of the key issues of the BEM stack, the [bem-core
library](https://github.com/bem/bem-core) provides
[i-bem](https://github.com/bem/bem-core/tree/v1/common.blocks/i-bem) block among others.
It is often called a helper block since it's used to build other blocks and
empowers them with BEM features.

The `i-bem` block is implemented using a variety of technologies, including JavaScript,
which provides the framework for coding in BEM terms.

This tutorial details how to use `i-bem` features for JavaScript in your
components.

## JavaScript-enriched block
### Prerequisites
Block `i-bem` and its `dom` element, with all their dependencies, must be included
into your page's js file if you are going to enjoy BEM. This happens
automatically if you borrow the project structure from the
[project-stub repository](https://github.com/bem/project-stub/tree/bem-core).

### HTML structure
Any BEM block can be equipped with JavaScript. To do this, you just need to place
a JavaScript file into your block's directory.

```
├── desktop.blocks/
│   ├── my-block/
│       └── my-block.js
```

Then, just mark a block with a `js` flag when declaring it in the BEM tree.

```js
{
    block: 'my-block',
    js: true
}
```

This gives (after running BEMHTML templates on the JSON) a corresponding DOM
node marked with an `i-bem` class and having `data-bem` attribute with the block
parameters.

```html
<div class="my-block i-bem" data-bem="{'my-block':{}}">
    ...
</div>
```

If you are not using BEMHTML templates, instruct your templates to produce the same
output or write this HTML manually. Then you can use BEM JavaScript with this HTML.

The `data-bem` attribute stores block parameters in JSON, which structure is:

```js
{
    "my-block" : {
        "paramName": "paramValue"
    }
}
```

## The console.log example

<pre>├── desktop.bundles/
│   ├── 001-simple-block/
│   │   ├── blocks/
│   │   │   ├── .bem/
│   │   │   └── my-block/
│   │   │       └── <a href="https://github.com/toivonen/bem-js-tutorial/blob/master/desktop.bundles/001-simple-block/blocks/my-block/my-block.js">my-block.js</a>
│   │   └── <a href="https://github.com/toivonen/bem-js-tutorial/blob/master/desktop.bundles/001-simple-block/001-simple-block.bemjson.js">001-simple-block.bemjson.js</a>

>> <a href="http://varya.me/bem-js-tutorial/desktop.bundles/001-simple-block/001-simple-block.html">001-simple-block.html</a></pre>

The first example is the most simple. It demonstrates the block's structure and
shows how the JavaScript starts working.<br/>
Load the example page
[001-simple-block](http://varya.me/bem-js-tutorial/desktop.bundles/001-simple-block/001-simple-block.html)
with your console tool open, and you can see the `outerHTML` of the `my-block` on
the page.

The BEMJSON declaration of the example
[001-simple-block.bemjson.js](https://github.com/toivonen/bem-js-tutorial/blob/master/desktop.bundles/001-simple-block/001-simple-block.bemjson.js)
describes a simple page with only one `my-block` component.

The `my-block` component is represented on the
[001-simple-block/blocks](https://github.com/toivonen/bem-js-tutorial/tree/master/desktop.bundles/001-simple-block/blocks/my-block)
level with a JavaScript file. The
[my-block.js](https://github.com/toivonen/bem-js-tutorial/blob/master/desktop.bundles/001-simple-block/blocks/my-block/my-block.js)
file is filled with a simple piece of code.

```js
modules.define('i-bem__dom', function(provide, DOM) {

DOM.decl('my-block', {
    onSetMod: {
        'js' : {
            'inited' : function() {
                console.log(this.domElem[0].outerHTML);
            }
        }
    }
});

provide(DOM);

});
```

The `i-bem` utilizes a special [module system
ymaps/modules](https://github.com/ymaps/modules), so the first line defines which
modules to use for the component. In this case it is `i-bem__dom`, a
module represented as a `dom` element of `i-bem` block from `bem-core` library.
[Link to its code, if you need
it](https://github.com/bem/bem-core/blob/v1/common.blocks/i-bem/__dom/i-bem__dom.js).

Inside you can use the `DOM` object and its `decl` method to describe a block.

The block name is the first parameter.<br/>
The second is a hash of dynamic
properties of the block. Every instance of the block gets a copy of them.

Aside from custom properties, the hash can also contain some special ones. You can see one
of them, an `onSetMod` property in the example. It is used to store callbacks to
run when a block gets a modifier. The syntax is the following:

```js
DOM.decl('my-block', {
    onSetMod: {
        'foo' : function() {
            // Runs when a block gets any value of `foo` modifier
            // This also works for 'boolean' modifiers
        },
        'bar' : {
            'qux' : function() {
                // Runs when a block gets 'qux' value of 'bar' modifier
            },
            '' : function() {
                // Runs when `bar` modifier is removed from a block
            },
            '*' : function() {
                // Runs for any value of 'bar' modifier
            }
        },
        '*' : function() {
            // Runs for any modifier of the block
        }
    }
});
```

These callbacks get following parameters:

```js
function(modName, modVal, curModVal) {

    // modName
    // Modifier's name is operated

    // modVal
    // Modifier's value to be set. It is a `String` for modifiers with values
    // or `true`/`false` for boolean modifiers

    // curModVal
    // Current value of the modifier

}
```

The first modifier any block gets is a `js` modifier with its `inited` value.
The framework core reads all the `i-bem` marked blocks on a page and then initializes
them and sets the `js_inited` modifier on each block. Thus, you can
write a code to be run after the block starts functioning by 
defining a callback to the `js_inited` modifier.

In the example presented above, this code is a `console.log` call with the block's `outerHTML`.

## Modifiers
In BEM, modifiers express block states. To put a block into a special state we
set a modifier on it. Then a block runs a callback associated with
this modifier.

### Setting a modifier on a block and reacting to it

<pre>├── desktop.bundles/
│   ├── 002-change-modifier/
│   │   ├── blocks/
│   │   │   ├── .bem/
│   │   │   └── call-button/
│   │   │       ├── <a href="https://github.com/toivonen/bem-js-tutorial/blob/master/desktop.bundles/002-change-modifier/blocks/call-button/call-button.bemhtml">call-button.bemhtml</a>
│   │   │       ├── <a href="https://github.com/toivonen/bem-js-tutorial/blob/master/desktop.bundles/002-change-modifier/blocks/call-button/call-button.css">call-button.css</a>
│   │   │       ├── <a href="https://github.com/toivonen/bem-js-tutorial/blob/master/desktop.bundles/002-change-modifier/blocks/call-button/call-button.js">call-button.js</a>
│   │   │       └── call-button.png
│   │   └── <a href="https://github.com/toivonen/bem-js-tutorial/blob/master/desktop.bundles/002-change-modifier/002-change-modifier.bemjson.js">002-change-modifier.bemjson.js</a>

>> <a href="http://varya.me/bem-js-tutorial/desktop.bundles/002-change-modifier/002-change-modifier.html">002-change-modifier.html</a></pre>

In the
[002-change-modifier](http://varya.me/bem-js-tutorial/desktop.bundles/002-change-modifier/002-change-modifier.html)
example you can see a button changing its state after a user clicks on it.

The button is a BEM block named `call-button` and is represented by CSS,
JavaScript and templates placed into [the block
folder](https://github.com/toivonen/bem-js-tutorial/tree/master/desktop.bundles/002-change-modifier/blocks/call-button).

In JavaScript
[blocks/call-button/call-button.js](https://github.com/toivonen/bem-js-tutorial/blob/master/desktop.bundles/002-change-modifier/blocks/call-button/call-button.js)
there is a common BEM DOM block declaration.

The callback associated with `js_inited` modifier runs when a block is
initialized by the core. In this example it starts with binding to a `click`
event on the DOM node corresponding to the block. This is done with the `bindTo`
helper.<br/>
In the callback it is said to set a `calling` modifier
to the block and the `setMod` method serves for it.

> NOTE: In many cases using bindTo for events listening is not the best solution
> as it needs to watch every block of the kind. It becomes even worse with
> elements of the blocks since they are many. You will see below much better way
> in the `live` section.

```js
modules.define('i-bem__dom', function(provide, DOM) {

DOM.decl('call-button', {
    onSetMod: {
        'js' : {
            'inited' : function() {
                this.bindTo('click', function() {
                    this.setMod('calling');
                });
            }
        }

...

```

Take into account that here we use a `boolean modifier`, which has no value. But
as you will see below, modifiers are very often used as key-value pairs. In that
case, both modifier's name and its value have to be passed to the `setMod`
helper:

```js
this.setMod('status', 'on');
...
this.setMod('status', 'off');
```

The `setMod` method applies a modifier's CSS class to the blocks which makes the
block change its appearance. If you need additional changes on a block,
place them into a function corresponding to the modifier. Like the following:

```js
modules.define('i-bem__dom', function(provide, DOM) {

DOM.decl('call-button', {
    onSetMod: {
        'js' : { ... },
        'calling' : function() {
            this.elem('link').text('Calling...');
        }
    }
});

provide(DOM);

});
```
Here you can run your calculations, or code any functionality of the block. As
there is access to the block's DOM node and its children, the DOM structure can
also be changed.<br/>
With the `elem` helper you can select the elements of the block by their names.

The concept of pre-defined block states expressed with modifiers is a very
powerful and efficient way to describe an interface component.<br/>
Everything related to a particular block state is encapsulated in a relevant modifier.
From wherever you change a block modifier, it knows what to do.<br/>
Modifiers are described in a declarative manner, which empowers a programmer to extend
the code with further implementations or to redefine it completely, as is shown
in the tutorial below.

### Setting a modifier on an element

<pre>├── desktop.bundles/
│   ├── 003-element-modifier/
│   │   ├── blocks
│   │   │   ├── .bem/
│   │   │   ├── page/
│   │   │   ├── sign/
│   │   │   ├── text/
│   │   │   └── traffic-light/
│   │   │       ├── __go/
│   │   │       │   └── traffic-light__go.mp3
│   │   │       ├── <a href="https://github.com/toivonen/bem-js-tutorial/blob/master/desktop.bundles/003-element-modifier/blocks/traffic-light/traffic-light.bemhtml">traffic-light.bemhtml</a>
│   │   │       ├── <a href="https://github.com/toivonen/bem-js-tutorial/blob/master/desktop.bundles/003-element-modifier/blocks/traffic-light/traffic-light.css">traffic-light.css</a>
│   │   │       └── <a href="https://github.com/toivonen/bem-js-tutorial/blob/master/desktop.bundles/003-element-modifier/blocks/traffic-light/traffic-light.js">traffic-light.js</a>
│   │   └── <a href="https://github.com/toivonen/bem-js-tutorial/blob/master/desktop.bundles/003-element-modifier/003-element-modifier.bemjson.js">003-element-modifier.bemjson.js</a>

>> <a href="http://varya.me/bem-js-tutorial/desktop.bundles/003-element-modifier/003-element-modifier.html">003-element-modifier.html</a></pre>

According to BEM, elements can be modified in the same way as blocks. JavaScript methods
are similar in both. The next
example
[003-element-modifier](http://varya.me/bem-js-tutorial/desktop.bundles/003-element-modifier/003-element-modifier.html)
illustrates this.

The `traffic-light` block contains three light elements `stop`, `slow` and `go`
each of which can have a `status` modifier with its `on` and `off` value. As follows:
[traffic-light.js](https://github.com/toivonen/bem-js-tutorial/blob/master/desktop.bundles/003-element-modifier/blocks/traffic-light/traffic-light.js).

Similar to the previous example, the `traffic-light` block is introduced to the
`i-bem` core as a DOM-equipped block.

```js
modules.define('i-bem__dom', function(provide, DOM) {

DOM.decl('traffic-light', {
    onSetMod: {
        'js' : {
            'inited' : function() {
                ...
                this.setMod('status', 'stop');
            }
        },
        ...
});

provide(DOM);

});
```

The traffic light works by switching its `status` modifier from the `stop` to the
`slow` and then to the `go` values. In its initializing method it is said to set
a modifier `status_stop` to the block, so that the cycle begins.

The `status` modifier is declared with its callback, once for all its values. This
is a good way to get rid of copy&paste if the corresponding states work similarly.

```js
modules.define('i-bem__dom', function(provide, DOM) {

var timer;

DOM.decl('traffic-light', {
    onSetMod: {
        'js' : { ... },
        'status' : function(modName, modVal, oldModVal) {
            clearTimeout(timer);
            var nextStatus = {
                'stop' : 'slow',
                'slow' : 'go',
                'go' : 'stop'
                },
                _this = this;
            oldModVal && this.setMod(this.elem(oldModVal), 'status', 'off');
            this.setMod(this.elem(modVal), 'status', 'on');
            timer = window.setTimeout(function(){
                _this.setMod('status', nextStatus[modVal]);
            }, 2000);
        }
    },
    ...
});

provide(DOM);

});
```

The arguments passed into the modifier callback are:

 1. Modifier name,
 1. Modifier value to be set,
 1. Previous modifier value.

With these, the actions can be a bit different depending on the modifier value.

Here a corresponding element is given the `status_on` modifier so that its light
turns on and the previously active projector is set `status_off`.

Modifiers are set on elements with the already familiar `setMod` helper with an
optional first parameter which means an element name.<br/>

So, by providing different parameters to the same `setMod` function you can:

```js
// apply a modifier to a current block
this.setMod('modName', 'modValue');

// apply a modifier to an element of a current block
this.setMod(this.elem('elemName'), 'modName', 'modValue');
```

Describing the actions related to element modifiers is similar to block modifier
actions. By analogy to `onSetMod` property you can user `onElemSetMod` with the
following syntax:

```js
DOM.decl('my-block', {
    onElemSetMod: {
        'elemName' : {
          'foo' : function() {
              // Runs when an element gets any value of `foo` modifier
          },
          'bar' : {
              'qux' : function() {
                  // Runs when an element gets 'qux' value of 'bar' modifier
              },
              '' : function() {
                  // Runs when `bar` modifier is removed from an element
              }
          }
        }
    }
});
```

In this example, only the `go` element is provided with a special functionality.

```js
modules.define('i-bem__dom', function(provide, DOM) {

var goSound = new Audio('blocks/traffic-light/__go/traffic-light__go.mp3'),
    timer;

DOM.decl('traffic-light', {
    onSetMod: { ... },
    onElemSetMod: {
        'go' : {
            'status' : {
                'on' : function() {
                    goSound.play();
                },
                'off' : function() {
                    goSound.pause();
                }
            }
        }
    }
});

provide(DOM);

});
```

This makes a browser play a traffic light sound when an element is switched into
`status_on` and to keep silent when the modifier goes off.

### Toggling a modifier

<pre>├── desktop.bundles/
│   ├── 004-toggle-mod/
│   │   ├── blocks/
│   │   │   ├── .bem/
│   │   │   ├── page/
│   │   │   └── switch/
│   │   │       ├── <a href="https://github.com/toivonen/bem-js-tutorial/blob/master/desktop.bundles/004-toggle-mod/blocks/switch/switch.bemhtml">switch.bemhtml</a>
│   │   │       ├── <a href="https://github.com/toivonen/bem-js-tutorial/blob/master/desktop.bundles/004-toggle-mod/blocks/switch/switch.css">switch.css</a>
│   │   │       └── <a href="https://github.com/toivonen/bem-js-tutorial/blob/master/desktop.bundles/004-toggle-mod/blocks/switch/switch.js">switch.js</a>
│   │   └── <a href="https://github.com/toivonen/bem-js-tutorial/blob/master/desktop.bundles/004-toggle-mod/004-toggle-mod.bemjson.js">004-toggle-mod.bemjson.js</a>

>> <a href="http://varya.me/bem-js-tutorial/desktop.bundles/004-toggle-mod/004-toggle-mod.html">004-toggle-mod.html</a></pre>

It is useful to toggle a modifier if there are 2 values of it to be changed one
by one. This is what the
[004-toggle-mod](http://varya.me/bem-js-tutorial/desktop.bundles/004-toggle-mod/004-toggle-mod.html)
example demonstrates.

It shows a `switch` block, which is a nice button, with its `switched_off`
modifier meaning that the button is inactive at the moment. The
[switch.js](https://github.com/toivonen/bem-js-tutorial/blob/master/desktop.bundles/004-toggle-mod/blocks/switch/switch.js)
file of the block instructs the button to react to user clicks and toggle the
modifier from `switched_off` to `switched_on` and backwards by using the
`toggleMod` helper.

```js
modules.define('i-bem__dom', function(provide, DOM) {

DOM.decl('switch', {
    onSetMod: {
        'js' : {
            'inited' : function() {
                this.bindTo('click', function() {
                    this.toggleMod('switched', 'on', 'off');
                });
            }
        }
    }
});

provide(DOM);

});
```

Indeed, the same goes for elements which an additional first parameter for the
helper method.

### Deleting a modifier

<pre>├── desktop.bundles/
│   ├── 005-modifier-removing/
│   │   ├── blocks/
│   │   │   ├── .bem/
│   │   │   ├── page/
│   │   │   └── todo/
│   │   │       ├── <a href="https://github.com/toivonen/bem-js-tutorial/blob/master/desktop.bundles/005-modifier-removing/blocks/todo/todo.bemhtml">todo.bemhtml</a>
│   │   │       ├── <a href="https://github.com/toivonen/bem-js-tutorial/blob/master/desktop.bundles/005-modifier-removing/blocks/todo/todo.css">todo.css</a>
│   │   │       └── <a href="https://github.com/toivonen/bem-js-tutorial/blob/master/desktop.bundles/005-modifier-removing/blocks/todo/todo.js">todo.js</a>
│   │   └── <a href="https://github.com/toivonen/bem-js-tutorial/blob/master/desktop.bundles/005-modifier-removing/005-modifier-removing.bemjson.js">005-modifier-removing.bemjson.js</a>

>> <a href="http://varya.me/bem-js-tutorial/desktop.bundles/005-modifier-removing/005-modifier-removing.html">005-modifier-removing.html</a></pre>

Removing a modifier from an element (or a block) explained with
[005-modifier-removing](http://varya.me/bem-js-tutorial/desktop.bundles/005-modifier-removing/005-modifier-removing.html)
example. This is a kind of To-Do list, where each task is a sticky note and can
be hidden (which means to be marked done) with a click.

The list is represented as a `todo` block where every item is name a `task`
block. As all the tasks are visible by default, it is emphasized by a
`visible_yes` modifier.

```html
<ul class="todo ..." data-bem="{ 'todo': {} }">
  <li class="todo__task todo__task_visible_yes" title="Click to remove">
    <a class="todo__task-inner">
      <h2>Lean more about BEM</h2>
      Visit bem.info to learn more.
    </a>
  </li>
  ...
```

How the block behaves is described in its [todo.js](https://github.com/toivonen/bem-js-tutorial/blob/master/desktop.bundles/005-modifier-removing/blocks/todo/todo.js)
file.

```js
modules.define('i-bem__dom', function(provide, DOM) {

DOM.decl('todo', {
    onSetMod: {
        'js' : {
            'inited' : function() {
                this.bindTo(this.elem('task'), 'click', function(e) {
                    this.delMod(e.domElem, 'visible');
                });
            }
        }
    }
});

provide(DOM);

});
```

Whenever a user clicks on a `task` element the `visible` modifier is removed
from it by `delMod` modifier.<br/>
The `delMod` helper can also be used for blocks as the first parameter (an
element object) is optional.

Notice that the `bindTo` helper works not with a block but with its elements
here.

> As it was mentioned above, `bindTo` helper listens for every element of the
> kind. If this block had 100 task elements, that would mean 100 event watchers.
> Moreover, a dynamically added new task should have been provided with an event
> listener as well. There is another way to work with the events fully explained
> in the `live` section. Make sure you have learnt it before starting with a
> real powerful application.

### Before a modifier is set

<pre>├── desktop.bundles/
│   ├── 006-before-set-mod/
│   │   ├── blocks/
│   │   │   ├── .bem/
│   │   │   ├── page/
│   │   │   └── accordion-menu/
│   │   │       ├── <a href="https://github.com/toivonen/bem-js-tutorial/blob/master/desktop.bundles/006-before-set-mod/blocks/accordion-menu/accordion-menu.bemhtml">accordion-menu.bemhtml</a>
│   │   │       ├── <a href="https://github.com/toivonen/bem-js-tutorial/blob/master/desktop.bundles/006-before-set-mod/blocks/accordion-menu/accordion-menu.css">accordion-menu.css</a>
│   │   │       └── <a href="https://github.com/toivonen/bem-js-tutorial/blob/master/desktop.bundles/006-before-set-mod/blocks/accordion-menu/accordion-menu.js">accordion-menu.js</a>
│   │   └── <a href="https://github.com/toivonen/bem-js-tutorial/blob/master/desktop.bundles/006-before-set-mod/006-before-set-mod.bemjson.js">006-before-set-mod.bemjson.js</a>

>> <a href="http://varya.me/bem-js-tutorial/desktop.bundles/006-before-set-mod/006-before-set-mod.html">006-before-set-mod.html</a></pre>

Besides the possibility to react on a modifier setting, you can do something
before that happens. It is widely adopted for the cases when you need to prevent
setting a modifier.

The
[006-before-set-mod](http://varya.me/bem-js-tutorial/desktop.bundles/006-before-set-mod/006-before-set-mod.html)
example illustrates such a case with an
[accordion-menu](https://github.com/toivonen/bem-js-tutorial/tree/master/desktop.bundles/006-before-set-mod/blocks/accordion-menu)
block. You can see a menu with a few items on a page. Each of them can reveal
its subitems when being clicked. To do that you need bind to a 'click' event on
the menu items, set `current` modifier into `true` for the related item and
ensure that previously selected item is closed (which means its `current`
modifier is set into `false`).

```js
modules.define('i-bem__dom', ['jquery'], function(provide, $, DOM) {

DOM.decl('accordion-menu', {

    onSetMod: {
        'js' : {
            'inited' : function() {
                this._current = this.findElem('item', 'current', true);
                this.bindTo('item', 'click', function(e) {
                    this.setMod($(e.currentTarget), 'current', true);
                });
            }
        }
    },

    onElemSetMod: {
        'item' : {
            'current' : {
                'true' : function(elem) {
                    this.delMod(this._current, 'current');
                    this._current = elem;
                }
            }
        }
    }

});

provide(DOM);

});
```
> You may also take notice that jQuery is used here to wrap the elements and this
> provides some changes into the code. The bem-core library is based on a
> [ymaps/modules](https://github.com/ymaps/modules) module system explained below.
> With it each module should be declared before using.

The example becomes more interesting when a disabled item appears. Such an item
has to prevent its being in the `current` state. That is always possible to put
an additional condition in the modifier callback but the core provides more
elegant solution. Similar to `onSetMod` and `onElemSetMod` properties you can
use `beforeSetMod` and `beforeElemSetMod` to instruct the block component what
to do previously. It is also prevents setting a modifier when a callback related
to the 'before' part returns `false`.

```js
modules.define('i-bem__dom', ['jquery'], function(provide, $, DOM) {

DOM.decl('accordion-menu', {
    beforeElemSetMod: {
        'item' : {
            'current' : {
                'true' : function(elem) {
                    return !this.hasMod(elem, 'disabled');
                }
            }
        }
    },
    ...
});

provide(DOM);

});
```

Here it checks if the clicked item is disabled and prevents such an item to be
`current`.

## Live initialization
Before a block starts to function the core initializes it. At the end of this
process the block gets `js_inited` modifier, which you are already familiar
with.

While a block is initialized, there appears a JavaScript object corresponding to
the block instance. Then a callback for `js_inited` modifier runs, and there can
be coded all the primary actions.

In the previous examples all the blocks on a page were initialized after
`domReady`. Although on a page full of block it is not needed to initialize all
the components at once. Sometimes a user loads a page just to press one button
on it. So, a better way is to save calculation time and browser memory
initializing block only when a user starts operating on them.

This is the so-called `live initialization` (or `lazy`).

### `live` static method
The instructions to initialize a block lazy can be given in a predefined `live`
static method.

```js
modules.define('i-bem__dom', function(provide, DOM) {

DOM.decl('my-block', {
    onSetMod: {
        ...
    },
    ...
},{
    live: function() {
        // Here you can code when to initialize
        // this block instances
    }
});

provide(DOM);

});
```

In the previous examples, there was not static methods at all and this is equal
to setting the `live` property as `false`.<br/>
Here, as it is a function, the core understands that the instances of this block
should not be initialized before something special happens. This can be that a
DOM event fires of the block DOM node or on an element.

### Initializing a block on DOM event

<pre>├── desktop.bundles/
│   ├── 010-live-init-on-event/
│   │   ├── blocks/
│   │   │   ├── .bem/
│   │   │   ├── text/
│   │   │   └── translate/
│   │   │       ├── <a href="https://github.com/toivonen/bem-js-tutorial/blob/master/desktop.bundles/010-live-init-on-event/blocks/translate/translate.bemhtml">translate.bemhtml</a>
│   │   │       ├── <a href="https://github.com/toivonen/bem-js-tutorial/blob/master/desktop.bundles/010-live-init-on-event/blocks/translate/translate.css">translate.css</a>
│   │   │       └── <a href="https://github.com/toivonen/bem-js-tutorial/blob/master/desktop.bundles/010-live-init-on-event/blocks/translate/translate.js">translate.js</a>
│   │   └── <a href="https://github.com/toivonen/bem-js-tutorial/blob/master/desktop.bundles/010-live-init-on-event/010-live-init-on-event.bemjson.js">010-live-init-on-event.bemjson.js</a>

>> <a href="http://varya.me/bem-js-tutorial/desktop.bundles/010-live-init-on-event/010-live-init-on-event.html">010-live-init-on-event.html</a></pre>

On the
[010-live-init-on-event.html](http://varya.me/bem-js-tutorial/desktop.bundles/010-live-init-on-event/010-live-init-on-event.html)
page you can see the text in Dutch. Actually, this text is divided into a lot of
pieces phrase by phrase. Then, they are framed with a `translate` block.

If a user reading the text does not understand its meaning he/she can see a
translation for an unclear phrase by clicking on the text.

```html
<span
    class="translate i-bem"
    data-bem="{'translate':{'prompt':'один мужчина заходит на почту;'}}">
    Een man gaat een postkantor binnen
    <i class="translate__prompt"></i>
</span>
```

As you can see from its HTML structure, the `translate` block holds a piece of
text in Dutch inside and its Russian translation in the block parameters (inside
the `data-bem` attribute). Also, there is a `prompt` element not displayed by
default, which is used to place the translation into it when needed.

Note that there is no `translate_js_inited` class on a block DOM node even after
the page is completely loaded. This means that there is no JavaScript object
related to the block yet.<br/>
In the
[translate.js](https://github.com/toivonen/bem-js-tutorial/blob/master/desktop.bundles/010-live-init-on-event/blocks/translate/translate.js)
file of the block it is said to initialize it only after a `click` launches on
the block DOM node.

```js
modules.define('i-bem__dom', function(provide, DOM) {

DOM.decl('translate', {
    ...
},{
    live: function() {
        this.liveInitOnEvent('click');
    }
});

provide(DOM);

});
```

When clicked, the core applies `js_inited` modifier to the block instance and
runs block 'constructor', the function set to this modifier.

```js
modules.define('i-bem__dom', function(provide, DOM) {

DOM.decl('translate', {
    onSetMod: {
        'js' : {
            'inited' : function() {
                this.setMod(this.elem('prompt'), 'visible', true);
            }
        }
    },
    onElemSetMod: {
        'prompt': {
            'visible': function(elem) {
                elem.text(this.params['prompt']);
            }
        }
    }
},{
    ...
});

provide(DOM);

});
```
It makes the contained `prompt` element visible by setting on it the `visible`
modifier into `true`. And this means to take the corresponding translation from
the block parameters by getting the `this.params['paramName']` value.<br/>
In face, the translation could be placed into the `prompt` at the beginning since
it was invisible for a user anyway. But just to illustrate how the parameters can
be taken, its was placed into the `data-bem`.

Coming back to the live initialization, you can see that on a page with many
blocks of the kind the core initializes only those on which the event runs. This
approach saves the browser memory and makes the page function faster.

There is an [event delegation](http://davidwalsh.name/event-delegate) idea
behind live initialization. Thus, there is only one listener for the `click`
event on the `document` object, not a lot of them for every block on a
page.<br/>
Besides saving browser forces, this way provides some flexibility for
dynamically changed pages. This you can see with the following example.

### Delegated initialization
<pre>

>> <a href="http://varya.me/bem-js-tutorial/desktop.bundles/010_2-delegation/010_2-delegation.html">010_2-delegation.html</a></pre>

This page provides absolutely the same `translate` block as the previous one.
But there is also a piece of crazy inline JavaScript on a page which works when a
user clicks the pink button and dynamically append a few of new `translate`
blocks to the page. Then, with clicking on the phrases of this fresh joke you can
see that it work absolutely the same as the other `translate` blocks being on the
page at the beginning.

The core of `i-bem` framework listens to the events on the `document` object. So,
when a user clicks any `translate` block, this click bubbles up to the `document`
and core initializes the block as it was instructed it its `live` section.

### Binding to live events
<pre>├── desktop.bundles/
│   ├── 011-live-bind-to/
│   │   ├── blocks/
│   │   │   ├── .bem/
│   │   │   ├── button/
│   │   │   |   ├── <a href="https://github.com/toivonen/bem-js-tutorial/blob/master/desktop.bundles/011-live-bind-to/blocks/button/button.bemhtml">button.bemhtml</a>
│   │   │   |   ├── <a href="https://github.com/toivonen/bem-js-tutorial/blob/master/desktop.bundles/011-live-bind-to/blocks/button/button.css">button.css</a>
│   │   │   |   └── <a href="https://github.com/toivonen/bem-js-tutorial/blob/master/desktop.bundles/011-live-bind-to/blocks/button/button.js">button.js</a>
│   │   │   └── page/
│   │   └── <a href="https://github.com/toivonen/bem-js-tutorial/blob/master/desktop.bundles/011-live-bind-to/011-live-bind-to.bemjson.js">011-live-bind-to.bemjson.js</a>

>> <a href="http://varya.me/bem-js-tutorial/desktop.bundles/011-live-bind-to/011-live-bind-to.html">011-live-bind-to.html</a></pre>

The next [example with 100 BonBon
buttons](http://varya.me/bem-js-tutorial/desktop.bundles/011-live-bind-to/011-live-bind-to.html)
shows that live events can be reacted not once when initializing a block but
every time.

This `button` block is again equipped with live initialization instructions since
it would be madness to initialize all the 100 buttons at once and then listen to
the clicks on each of them.

```js
modules.define('i-bem__dom', function(provide, DOM) {

DOM.decl('button', {
    onSetMod: {
        'js' : {
            'inited' : function() {
                console.log('Here an object of ' + this.domElem[0].innerHTML + ' comes. Just once.');
            }
        }
    },
    ...
},{
    live: function() {
        this.liveBindTo('click');
    }
});

provide(DOM);

});
```

Similar to the examples with `liveInitOnEvent` this code initializes a block
instance and runs the `js_inited` modifier callback.

Unlike the `liveInitOnEvent` the `liveBindTo` method runs its callback not
just once but every time a user clicks the button.

```js
modules.define('i-bem__dom', function(provide, DOM) {

DOM.decl('button', {
    onSetMod: {
        ...
    },
    onClick: function() {
        console.log('Here I can track clicks');
    }
},{
    live: function() {
        this.liveBindTo('click', function(e) {
            this.onClick();
        });
    }
});

provide(DOM);

});
```

### Live initialization on many events
<pre>├── desktop.bundles/
│   ├── 012-live-init-many-events/
│   │   ├── blocks/
│   │   │   ├── .bem/
│   │   │   ├── checkbox/
│   │   │   |   ├── <a href="https://github.com/toivonen/bem-js-tutorial/blob/master/desktop.bundles/012-live-init-many-events/blocks/checkbox/checkbox.bemhtml">checkbox.bemhtml</a>
│   │   │   |   ├── <a href="https://github.com/toivonen/bem-js-tutorial/blob/master/desktop.bundles/012-live-init-many-events/blocks/checkbox/checkbox.css">checkbox.css</a>
│   │   │   |   └── <a href="https://github.com/toivonen/bem-js-tutorial/blob/master/desktop.bundles/012-live-init-many-events/blocks/checkbox/checkbox.js">checkbox.js</a>
│   │   │   └── page/
│   │   └── <a href="https://github.com/toivonen/bem-js-tutorial/blob/master/desktop.bundles/012-live-init-many-events/012-live-init-many-events.bemjson.js">012-live-init-many-events.bemjson.js</a>

>> <a href="http://varya.me/bem-js-tutorial/desktop.bundles/012-live-init-many-events/012-live-init-many-events.html">012-live-init-many-events.html</a></pre>

In the previous examples the core watched only one `click` event to decide if a
block should start working or not. But sometimes reacting just one event is not
enough. This is illustrated with the
[012-live-init-many-events](http://varya.me/bem-js-tutorial/desktop.bundles/012-live-init-many-events/012-live-init-many-events.html)
example, where you can see customized checkboxes.

```html
<span
    class="checkbox i-bem"
    data-bem="{'checkbox':{}}">
    <input class="checkbox__control" id="remember1" type="checkbox" value="on">
    <label class="checkbox__label" for="remember1"></label>
</span>
```

It is obvious an instance of this block has to be initialized when a user clicks
its `label` element.

```js
modules.define('i-bem__dom', function(provide, DOM) {

DOM.decl('checkbox', {
    ...
    _onClick : function() {
        this.setMod('focused', true);
    },
    ...
},{
    live: function() {
        this.liveBindTo('label', 'click', function() {
            this._onClick();
        });
    }
});

provide(DOM);

});
```

The same `liveBindTo` method is used here to initialized the block and listen to
its next clicks. Notice that here it is provided with an additional parameter
(the first one) with the name of a block element whose clicks we are interested
in.

But more than that, the control can be changed with a keyboard (or from another
JavaScript piece) and this must also be taken into account.<br/>
You can put in the `live` method as many instructions about how to initialize as
you need. Here it happens after a `click` event on the `label` element and also
after a `change` event on the embedded `control` element, which is native `input`.

```js
modules.define('i-bem__dom', function(provide, DOM) {

DOM.decl('checkbox', {
    ...
    _onClick : function() {
        this.setMod('focused', true);
    },
    _onChange : function(e) {
        this.setMod('checked', e.target.checked);
    }
},{
    live: function() {
        this.liveBindTo('label', 'click', function() {
            this._onClick();
        });

        this.liveBindTo('control', 'change', function(e){
            this._onChange(e);
        });
    }
});

provide(DOM);

});
```

The block should also be inited when focused in or focused out.

```js
modules.define('i-bem__dom', function(provide, DOM) {

DOM.decl('checkbox', {
    ...
},{
    live: function() {
        this.liveBindTo('label', 'click', function() {
            this._onClick();
        });

        this.liveBindTo('control', 'change', function(e){
            this._onChange(e);
        });

        this.liveBindTo('control', 'focusin focusout', function(e){
            this.setMod('focused', e.type == 'focusin'? true : false);
        });
    }
});

provide(DOM);

});
```

As you can see, it is possible to bind to more than one event with the same
callback if list their names separated with a space.

Then, with adding modifiers' functionality to the components, it can be finished.

```js
modules.define('i-bem__dom', function(provide, DOM) {

DOM.decl('checkbox', {
    onSetMod: {
        'focused' : {
            'true' : function() {
                this.elem('control').focus();
            },
            '' : function() {
                this.elem('control').blur();
            }
        },
        'checked' : function(modName, modVal) {
            this.elem('control').attr('checked', modVal ? 'checked' : false);
        }
    },
    ...
},{
    live: function() {
        ...
    }
});

provide(DOM);

});
```

This approach makes the control behaviour consistent. No matter how a user or
another piece of JavaScript or a browser start to interact with the component,
it will work fine. Getting the `focused` modifier from something, it would focus
the embedded input control. Having the control focused, it would set `focused`
modifier to itself providing the proper view. When changed either manually or
automatically the block would get `checked` modifier and a `checked` attribute
for the control or loose them.

#### Why not :checked?
As you might notice, in this example an internal 'control' element (the input)
is indicated to be checked with the `checked` modifier on its parent block.

```html
<span
    class="checkbox i-bem checkbox_js_inited checkbox_checked"
    data-bem="{'checkbox':{}}">
    <input
        class="checkbox__control"
        id="remember2"
        type="checkbox"
        value="on"
        checked="checked">
   <label class="checkbox__label" for="remember2"></label>
</span>
```

```css
.checkbox_checked .checkbox__label {
    left: 54px;
}

.checkbox_checked .checkbox__label:after {
    background: #00bf00;
}
```

Indeed, it would be possible to use `:checked` pseudo selector as it was done in
the [control prototype](http://codepen.io/bbodine1/pen/novBm).

```css
.checkbox input[type=checkbox]:checked + label {
  left: 54px;
}

.checkbox input[type=checkbox]:checked + label:after {
  background: #00bf00;
}
```

However the modifier approach supplies more flexibility making the whole block
be able to change if checked

```css
.checkbox_checked
{
    background-image: -webkit-linear-gradient(0deg, #333, #333 4px, #555 4px, #555 6px);
    background-image: linear-gradient(0deg, #333, #333 4px, #555 4px, #555 6px);
    background-size: 6px 6px;
}
```

as well as saves time for parsing selectors and bringing architectural
consistency to the code.
