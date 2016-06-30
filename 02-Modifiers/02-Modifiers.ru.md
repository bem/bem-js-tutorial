# Модификаторы

В БЭМ модификаторы выражают состояние блока. Чтобы привести блок в новое состояние,
ему назначают модификатор. Это запускает соответствующий модификатору callback.

## Установка модификатора на блок и реакция на это

```files
pure.bundles/
    002-change-modifier/
        blocks/
            call-button/
                call-button.bemhtml.js
                call-button.css
                call-button.js
                call-button.png
        002-change-modifier.bemjson.js
        002-change-modifier.html
```

В примере [002-change-modifier](https://bem.github.io/bem-js-tutorial/pure.bundles/002-change-modifier/002-change-modifier.html)
([BEMJSON](https://github.com/bem/bem-js-tutorial/blob/master/pure.bundles/002-change-modifier/002-change-modifier.bemjson.js))
вы можете увидеть кнопку, меняющую свое состояние по клику на неё.

Кнопка — это блок `call-button`, представленный
[CSS](https://github.com/bem/bem-js-tutorial/blob/master/pure.bundles/002-change-modifier/blocks/call-button/call-button.css),
[JavaScript](https://github.com/bem/bem-js-tutorial/blob/master/pure.bundles/002-change-modifier/blocks/call-button/call-button.js)
и [шаблонами](https://github.com/bem/bem-js-tutorial/blob/master/pure.bundles/002-change-modifier/blocks/call-button/call-button.bemhtml).
Все эти технологии находятся в [папке блока](https://github.com/bem/bem-js-tutorial/tree/master/pure.bundles/002-change-modifier/blocks/call-button).

В JavaScript-файле [blocks/call-button/call-button.js](https://github.com/bem/bem-js-tutorial/blob/master/pure.bundles/002-change-modifier/blocks/call-button/call-button.js) — стандартная декларация для
DOM-блока.

Callback, соответствующий модификатору `js_inited`, запускается, когда ядро
инициализирует блок. В этом примере всё начинается с назначения обработчика для
события `click` на DOM-узле блока. Для этого используется метод `bindTo`. А callback
устанавливает блоку модификатор `calling` при помощи метода `setMod`.

**ВАЖНО:** В большинстве случаев не рекомендуется использовать `bindTo` для работы
с событиями, потому что он навешивает обработчик на событие для каждого отдельного
экземпляра блока. Это особенно ощутимо, если таких блоков на странице много. Чуть
позже в описании `live` секции вы найдёте рекомендованный способ.

```js
modules.define('call-button', ['i-bem__dom'], function(provide, BEMDOM) {

provide(BEMDOM.decl(this.name, {
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

Обратите внимание, что здесь используется булевый модификатор, у него нет
значений. Но, как вы раньше могли видеть, очень часто модификатор — это пара
«ключ-значение». В таких случаях в метод `setMod` передаётся и имя, и значение
модификатора:

```js
this.setMod('status', 'on');
//...
this.setMod('status', 'off');
```

Метод `setMod` назначает блоку соответствующий модификатору CSS-класс, и блок
меняет свой внешний вид. Если кроме этого нужны ещё какие-то действия, запишите
их в функции callback на установку модификатора. Например, так:

```js
modules.define('call-button', ['i-bem__dom'], function(provide, BEMDOM) {

provide(BEMDOM.decl(this.name, {
    onSetMod: {
        'js' : { ... },
        'calling' : function() {
            this.elem('link').text('Calling...');
        }
    }
}));

});
```

Здесь вы можете производить любые вычисления и совершать любые действия с
блоком. А раз есть доступ к DOM-узлу блока и вложенным в него элементам, то
структуру блока тоже можно поменять. Для обращения к элементам блока используется
метод `elem`, а в качестве параметра передаётся имя элемента.

Концепция известных состояний блока, выраженных модификаторами, — это очень
мощный и эффективный способ описания интерфейсных компонентов.

Всё, что относится к определенному состоянию блока, инкапсулировано в нужный
модификатор. Откуда бы вы ни изменили модификатор блока, блок знает, что
делать.

Действия модификаторов описываются декларативно. Это позволяет разработчику
расширить функциональность модификатора при реиспользовании или полностью её
переопределить. Ниже это продемонстрировано.

## Установка модификатора для элемента

```files
pure.bundles/
    003-element-modifier/
        blocks
            page/
            sign/
            text/
            traffic-light/
                __go/
                    traffic-light__go.mp3
                traffic-light.bemhtml.js
                traffic-light.css
                traffic-light.js
        003-element-modifier.bemjson.js
        003-element-modifier.html
```

В БЭМ модификаторы могут быть не только у блоков, но и у элементов. Используемые для
этого методы похожи.

Рассмотрим на примере
[003-element-modifier](https://bem.github.io/bem-js-tutorial/pure.bundles/003-element-modifier/003-element-modifier.html)
([BEMJSON](https://github.com/bem/bem-js-tutorial/blob/master/pure.bundles/003-element-modifier/003-element-modifier.bemjson.js)).

Как и в предыдущих примерах, блок `traffic-light` реализован в технологиях
[CSS](https://github.com/bem/bem-js-tutorial/blob/master/pure.bundles/003-element-modifier/blocks/traffic-light/traffic-light.css),
[JavaScript](https://github.com/bem/bem-js-tutorial/blob/master/pure.bundles/003-element-modifier/blocks/traffic-light/traffic-light.js)
и [BEMHTML](https://github.com/bem/bem-js-tutorial/blob/master/pure.bundles/003-element-modifier/blocks/traffic-light/traffic-light.bemhtml), объявляется как DOM-блок.

Он содержит три элемента: `stop`, `slow` и `go`. У каждого из них может быть
модификатор `status` со значениями `on` и `off`.

```js
modules.define('traffic-light', ['i-bem__dom'], function(provide, BEMDOM) {

provide(BEMDOM.decl(this.name, {
    onSetMod: {
        'js' : {
            'inited' : function() {
                ...
                this.setMod('status', 'stop');
            }
        },
        ...
}));

});
```

Светофор работает, переключая модификатор `status` со значения `stop` на `slow`
и затем на `go`. При инициализации блока устанавливается модификатор
`status_stop`, и это начинает цикл.

Действия модификатора `status` описаны в функции callback, общей для всех значений.
Это позволяет избежать лишнего копирования в случаях с похожей функциональностью разных
модификаторов.

```js
modules.define('traffic-light', ['i-bem__dom'], function(provide, BEMDOM) {

provide(BEMDOM.decl('traffic-light', {
    onSetMod: {
        'js' : { ... },

        'status' : function(modName, modVal, oldModVal) {
            clearTimeout(this.timer);

            var nextStatus = {
                    'stop' : 'slow',
                    'slow' : 'go',
                    'go' : 'stop'
                },
                _this = this;

            oldModVal && this.setMod(this.elem(oldModVal), 'status', 'off');

            this.setMod(this.elem(modVal), 'status', 'on');

            this.timer = window.setTimeout(function() {
                _this.setMod('status', nextStatus[modVal]);
            }, 2000);
        }
    },
    ...
}));

});
```

В callback приходят следующие аргументы:

 1. Имя модификатора,
 1. Устанавливаемое значение,
 1. Предыдущее значение.

С использованием этой информации можно действовать по-разному в зависимости от
устанавливаемого значения.

Здесь соответствующему элементу назначается модификатор `status_on` — его фонарь
включается, а предыдущий активный прожектор получает модификатор `status_off`.

Для установки модификаторов на элементы используется уже знакомый метод
`setMod`, но в него передаётся дополнительный первый параметр — имя элемента.

То есть, используя разные параметры, методом `setMod` можно:

```js
// назначить модификатор блоку
this.setMod('modName', 'modValue');

// назначить модификатор элементу блока
this.setMod(this.elem('elemName'), 'modName', 'modValue');
```

Программирование действий, соответствующих модификаторам элементов, похоже на тоже
самое для модификаторов блоков. По аналогии с `onSetMod`, можно воспользоваться
свойством `onElemSetMod` со следующим синтаксисом:

```js
DOM.decl('my-block', {
    onElemSetMod: {
        'elemName' : {
          'foo' : function() {
              // Запускается, если элемент получает любое значение
              // модификатора `foo`
          },
          'bar' : {
              'qux' : function() {
                  // Запускается при установке на элементе значения `qux` для
                  // модификатора `bar`
              },
              '' : function() {
                  // Запускается при удалении модификатора `bar` с элемента
              }
          }
        }
    }
});
```

В этом примере какая-то функциональность есть только у элемента `go`.

```js
modules.define('traffic-light', ['i-bem__dom'], function(provide, BEMDOM) {

var goSound = new Audio('blocks/traffic-light/__go/traffic-light__go.mp3');

provide(BEMDOM.decl(this.name, {
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
}));

});
```

Это включает звук светофора, когда элемент переключен в состояние `switched_on`,
и выключает его при назначении модификатора `switched_off`.

## Переключение (toggle) модификатора

```files
pure.bundles/
    004-toggle-mod/
        blocks/
            page/
            switch/
                switch.bemhtml.js
                switch.css
                switch.js
        004-toggle-mod.bemjson.js
        004-toggle-mod.html
```

Если у модификатора 2 значения, и они должны меняться друг за другом, удобно
воспользоваться переключением (toggle). Это показано в примере
[004-toggle-mod](https://bem.github.io/bem-js-tutorial/pure.bundles/004-toggle-mod/004-toggle-mod.html)
([BEMJSON](https://github.com/bem/bem-js-tutorial/blob/master/pure.bundles/004-toggle-mod/004-toggle-mod.bemjson.js)).

На этой странице вы можете видеть кнопку — блок `swicth` с модификатором
`switched_off`, что означает выключенное состояние.

Файл
[switch.js](https://github.com/bem/bem-js-tutorial/blob/master/pure.bundles/004-toggle-mod/blocks/switch/switch.js)
говорит кнопке слушать события `click` и переключаться из состояния
`swicthed_off` в `switched_on` и обратно при помощи метода `toggleMod`.

```js
modules.define('switch', ['i-bem__dom'], function(provide, BEMDOM) {

provide(BEMDOM.decl(this.name, {
    onSetMod: {
        'js' : {
            'inited' : function() {
                this.bindTo('click', function() {
                    this.toggleMod('switched', 'on', 'off');
                });
            }
        }
    }
}));

});
```

Конечно, то же самое работает и для элементов, если передать элемент в качестве
первого опционального параметра.

## Удаление модификатора

```files
pure.bundles/
    005-modifier-removing/
        blocks/
            page/
            todo/
                todo.bemhtml.js
                todo.css
                todo.js
        005-modifier-removing.bemjson.js
        005-modifier-removing.html
```

Удаление модификатора с элемента (или блока) проиллюстрировано примером
[005-modifier-removing](https://bem.github.io/bem-js-tutorial/pure.bundles/005-modifier-removing/005-modifier-removing.html)
([BEMJSON](https://github.com/bem/bem-js-tutorial/blob/master/pure.bundles/005-modifier-removing/005-modifier-removing.bemjson.js)).
Это страница с todo-листом, в котором каждое дело показано клейким листочком.
Листочек можно спрятать (пометить, как выполненный), кликнув на него.

Список представлен блоком `todo`, а каждое дело в нём — элементом `task`. По
умолчанию все дела видимы, им назначен модификатор `visible_yes`.

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

Поведение блока описано в файле
[todo.js](https://github.com/bem/bem-js-tutorial/blob/master/pure.bundles/005-modifier-removing/blocks/todo/todo.js).

```js
modules.define('todo', ['i-bem__dom', jquery], function(provide, BEMDOM, $) {

provide(BEMDOM.decl(this.name, {
    onSetMod: {
        'js' : {
            'inited' : function() {
                this.bindTo(this.elem('task'), 'click', function(e) {
                    this.delMod($(e.currentTarget), 'visible');
                });
            }
        }
    }
}));

});
```

Как только пользователь кликает на элемент `task`, его модификатор `visible`
удаляется при помощи метода `delMod`.

Поскольку первый параметр (объект элемента) — опциональный, этот же метод можно
применять и к блокам.

Обратите внимание, что здесь метод `bindTo` работает не с блоком, а с
элементами.

**ВАЖНО:** Как было сказано выше, метод `bindTo` вешает обработчик на каждый такой
элемент. Если бы у блока было 100 элементов, он бы назначил 100 обработчиков.
Кроме того, динамически добавляемые элементы должны тоже получать отдельный
обработчик. Другой, лучший, способ работы с событиями изложен при описании секции
`live`. Дочитайте до этого места прежде чем начинать разрабатывать сложный блок.

## До установки модификатора

```files
pure.bundles/
    006-before-set-mod/
        blocks/
            page/
            accordion-menu/
                accordion-menu.bemhtml.js
                accordion-menu.css
                accordion-menu.js
        006-before-set-mod.bemjson.js
        006-before-set-mod.html
```

Иногда нужно произвести какие-то действия до установки модификатора. Это
особенно применимо, если в результате вычислений оказывается, что установку
модификатора надо предотвратить.

Пример
[006-before-set-mod](https://bem.github.io/bem-js-tutorial/pure.bundles/006-before-set-mod/006-before-set-mod.html)
([BEMJSON](https://github.com/bem/bem-js-tutorial/blob/master/pure.bundles/006-before-set-mod/006-before-set-mod.bemjson.js))
демонстрирует такой случай на примере блока
[accordion-menu](https://github.com/bem/bem-js-tutorial/tree/master/pure.bundles/006-before-set-mod/blocks/accordion-menu).

Меню на странице состоит из нескольких пунктов, каждый из которых может
раскрываться по клику и открывать доступ к своим подпунктам. Чтобы это
произошло, обработчик события `click` устанавливает активному пункту модификатор
`current` со значением `true` и закрывает ранее открытый пункт (то есть задаёт
ему модификатор `current` со значением `false`).

```js
modules.define('accordion-menu',
        ['i-bem__dom', 'jquery'], function(provide, BEMDOM, $) {

provide(BEMDOM.decl(this.name, {

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

}));

});
```

**ВАЖНО:** Обратите внимание, что здесь используется jQuery. Для этого потребовалось
изменить декларацию модуля. Библиотека bem-core использует модульную систему
[ymaps/modules](https://github.com/ymaps/modules/blob/master/README.ru.md).
При описании модуля все зависимые модули должны быть явно указаны.

Пример с меню становится более интересным, если у меню могут быть неактивные
(disabled) пункты. Такой пункт меню не может быть в состоянии `current`.
Конечно, всегда можно добавить дополнительную проверку в callback на установку
модификатора, но bem-core предлагает более элегантное решение. По аналогии со
свойствами `onSetMod` и `onElemSetMod` можно воспользоваться свойствами
`beforeSetMod` и `beforeElemSetMod`, чтобы сообщить блоку, что делать до
установки модификатора. А если такой callback возвращает `false`, это
предотвратит установку модификатора.

```js
modules.define('accordion-menu',
        ['i-bem__dom', 'jquery'], function(provide, BEMDOM, $) {

provide(BEMDOM.decl(this.name, {
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
}));

});
```

Здесь происходит проверка, активен ли элемент, и если нет — такой элемент не
может получить модификатор `current`.
