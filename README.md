
```javascript
var flatstach = require("flatstack");
var queue = flatstack();


queue.push(function() {
  setTimeout(queue.pause().resume, 0);
});

//if argument[0] is present, then it's async
queue.push(function(next) {
   setTimeout(queue.pause().resume, 0);
});

queue.run();
```