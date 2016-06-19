# Структура блока

## Блок с JavaScript функциональностью

### Окружение

Для того, чтобы начать писать JavaScript, нужно подключить к странице блок
`i-bem`, его элемент `dom` и все их зависимости. Это произойдет автоматически,
если полностью повторить в своём проекте структуру из репозитория
[project-stub](https://ru.bem.info/platform/project-stub/).

### HTML структура

JavaScript можно написать для любого БЭМ блока. Для этого сначала нужно поместить
JavaScript файл в директорию блока.

```files
desktop.blocks/
    my-block/
        my-block.js
```

Затем в [BEMJSON](https://ru.bem.info/platform/bemjson/) описании страницы нужно пометить блок флагом `js`.

```js
{
    block: 'my-block',
    js: true
}
```

Это даст (после сборки и отработки [BEMHTML](https://ru.bem.info/platform/bem-xjst/) шаблонов на JSON) DOM узел,
помеченный дополнительным классом `i-bem` и атрибутом `data-bem` с параметрами
блока.

```html
<div class="my-block i-bem" data-bem="{'my-block':{}}">
    ...
</div>
```

Если вы не используете BEMJSON/BEMHTML, научите свои шаблоны производить такие
блоки, или просто напишите этот HTML вручную.

Атрибут `data-bem` нужен для хранения параметров блока в JSON. Структура
используется следующая:

```js
{
    "my-block" : {
        "paramName": "paramValue"
    }
}
```

## Простой пример с console.log

```files
pure.bundles/
    001-simple-block/
        blocks/
            my-block/
                my-block.js
        001-simple-block.bemjson.js
        001-simple-block.html
```

Первый пример — самый простой. Он показывает структуру блока и работающий JavaScript.

Загрузите пример
[001-simple-block](https://bem.github.io/bem-js-tutorial/pure.bundles/001-simple-block/001-simple-block.html) в браузере с открытой консолью, и вы увидите вывод строки,
соответствующей `outerHTML` блока.

BEMJSON декларация этого примера
[001-simple-block.bemjson.js](https://github.com/bem/bem-js-tutorial/blob/master/pure.bundles/001-simple-block/001-simple-block.bemjson.js) описывает простую страницу с
одним-единственным блоком `my-block`.

Компонент `my-block` расположен на уровне переопределения
[001-simple-block/blocks](https://github.com/bem/bem-js-tutorial/tree/master/pure.bundles/001-simple-block/blocks/my-block) и содержит JavaScript файл. Это файл
[my-block.js](https://github.com/bem/bem-js-tutorial/blob/master/pure.bundles/001-simple-block/blocks/my-block/my-block.js), в нём довольно простой код.

```js
modules.define('my-block', ['i-bem__dom'], function(provide, BEMDOM) {

provide(BEMDOM.decl(this.name, {
    onSetMod: {
        'js' : {
            'inited' : function() {
                console.log(this.domElem[0].outerHTML);
            }
        }
    }
}));

});
```

Фреймворк i-bem использует [модульную систему ymaps/modules](https://github.com/ymaps/modules/blob/master/README.ru.md).

Поэтому первой строчкой указывается, какой модуль использует компонент. В данном
случае это модуль
[`i-bem__dom`](https://github.com/bem/bem-core/blob/v3/common.blocks/i-bem/__dom/i-bem__dom.js),
реализованный как элемент `dom` блока `i-bem` библиотеки
[bem-core](https://en.bem.info/libs/bem-core/).

Далее внутри вы можете использовать объект `BEMDOM` и его метод `decl` для описания
вашего блока.

Первый параметр — имя блока.

Второй — хэш динамических свойств блока. Каждый экземпляр блока получает их копии.

Свойства могут быть какие угодно, но есть несколько специально
зарезервированных. Одно из них — `onSetMod`, его можно увидеть в следующем примере.
Оно используется для хранения функций callback, которые нужно позвать, если блоку
назначается соответствующий модификатор.

```js
BEMDOM.decl(this.name, {
    onSetMod: {
        'foo' : function() {
            // Вызывается, если блоку назначается любое значение модификатора 'foo'.
            // Работает и для 'булевых' модификаторов
        },
        'bar' : {
            'qux' : function() {
                // Вызывается, если блок приобретает модификатор
                // 'bar' со значением 'qux'
            },
            '' : function() {
                // Вызывается, если модификатор 'bar' удаляется с блока
            },
            '*' : function() {
                // Запускается при назначению блока любого значения модификатора bar
            }
        },
        '*' : function() {
            // Запускается при назначении блоку любого модификатора
        }
    }
});
```

В эти функции callback приходят следующие параметры:

```js
function(modName, modVal, currentModVal) {

    // modName
    // Имя модификатора

    // modVal
    // Значение для устанавливаемого модификатора.
    // Это `String`, или `true`/`false` в случае булевых модификаторов.

    // currentModVal
    // Текущее значение модификатора

}
```

Первый модификатор, устанавливаемый на блок — это модификатор `js` со значением
`inited`.

Ядро фреймворка ищет на странице все блоки, промаркированные дополнительным
классом `i-bem`, инициализирует их и назначает каждому модификатор `js_inited`.

Таким образом, вы можете написать код, который запустится в самом начале работы
блока. Такой код нужно поместить в callback, соответствующий установке
модификатора `js_inited`.

В предыдущем примере это был код, выводящий в консоль `outerHTML` блока.
