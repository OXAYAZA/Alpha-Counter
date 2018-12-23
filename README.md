# αCounters

Customizable counters, progress circles and countdown.
Check out this [Demo](https://codepen.io/OXAYAZA/pen/JJryqW) to see they in action!


## αCounter Usage

Simple HTML markup for counter:
```html
<span class="counter">99</span>
```

Initialization:
```js
var counter = aCounter({ node: document.querySelector( '.counter' ) });
```

or with all options:
```js
var counter = aCounter({
    node:       document.querySelector( '.counter' ),
    from:       10,
    to:         50,
    duration:   1000,
    refresh:    30,
    formatter:  function ( value ) { return value + '%'; },
    onStart:    function ( value ) { console.log( value ); },
    onUpdate:   function ( value ) { console.log( value ); },
    onComplete: function ( value ) { console.log( value ); }
});
```

### αCounter API

#### aCounter( options )
Returns a counter instance.

#### options
_Type: [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)_
_Required_

##### node
_Type: [Element object](https://developer.mozilla.org/en-US/docs/Web/API/Element)_
_Required_
The element that is changed by the counter.

##### from
_Type: [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)_
_Default: 0_
The number from which the count begins.

##### to
_Type: [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)_
The number to which the count ends. If the parameter is not specified, the counter will try to get it from the element. Otherwise, an error is thrown.

##### duration
_Type: [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)_
_Default: 3000_
Сounting duration in milliseconds.

##### refresh
_Type: [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)_
_Default: 30_
Counter element refresh rate in milliseconds.

##### formatter( value )
_Type: [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)_
A callback function that serving as a counter value formatter. Must return a modified counter value (for example, added prefix). The counter instance serves as the context.

##### onStart( value )
_Type: [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)_
Callback function that execute before count starting. The counter instance serves as the context. The counter value serves as a parameter.

##### onUpdate( value )
_Type: [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)_
Callback function that execute on each counter refresh. The counter instance serves as the context. The counter value serves as a parameter.

##### onComplete( value )
_Type: [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)_
Callback function that execute when counting complete. The counter instance serves as the context. The counter value serves as a parameter.


## License

Licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
[![Creative Commons License](https://i.creativecommons.org/l/by-sa/4.0/80x15.png)](https://creativecommons.org/licenses/by-sa/4.0/)
