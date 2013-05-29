var expect = require("expect.js"),
flatstack  = require("..");

describe("flatstack", function() {
  var queue = flatstack();

  it("can add, and run a list of functions synchronously", function() {
    var i = 0;
    queue.push(function() {
      i++;
    });
    queue.push(function() {
      i++;
    });

    expect(i).to.be(2);
  });
});