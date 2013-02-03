var $ = require('zepto-component');

module.exports = Tracker;

var frameFragment = $("<li></li>");
var traceFragment = $("<span class='value'></span>");

function Tracker(element,type,opts){
  if( !(this instanceof Tracker) )
    return new Tracker(element,type,opts);

  this.element = $(element);
  this.visible = 0;
  this.history = [];
  this.meta = [];

  this.element.on('mouseover','li',function(e){
    var li = e.currentTarget
      , tr = e.target;
    // TODO tooltíp of meta, timestamp and type or value
  })

  this.element.addClass('tracker').addClass(type);

  opts = opts || {}
  opts.type = opts.type || 'frames';
  opts.visible = opts.visible || 100;
  opts.min = opts.min || Number.MIN_VALUE;
  opts.max = opts.max || Number.MAX_VALUE;

  var currentFrame = frameFragment.clone()
    , metaIndex = 0
    , metaCount = 16383; // 2^14-1

  if( type === 'frames' ){
    this.frame = function(type,meta){
      var trace = traceFragment.clone();
      trace.addClass(type)
      if( meta ){
        trace.data('meta-index',metaIndex);
        this.meta[metaIndex] = meta;
        metaIndex = (metaIndex + 1) & metaCount;
      }
      currentFrame.append(trace)
      return this;
    }
  }

  if( type === 'timeline' ){
    this.value = function(value,meta){
      opts.type = 'timeline';
      var v = (value - opts.min) / (opts.max-opts.min) * 100
      var trace = traceFragment.clone();
      trace.css('height',v+'%');
      trace.data('value',value);
      if( meta ){
        trace.data('meta-index',metaIndex);
        this.meta[metaIndex] = meta;
        metaIndex = (metaIndex + 1) & metaCount;
      }
      currentFrame.append(trace)
      return this;
    }

    this.percent = function(percent,meta){
      opts.type = 'timeline';
      var trace = traceFragment.clone();
      trace.css('height',percent+'%')
      if( meta ){
        trace.data('meta-index',metaIndex);
        this.meta[metaIndex] = meta;
        metaIndex = (metaIndex + 1) & metaCount;
      }
      currentFrame.append(trace)
      return this;
    }
  }

  this.update = function(){
    // TODO Resize the width of the frame to fit each trace next to each other
    // $('.value',currentFrame).css('width',5/$('.value',currentFrame).length)

    // Resize height of frames to fit each trace on top of each other
    if( type === 'frames' )
      currentFrame.children().css('height',(100/currentFrame.children().length)+'%')

    currentFrame.data('ts',Date.now())

    // this.history.append(currentFrame)
    this.element.append(currentFrame)
    if( this.visible++ > opts.visible ){
      this.element[0].removeChild(this.element[0].firstChild);
      this.visible--;
    }

    currentFrame = frameFragment.clone();
    return this;
  }
}