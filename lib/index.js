
function flatstack(_context, _parent) {

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
      return flatstack(context, self);
    },

    /**
     */

    pause: function() {

      //already paused? skip!
      if(self._pauseCount) return;

      var p = self;

      while(p) {
        p._pauseCount++;
        p = p._parent;
      }
    },

    /**
     */

    resume: function() {

      //already resumed? ignore!
      if(!self._pauseCount || self._resuming) return;

      self._resuming = true;

      //if the queued function called for .pause() and .resume()
      //maintain the async behavior by adding a timeout - it's expected!
      setTimeout(self._resume, 0);
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
    },

    /**
     */

    unshift: function() {
      _queue.unshift.apply(_queue, arguments);
      self._run();
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
        if(fn.length) {
          fn.call(_context, self.pause().resume);
        } else {
          fn.call(_context);
        }
      }
    },

    /**
     */

    _run: function() {
      if(self._pauseCount || _queue.length) return;
      self.next();
    }
  };
}


module.exports = flatstack;