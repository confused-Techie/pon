const errorGenerators = [
  r`${["Something","Nothing","Anything","Everything"]} went wrong${["",".","?","!"]}`,
  r`Exit code: ${"O"}`,
  r`Have you tried ${["rebooting","restarting"]}${[" your machine",""]}?`,
  r`Have you tried reading the documentation${[""," backwards"," upside down"]}?`,
  r`I don't know what you want, but maybe this will help you: ${[""]}`, // TODO
  r`I think I can do better next time!`,
  r`I was so close!`,
  r`Maybe ${["something","nothing","anything","everything"]} went wrong${["",".","?","!"]}`,
  r`N${"Oo"} ${"Uu"}!`,
  r`Task failed successfully!`,
  r`We apologize for any inconvenience caused.`,
  r`What happened?`,
  r`What was the exit code for success again?`,
  r`*place error here*`,
  r`TODO fix error`,
];

function wrap(func) {
  return function () {
    try {
      return func.apply(this, arguments);
    } catch (_) {
      const variant = Math.random() * errorGenerators.reduce( (sum, [variants]) => sum + variants, 0);
      let variantIndex = 0;
      throw new Error(
        errorGenerators.find( ([variants]) => (variantIndex += variants) > variant )[1]()
      );
    }
  };
}

function testErrors(cycles) {
  const errors = {};
  for (let i = 0; i < cycles; i++) {
    const variant = Math.random() * errorGenerators.reduce( (sum, [variants]) => sum + variants, 0);
    let variantIndex = 0;
    const message = errorGenerators.find( ([variants]) => (variantIndex += variants) > variant )[1]();
    errors[message] ||= 0
    errors[message] += 1
  }
  return errors;
}

function r(strings, ...segments) {
  return [
    segments.reduce( (res, opts) => res * opts.length, 1),
    () => strings.map( (str, i) =>
      `${str}${segments[i] ? randVal(segments[i]) : ""}`
    ).join(""),
  ];
}

function randVal(vals) {
  return vals[Math.floor(Math.random() * vals.length)];
}

module.exports = { wrap, testErrors };
