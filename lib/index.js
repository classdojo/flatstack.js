
function flatstack(options) {

  if(!options) {
    options = {};
  }

  var _context = options.context,
  _parent      = options.parent,
  _asyncLength = options.asyncLength || 1;


  var _queue = [];

  var self = {

    /**
     */

    _parent: _parent,


    /**
     */

    _pauseCount: 0,

    /**
     */

    child: function(context) {
      return flatstack({
        context     : _context,
        parent      : _parent,
        asyncLength : _asyncLength
      });
    },

    /**
     */

    pause: function() {

      //already paused? skip!
      if(self._pauseCount) return self;

      var p = self;

      while(p) {
        p._pauseCount++;
        p = p._parent;
      }

      return self;
    },

    /**
     */

    resume: function() {

      //already resumed? ignore!
      if(!self._pauseCount || self._resuming) return self;

      self._resuming = true;


      //if the queued function called for .pause() and .resume()
      //maintain the async behavior by adding a timeout - it's expected!
      setTimeout(self._resume, 0);

      return self;
    },

    /**
     */

    _resume: function() {
      var p = self;
      self._resuming = false;

      //first decrmeent the pause count
      while(p) {
        p._pauseCount--;
        p = p._parent;
      }

      p = self;

      //next, resume eveything
      while(p) {
        if(p._pauseCount) break;
        p.next();
        p = p._parent;
      }
    },

    /**
     */

    push: function() {
      _queue.push.apply(_queue, arguments);
      self._run();
      return self;
    },

    /**
     */

    unshift: function() {
      _queue.unshift.apply(_queue, arguments);
      self._run();
      return self;
    },

    /**
     */

    next: function() {

      var fn;

      while(_queue.length) {

        //paused? stop for now
        if(self._pauseCount) break;

        fn = _queue.shift();

        //argument provided? it's asynchronous
        if(fn.length === _asyncLength) {
          fn.call(_context, self.pause().resume);
        } else {
          fn.call(_context);
        }
      }

      if(self._complete && !_queue.length && !self._pauseCount) {
        self._complete();

        //can ONLY be called once - dispose of this.
        self._complete = undefined;
      }

    },

    /**
     */

    complete: function(fn) {

      self._complete = fn;

      //just need to get to the ._complete() logic
      if(!_queue.length) return self.next();
    },

    /**
     */

    _run: function() {
      if(self._pauseCount || !_queue.length) return;
      self.next();
    }
  };

  return self;
}


module.exports = flatstack;