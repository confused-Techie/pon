const pon = require("../lib/pon.js");
const fixtures = require("./fixtures/fixtures.js");

describe("Reads Files Correctly", () => {

  test("Reads flat object", () => {
    const out = pon.read(fixtures.flat_object.pon);

    expect(out).toMatchObject(fixtures.flat_object.obj);
  });

  test("Reads example object", () => {
    const out = pon.read(fixtures.example_object.pon);

    expect(out).toMatchObject(fixtures.example_object.obj);
  });

  test("Reads all comment chars", () => {
    const out = pon.read(fixtures.comment_chars.pon);
    expect(out).toMatchObject(fixtures.comment_chars.obj);
  });

});

describe("Writes Files Correctly", () => {

  test("Writes flat object", () => {
    const out = pon.write(fixtures.flat_object.obj);
    expect(out).toMatch(fixtures.flat_object.pon);
  });

  test("Writes example object", () => {
    const out = pon.write(fixtures.example_object.obj);

    // We have to remove comments, since they can't be written out.
    let match = fixtures.example_object.pon
      .replace("<¿--<<This is a single line comment>>--?>\n", "")
      .replace("<¡--<<This is a multi\nline comment>>--!>\n", "");
    expect(out).toMatch(match);
  });

  test("Writes all comment chars", () => {
    const out = pon.write(fixtures.comment_chars.obj);
    let match = fixtures.comment_chars.pon
      .replace("<¿--<<Comment with > in it>>--?>\n", "");
    expect(out).toMatch(match);
  });

});
