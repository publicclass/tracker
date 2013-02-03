var Emitter = require('emitter')
  , $ = require('jquery');

module.exports = Tracker;

var frameFragment = $("<li></li>");
var traceFragment = $("<span class='value'></span>");

function Tracker(element,type,opts){
  if( !(this instanceof Tracker) )
    return new Tracker(element,type,opts);

  Emitter(this)

  this.element = $(element);
  this.visible = 0;
  this.history = [];
  this.meta = [];

  this.element.on('mouseover','li',function(e){
    if( e.target.nodeName == 'SPAN' ){
      var li = $(e.currentTarget);
      var tr = $(e.target);
      var index = tr.data('meta-index')
      this.emit('meta',this.meta[index],tr.data('type') || tr.data('value'),li.data('ts'))
    }
  }.bind(this))

  this.element.addClass('tracker').addClass(type);

  opts = opts || {};
  opts.visible = opts.visible || 100;
  opts.min = opts.min || Number.MIN_VALUE;
  opts.max = opts.max || Number.MAX_VALUE;

  var currentFrame = frameFragment.clone()
    , traces = 0
    , metaIndex = 0
    , metaCount = 16383; // 2^14-1

  if( type === 'frames' ){
    this.frame = function(type,meta){
      var trace = traceFragment.clone();
      trace.addClass(type)
      trace.data('type',type);
      if( meta ){
        trace.data('meta-index',metaIndex);
        this.meta[metaIndex] = meta;
        metaIndex = (metaIndex + 1) & metaCount;
      }
      currentFrame.append(trace)
      traces++;
      return this;
    }
  }

  if( type === 'stack' ){
    this.count = function(type,meta){
      var trace = traceFragment.clone();
      trace.css('bottom',traces*6+'px');
      if( type ){
        trace.addClass(type)
        trace.data('type',type);
      }
      if( meta ){
        trace.data('meta-index',metaIndex);
        this.meta[metaIndex] = meta;
        metaIndex = (metaIndex + 1) & metaCount;
      }
      currentFrame.append(trace)
      traces++;
      return this;
    }
  }

  if( type === 'timeline' ){
    this.value = function(value,meta){
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
      traces++;
      return this;
    }

    this.percent = function(percent,meta){
      var trace = traceFragment.clone();
      trace.css('height',percent+'%')
      if( meta ){
        trace.data('meta-index',metaIndex);
        this.meta[metaIndex] = meta;
        metaIndex = (metaIndex + 1) & metaCount;
      }
      currentFrame.append(trace)
      traces++;
      return this;
    }
  }

  this.update = function(){
    if( !this.element.length )
      return this;

    // Resize height of frames to fit each trace on top of each other
    if( type === 'frames' && traces )
      currentFrame.children().css('height',(100/traces)+'%')

    // TODO Resize the width of the frame to fit each trace next to each other
    // if( type === 'timeline' && traces )
    //   currentFrame.children().css('width',(5/traces)+'px')

    currentFrame.data('ts',Date.now())

    // this.history.append(currentFrame)
    this.element.append(currentFrame)
    if( this.visible++ > opts.visible ){
      this.element[0].removeChild(this.element[0].firstChild);
      this.visible--;
    }

    currentFrame = frameFragment.clone();
    traces = 0;
    return this;
  }
}