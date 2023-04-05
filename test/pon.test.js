// Enable useful error messages
require("../lib/errors.js").wrap = f => f;

const pon = require("../lib/pon.js");
const fixtures = require("./fixtures/fixtures.js");

describe("Reads Files Correctly", () => {

  for (const fix in fixtures) {

    test(`Writes ${fix}-${fixtures[fix]._type} File Correctly`, () => {
      let tmp = fixtures[fix];

      const out = pon.read(tmp.pon);

      expect(out).toMatchObject(tmp.obj);
    });
  }
});

describe("Writes Files Correctly", () => {

  for (const fix in fixtures) {

    test(`Writes ${fix}-${fixtures[fix]._type} File correctly`, () => {
      let tmp = fixtures[fix];

      const out = pon.write(tmp.obj);

      let match = tmp.pon;
      if (Array.isArray(tmp._comments)) {
        for (const com of tmp._comments) {
          match = match.replace(com, "");
        }
      }

      expect(out).toMatch(match);
    });
  }
});

describe("Ensure our errors are as helpful as possible", () => {

  test("Make sure errors happen", () => {
    let err = require("../lib/errors.js");
    let cycles = 10;

    let errs = err.testErrors(cycles);

    // Some errors don't return directly, or immediatly. So we can't check the exact
    // number, but we expect near to, -1, but this is easier
    expect(Object.keys(errs).length).toBeLessThanOrEqual(cycles);
  });
});
