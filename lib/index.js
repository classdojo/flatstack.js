
function flatstack(_context) {

  var _queue = [];

  var self = {


    /**
     */

    _pauseCount: 0,

    /**
     */

    child: function(context) {
      var child = flatstack(context);
      child._parent = self;
      return child;
    },

    /**
     */

    pause: function() {
      var p = self;

      //already paused? skip!
      if(self._pauseCount) return;

      while(p) {
        p._pauseCount++;
        p = p._parent;
      }
    },

    /**
     */

    resume: function() {

      //already resumed? ignore!
      if(!self._pauseCount) return;

      setTimeout(self._resume, 0);
    },

    /**
     */

    _resume: function() {
      var p = self;

      //first decrmeent the pause count
      while(p) {
        p._pauseCount--;
        p = p._parent;
      }

      p = self;

      //next, resume eveything
      while(p) {
        if(self._pauseCount) break;
        p.next();
        p = p._parent;
      }
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

      while(_queue.length) {

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