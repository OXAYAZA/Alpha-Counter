# αCounters

Customizable counters, progress circles and countdown.  
Check out this [Demo](https://codepen.io/OXAYAZA/pen/JJryqW) to see they in action!


## αCounter Usage

HTML markup for counter:
```html
<span class="counter">99</span>
```

Simple initialization:
```js
aCounter({ node: document.querySelector( '.counter' ) });
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
Initializes the counter and returns its instance.

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
Counter element render interval in milliseconds.

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


## αProgressCircle Usage
__αProgressCircle__ requires an initial SVG image size of 100 by 100 pixels.  
The width and height attributes can be anything but the viewbox attribute should be `0 0 100 100`.  
There must also be at least one SVG element with a clipped class.

HTML markup for progress circle:
```html
<svg class="progress-circle" x="0px" y="0px" width="100" height="100" viewbox="0 0 100 100">
    <circle class="clipped" cx="50" cy="50" r="50"></circle>
</svg>
```

Simple initialization:
```js
aProgressCircle({ node: document.querySelector( '.progress-circle' ) });
```

or with all options:
```js
var progressCircle = aProgressCircle({
    node:    document.querySelector( '.progress-circle' ),
    clipped: '.clipped',
    clipId:  'MyAwesomeId',
    angle:   45
});
```

## αProgressCircle API

#### aProgressCircle( options )
Initializes the svg progress circle and returns its instance.

#### options
_Type: [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)_  
_Required_

##### node
_Type: [Element object](https://developer.mozilla.org/en-US/docs/Web/API/Element)_  
_Required_  
The SVG element that is processed by the aProgressCircle instance.

##### clipped
_Type: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)_  
_Default: '.clipped'_  
The selector of the SVG element to be clipped depending on the progress angle.

##### clipId
_Type: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)_  
_Default: random eight-character string_  
ID of the generated `<clipPath>` element.

##### angle
_Type: [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)_  
_Default: 0_  
Angle of circle progress (from 0 to 360 degrees inclusive).


## αCountdown Usage
Requires exactly 4 elements with attributes `data-counter-days`, `data-counter-hours`, `data-counter-minutes`, `data-counter-seconds` and exactly 4 svg-elements with attributes `data-progress-days`, `data-progress-hours`, `data-progress-minutes`, `data-progress-seconds`.  
The latter must satisfy the conditions of the __αProgressCircle__.
Just use and modify basic markup =)

HTML markup for countdown:
```html
<div class="countdown">
  <div class="countdown-block">
    <svg class="countdown-circle" x="0px" y="0px" width="100px" height="100px" viewbox="0 0 100 100" data-progress-days>
      <circle class="clipped" cx="50" cy="50" r="50" ></circle>
    </svg>
    <h1 class="countdown-counter" data-counter-days>00</h1>
  </div>
  <div class="countdown-block">
    <svg class="countdown-circle" x="0px" y="0px" width="100px" height="100px" viewbox="0 0 100 100" data-progress-hours>
      <circle class="clipped" cx="50" cy="50" r="50" ></circle>
    </svg>
    <h1 class="countdown-counter" data-counter-hours>00</h1>
  </div>
  <div class="countdown-block">
    <svg class="countdown-circle" x="0px" y="0px" width="100px" height="100px" viewbox="0 0 100 100" data-progress-minutes>
      <circle class="clipped" cx="50" cy="50" r="50" ></circle>
    </svg>
    <h1 class="countdown-counter" data-counter-minutes>00</h1>
  </div>
  <div class="countdown-block">
    <svg class="countdown-circle" x="0px" y="0px" width="100px" height="100px" viewbox="0 0 100 100" data-progress-seconds>
      <circle class="clipped" cx="50" cy="50" r="50" ></circle>
    </svg>
    <h1 class="countdown-counter" data-counter-seconds="">00</h1>
  </div>
</div>
```

Some basic styles:
```css
.countdown {
    display: flex;
    justify-content: center;
    text-align: center;
}
```

Simple initialization:
```js
aCountdown({
    node: document.querySelector( '.countdown' ),
    from: '2017-08-19',
    to:   '2019-09-20'
});
```

or with all options:
```js
var countdown = aCountdown({
    node:  document.querySelector( '.countdown' ),
    from:  '2017-08-19',
    to:    '2019-09-20',
    tick:  100,
    onTick: function() { console.log( this ); }
});
```

## αCountdown API

#### aCountdown( options )
Initializes the countdown and returns its instance.

#### options
_Type: [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)_  
_Required_

##### node
_Type: [Element object](https://developer.mozilla.org/en-US/docs/Web/API/Element)_  
_Required_  
The main element that is processed by the aCountdown instance.

##### from
_Type: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)_  
_Required_  
Countdown start date. Must be in valid [format](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse).

##### to
_Type: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)_  
_Required_  
Countdown end date. Must be in valid [format](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse).

##### tick
_Type: [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)_  
_Default: 1000_  
Countdown render interval in milliseconds.

##### onTick
_Type: [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)_  
Callback function that execute on each countdown render. The countdown instance serves as the context.

## License

Licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)  
[![Creative Commons License](https://i.creativecommons.org/l/by-sa/4.0/80x15.png)](https://creativecommons.org/licenses/by-sa/4.0/)
