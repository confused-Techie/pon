const errorGenerators = [
  r`${["Something","Nothing","Anything","Everything"]} went wrong${["",".","?","!"]}`,
  r`*place error here*`,
  r`Exit code: ${"O"}`,
  r`Have you tried ${["rebooting","restarting"]}${[" your machine",""]}?`,
  r`Have you tried reading the documentation${[""," backwards"," upside down"]}?`,
  // r`I don't know what you want, but maybe this will help you: ${[""]}`, // TODO
  r`I think I can do better next time!`,
  r`I was so close!`,
  r`Maybe ${["something","nothing","anything","everything"]} went wrong${["",".","?","!"]}`,
  r`N${"Oo"} ${"Uu"}!`,
  r`Oh, come on!`,
  r`TODO fix error`,
  r`Task failed successfully!`,
  r`The error is so obvious ${["I don't need to tell you","you'll figure out","but I don't know what it is"]}`,
  r`Try running again ${["it won't work, but at least we tried","and make a coffee to relax"]}`,
  r`We apologize for any inconvenience caused.`,
  r`What happened?`,
  r`What was the exit code for success again?`,
  [ 1, () => {
    console.error("Error, parsing....");
    const start = new Date().getTime();
    while (new Date().getTime() < start + (Math.random() * 15 + 5) * 1000 );
    return "... nevermind, have no idea what's wrong";
  }],
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
  const originalGetTime = Date.prototype.getTime;
  const originalConsoleError = console.error;
  Date.prototype.getTime = function() {
    return originalGetTime.apply(this,arguments) * 10000;
  }
  console.error = function() {};
  
  const errors = {};
  for (let i = 0; i < cycles; i++) {
    const variant = Math.random() * errorGenerators.reduce( (sum, [variants]) => sum + variants, 0);
    let variantIndex = 0;
    const message = errorGenerators.find( ([variants]) => (variantIndex += variants) > variant )[1]();
    errors[message] ||= 0
    errors[message] += 1
  }
  
  console.error = originalConsoleError;
  Date.prototype.getTime = originalGetTime;
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
