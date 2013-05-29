function flatstack(_context) {

  var _queue = [];

  function _pause(stack) {

  }

  function _resume(stack) {
    if(!stack._pauseCount) {
      return;
    }

    stack._pauseCount--;

    if(!stack._pauseCount) {

    }
  }

  var self = {

    /**
     */

    _pauseCount: 0,

    /**
     */

    parent: function(parent) {
      self._parent = parent;
    },

    /**
     */

    pause: function() {

      if(self._pauseCount) {
        return;
      }

      var p = self;
      while(p) {
        p._pauseCount++;
        p = p._parent;
      }
    },

    /**
     */

    resume: function() {

      if(!self._pauseCount) {
        return;
      }

      var p = self;

      while(p) {
        p._pauseCount--;
        p = p._parent;
      }
    }

    /**
     */

    push: function() {
      _queue.push.apply(_queue, arguments);
      self.run();
    },

    /**
     */

    unshift: function() {
      _queue.unshift.apply(_queue, arguments);
      self.run();
    },

    /**
     */

    next: function() {

      var fn;

      while(this._queue.length) {

        //paused? stop for now
        if(self._pauseCount) break;

        fn = _queue.shift();

        //argument provided? it's asynchronous
        if(fn.length === 1) {
          fn.call(_context, self.pause().resume);
        } else {
          fn.call(_context);
        }
      }
    },

    /**
     */

    _run: function() {
      if(self._running) return;
      self.next();
    }
  };
}


module.exports = flatstack;