# Countdown

Customizable countdown svg circles.
Check out this [Demo](https://codepen.io/OXAYAZA/pen/JJryqW) to see it in action!


## Usage

Standard HTML markup for countdown:

```html
<div class="wrap" data-countdown data-from="2017-08-19T20:00:00" data-to="2017-09-20T20:30:00">
  <div class="progress-circle" data-circle-countdown="data-circle-countdown" data-units="Days">
    <svg x="0px" y="0px" width="200px" height="200px" viewbox="0 0 100 100">
      <clipPath class="progress-clip"><path d=""></path></clipPath>
      <circle class="clipped" cx="50" cy="50" r="50"></circle>
    </svg>
    <div class="counter"></div>
  </div>
  <div class="progress-circle" data-circle-countdown="data-circle-countdown" data-units="Hours">
    <svg x="0px" y="0px" width="200px" height="200px" viewbox="0 0 100 100">
      <clipPath class="progress-clip"><path d=""></path></clipPath>
      <circle class="clipped" cx="50" cy="50" r="50"></circle>
    </svg>
    <div class="counter"></div>
  </div>
  <div class="progress-circle" data-circle-countdown="data-circle-countdown" data-units="Minutes">
    <svg x="0px" y="0px" width="200px" height="200px" viewbox="0 0 100 100">
      <clipPath class="progress-clip"><path d=""></path></clipPath>
      <circle class="clipped" cx="50" cy="50" r="50"></circle>
    </svg>
    <div class="counter"></div>
  </div>
  <div class="progress-circle" data-circle-countdown="data-circle-countdown" data-units="Seconds">
    <svg x="0px" y="0px" width="200px" height="200px" viewbox="0 0 100 100">
      <clipPath class="progress-clip"><path d=""></path></clipPath>
      <circle class="clipped" cx="50" cy="50" r="50"></circle>
    </svg>
    <div class="counter"></div>
  </div>
</div>
```

Add styles:

```html
<link rel="stylesheet" href="path/to/css/rd-parallax.css">
```

Initialization:

```js
document.addEventListener( 'DOMContentLoaded', function () {
	svgCountDown();
});
```


#### Basic Elements:

`<div class="wrap" data-countdown data-from="2017-08-19T20:00:00" data-to="2017-09-20T20:30:00">...</div>` - main wrapper, contains 4 circles for countdown.

`<div class="progress-circle" data-circle-countdown="data-circle-countdown" data-units="Days">...</div>` - block of the countdown circle, contains an svg image and counter.

`<clipPath class="progress-clip"><path d=""></path></clipPath>` - element for clipping the main figure.

`<circle class="clipped" cx="50" cy="50" r="50"></circle>` - cropped figure.

`<div class="counter"></div>` - counter.

#### Basic Attributes:

`data-countdown` - script initialization attribute, can be changed to id or class, does not have values.

`data-from` - starting time in the format `YYYY-MM-DDTHH:mm:ss`, where `T`- date and time separator.

`data-to` - end time in the format `YYYY-MM-DDTHH:mm:ss`, where `T`- date and time separator.

`data-circle-countdown` - attribute for initialization of the countdown circle, can be changed to an id or a class, has no values.

`data-units` - units of time displayed in the circle: `Days, Hours, Minutes, Seconds`.


## API

##### svgCountDown([ options ])

* optins (Object): object for storing options;
* optins.clipPathSelector (String): clipPath selector;
* optins.clippedSelector (String): clipped element selector;
* optins.counterSelector (String): counter selector;
* optins.clipPathId (String): added clipPath id (it is necessary because svg attribute clip-path can refer only to id);
* optins.unitsAttr (String): attribute name for setting time units;
* optins.fromAttr (String): attribute name for the countdown start;
* optins.toAttr (String): attribute name for the countdown end;
* optins.increase (Boolean): true - filling in the circle clockwise, false - cleaning the circle clockwise.
* optins.tickInterval (Number): interval for recalculation and drawing a circle;
* optins.oninit (Function): function performed when the script is initialized;
* optins.ontick (Function): function performed at each recalculation;


## License

Licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)

[![Creative Commons License](https://i.creativecommons.org/l/by-sa/4.0/80x15.png)](https://creativecommons.org/licenses/by-sa/4.0/)
