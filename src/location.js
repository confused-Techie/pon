function location(startLine, startColumn, startOffset, endLine, endColumn, endOffset, source) {
  return {
    start: {
      line: startLine,
      column: startColumn,
      offset: startOffset
    },
    end: {
      line: endLine,
      column: endColumn,
      offset: endOffset
    },
    source: source || null
  };
}

module.exports = location;
