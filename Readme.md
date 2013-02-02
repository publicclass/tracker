
# tracker

  A little event tracker

## Installation

    $ component install publicclass/tracker

## API

### new Tracker(element,type[,opts])

  Create a new tracker. `type` can be either _frames_ or _timeline_ and the type will decide what can be tracked.

### Tracker#frame(type[,meta])

  Accessible on Trackers of `frames`-type. The `type` argument can be any string or such. It will be set as the class of the trace and can thus be styled to your liking.

  The `meta` argument is stored and will be accessible in the tooltip (TBD).

### Tracker#percent(percent[,meta])

  Accessible on Trackers of `timeline`-type.

  The `meta` argument is stored and will be accessible in the tooltip (TBD).

### Tracker#value(value[,meta])

  Accessible on Trackers of `timeline`-type. The `value` will be scaled according to the `min` and `max` options passed into the constructor.

  The `meta` argument is stored and will be accessible in the tooltip (TBD).

## License

  MIT
