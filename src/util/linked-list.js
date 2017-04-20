/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/canvas-ui
 * @licence MIT
 *
 * For test only, and this file won't be built into the release file
 */

function LinkedList() {
  var Node = function(element) {　　　　　　　
    this.element = element;
    this.next = null;
  };
  this.length = 0;
  this.head = null;

  this.reverse1 = function() {
    console.log('Iterative Reverse');
    console.log(this.toString());
    var current = this.head;
    var previous = null;
    while (current) {
      var temp = current.next;
      current.next = previous;
      previous = current;
      current = temp;
    }

    // Reset the head to the last item
    this.head = previous;
    console.log(this.toString());
  };

  this.reverseItem = function(previous, current) {
    if (current.next) {
      this.reverseItem(current, current.next);
    } else {
      // Reset the head to the last item
      this.head = current;
    }
    current.next = previous;
  };

  this.reverse2 = function() {
    console.log('Recursive Reverse');
    console.log(this.toString());
    this.reverseItem(null, this.head);
    console.log(this.toString());
  };

  this.append = function(element) {
    var node = new Node(element);　　　　　　　　
    var current;
    if (this.head === null) {　　　　　　　　　　　　　
      this.head = node;
    } else {
      current = this.head;　　　　　　　　　　　　　　
      while (current.next) {　　　　　　　　　　
        current = current.next;
      }
      current.next = node;　　　　　　　　　　　　
    }
    this.length++;　　　　　　　　　　　　　　　　　　　　
  };

  this.removeAt = function(position) {
    if (position > -1 && position < this.length) {
      var current = this.head;
      var index = 0;
      var previous;
      if (position == 0) {
        this.head = current.next;
      } else {
        while (index++ < position) {
          previous = current;
          current = current.next;
        }
        previous.next = current.next;
      }
      this.length--;
      return current.element;
    } else {
      return null;
    }
  };

  this.insert = function(position, element) {
    if (position > -1 && position <= this.length) {　　　　　　　　
      var node = new Node(element);　　　　　　　　
      current = this.head;
      var index = 0;
      var previous;
      if (position == 0) {　　　　　　　　　　　　　　　　　　　　
        node.next = current;
        this.head = node;　　　　　　　　　　　　　　　　　　　　　　　　
      } else {
        while (index++ < position) {
          previous = current;
          current = current.next;
        }　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　
        previous.next = node;
        node.next = current;
      }
      this.length++;
      return true;
    } else {
      return false;
    }

  };

  this.toString = function() {
    var current = this.head;
    var string = '';
    while (current) {
      string += ',' + current.element;
      current = current.next;
    }
    return string;
  };

  this.indexOf = function(element) {
    var current = this.head;
    var index = -1;
    while (current) {
      if (element === current.element) {
        return index;
      }
      index++;
      current = current.next;
    }
    return -1;
  };

  this.getLength = function() {
    return this.length;
  }
}

// Init a list
var l = new LinkedList();
for (var i = 0; i < 10; i++) {
  l.append(i);
}

// Reverse with iteration
l.reverse1();

// Reverse with recursion
l.reverse2();
