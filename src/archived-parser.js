class Parser {
  constructor(obj) {
    this.data = obj;
    this.tree = {};
    this.index = 0;

    // State Tracking
    this.propertyTypes = {};
    this.line = 0;
    this.looseTree = {
      index: 0,
      depth: 0,
      name: "",
      value: null,
      parent: null,
    };
    this.looseTreeActive = false;
    this.lastParent = false;
  }

  async parse() {
    // Manages the parsing runtime

    let cur = this.cur();
    console.log(`Current Run: ${cur}`);

    if (this.index === this.data.length || this.index > this.data.length) {
      console.log("End of file hit");
      // This indicates we have parsed the whole file
      return;
    }

    if (cur === "D" && this.peek(1) === "i" && this.peek(2) === "m" && this.peek(3) === " ") {
      console.log("Dim Definition hit");
      // Defining of a property type
      // this line begins with "Dim" and is a property type definition
      this.setIndex(this.index + 3);
      // set our index according to our peeked values
      let propertyName = this.greedyNextTillSpace();
      let propertyType = this.consumeLine();
      if (propertyType.startsWith("As ")) {
        propertyType = propertyType.replace("As ", "");
        this.propertyTypes[propertyName] = propertyType;
        return this.parse();

      } else {
        // The property type doesn't start with a directive, fail
        return new Error(`Property Type Declarator has no Directive at ${this.index}`);
      }
    }

    if (/\d/.test(cur) && /\d/.test(this.greedyPeekTillSpace(cur))) {
      console.log("Number hit");
      // The value is a number until the next space
      // This means we are now defining some data
      if (this.lastParent) {
        // This means that we are likely within a definition. And want to append
        // all data inside
        this.looseTree.parent = this.lastParent;
      }

      this.looseTreeActive = true;
      let value = this.greedyNextTillSpace(cur);
      this.looseTree.index = parseFloat(value);
      this.next();
      return this.parse();
    }

    if (/\t/.test(cur) && this.peek(1) === " " && this.peek(2) === " " && this.peek(3) === " ") {
      console.log("Valid indentation hit");
      this.setIndex(this.index + 3);

      return this.parse();
    }

    if (cur === " " && this.peek(1) === " " && this.peek(2) === " " && this.peek(3) === " " && this.peek(4) === " ") {
      console.log("Valid compatible indentation hit");
      this.setIndex(this.index + 5);
      return this.parse();
    }

    if (cur === "#" && /#+/.test(this.greedyPeekTillSpace(cur)) && this.looseTreeActive) {
      console.log("Hashtag hit");
      // We are getting our depth indicator
      let value = this.greedyNextTillSpace(cur);
      this.looseTree.depth = value.length;
      this.next();
      return this.parse();
    }

    if (cur === "<" && this.peek() === "<" && this.looseTreeActive) {
      console.log("Value reference hit");
      // We have hit a value reference eg <<value>>
      let value = this.greedyNextTillSpace(cur);
      value = value.replace("<<", "").replace(">>", "");
      if (value.endsWith(":=") && this.peek() === " ") {
        // This is a single line defition
        this.looseTree.name = value.replace(":=", "");

        this.next(); // Calling to skip trailing space

        let singleLineValue = this.greedyNextTillSpace();

        this.looseTree.value = singleLineValue.replace("<<", "").replace(">>", "");

        this.next();
        return this.parse();
      } else {
        this.looseTree.name = value;
        this.next();
        return this.parse();
      }
    }

    if (cur === "[" && this.looseTreeActive) {
      console.log("Object Tree Hit");
      // We have hit the opening definition of an object
      if (this.lastParent) {
        this.tree[this.lastParent].value = {};
        this.tree[this.lastParent].value[this.looseTree.name] = this.looseTree;
      } else {
        this.tree[this.looseTree.name] = this.looseTree;
      }
      this.looseTreeActive = false;
      this.lastParent = this.looseTree.name;
      // Now that we have assigned the index of the tree with out looseTree data
      // Lets go ahead and clear any data stored for the loose tree
      this.looseTree = {
        index: 0,
        depth: 0,
        name: "",
        value: null,
        parent: null,
      };
      this.next();
      return this.parse();
    }

    if (/[\r\n]+/.test(cur)) {
      console.log("Newline hit");
      // On a line ending selector, just move to the next character
      this.next();
      this.line++;
      return this.parse();
    }
  }

  setIndex(idx) {
    // Sets the index to the provided value
    this.index = idx;
  }

  cur() {
    // Returns the char at the current location of the index
    return this.data.charAt(this.index);
  }

  next() {
    // Returns the next char of the index while increasing the index
    this.index = this.index + 1;
    return this.data.charAt(this.index);
  }

  peek(value) {
    // Returns the next char without moving the index
    // Optionally accepting a value to peek ahead
    let amount = value ?? 1;
    return this.data.charAt(this.index + amount);
  }

  peekBehind() {
    // Returns the last char without moving the index
    return this.data.charAt(this.index - 1);
  }

  greedyNextTillSpace(existingLine) {
    // Will use next to consume the text until line ending characters or spaces
    // are found. Optionally assign line to existing line in case of self called
    // recusion.

    let line = existingLine ?? "";

    if (/[\r\n\s]+/.test(this.peek())) {
      // A newline, or space has been found
      this.index = this.index + 1;
      return line;
    } else {
      // The next index contains anything other than newline characters or spaces
      line += this.next();
      return this.greedyNextTillSpace(line);
    }
  }

  greedyPeekTillSpace(existingLine, idx) {
    let line = existingLine ?? "";
    let peekIdx = idx ?? null;

    if (/[\r\n\s]+/.test(this.peek(peekIdx))) {
      return line;
    } else {
      line += this.peek(peekIdx);
      return this.greedyPeekTillSpace(line, peekIdx + 1);
    }
  }

  consumeLine(existingLine) {
    let line = existingLine ?? "";

    if (/[\r\n]+/.test(this.peek())) {
      this.index = this.index + 1;
      return line;
    } else {
      line += this.next();
      return this.consumeLine(line);
    }
  }

}

module.exports = Parser;
