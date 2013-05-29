

function flatstack(_context) {

  var _queue = [], _children = [];

  var self = {

    /**
     */

    _children: _children,

    /**
     */

    _paused: false,

    /**
     */

    child: function(context) {
      var child = flatstack(context);
      child._parent = self;
      _children.push(child);
      return child;
    },

    /**
     */

    pause: function() {
      self._paused = true;
    },

    /**
     */

    childrenPaused: function() {
      var child;

      for(var n = _children.length, i = 0; i--;) {
        child = _children[i];
        if(child.childrenPaused()) return true;
      }

      return false;
    },

    /**
     */

    resume: function() {
      self._paused = false;

      var p = self;
      while(p) {
        p._tryResuming();
        p = p._parent;
      }
    },

    /**
     */

    _tryResuming: function () {
      if(self._paused) return;
      if(self.childrenPaused()) return;
      self._resume();
    },

    /**
     */

    _resume: function() {
      setTimeout(p.next, 0);
    },

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
        if(self._paused) break;

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