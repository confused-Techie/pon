class Parser {
  constructor(obj) {
    this.data = obj;
    this.out = {};
    this.index = 0;

    // State Tracking
    this.propertyTypes = {};
  }

  async parse() {
    // Manages the parsing runtime

    let cur = this.cur();

    if (this.index === this.data.length || this.index > this.data.length) {
      // This indicates we have parsed the whole file
      return;
    }

    if (cur === "D") {
      // Possible defining of a property type
      if (this.peek(1) === "i" && this.peek(2) === "m" && this.peek(3) === " ") {
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
