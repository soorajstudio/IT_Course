import { buildAndEmitCourse, type CompactCourse, type CompactLesson } from '../curriculumFactory';

function L(
  title: string,
  summary: string,
  details: string,
  bestPractice: string,
  codeTitle: string,
  code: string,
  output: string | undefined,
  keyPoints: [string, string, string],
  mistakes: [[string, string], [string, string]],
  qa: [[string, string], [string, string]],
  q: string,
  opts: [string, string, string, string],
  ans: 0 | 1 | 2 | 3,
  exp: string
): CompactLesson {
  return {
    title,
    summary,
    details,
    bestPractice,
    codeTitle,
    code,
    output,
    keyPoints,
    mistakes,
    qa,
    mcq: [{ prompt: q, options: opts, correctIndex: ans, explanation: exp }],
  };
}

const jsCourse: CompactCourse = {
  slug: 'javascript',
  order: 3,
  title: 'JavaScript (Vanilla)',
  shortTitle: 'JavaScript',
  area: 'Web',
  tagline: 'Closures, prototypes, the Event Loop, Promises, DOM engineering, and modern ES2024 internals.',
  description:
    'Build deep mastery of vanilla JavaScript: lexical scoping, closures, this binding, prototypal inheritance, microtasks vs macrotasks, async/await concurrency, ES modules, DOM delegation, memory profiling, and interview output tracing.',
  codeLanguage: 'javascript',
  estimatedHours: 28,
  prerequisites: ['HTML and CSS fundamentals'],
  whatYoullLearn: [
    'Trace hoisting, Temporal Dead Zone, lexical closures, and garbage collection',
    'Predict this binding across method calls, arrow functions, call/apply/bind, and new',
    'Master Promises, async/await, AbortController, and Event Loop microtask ordering',
    'Use modern ES2023+ immutable array methods (toSorted, toSpliced, Map, Set, WeakMap)',
    'Architect fast DOM interactions with Event Delegation, IntersectionObserver, and Fetch',
    'Implement Metaprogramming with Proxy, Reflect, Symbols, Generators, and Iterators',
  ],
  levelSummaries: {
    Beginner: 'Variables, types, coercion, control flow, functions, arrays, objects, and destructuring.',
    Intermediate: 'Closures, this binding, prototypes, classes, DOM events, Fetch API, and error handling.',
    Advanced: 'Event Loop microtasks, Promise combinators, ES modules, Proxy/Symbols, generators, and memory tuning.',
  },
  sections: [
    {
      level: 'Beginner',
      title: 'Variables, Types & Coercion',
      description: 'Understand let/const/var, primitive vs reference values, strict equality, and truthiness rules.',
      lessons: [
        L(
          'var, let, const & Temporal Dead Zone',
          'let and const are block-scoped and sit in the Temporal Dead Zone (TDZ) until their declaration executes, preventing accidental pre-initialization reads.',
          'Unlike var—which is function-scoped and hoisted with value undefined—accessing a let or const binding before its declaration throws a ReferenceError. Note that const prevents reassigning the binding, not mutating object properties.',
          'Default to const for every binding; reach for let only when reassignment is genuinely required, and avoid var in modern code.',
          'Block Scope & TDZ Behavior',
          `const config = { retries: 3 };\nconfig.retries = 5; // Allowed: mutating property, not binding\n\nfor (let i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0); // Prints 0, 1, 2 (fresh binding per iteration)\n}`,
          '0\n1\n2',
          [
            'let and const are hoisted to block scope but uninitialized in the TDZ until evaluated.',
            'const freezes the variable reference, NOT internal properties of objects or arrays.',
            'for (let i = ...) creates a fresh lexical binding per iteration, solving classic closure bugs.',
          ],
          [
            ['Using var in a loop with async callbacks and seeing the final value repeated', 'Use let in loop headers so each iteration captures its own binding.'],
            ['Assuming const makes an array or object deeply immutable', 'Use Object.freeze() (or structured copies) when you actually need runtime immutability.'],
          ],
          [
            ['What is the Temporal Dead Zone (TDZ)?', 'The period between entering a block scope and executing a let/const declaration during which referencing the variable throws a ReferenceError instead of returning undefined.'],
            ['Why does typeof undeclaredVar return "undefined" while typeof x throws if let x is declared later in the block?', 'Because let x IS hoisted into the block scope in the TDZ, making typeof throw ReferenceError before initialization.'],
          ],
          'What happens when you read a let variable before its declaration line inside the same block?',
          ['Throws a ReferenceError due to the Temporal Dead Zone', 'Returns undefined', 'Returns null', 'Creates a global variable'],
          0,
          'let and const bindings exist in the TDZ until initialized, throwing ReferenceError on earlier access.'
        ),
        L(
          'Primitive Types, typeof Quirks & Reference Semantics',
          'JavaScript has 7 primitive types (string, number, bigint, boolean, undefined, symbol, null) copied by value, while objects, arrays, and functions are passed by shared reference.',
          'A famous historical bug causes typeof null to return "object"—always check value === null explicitly. Use structuredClone(obj) for native deep cloning of nested data structures (including Dates, Maps, and Sets).',
          'Check arrays with Array.isArray(x) rather than typeof x (which returns "object").',
          'Value Copy vs Reference Sharing & structuredClone',
          `const a = { user: { name: 'Maya' } };\nconst shallow = { ...a };\nconst deep = structuredClone(a);\n\nshallow.user.name = 'Liam';\nconsole.log(a.user.name, deep.user.name);`,
          'Liam Maya',
          [
            '7 primitives: string, number, bigint, boolean, undefined, symbol, null.',
            'typeof null === "object" is a legacy spec quirk; use val === null.',
            'Spread ({ ...obj }) makes a shallow copy; structuredClone(obj) makes a true deep copy.',
          ],
          [
            ['Assuming { ...obj } deeply clones nested arrays and objects', 'Spread only clones top-level keys; nested references remain shared—use structuredClone() for deep copies.'],
            ['Using typeof x === "object" without excluding null', 'Always guard with x !== null && typeof x === "object".'],
          ],
          [
            ['Why does typeof null return "object"?', 'In JavaScript’s original 1995 implementation, values carried a 3-bit type tag where objects were 000 and null was the all-zero pointer, causing typeof to misreport null as "object".'],
            ['What types cannot be cloned by structuredClone()?', 'Functions, DOM nodes, and Symbol properties throw a DataCloneError when passed to structuredClone().'],
          ],
          'What does typeof null evaluate to in JavaScript?',
          ['"object"', '"null"', '"undefined"', '"primitive"'],
          0,
          'Due to a legacy engine representation preserved for web compatibility, typeof null === "object".'
        ),
        L(
          'Strict Equality (===), Object.is() & Type Coercion',
          'Loose equality (==) triggers complex abstract coercion rules (like "" == 0 being true), whereas strict equality (===) compares both type and value with zero implicit conversion.',
          'Two edge cases exist even with ===: NaN === NaN is false, and +0 === -0 is true. Object.is(NaN, NaN) returns true and Object.is(+0, -0) returns false—and React uses Object.is() internally to detect state changes.',
          'Always use === and !==; the only idiomatic exception is x == null to match both null and undefined simultaneously.',
          'Equality Edge Cases',
          `console.log(0 === false);          // false\nconsole.log(NaN === NaN);          // false\nconsole.log(Object.is(NaN, NaN));  // true\nconsole.log(Number.isNaN('abc'));  // false (safer than global isNaN)`,
          'false\nfalse\ntrue\nfalse',
          [
            'Prefer === everywhere to avoid surprising coercion bugs like [] == ![] evaluating to true.',
            'Use Number.isNaN(x) instead of global isNaN(x), which coerces strings like "abc" to NaN.',
            'Object.is() matches === except it treats NaN as equal to NaN and distinguishes +0 from -0.',
          ],
          [
            ['Using global isNaN("hello") expecting false', 'Global isNaN coerces its argument to a number first; use Number.isNaN() which never coerces.'],
            ['Checking x === NaN', 'NaN is never equal to itself under ===; use Number.isNaN(x) or Object.is(x, NaN).'],
          ],
          [
            ['How does Number.isNaN() differ from global isNaN()?', 'Number.isNaN() returns true ONLY if the value is already of type number and equals NaN; global isNaN() coerces non-numbers first, so isNaN("foo") returns true.'],
            ['Why is null == undefined true while null == 0 is false?', 'The Abstract Equality spec explicitly defines null and undefined as loosely equal only to each other and never to numbers or booleans.'],
          ],
          'What does Number.isNaN("hello") return?',
          ['false', 'true', 'NaN', 'Throws a TypeError'],
          0,
          'Number.isNaN does not coerce strings; since "hello" is not a number, it immediately returns false.'
        ),
        L(
          'Truthiness, Short-Circuiting & Nullish Coalescing (??)',
          'JavaScript has exactly 8 falsy values (false, 0, -0, 0n, "", null, undefined, NaN); everything else—including empty arrays [] and empty objects {}—is truthy.',
          'Using logical OR (||) for defaults breaks when valid values are 0, "", or false. Nullish coalescing (??) falls back ONLY when the left side is null or undefined, pairing cleanly with optional chaining (?.).',
          'Use ?? for numeric, boolean, and string defaults (e.g., const port = config.port ?? 3000;).',
          'Nullish Coalescing vs Logical OR',
          `const score = 0;\nconst withOr = score || 100;       // 100 (bug!)\nconst withNullish = score ?? 100;  // 0 (correct!)\n\nconst user = { profile: null };\nconsole.log(withOr, withNullish, user.profile?.name ?? 'Guest');`,
          '100 0 Guest',
          [
            'Empty arrays [] and empty objects {} are TRUTHY in JavaScript.',
            '?? triggers its right-hand fallback strictly for null and undefined (preserving 0, "", false).',
            'Optional chaining (?.) short-circuits to undefined safely on nullish intermediate properties.',
          ],
          [
            ['Writing const count = input.count || 10 when 0 is a valid count', 'Use input.count ?? 10 so 0 is preserved instead of silently replaced with 10.'],
            ['Testing if (arr) to check whether an array is non-empty', '[] is truthy; check arr.length > 0 explicitly.'],
          ],
          [
            ['What are all the falsy values in JavaScript?', 'false, 0, -0, 0n, "", null, undefined, and NaN.'],
            ['Why can’t you mix && or || directly with ?? without parentheses?', 'The spec forbids unparenthesized mixing (e.g. a || b ?? c throws a SyntaxError) to prevent precedence bugs.'],
          ],
          'What does (0 ?? 42) evaluate to?',
          ['0', '42', 'undefined', 'false'],
          0,
          'Nullish coalescing (??) only falls back for null or undefined; 0 is non-nullish and is returned.'
        ),
      ],
      outputQuestions: [
        {
          prompt: 'What does this code print to the console?',
          code: `console.log(Boolean([]), Boolean({}), Boolean('0'), Boolean(''));`,
          options: ['true true true false', 'false false false false', 'false false true false', 'true true false false'],
          correctIndex: 0,
          explanation: 'Empty arrays, empty objects, and non-empty strings like "0" are all truthy; only "" is falsy.',
        },
        {
          prompt: 'What does this code print?',
          code: `console.log(1 + '2' + 3, 1 + 2 + '3');`,
          options: ['"123" "33"', '"123" "123"', '6 6', '"6" "33"'],
          correctIndex: 0,
          explanation: '+ evaluates left-to-right: 1 + "2" becomes "12", then + 3 becomes "123"; whereas 1 + 2 becomes 3, then + "3" becomes "33".',
        },
      ],
    },
    {
      level: 'Beginner',
      title: 'Functions, Parameters & Scope',
      description: 'Master declarations vs expressions, arrow functions, rest/spread, default parameters, and lexical scope.',
      lessons: [
        L(
          'Declarations, Expressions & Function Hoisting',
          'Function declarations are hoisted with their full body, whereas function expressions and arrow functions assigned to const follow TDZ rules.',
          'Because function declarations hoist completely, helper functions can sit cleanly below top-level orchestration logic. Function expressions are ideal for callbacks, closures, and conditional assignment.',
          'Name your function expressions (const retry = function retry() {}) or assign clear const names so stack traces stay readable.',
          'Hoisting Difference in Practice',
          `console.log(add(2, 3)); // 5 — hoisted declaration\nfunction add(a, b) { return a + b; }\n\nconst multiply = (a, b) => a * b;\nconsole.log(multiply(2, 3)); // 6`,
          '5\n6',
          [
            'Function declarations hoist both identifier and body to the top of their enclosing scope.',
            'Arrow functions and function expressions assigned to const/let cannot be called before initialization.',
            'Functions are first-class values: passable as arguments and returnable from other functions.',
          ],
          [
            ['Calling a const arrow function before its definition line', 'Declare const arrow functions before invoking them, or use a function declaration.'],
            ['Declaring named functions inside if blocks in non-strict mode', 'Behavior varies across legacy engines; assign const/let expressions inside blocks instead.'],
          ],
          [
            ['How does hoisting differ between function foo(){} and const foo = () => {}?', 'function foo(){} is fully hoisted and callable anywhere in its scope; const foo is hoisted into the TDZ and throws ReferenceError if called before its line executes.'],
            ['What makes functions "first-class citizens" in JavaScript?', 'They can be stored in variables, passed as callbacks, returned from higher-order functions, and assigned properties just like objects.'],
          ],
          'What happens if you call greet() on line 1 when line 3 is const greet = () => "hi";?',
          ['Throws a ReferenceError', 'Returns "hi"', 'Returns undefined', 'Throws a TypeError: greet is not a function'],
          0,
          'const bindings are in the Temporal Dead Zone before line 3 executes, throwing ReferenceError.'
        ),
        L(
          'Arrow Functions vs Regular Functions',
          'Arrow functions provide concise syntax and lexically inherit this and arguments from their enclosing scope.',
          'Arrow functions cannot be invoked with new (they have no [[Construct]] internal method or prototype property) and ignore call/apply/bind for their this argument—making them ideal for array callbacks and timers, but wrong for object prototype methods that need dynamic this.',
          'Wrap implicit object returns in parentheses: const makeUser = (name) => ({ name });—otherwise braces parse as a function body!',
          'Implicit Object Return & Lexical this',
          `const makePoint = (x, y) => ({ x, y });\nconsole.log(makePoint(3, 4));\n\nconst timer = {\n  seconds: 0,\n  start() {\n    // Arrow inherits 'this' from start()\n    setTimeout(() => console.log(++this.seconds), 10);\n  }\n};`,
          '{ x: 3, y: 4 }',
          [
            'Arrow functions bind this lexically from where they are defined, never from how they are called.',
            'Arrow functions have no own arguments object and cannot be used as constructors with new.',
            'Always parenthesize implicit object literal returns: () => ({ key: val }).',
          ],
          [
            ['Writing const fn = () => { a: 1 } expecting an object return', 'JavaScript parses { a: 1 } as a labeled block returning undefined; wrap as ({ a: 1 }).'],
            ['Using an arrow function as an object method or DOM event listener needing this', 'Use regular method syntax { onClick() {} } when dynamic this is required.'],
          ],
          [
            ['Can you change an arrow function’s this with .bind(obj)?', 'No. Arrow functions have no own this binding; call, apply, and bind ignore the first thisArg parameter.'],
            ['What happens if you call new ArrowFn()?', 'Throws a TypeError because arrow functions are not constructors and lack a prototype property.'],
          ],
          'What does const getObj = () => { value: 42 }; console.log(getObj()); print?',
          ['undefined', '{ value: 42 }', '42', 'Throws a SyntaxError'],
          0,
          'Without parentheses around the braces, value: is parsed as a statement label inside a function body that returns undefined.'
        ),
        L(
          'Default Parameters, Rest & Spread Operators',
          'ES6 default parameters evaluate lazily on every call only when an argument is strictly undefined (not null or 0).',
          'Rest parameters (...args) collect trailing arguments into a real Array (replacing legacy array-like arguments), while spread (...arr) expands any iterable into function calls or array/object literals.',
          'Avoid allocating mutable default objects outside the function; ES6 default parameter expressions like (items = []) safely create a fresh array per call.',
          'Fresh Default Arrays & Rest Aggregation',
          `function sum(label, ...nums) {\n  const total = nums.reduce((acc, n) => acc + n, 0);\n  return \`\${label}: \${total}\`;\n}\nconsole.log(sum('Score', 10, 20, 30));`,
          'Score: 60',
          [
            'Default parameters trigger ONLY on undefined (null passes through as null).',
            'Rest (...args) must be the final parameter and yields a genuine Array.',
            'Default parameter expressions are evaluated fresh on each call, avoiding shared mutable state.',
          ],
          [
            ['Expecting default parameter (x = 5) to trigger when passing null', 'Passing null sets x to null; only undefined (or omitted arguments) activates default parameters.'],
            ['Placing a rest parameter before another parameter (...a, b)', 'Rest must always be the last parameter or JavaScript throws a SyntaxError.'],
          ],
          [
            ['How does ...args differ from the legacy arguments object?', '...args is a true Array supporting map/reduce/filter directly and works in arrow functions, whereas arguments is an array-like object unavailable in arrows.'],
            ['What does function f(a = 1, b = a * 2) return for f(3)?', 'a is 3, and b references earlier parameter a to compute 6.'],
          ],
          'Given function greet(name = "Guest") { return name; }, what does greet(null) return?',
          ['null', '"Guest"', 'undefined', '""'],
          0,
          'Default parameters only activate when the passed argument is strictly undefined, not null.'
        ),
        L(
          'Higher-Order Functions & Pure Function Design',
          'Higher-order functions either accept callbacks as arguments or return newly constructed functions—forming the backbone of array pipelines, debouncing, and middleware.',
          'Pure functions always return the same output for the same inputs without mutating external state, making them trivial to unit-test, memoize, and compose.',
          'Keep core business logic (scoring, filtering, formatting) in pure helper modules decoupled from DOM/React state.',
          'Composing a Reusable Debounce Utility',
          `function debounce(fn, delayMs) {\n  let timerId;\n  return (...args) => {\n    clearTimeout(timerId);\n    timerId = setTimeout(() => fn(...args), delayMs);\n  };\n}\nconst logSearch = debounce((q) => console.log('Query:', q), 200);`,
          undefined,
          [
            'Higher-order functions abstract control patterns (debounce, throttle, memoize, retry).',
            'Pure functions produce deterministic outputs and zero side effects.',
            'Callbacks compose cleanly when data transformations return new values instead of mutating inputs.',
          ],
          [
            ['Mutating input arrays inside helper functions passed to UI components', 'Return new arrays/objects so callers never suffer silent state aliasing bugs.'],
            ['Creating a new debounced function inside every render or event invocation', 'Instantiate debounce once outside the event handler so its timerId closure persists across calls.'],
          ],
          [
            ['What is the difference between debounce and throttle?', 'Debounce delays execution until calls stop for N ms (ideal for search inputs); throttle guarantees execution at most once every N ms while events fire continuously (ideal for scroll/resize).'],
            ['Why are pure functions easier to test and cache?', 'Because output depends exclusively on arguments with no hidden global state, enabling deterministic unit tests and safe memoization.'],
          ],
          'Which pattern delays executing a search API handler until the user stops typing for 300ms?',
          ['Debouncing', 'Throttling', 'Hoisting', 'Currying'],
          0,
          'Debouncing resets a timer on every keystroke and invokes the function only after the quiet delay elapses.'
        ),
      ],
      outputQuestions: [
        {
          prompt: 'What does this snippet output?',
          code: `function test(a = 10, b = a + 5) {\n  console.log(a, b);\n}\ntest(undefined, 2);`,
          options: ['10 2', 'undefined 2', '10 15', 'NaN 2'],
          correctIndex: 0,
          explanation: 'Passing undefined activates the default a = 10, while explicit argument 2 overrides b.',
        },
        {
          prompt: 'What does this code print?',
          code: `const make = (x) => ({ doubled: x * 2 });\nconsole.log(make(6).doubled);`,
          options: ['12', 'undefined', 'Throws TypeError', '{ doubled: 12 }'],
          correctIndex: 0,
          explanation: 'Parenthesizing ({ doubled: x * 2 }) returns the object literal cleanly, so .doubled is 12.',
        },
      ],
    },
    {
      level: 'Beginner',
      title: 'Arrays, Objects & Modern Collections',
      description: 'Master map/filter/reduce, ES2023 immutable array methods, destructuring, and Map/Set.',
      lessons: [
        L(
          'Declarative Array Pipelines: map, filter, reduce, flatMap',
          'Functional array methods transform collections cleanly without manual index loops.',
          'map preserves length (1-to-1 transform), filter selects a subset, flatMap maps and flattens 1 level in a single pass, and reduce folds an array into any shape (sum, lookup map, grouped object). Always pass an initialValue to reduce to prevent TypeErrors on empty arrays.',
          'Avoid calling .sort() on an array you do not own—Array.prototype.sort mutates in place and sorts lexicographically by default!',
          'Safe Reduction & Numeric Sorting',
          `const scores = [100, 25, 80, 9];\nconst ascending = scores.toSorted((a, b) => a - b);\nconst avg = scores.reduce((sum, n) => sum + n, 0) / scores.length;\nconsole.log(ascending, avg);`,
          '[ 9, 25, 80, 100 ] 53.5',
          [
            'Array.prototype.sort() with no comparator sorts numbers as strings ("100" before "25")!',
            'ES2023 toSorted(), toReversed(), toSpliced(), and with() return new arrays without mutating the original.',
            'Always pass an explicit initial value to reduce() so empty arrays never throw.',
          ],
          [
            ['Calling [10, 2, 1].sort() expecting [1, 2, 10]', 'Without a numeric comparator (a, b) => a - b, JS converts elements to strings and yields [1, 10, 2].'],
            ['Using .map() solely for side effects instead of .forEach() or for..of', 'Use map() only when you use its returned transformed array.'],
          ],
          [
            ['What does [10, 2, 1].sort() return and why?', '[1, 10, 2], because default sort converts values to UTF-16 strings and compares lexicographically.'],
            ['How does toSorted() differ from sort()?', 'sort() mutates the array in place and returns the same reference; ES2023 toSorted() returns a brand-new sorted copy leaving the original untouched.'],
          ],
          'What does [10, 2, 1].sort() return in JavaScript?',
          ['[1, 10, 2]', '[1, 2, 10]', '[10, 2, 1]', 'Throws a TypeError'],
          0,
          'Without a comparator callback, Array.prototype.sort converts numbers to strings and compares lexicographically.'
        ),
        L(
          'Destructuring, Computed Keys & Object Utilities',
          'Destructuring unpacks nested objects and arrays concisely with renaming and fallback defaults in one expression.',
          'Object.entries(), Object.fromEntries(), Object.keys(), and ES2024 Object.groupBy() make object-to-array transformations ergonomic and clean.',
          'Use Object.hasOwn(obj, key) (ES2022) instead of obj.hasOwnProperty(key), which crashes on Object.create(null) dictionaries.',
          'Destructuring, Renaming & Object.fromEntries',
          `const raw = { html: 90, css: 85, js: 65 };\nconst passed = Object.fromEntries(\n  Object.entries(raw).filter(([, score]) => score >= 70)\n);\nconst { html: htmlScore, python = 0 } = passed;\nconsole.log(htmlScore, python);`,
          '90 0',
          [
            'Object destructuring supports renaming ({ a: alias }) and defaults ({ b = 10 }).',
            'Object.entries() + Object.fromEntries() lets you map/filter objects using array methods.',
            'Object.hasOwn(obj, prop) is safer than obj.hasOwnProperty(prop).',
          ],
          [
            ['Destructuring from null or undefined without a fallback object', 'Write const { id } = payload ?? {}; to avoid TypeError: Cannot destructure property of null.'],
            ['Calling obj.hasOwnProperty(k) on a null-prototype object', 'Use static Object.hasOwn(obj, k), which works safely on every object.'],
          ],
          [
            ['Why is Object.hasOwn(obj, key) preferred over obj.hasOwnProperty(key)?', 'Objects created with Object.create(null) lack Object.prototype, and malicious objects can shadow hasOwnProperty; static Object.hasOwn() avoids both hazards.'],
            ['What does Object.groupBy(items, fn) return?', 'A null-prototype object grouping array items by the key returned from fn.'],
          ],
          'Which modern static method safely checks whether an object owns a property even if created via Object.create(null)?',
          ['Object.hasOwn(obj, key)', 'obj.hasOwnProperty(key)', 'key in obj', 'Object.owns(obj, key)'],
          0,
          'Object.hasOwn(obj, key) checks own properties directly without relying on Object.prototype.'
        ),
        L(
          'Map, Set, WeakMap & WeakSet',
          'Map and Set provide O(1) average lookup, preserve insertion order, allow any value (including objects) as keys, and avoid prototype key collisions.',
          'WeakMap and WeakSet hold object keys weakly so entries are automatically garbage-collected when the key object is no longer referenced elsewhere—preventing memory leaks in caches and DOM metadata.',
          'Use Set for O(1) membership checks and deduplication ([...new Set(arr)]) instead of repeated O(n) array.includes().',
          'O(1) Deduplication & Frequency Map',
          `const tags = ['sql', 'js', 'sql', 'python', 'js'];\nconst unique = [...new Set(tags)];\nconst freq = new Map();\nfor (const t of tags) freq.set(t, (freq.get(t) ?? 0) + 1);\nconsole.log(unique.length, freq.get('sql'));`,
          '3 2',
          [
            'Map supports non-string keys, has an O(1) .size property, and avoids "__proto__" key collisions.',
            'Set enforces uniqueness using SameValueZero (so NaN equals NaN inside a Set).',
            'WeakMap keys must be objects (or non-registered symbols) and cannot be iterated so GC stays non-observable.',
          ],
          [
            ['Using array.includes() inside a loop over 10,000 items (O(n^2))', 'Convert the lookup list to a Set for O(1) .has() checks.'],
            ['Trying to iterate or read .size on a WeakMap', 'WeakMap is intentionally non-iterable because garbage collection timing is nondeterministic.'],
          ],
          [
            ['When should you choose Map over a plain object {}?', 'When keys are dynamic/untrusted user strings (preventing prototype pollution), when keys are non-strings (objects/numbers), when frequent insertions/deletions occur, or when you need .size directly.'],
            ['Why can’t WeakMap store primitive string keys?', 'Primitives are copied by value and not garbage-collected by object identity, so weak references cannot track their lifetime.'],
          ],
          'Why is WeakMap ideal for attaching private metadata to DOM elements?',
          [
            'Entries are automatically garbage-collected once the DOM element is removed and unreferenced',
            'WeakMap serializes directly to JSON.stringify()',
            'WeakMap supports primitive string keys faster than Map',
            'WeakMap exposes a .size property for leak debugging',
          ],
          0,
          'Weak references allow the GC to reclaim DOM nodes and their associated WeakMap entries automatically.'
        ),
        L(
          'Iteration Protocols: for..of vs for..in',
          'for..of iterates VALUES of any iterable (Array, String, Map, Set, NodeList) via Symbol.iterator, whereas for..in iterates enumerable STRING KEYS including inherited prototype keys!',
          'Never use for..in to iterate arrays: it returns string indices ("0", "1"), skips order guarantees on custom properties, and walks up the prototype chain.',
          'Use for..of for arrays/iterables (supports break, continue, and await cleanly), and Object.entries() with for..of for plain objects.',
          'Iterating Cleanly with for..of',
          `const scores = new Map([['HTML', 95], ['CSS', 88]]);\nfor (const [course, score] of scores) {\n  if (score < 90) continue;\n  console.log(\`\${course}: \${score}%\`);\n}`,
          'HTML: 95%',
          [
            'for..of iterates values of iterables and works seamlessly with async/await and break/continue.',
            'for..in iterates enumerable property keys including inherited prototype properties.',
            'Array.prototype.forEach() CANNOT be exited early with break or return, and does NOT await async callbacks.',
          ],
          [
            ['Using await inside arr.forEach(async (item) => ...)', 'forEach ignores returned promises and fires all iterations concurrently without waiting; use for..of or Promise.all(arr.map(...)).'],
            ['Using for..in on an array', 'Use for..of or standard indexed for loops for arrays.'],
          ],
          [
            ['Why doesn’t await work as expected inside array.forEach()?', 'forEach executes the callback synchronously for every item and discards the returned Promise, so the enclosing async function does not wait for iterations to finish.'],
            ['What makes an object iterable by for..of and spread (...)?', 'Implementing a [Symbol.iterator]() method returning an iterator object with a .next() method yielding { value, done }.'],
          ],
          'What happens if you pass an async callback to items.forEach(async (x) => await save(x))?',
          [
            'forEach does not await the promises—all calls fire without waiting for one another',
            'Each item waits sequentially for the previous save() to finish',
            'JavaScript throws a SyntaxError',
            'forEach returns a single resolved Promise',
          ],
          0,
          'Array.prototype.forEach ignores Promise return values; use for..of for sequential awaits or Promise.all(items.map(...)) for parallel.'
        ),
      ],
      outputQuestions: [
        {
          prompt: 'What does this snippet print?',
          code: `const s = new Set([1, 2, 2, NaN, NaN]);\nconsole.log(s.size);`,
          options: ['3', '4', '5', '2'],
          correctIndex: 0,
          explanation: 'Set uses SameValueZero equality, so duplicate 2 and duplicate NaN are both deduplicated, leaving {1, 2, NaN} (size 3).',
        },
        {
          prompt: 'What does this code output?',
          code: `const arr = [3, 1, 2];\nconst sorted = arr.toSorted((a, b) => a - b);\nconsole.log(arr[0], sorted[0]);`,
          options: ['3 1', '1 1', '3 3', '1 3'],
          correctIndex: 0,
          explanation: 'ES2023 toSorted() leaves the original array untouched (arr[0] === 3) and returns a new sorted array (sorted[0] === 1).',
        },
      ],
    },
    {
      level: 'Beginner',
      title: 'DOM Manipulation & Events',
      description: 'Query elements efficiently, delegate events cleanly, prevent XSS, and observe visibility with IntersectionObserver.',
      lessons: [
        L(
          'Querying, Creating & Batching DOM Updates',
          'Modern DOM APIs (querySelector, closest, append, replaceChildren, DocumentFragment) make dynamic UI updates crisp and fast.',
          'Avoid inserting elements inside tight loops that interleave DOM writes with layout reads (like offsetHeight), which causes forced synchronous reflow ("layout thrashing"). Batch insertions using a DocumentFragment or element.append(...nodes).',
          'Always prefer textContent over innerHTML for dynamic user strings to eliminate XSS risks.',
          'Batching DOM Creation with DocumentFragment',
          `const frag = document.createDocumentFragment();\nfor (const name of ['HTML', 'CSS', 'JS']) {\n  const li = document.createElement('li');\n  li.textContent = name;\n  frag.append(li);\n}\ndocument.querySelector('#course-list').replaceChildren(frag);`,
          undefined,
          [
            'querySelectorAll returns a static NodeList; getElementsByClassName returns a live HTMLCollection.',
            'replaceChildren() clears and inserts new nodes cleanly in one call.',
            'Batching reads before writes avoids forced synchronous layout thrashing.',
          ],
          [
            ['Using innerHTML += "<li>...</li>" inside a loop', 'Each += serializes, destroys, and re-parses the entire container DOM and drops existing event listeners; append nodes via DocumentFragment instead.'],
            ['Interleaving style writes and offsetWidth reads inside a loop', 'Measure all elements first, then apply all style mutations together.'],
          ],
          [
            ['What is the difference between a live HTMLCollection and a static NodeList?', 'A live HTMLCollection (getElementsByTagName) updates automatically when the DOM changes (causing infinite loops if mutating while iterating), whereas querySelectorAll returns a static snapshot NodeList.'],
            ['What is layout thrashing?', 'Repeatedly writing to DOM styles and immediately reading layout geometry (offsetHeight, getBoundingClientRect) inside a loop, forcing the browser to recalculate layout synchronously on every iteration.'],
          ],
          'Which DOM API returns a STATIC snapshot that does not mutate as you modify the document?',
          ['document.querySelectorAll(".item")', 'document.getElementsByClassName("item")', 'document.getElementsByTagName("li")', 'element.children'],
          0,
          'querySelectorAll returns a static NodeList; getElementsBy* and .children return live HTMLCollections.'
        ),
        L(
          'Event Propagation: Capturing, Target, Bubbling & Delegation',
          'DOM events travel in three phases: Capturing (window down to target), Target, and Bubbling (target back up to window).',
          'Event Delegation attaches a SINGLE listener on a parent container and inspects event.target.closest("button[data-id]")—using constant O(1) memory even for 10,000 list rows and automatically handling newly added items.',
          'Know the difference between event.target (the innermost clicked node, e.g., an SVG path) and event.currentTarget (the element holding the listener).',
          'Clean Event Delegation with closest()',
          `document.querySelector('#quiz-list').addEventListener('click', (event) => {\n  const btn = event.target.closest('button[data-answer]');\n  if (!btn) return;\n  console.log('Selected:', btn.dataset.answer);\n});`,
          undefined,
          [
            'event.target is the deepest clicked element; event.currentTarget is the element running the listener.',
            'event.target.closest(selector) handles clicks on nested icons inside buttons reliably.',
            'event.preventDefault() cancels default browser action; event.stopPropagation() stops bubbling.',
          ],
          [
            ['Checking event.target.tagName === "BUTTON" when the button contains an icon <span>', 'Clicking the icon makes event.target the <span>; use event.target.closest("button") instead.'],
            ['Confusing stopPropagation() with preventDefault()', 'stopPropagation stops bubbling up the DOM; preventDefault cancels native browser behavior like form submission or link navigation.'],
          ],
          [
            ['Why is Event Delegation often superior to attaching listeners to every list item?', 'It uses one listener instead of N (saving memory), avoids re-attaching listeners when items are dynamically added, and simplifies cleanup.'],
            ['Which common DOM events do NOT bubble?', 'focus, blur, load, and scroll do not bubble (use focusin/focusout or capture phase { capture: true } instead).'],
          ],
          'Inside a click listener on a <ul>, a user clicks an <i> icon inside a <button>. What is event.target vs event.currentTarget?',
          [
            'event.target is <i>; event.currentTarget is <ul>',
            'event.target is <ul>; event.currentTarget is <i>',
            'Both refer to <button>',
            'Both refer to <ul>',
          ],
          0,
          'event.target is always the deepest originating node; event.currentTarget is the element to which the listener is bound.'
        ),
        L(
          'AbortController for Clean Listener & Fetch Cleanup',
          'Passing { signal: controller.signal } to addEventListener lets you tear down dozens of listeners simultaneously with a single controller.abort() call—no need to keep references to every callback.',
          'The exact same AbortController pattern cancels in-flight fetch() requests when a user types a new search query or navigates away, preventing race conditions where stale responses overwrite newer results.',
          'Always attach an AbortController signal to search-as-you-type fetch calls and component-scoped window listeners.',
          'One-Line Listener & Fetch Teardown',
          `const controller = new AbortController();\nwindow.addEventListener('keydown', (e) => {\n  if (e.key === 'Escape') controller.abort();\n}, { signal: controller.signal });\n\nfetch('/api/courses', { signal: controller.signal }).catch((err) => {\n  if (err.name !== 'AbortError') console.error(err);\n});`,
          undefined,
          [
            'AbortController removes multiple listeners cleanly via one controller.abort() call.',
            'Aborting a fetch rejects with an AbortError—handle it separately from real network errors.',
            'AbortSignal.timeout(5000) creates an automatic 5-second fetch timeout cleanly.',
          ],
          [
            ['Calling removeEventListener with a newly created anonymous arrow function', 'Two arrow functions are distinct references so removeEventListener silently fails; use a named function or AbortController signal.'],
            ['Ignoring race conditions on rapid search input fetch calls', 'Abort the previous request before dispatching the next so slower old responses cannot overwrite fresh results.'],
          ],
          [
            ['Why does addEventListener({ signal }) eliminate common listener memory leaks?', 'You don’t need to store matching callback references or capture flags—calling controller.abort() removes every listener registered with that signal automatically.'],
            ['How do you set a 5-second timeout on fetch() in modern JS?', 'Pass { signal: AbortSignal.timeout(5000) } in the fetch options object.'],
          ],
          'What happens when controller.abort() is called after registering 3 event listeners with { signal: controller.signal }?',
          [
            'All 3 event listeners are automatically removed immediately',
            'Only the first listener is removed',
            'An unhandled exception crashes the script',
            'The listeners pause temporarily until resume() is called',
          ],
          0,
          'Aborting a signal automatically unregisters every event listener attached to it.'
        ),
        L(
          'IntersectionObserver & ResizeObserver',
          'Modern Observer APIs replace expensive scroll and resize polling listeners with asynchronous, browser-optimized callbacks.',
          'IntersectionObserver detects when elements enter the viewport (lazy-loading media, infinite scroll, active table-of-contents highlighting), while ResizeObserver reacts to individual element box size changes cleanly.',
          'Always call observer.disconnect() (or unobserve) when elements unmount to prevent detached DOM leaks.',
          'Lazy Visibility Detection with IntersectionObserver',
          `const observer = new IntersectionObserver((entries, obs) => {\n  for (const entry of entries) {\n    if (entry.isIntersecting) {\n      entry.target.dataset.visible = 'true';\n      obs.unobserve(entry.target);\n    }\n  }\n}, { threshold: 0.25 });`,
          undefined,
          [
            'IntersectionObserver runs off the main scroll path—no getBoundingClientRect() scroll jank.',
            'Always call unobserve() for one-shot reveal or lazy-load triggers.',
            'ResizeObserver observes specific element size changes, not just window resize.',
          ],
          [
            ['Polling getBoundingClientRect() on every window scroll event', 'Replace scroll geometry checks with IntersectionObserver for smooth 60fps scrolling.'],
            ['Forgetting observer.disconnect() in SPA cleanup', 'Disconnect observers on component unmount so removed nodes can be garbage collected.'],
          ],
          [
            ['Why is IntersectionObserver dramatically faster than a scroll event listener?', 'The browser computes intersections asynchronously off the critical scroll thread without forcing synchronous main-thread layout reflows.'],
            ['What does threshold: 0.5 configure in IntersectionObserver?', 'The callback fires when at least 50% of the target element’s bounding box is visible within the root viewport.'],
          ],
          'Which browser API efficiently detects when an element scrolls into view without attaching a scroll event listener?',
          ['IntersectionObserver', 'MutationObserver', 'PerformanceObserver', 'ScrollWatcher'],
          0,
          'IntersectionObserver asynchronously notifies you when targets intersect the viewport or an ancestor scroll root.'
        ),
      ],
      outputQuestions: [
        {
          prompt: 'If a user clicks #btn inside #parent, in what order do the console logs appear?',
          code: `parent.addEventListener('click', () => console.log('P-cap'), { capture: true });\nparent.addEventListener('click', () => console.log('P-bub'));\nbtn.addEventListener('click', () => console.log('Btn'));`,
          options: ['P-cap -> Btn -> P-bub', 'Btn -> P-bub -> P-cap', 'P-bub -> Btn -> P-cap', 'P-cap -> P-bub -> Btn'],
          correctIndex: 0,
          explanation: 'Events flow top-down in capture phase (P-cap), fire at target (Btn), then bubble bottom-up (P-bub).',
        },
        {
          prompt: 'Why does removeEventListener fail to detach the listener in this snippet?',
          code: `btn.addEventListener('click', () => console.log('hi'));\nbtn.removeEventListener('click', () => console.log('hi'));`,
          options: [
            'Each arrow literal creates a different function reference in memory',
            'Arrow functions cannot be removed from DOM nodes',
            'removeEventListener requires a third boolean argument',
            'click events are permanent once bound',
          ],
          correctIndex: 0,
          explanation: 'removeEventListener matches by exact function reference; store the function in a variable or use AbortController.',
        },
      ],
    },
    {
      level: 'Intermediate',
      title: 'Closures, Execution Context & this',
      description: 'Master lexical environments, practical closure patterns, and the 4 rules governing this binding.',
      lessons: [
        L(
          'Lexical Scoping & Closures Under the Hood',
          'A closure is formed whenever a function retains live access to variables from its outer lexical environment even after the outer function has returned.',
          'Closures capture variable BINDINGS (references), not snapshots of values—which is why incrementing a closed-over counter persists across invocations, and why var in loops shared a single binding across callbacks.',
          'Use closures for clean data encapsulation (private state), memoization caches, and factory functions.',
          'Private State Encapsulation via Closure',
          `function createCounter(initial = 0) {\n  let count = initial;\n  return {\n    inc: () => ++count,\n    value: () => count,\n  };\n}\nconst c = createCounter(10);\nconsole.log(c.inc(), c.inc(), c.value());`,
          '11 12 12',
          [
            'Every function carries a hidden [[Environment]] link to its birth lexical scope.',
            'Closures reference live bindings—mutations are visible to all functions sharing that scope.',
            'Be mindful of retaining huge objects unintentionally inside long-lived closures.',
          ],
          [
            ['Assuming closures freeze the value of a variable at function creation time', 'Closures capture the live variable binding; if mutated later, the closure sees the updated value.'],
            ['Creating memory leaks by keeping references to huge DOM arrays inside global event closures', 'Extract only the tiny primitive ID needed before creating long-lived callbacks.'],
          ],
          [
            ['Define a closure in one clear sentence.', 'A closure is the combination of a function and its lexical environment, allowing the function to read and mutate outer variables even after the outer function finishes executing.'],
            ['Why did for (var i = 0; i < 3; i++) setTimeout(() => console.log(i)) print 3, 3, 3?', 'Because var is function-scoped, all three callbacks closed over the exact same i binding whose final value after the loop was 3; using let creates a separate binding per iteration.'],
          ],
          'What does a closure capture from its outer scope?',
          [
            'Live references to outer variable bindings',
            'Immutable deep copies of outer values',
            'Only primitive constants, never objects',
            'Only global window variables',
          ],
          0,
          'Closures maintain live references to their enclosing lexical environment bindings.'
        ),
        L(
          'The 4 Rules of this Binding',
          'For regular (non-arrow) functions, this is determined dynamically at CALL TIME using four precedence rules: new > explicit (call/apply/bind) > implicit (obj.method()) > default (undefined in strict mode).',
          'Extracting a method into a standalone variable (const fn = user.greet; fn();) detaches the implicit object context, causing this to become undefined in strict mode (or window in sloppy mode).',
          'Use ES modules or "use strict" everywhere so accidental unbound this fails loudly as undefined instead of silently corrupting globalThis.',
          'Implicit Loss vs Explicit Binding',
          `'use strict';\nconst learner = {\n  name: 'Nora',\n  greet() { return \`Hi, \${this.name}\`; }\n};\nconst detached = learner.greet;\nconst bound = learner.greet.bind(learner);\nconsole.log(bound()); // "Hi, Nora" (detached() throws TypeError)`,
          'Hi, Nora',
          [
            'Precedence: new > call/apply/bind > obj.fn() > default (undefined in strict mode).',
            'Detaching a method (const f = obj.m) loses implicit this binding.',
            'Arrow functions ignore all 4 rules and inherit this lexically from surrounding code.',
          ],
          [
            ['Passing obj.handleClick directly to addEventListener without binding', 'Inside the DOM callback, this becomes the DOM element instead of obj; bind it or wrap in an arrow () => obj.handleClick().'],
            ['Trying to re-bind an already-bound function with .bind() a second time', 'Once bound via .bind(), a function’s this is permanently locked (except when invoked with new).'],
          ],
          [
            ['Compare call(), apply(), and bind().', 'call(thisArg, a, b) and apply(thisArg, [a, b]) invoke the function immediately with explicit this; bind(thisArg, a) returns a new permanently bound function without invoking it yet.'],
            ['What does this equal inside a standalone function call in an ES module?', 'undefined, because ES modules execute strictly in strict mode by default.'],
          ],
          'Which binding rule has the HIGHEST precedence for a regular JavaScript function?',
          ['new constructor invocation', 'Explicit call/apply/bind', 'Implicit obj.method() call', 'Global default binding'],
          0,
          'new overrides even .bind()—precedence is new > explicit > implicit > default.'
        ),
        L(
          'Memoization & Partial Application with Closures',
          'Closures power practical performance and composition utilities like function memoization and currying.',
          'A memoize wrapper stores previous input-to-output results in a private Map so repeated expensive pure computations return in O(1) time. Pair with a bounded cache size in production so long-running processes never exhaust RAM.',
          'Only memoize pure functions; caching functions that depend on Date.now() or mutable external state causes stale bugs.',
          'Bounded Memoization Factory',
          `function memoize(fn) {\n  const cache = new Map();\n  return (arg) => {\n    if (cache.has(arg)) return cache.get(arg);\n    const result = fn(arg);\n    cache.set(arg, result);\n    return result;\n  };\n}\nconst fastFib = memoize((n) => (n <= 1 ? n : fastFib(n - 1) + fastFib(n - 2)));\nconsole.log(fastFib(40));`,
          '102334155',
          [
            'Memoization trades O(n) memory to collapse exponential repeated subproblems to linear/O(1).',
            'Use a Map inside the closure so cache storage stays completely encapsulated.',
            'Avoid unbounded memo caches on arbitrary user inputs (use LRU eviction if needed).',
          ],
          [
            ['Memoizing with JSON.stringify(args) on objects containing circular references or functions', 'Use primitive keys or nested WeakMaps for object-key memoization.'],
            ['Memoizing an impure function that reads changing server or DOM state', 'Memoize only deterministic pure functions.'],
          ],
          [
            ['What is currying vs partial application?', 'Currying transforms f(a, b, c) into nested unary calls f(a)(b)(c); partial application fixes some arguments upfront to produce a function taking the remaining arguments.'],
            ['Why can unbounded memoization cause memory leaks in Node.js servers?', 'If unique keys keep arriving forever (like user IDs or timestamps), the closure Map grows indefinitely until the V8 heap runs out of memory.'],
          ],
          'Why does a memoized function store its cache inside an enclosing closure instead of a global object?',
          [
            'Encapsulates private cache state per function instance without polluting global scope',
            'Closures automatically persist caches to localStorage',
            'Global objects cannot hold Map instances',
            'Closures bypass garbage collection permanently',
          ],
          0,
          'Closures keep each memoized function’s cache isolated and private.'
        ),
        L(
          'Prototypes, Prototype Chain & Class Syntax',
          'JavaScript classes are clean syntactic sugar over prototypal delegation: every instance links via [[Prototype]] to its constructor’s .prototype object.',
          'When you read obj.toString(), the engine walks obj -> obj’s [[Prototype]] -> Object.prototype -> null. Methods defined inside a class live once on ClassName.prototype (shared across all instances), whereas class fields like onClick = () => {} allocate a fresh copy on every instance.',
          'Use private class fields (#balance) for true runtime encapsulation enforced by the JavaScript engine.',
          'ES2022 Private Class Fields & Prototype Methods',
          `class BankAccount {\n  #balance = 0;\n  constructor(initial) { this.#balance = initial; }\n  deposit(amount) {\n    if (amount <= 0) throw new RangeError('Positive amount required');\n    this.#balance += amount;\n  }\n  get balance() { return this.#balance; }\n}\nconst acct = new BankAccount(100);\nacct.deposit(50);\nconsole.log(acct.balance);`,
          '150',
          [
            'class methods live on ClassName.prototype (shared); arrow class fields live per-instance.',
            'Private fields (#field) cannot be accessed or inspected outside the class body.',
            'Object.getPrototypeOf(x) is the standard replacement for legacy __proto__.',
          ],
          [
            ['Defining arrow methods on classes instantiated 100,000 times', 'Arrow class fields allocate a new function object per instance; prefer prototype methods for high-volume data classes.'],
            ['Mutating built-in Object.prototype or Array.prototype directly', 'Monkey-patching global prototypes breaks third-party libraries and future ECMAScript methods.'],
          ],
          [
            ['Where are regular methods vs arrow class fields stored in memory?', 'Regular class methods live once on Class.prototype and are shared via delegation; arrow class fields are created separately on each instance during construction.'],
            ['What happens if external code tries to read acct.#balance?', 'JavaScript throws a SyntaxError because # private fields are strictly enforced at parse and runtime.'],
          ],
          'Where does a standard method declared inside class User { greet() {} } live?',
          ['On User.prototype (shared by all instances)', 'Copied separately onto every User instance', 'On the global window object', 'Inside User’s private closure only'],
          0,
          'Standard ES6 class methods are placed non-enumerably on Constructor.prototype.'
        ),
      ],
      outputQuestions: [
        {
          prompt: 'What does this loop print after 10ms?',
          code: `for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 10);\n}`,
          options: ['3, 3, 3', '0, 1, 2', '0, 0, 0', 'undefined, undefined, undefined'],
          correctIndex: 0,
          explanation: 'var shares a single function-scoped i across all 3 closures; by the time timers run, the loop has incremented i to 3.',
        },
        {
          prompt: 'What does this snippet output?',
          code: `const obj = {\n  val: 42,\n  regular() { return this.val; },\n  arrow: () => this?.val,\n};\nconsole.log(obj.regular(), obj.arrow());`,
          options: ['42 undefined', '42 42', 'undefined undefined', 'undefined 42'],
          correctIndex: 0,
          explanation: 'regular() uses implicit binding (this === obj -> 42); arrow inherits outer lexical this (not obj -> undefined).',
        },
      ],
    },
    {
      level: 'Intermediate',
      title: 'Asynchronous JS: Promises & Async/Await',
      description: 'Master Promise states, error propagation, async/await concurrency patterns, and Fetch API pitfalls.',
      lessons: [
        L(
          'Promise States, Chaining & Rejection Handling',
          'A Promise represents an eventual completion or failure and transitions irreversibly from pending to either fulfilled or rejected.',
          'Every .then() and .catch() returns a NEW Promise—returning a plain value resolves the next link, returning a Promise adopts its state, and throwing rejects down the chain until a .catch() handles it.',
          'Always return promises inside .then() chains and terminate chains with .catch() (or try/catch in async functions) to avoid unhandled rejections.',
          'Clean Promise Chain with Error Recovery',
          `Promise.resolve(10)\n  .then((n) => n * 2)\n  .then((n) => { if (n > 15) throw new Error('Too high'); return n; })\n  .catch((err) => 0)\n  .then((final) => console.log('Recovered:', final));`,
          'Recovered: 0',
          [
            'A Promise settles at most once; subsequent resolve/reject calls are silently ignored.',
            'Returning a value from .catch() recovers the chain into a fulfilled state.',
            'finally() runs on both fulfillment and rejection without altering the resolved value (unless it throws).',
          ],
          [
            ['Forgetting to return a nested Promise inside .then()', 'Without return, the outer chain resolves immediately to undefined before the inner request finishes.'],
            ['Wrapping an already Promise-returning function in new Promise(...) ("Promise constructor antipattern")', 'Return the existing Promise directly instead of adding redundant wrappers that swallow errors.'],
          ],
          [
            ['What are the three possible states of a Promise?', 'pending, fulfilled, and rejected (fulfilled and rejected are collectively called "settled").'],
            ['What does .finally(() => 999) pass to the next .then()?', 'The original resolved value—finally ignores its own return value unless it throws or returns a rejected Promise.'],
          ],
          'If a .catch() handler returns the string "fallback" without throwing, what state is the returned Promise in?',
          ['Fulfilled with "fallback"', 'Still rejected with the original error', 'Pending forever', 'Fulfilled with undefined'],
          0,
          'Returning normally from .catch() recovers the error and fulfills the downstream Promise with that return value.'
        ),
        L(
          'async/await & Avoiding Sequential Waterfalls',
          'async functions always return a Promise, and await suspends only the current async function (not the browser main thread) until the awaited Promise settles.',
          'A common performance bug is awaiting two independent requests sequentially—doubling latency! Kick off independent promises together with Promise.all() so they run concurrently.',
          'Wrap await calls in try/catch/finally for crisp error handling and loading-state teardown.',
          'Parallel Concurrency vs Sequential Waterfall',
          `async function loadDashboard(userId) {\n  // Runs both fetches concurrently in parallel\n  const [profile, courses] = await Promise.all([\n    fetch(\`/api/users/\${userId}\`).then((r) => r.json()),\n    fetch('/api/courses').then((r) => r.json()),\n  ]);\n  return { profile, courses };\n}`,
          undefined,
          [
            'An async function ALWAYS wraps its return value in a Promise.',
            'Use Promise.all() for independent async work instead of back-to-back awaits.',
            'await pauses only the enclosing async function; other UI events keep running smoothly.',
          ],
          [
            ['Awaiting independent API calls sequentially (await fetchA(); await fetchB();)', 'Launch them in parallel with Promise.all([fetchA(), fetchB()]).'],
            ['Writing return await fn() outside a try/catch vs inside try/catch', 'Inside try/catch you MUST write return await fn() so rejections are caught locally; without await, the rejection bypasses catch!'],
          ],
          [
            ['Why is return await promise() required inside a try/catch block?', 'Without await, the function returns the pending Promise directly and exits the try block before the rejection happens, bypassing the catch block completely.'],
            ['What does async function f() { return 5; } return?', 'A Promise fulfilled with 5.'],
          ],
          'What happens if you write try { return fetchBadUrl(); } catch (e) { handle(e); } WITHOUT await?',
          [
            'The catch block is bypassed and the rejection escapes to the caller',
            'The catch block catches the network error normally',
            'JavaScript throws a SyntaxError',
            'fetchBadUrl runs synchronously',
          ],
          0,
          'Without await inside try, the function returns the Promise immediately before it rejects.'
        ),
        L(
          'Promise Combinators: all, allSettled, race & any',
          'JavaScript offers four static Promise combinators tailored to distinct concurrency and resilience requirements.',
          'Promise.all fails fast on the first rejection; Promise.allSettled waits for every promise and returns { status, value | reason } for each; Promise.race settles on the very first settled promise (win or fail); Promise.any resolves on the first FULFILLMENT and rejects with AggregateError only if ALL fail.',
          'Use Promise.allSettled when loading independent dashboard widgets so one flaky endpoint never blanks the whole page.',
          'Resilient Widget Fetching with Promise.allSettled',
          `const results = await Promise.allSettled([\n  Promise.resolve('HTML loaded'),\n  Promise.reject(new Error('Timeout')),\n]);\nconsole.log(results.map((r) => r.status));`,
          "[ 'fulfilled', 'rejected' ]",
          [
            'Promise.all: all succeed, or fail-fast on first rejection.',
            'Promise.allSettled: never rejects; reports full outcome array for every promise.',
            'Promise.race: first settled (resolved OR rejected); Promise.any: first fulfilled.',
          ],
          [
            ['Using Promise.all when partial failures are acceptable', 'Use Promise.allSettled to render successful panels while showing localized error states for failed ones.'],
            ['Confusing Promise.race with Promise.any when racing mirrors', 'Use Promise.any for fastest healthy mirror (ignores fast 500 errors); use Promise.race for timeouts.'],
          ],
          [
            ['How do Promise.race() and Promise.any() differ if the fastest promise rejects?', 'Promise.race immediately rejects with that error; Promise.any ignores the rejection and keeps waiting for another promise to fulfill (throwing AggregateError only if every promise rejects).'],
            ['What does Promise.all([]) return?', 'A Promise that immediately fulfills with an empty array [].'],
          ],
          'Which Promise combinator waits for all promises to finish regardless of whether some reject, returning an array of status objects?',
          ['Promise.allSettled', 'Promise.all', 'Promise.any', 'Promise.race'],
          0,
          'Promise.allSettled waits for every input promise to settle and returns { status: "fulfilled"|"rejected", ... }.'
        ),
        L(
          'Fetch API Gotchas & Custom Error Classes',
          'Unlike Axios, fetch() ONLY rejects on network failures or aborted requests—an HTTP 404 or 500 response still RESOLVES with response.ok === false!',
          'Always check if (!res.ok) throw new HttpError(res.status, ...) before calling res.json(). Extending Error with custom subclasses and using the ES2022 { cause } option preserves full debugging context.',
          'Create a small reusable fetchJson() wrapper that enforces response.ok, timeouts, and typed error classes.',
          'Safe fetchJson Helper with HTTP Status Guard',
          `class HttpError extends Error {\n  constructor(status, message, options) {\n    super(message, options);\n    this.name = 'HttpError';\n    this.status = status;\n  }\n}\nasync function fetchJson(url) {\n  const res = await fetch(url);\n  if (!res.ok) throw new HttpError(res.status, \`Request failed: \${res.status}\`);\n  return res.json();\n}`,
          undefined,
          [
            'fetch() resolves on HTTP 404 and 500; always verify response.ok before parsing JSON.',
            'A Response body stream can only be consumed once (call res.clone() if needed twice).',
            'Use new Error("Context", { cause: originalErr }) to chain root causes cleanly.',
          ],
          [
            ['Assuming .catch() triggers on an HTTP 500 response from fetch()', 'Check if (!response.ok) explicitly and throw a structured error.'],
            ['Calling response.json() twice on the same Response object', 'Response bodies are single-use ReadableStreams; store the parsed value in a variable.'],
          ],
          [
            ['When does fetch() actually reject its returned Promise?', 'Only on network errors (DNS failure, offline, CORS block) or request cancellation via AbortController—never on HTTP 4xx/5xx status codes.'],
            ['What is the ES2022 Error { cause } option used for?', 'Wrapping low-level errors in higher-level domain errors while preserving the original error object and stack trace on err.cause.'],
          ],
          'What happens when fetch("/missing-endpoint") receives an HTTP 404 Not Found response?',
          [
            'The Promise resolves with a Response whose ok property is false and status is 404',
            'The Promise automatically rejects with an HttpError',
            'The Promise stays pending until timeout',
            'fetch() retries 3 times automatically',
          ],
          0,
          'fetch() treats any received HTTP response—including 404 and 500—as a resolved Promise with response.ok === false.'
        ),
      ],
      outputQuestions: [
        {
          prompt: 'What does this Promise chain print?',
          code: `Promise.reject('E1')\n  .then(() => console.log('A'))\n  .catch((e) => { console.log(e); return 'OK'; })\n  .then((v) => console.log(v));`,
          options: ['E1 then OK', 'A then E1', 'E1 only', 'Unhandled rejection'],
          correctIndex: 0,
          explanation: 'The first .then is skipped; .catch logs "E1" and returns "OK", recovering the chain for the final .then.',
        },
        {
          prompt: 'What does Promise.any([Promise.reject("a"), Promise.resolve("b"), Promise.resolve("c")]) resolve to?',
          code: `Promise.any([\n  Promise.reject('a'),\n  Promise.resolve('b'),\n  Promise.resolve('c'),\n]).then(console.log);`,
          options: ['"b"', '"a"', '["b", "c"]', 'Throws AggregateError'],
          correctIndex: 0,
          explanation: 'Promise.any ignores rejections and resolves with the first fulfilled value ("b").',
        },
      ],
    },
    {
      level: 'Intermediate',
      title: 'Prototypes, Classes & Object Internals',
      description: 'Understand prototype chains, ES6 classes, private fields, property descriptors, and structured cloning.',
      lessons: [
        L(
          'Prototype Chains, Object.create & Property Lookup',
          'JavaScript uses prototypal delegation rather than classical class copying: every object holds an internal [[Prototype]] link walked upward whenever a property is not found directly on the object.',
          'Methods defined on Constructor.prototype are shared by every instance in O(1) memory instead of being duplicated per object. Object.create(null) creates a truly empty dictionary object with no inherited Object.prototype keys.',
          'Prefer Object.hasOwn(obj, key) (ES2022) over obj.hasOwnProperty(key) so dictionary objects created with Object.create(null) never crash.',
          'Inspecting the Prototype Chain & Safe Own Checks',
          `const proto = { greet() { return \`Hi, \${this.name}\`; } };\nconst dev = Object.create(proto);\ndev.name = 'Maya';\nconsole.log(dev.greet(), Object.hasOwn(dev, 'name'), Object.hasOwn(dev, 'greet'));`,
          'Hi, Maya true false',
          [
            'Property lookups traverse obj -> [[Prototype]] -> ... -> Object.prototype -> null.',
            'Object.hasOwn(obj, key) safely checks own properties even on null-prototype objects.',
            'Writing to obj.prop always creates/updates an OWN property without mutating the prototype.',
          ],
          [
            ['Mutating Object.prototype or Array.prototype directly', 'Extending built-in prototypes causes naming collisions with future ECMAScript standards and third-party libraries.'],
            ['Calling obj.hasOwnProperty("k") on an untrusted or Object.create(null) object', 'Use Object.hasOwn(obj, "k") to avoid TypeError or prototype-shadowing exploits.'],
          ],
          [
            ['What happens when you assign instance.sharedProp = 42 if sharedProp exists on the prototype?', 'JavaScript creates a new own property sharedProp = 42 on instance (shadowing the prototype property) rather than mutating the prototype—unless the prototype defines a setter.'],
            ['What is the difference between __proto__ and Function.prototype?', 'Function.prototype is the object assigned as the [[Prototype]] of instances created with new Fn(); __proto__ is a legacy accessor for reading/setting an object’s [[Prototype]] (use Object.getPrototypeOf instead).'],
          ],
          'What does Object.hasOwn(dev, "toString") return for a normal object literal const dev = { name: "Ada" }?',
          ['false (toString is inherited from Object.prototype)', 'true', 'undefined', 'Throws a TypeError'],
          0,
          'Object.hasOwn checks only direct own properties, ignoring inherited prototype methods like toString.'
        ),
        L(
          'ES6 Classes, Private #Fields & Static Members',
          'ES6 classes provide clean, strict-mode syntactic sugar over prototype inheritance while adding true runtime-enforced private fields (#balance), static methods, and extends/super semantics.',
          'Unlike TypeScript private (which disappears at runtime), JavaScript #private fields are genuinely inaccessible outside the class body—even via Object.keys() or Reflect.ownKeys().',
          'Use private #fields to guard internal invariants and always call super() before touching this inside a subclass constructor.',
          'True Encapsulation with #Private Fields',
          `class BankAccount {\n  #balance = 0;\n  constructor(initial) { this.#balance = initial; }\n  deposit(amount) {\n    if (amount <= 0) throw new RangeError('Positive amount required');\n    this.#balance += amount;\n  }\n  get balance() { return this.#balance; }\n}\nconst acc = new BankAccount(100);\nacc.deposit(50);\nconsole.log(acc.balance);`,
          '150',
          [
            'Class bodies automatically execute in strict mode and are NOT hoisted for use before declaration (TDZ).',
            'Private #fields enforce true runtime encapsulation—accessing acc.#balance outside throws a SyntaxError.',
            'Subclass constructors must invoke super() before referencing this.',
          ],
          [
            ['Accessing this before super() in a derived class constructor', 'Derived classes allocate this inside super(); reading this earlier throws ReferenceError.'],
            ['Passing a class method directly as a callback (btn.onclick = acc.deposit) losing this', 'Bind methods or wrap in an arrow function (() => acc.deposit(10)) so this stays bound.'],
          ],
          [
            ['Are JavaScript class declarations hoisted like function declarations?', 'Class declarations are bound in scope but remain in the Temporal Dead Zone until evaluated—instantiating before the class line throws ReferenceError.'],
            ['How do JavaScript #private fields differ from _underscore conventions?', '_balance is still a public enumerable property; #balance is engine-enforced private storage completely hidden from outside access and JSON.stringify.'],
          ],
          'What happens if a subclass constructor references this.name = "A" before calling super()?',
          ['Throws a ReferenceError', 'Sets name on the parent prototype', 'Silently ignores the assignment', 'Creates a global variable name'],
          0,
          'In derived classes, this is uninitialized until super() executes and returns the instance.'
        ),
        L(
          'Property Descriptors, Object.freeze & Shallow vs Deep Cloning',
          'Every JavaScript object property carries hidden descriptor flags: value, writable, enumerable, and configurable (or get/set accessors).',
          'Object.freeze(obj) makes own properties non-writable and non-configurable, but it is SHALLOW—nested objects remain mutable! For true deep clones of data structures (including Date, Map, Set, and circular refs), use native structuredClone().',
          'Use structuredClone(state) instead of JSON.parse(JSON.stringify(state)) so Dates, Sets, Maps, and undefined values are not corrupted.',
          'Deep Cloning with structuredClone vs Shallow Freeze',
          `const original = { tags: new Set(['js', 'web']), created: new Date('2025-01-01') };\nconst clone = structuredClone(original);\nclone.tags.add('ts');\nconsole.log(original.tags.size, clone.tags.size, clone.created instanceof Date);`,
          '2 3 true',
          [
            'Object.freeze() is shallow: nested objects/arrays inside a frozen object can still be mutated.',
            'structuredClone() deep-copies Dates, Maps, Sets, RegExps, ArrayBuffers, and circular references natively.',
            'JSON.parse(JSON.stringify()) silently drops undefined, functions, Symbols, and converts Dates to strings.',
          ],
          [
            ['Assuming Object.freeze({ user: { role: "guest" } }) prevents obj.user.role = "admin"', 'Object.freeze only freezes top-level properties; recursively freeze nested objects if deep immutability is needed.'],
            ['Passing functions or DOM nodes to structuredClone()', 'structuredClone throws DataCloneError on functions and DOM nodes—clone plain data models only.'],
          ],
          [
            ['Why is structuredClone() usually better than JSON.parse(JSON.stringify(obj))?', 'structuredClone preserves Date, Map, Set, RegExp, typed arrays, and circular references without crashing or silently corrupting types.'],
            ['What is the difference between Object.seal() and Object.freeze()?', 'Object.seal prevents adding or deleting properties (configurable: false) while still allowing existing writable values to change; Object.freeze also sets writable: false.'],
          ],
          'What happens if you run const a = Object.freeze({ nested: { x: 1 } }); a.nested.x = 2;?',
          ['a.nested.x becomes 2 because Object.freeze is shallow', 'Throws a TypeError in strict mode', 'a.nested.x stays 1', 'Deletes nested'],
          0,
          'Object.freeze freezes only direct properties on a; the nested object itself is not frozen.'
        ),
        L(
          'Error Hierarchies, Custom Errors & Defensive Validation',
          'Structured error handling separates programmer bugs from recoverable runtime failures using custom Error subclasses with machine-readable error codes and ES2022 { cause } chaining.',
          'Because JavaScript lets anyone throw non-Error values (like strings), always normalize caught values in catch (err) blocks using err instanceof Error before reading err.message or err.stack.',
          'Design domain error classes (ValidationError, AuthError, NetworkError) so callers can branch cleanly with instanceof.',
          'Custom Error Subclass with Cause Chaining',
          `class ApiError extends Error {\n  constructor(message, status, options) {\n    super(message, options);\n    this.name = 'ApiError';\n    this.status = status;\n  }\n}\nconst err = new ApiError('Course load failed', 503, { cause: new Error('Timeout') });\nconsole.log(err.name, err.status, err.cause.message);`,
          'ApiError 503 Timeout',
          [
            'Always extend the built-in Error class so stack traces and instanceof Error work properly.',
            'Set this.name = this.constructor.name for readable logs and telemetry.',
            'Use { cause } to wrap low-level errors without losing original root-cause diagnostics.',
          ],
          [
            ['Writing catch (e) {} empty catch blocks that swallow errors silently', 'At minimum log, rethrow, or surface a clear recovery state so failures never vanish invisibly.'],
            ['Throwing raw strings (throw "failed") instead of Error objects', 'Strings lack stack traces and break instanceof Error checks across error boundaries.'],
          ],
          [
            ['Why should you throw new Error("...") instead of throw "..."?', 'Error instances capture stack traces, support structured properties like .cause, and work consistently with instanceof checks and debugging tools.'],
            ['When does a finally block execute relative to a return inside try?', 'finally ALWAYS executes before the function returns to its caller—even if try or catch executes a return or throw statement.'],
          ],
          'What does function f() { try { return 1; } finally { console.log("done"); } } do when called?',
          ['Logs "done" and then returns 1', 'Returns 1 and skips finally', 'Logs "done" and returns undefined', 'Throws SyntaxError'],
          0,
          'A finally block always runs right before control leaves the try/catch block, preserving the try return value unless finally itself returns.'
        ),
      ],
      outputQuestions: [
        {
          prompt: 'What does this prototype shadowing snippet print?',
          code: `function User(name) { this.name = name; }\nUser.prototype.role = 'student';\nconst u = new User('Sam');\nu.role = 'admin';\ndelete u.role;\nconsole.log(u.role);`,
          options: ['"student"', 'undefined', '"admin"', 'Throws ReferenceError'],
          correctIndex: 0,
          explanation: 'delete u.role removes only the own shadowing property, revealing the inherited prototype property "student" again.',
        },
        {
          prompt: 'What does this try/finally function return?',
          code: `function test() {\n  try { return 'A'; }\n  finally { return 'B'; }\n}\nconsole.log(test());`,
          options: ['"B"', '"A"', 'undefined', 'Throws SyntaxError'],
          correctIndex: 0,
          explanation: 'An explicit return inside finally overrides any pending return value from try or catch.',
        },
      ],
    },
    {
      level: 'Intermediate',
      title: 'Browser Storage, Fetch & Modern Web APIs',
      description: 'Persist client data reliably with Storage & IndexedDB, observe intersections cleanly, and build resilient HTTP clients.',
      lessons: [
        L(
          'localStorage, sessionStorage & Cross-Tab Synchronization',
          'Web Storage provides synchronous key-value string persistence (~5MB per origin): localStorage survives browser restarts while sessionStorage clears when the tab closes.',
          'Because localStorage throws QuotaExceededError when full or SecurityError in restricted iframes/private modes, always wrap reads/writes in try/catch and listen to the window "storage" event to sync state across open tabs.',
          'Design storage behind an async-ready adapter interface so migrating from localStorage to IndexedDB or Supabase later requires zero UI rewrites.',
          'Safe JSON Storage Wrapper with Cross-Tab Sync',
          `function saveState(key, value) {\n  try {\n    localStorage.setItem(key, JSON.stringify(value));\n    return true;\n  } catch {\n    return false;\n  }\n}\nwindow.addEventListener('storage', (e) => {\n  if (e.key === 'it_courses_state') console.log('Synced from another tab');\n});`,
          undefined,
          [
            'Web Storage stores strings only—serialize objects with JSON.stringify and validate on parse.',
            'The window "storage" event fires in OTHER open tabs on the same origin when localStorage changes.',
            'Never store sensitive credentials or unencrypted tokens in localStorage (XSS readable).',
          ],
          [
            ['Assuming localStorage.getItem() never throws or returns corrupted JSON', 'Always guard both storage access and JSON.parse inside try/catch with a clean fallback.'],
            ['Expecting the "storage" event to fire in the SAME tab that called setItem()', 'The native storage event only notifies OTHER tabs/windows on the same origin.'],
          ],
          [
            ['What is the key security risk of storing JWT access tokens in localStorage?', 'Any JavaScript running on the page (including XSS payloads or compromised third-party scripts) can read localStorage directly, whereas HttpOnly cookies are invisible to JS.'],
            ['How does sessionStorage differ from localStorage?', 'sessionStorage is scoped per browser tab/session and cleared when the tab closes; localStorage persists across restarts and is shared across all tabs of the origin.'],
          ],
          'In which tab does the browser fire the window "storage" event when Tab A calls localStorage.setItem("theme", "dark")?',
          ['In other open tabs on the same origin (e.g., Tab B), NOT Tab A', 'Only in Tab A', 'In all open tabs across all domains', 'Only after the page refreshes'],
          0,
          'The storage event notifies sibling tabs on the same origin so they can synchronize state.'
        ),
        L(
          'IntersectionObserver, ResizeObserver & MutationObserver',
          'Modern Observer APIs replace expensive scroll and resize polling loops with asynchronous, browser-scheduled callbacks that never force synchronous layout thrashing.',
          'IntersectionObserver powers lazy loading, infinite scroll, and active table-of-contents highlighting; ResizeObserver tracks individual container dimensions cleanly for responsive charts and canvases.',
          'Always call observer.disconnect() when cleaning up components or routes so observed DOM nodes can be garbage collected.',
          'Lazy-Tracking Active Lesson Section with IntersectionObserver',
          `const observer = new IntersectionObserver(\n  (entries) => {\n    entries.forEach((entry) => {\n      if (entry.isIntersecting) console.log('Visible:', entry.target.id);\n    });\n  },\n  { rootMargin: '-20% 0px -60% 0px', threshold: 0 }\n);\ndocument.querySelectorAll('section[id]').forEach((el) => observer.observe(el));`,
          undefined,
          [
            'IntersectionObserver detects viewport visibility off the hot scroll path with zero layout thrash.',
            'ResizeObserver fires when a specific element’s box size changes—even without a window resize.',
            'Always unobserve() or disconnect() observers on teardown to prevent memory leaks.',
          ],
          [
            ['Polling element.getBoundingClientRect() inside a window scroll listener', 'Reading layout geometry on every scroll frame triggers forced reflows; use IntersectionObserver instead.'],
            ['Forgetting to disconnect observers in single-page app route changes', 'Active observers hold references to DOM subtrees; always call observer.disconnect() on unmount.'],
          ],
          [
            ['Why is IntersectionObserver faster than checking getBoundingClientRect() in a scroll event?', 'IntersectionObserver batches visibility calculations inside the browser’s rendering pipeline asynchronously without forcing synchronous main-thread layout reflows.'],
            ['What is the difference between window "resize" events and ResizeObserver?', 'window resize only fires when the viewport changes; ResizeObserver fires whenever a specific element resizes (e.g., when a sidebar collapses or font size changes).'],
          ],
          'Which browser API efficiently detects when an element enters the viewport without attaching a scroll event listener?',
          ['IntersectionObserver', 'MutationObserver', 'PerformanceObserver', 'ScrollWatcher'],
          0,
          'IntersectionObserver asynchronously notifies your callback whenever target elements cross visibility thresholds.'
        ),
        L(
          'URL, URLSearchParams & History Navigation APIs',
          'The built-in URL and URLSearchParams classes parse, validate, and serialize URLs and query strings safely—eliminating brittle string concatenation and regex bugs.',
          'URLSearchParams automatically percent-encodes special characters (spaces, &, =, Unicode) and supports multi-value parameters via .getAll() and .append().',
          'Use new URL(path, window.location.origin) to construct safe links and keep search/filter state reflected cleanly in query parameters.',
          'Safe Query Parameter Building with URL & URLSearchParams',
          `const url = new URL('/courses', 'https://itcourses.dev');\nurl.searchParams.set('area', 'Backend & Cloud');\nurl.searchParams.set('q', 'C++ & C#');\nconsole.log(url.toString());`,
          'https://itcourses.dev/courses?area=Backend+%26+Cloud&q=C%2B%2B+%26+C%23',
          [
            'URLSearchParams handles percent-encoding automatically so & and + never break query strings.',
            'new URL(input) validates syntax and throws TypeError on malformed URLs.',
            'Check url.protocol against an allowlist (https:, http:) before navigating user-supplied links.',
          ],
          [
            ['Concatenating query strings manually like `?q=${input}` without encodeURIComponent', 'A search for "C# & .NET" breaks parameter parsing; URLSearchParams encodes everything cleanly.'],
            ['Mutating window.location.search directly when you only want to update filters in an SPA', 'Use history.replaceState or router searchParams so the page does not trigger a full reload.'],
          ],
          [
            ['Why does `?q=C#` break if not encoded properly?', 'The # character starts a URL fragment identifier on the client, truncating the query parameter before it ever reaches the server; URLSearchParams encodes it as %23.'],
            ['How does history.pushState differ from history.replaceState?', 'pushState adds a new entry to the browser Back stack, whereas replaceState updates the current entry without adding a Back step (ideal for live search filters).'],
          ],
          'How does URLSearchParams encode the value "C++" when serialized into a query string?',
          ['C%2B%2B', 'C++ (unchanged)', 'C  (two spaces)', 'Throws URIError'],
          0,
          'Because unencoded + represents a space in query strings, URLSearchParams encodes literal + signs as %2B.'
        ),
        L(
          'Intl APIs: Dates, Numbers, Currencies & Relative Time',
          'The built-in ECMAScript Internationalization API (Intl) formats numbers, currencies, dates, plurals, and relative times ("3 days ago") accurately across hundreds of locales with zero bundle bloat.',
          'Intl.DateTimeFormat, Intl.NumberFormat, and Intl.RelativeTimeFormat respect regional calendars, separators, and plural rules automatically—replacing bulky third-party formatting libraries.',
          'Reuse Intl formatter instances (new Intl.NumberFormat(...)) outside hot loops for dramatically faster formatting.',
          'Zero-Dependency Formatting with Intl',
          `const fmtDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' });\nconst fmtRel = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });\nconst fmtPct = new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 0 });\nconsole.log(fmtDate.format(new Date('2026-05-01T00:00:00Z')), fmtRel.format(-1, 'day'), fmtPct.format(0.87));`,
          'May 1, 2026 yesterday 87%',
          [
            'Intl APIs ship natively in every browser and Node.js with zero KB added to your JS bundle.',
            'Intl.RelativeTimeFormat("en", { numeric: "auto" }) outputs natural phrases like "yesterday".',
            'Cache Intl.*Format instances instead of recreating them inside every table row render.',
          ],
          [
            ['Formatting currency with "$" + price.toFixed(2) for international users', 'Currency symbols, decimals, and separators vary globally; use Intl.NumberFormat with style: "currency".'],
            ['Creating new Intl.DateTimeFormat() inside a 5,000-row map loop', 'Instantiate the formatter once outside the loop and call formatter.format(date) repeatedly.'],
          ],
          [
            ['What advantage does Intl.Collator have over simple string comparison (a < b) when sorting names?', 'Intl.Collator sorts accurately according to locale-specific alphabet rules, accents, case folding, and optional numeric order ("Lesson 2" before "Lesson 10").'],
            ['How do you format "Lesson 2" before "Lesson 10" using native JavaScript?', 'Use new Intl.Collator(undefined, { numeric: true }).compare(a, b).'],
          ],
          'Which built-in API sorts ["Lesson 10", "Lesson 2", "Lesson 1"] in natural numeric order with zero dependencies?',
          ['new Intl.Collator(undefined, { numeric: true }).compare', 'Array.prototype.sort() with no arguments', 'JSON.stringify comparison', 'String.prototype.charCodeAt'],
          0,
          'Intl.Collator with { numeric: true } compares embedded numbers numerically instead of lexicographically.'
        ),
      ],
      outputQuestions: [
        {
          prompt: 'What does this URLSearchParams snippet print?',
          code: `const p = new URLSearchParams('a=1&a=2');\nconsole.log(p.get('a'), p.getAll('a').length);`,
          options: ['1 2', '2 2', '[1,2] 1', '1 1'],
          correctIndex: 0,
          explanation: 'get("a") returns the first matching value ("1"), while getAll("a") returns ["1", "2"] of length 2.',
        },
        {
          prompt: 'What does numeric: "auto" produce for format(-1, "day")?',
          code: `const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });\nconsole.log(rtf.format(-1, 'day'));`,
          options: ['"yesterday"', '"1 day ago"', '"-1 day"', '"last day"'],
          correctIndex: 0,
          explanation: 'With numeric: "auto", Intl.RelativeTimeFormat uses natural words like "yesterday" instead of "1 day ago".',
        },
      ],
    },
    {
      level: 'Advanced',
      title: 'The Event Loop & Concurrency Internals',
      description: 'Trace the Call Stack, Web APIs, Microtask Queue, Macrotask Queue, and requestAnimationFrame accurately.',
      lessons: [
        L(
          'Call Stack, Microtasks & Macrotasks Execution Order',
          'JavaScript executes synchronously on a single Call Stack, then drains the ENTIRE Microtask Queue (Promise callbacks, queueMicrotask) before pulling the next single Macrotask (setTimeout, I/O, UI events).',
          'Because every microtask queued during microtask draining ALSO runs before the next macrotask or browser paint, an infinite recursive Promise loop freezes the page completely, whereas recursive setTimeout yields to the browser between ticks.',
          'Always trace interview Event Loop puzzles in 3 passes: 1) Synchronous top-level code (including new Promise executor!), 2) All queued Microtasks, 3) Macrotasks.',
          'Classic Interview Event Loop Trace',
          `console.log('1: sync');\nsetTimeout(() => console.log('2: macrotask'), 0);\nPromise.resolve().then(() => console.log('3: microtask'));\nconsole.log('4: sync');`,
          '1: sync\n4: sync\n3: microtask\n2: macrotask',
          [
            'The executor function passed to new Promise((resolve) => { ... }) runs SYNCHRONOUSLY!',
            'Microtasks (Promise.then, await continuations, queueMicrotask) always run before macrotasks (setTimeout).',
            'Browser rendering/paint happens between macrotasks after microtasks drain.',
          ],
          [
            ['Assuming code inside new Promise((resolve) => console.log("A")) runs asynchronously', 'The Promise constructor callback executes immediately and synchronously; only .then/.catch/.finally callbacks are queued as microtasks.'],
            ['Spawning unbounded recursive microtasks to defer heavy work', 'Use setTimeout or scheduler.yield() to break up long tasks so browser paints are not starved.'],
          ],
          [
            ['Why can a runaway queueMicrotask loop freeze UI rendering while setTimeout(..., 0) does not?', 'The Event Loop drains the microtask queue completely before rendering a frame; macrotasks like setTimeout allow paint cycles between turns.'],
            ['How does await x desugar in terms of the Microtask Queue?', 'Everything before await runs synchronously, and the code after await is scheduled as a microtask continuation once x resolves.'],
          ],
          'In what order do console logs run: sync code, Promise.then(), and setTimeout(..., 0)?',
          [
            'Sync code -> Promise.then() (microtask) -> setTimeout (macrotask)',
            'Sync code -> setTimeout -> Promise.then()',
            'Promise.then() -> sync code -> setTimeout',
            'Order is nondeterministic across browsers',
          ],
          0,
          'Synchronous stack finishes first, then the entire microtask queue drains before the next macrotask runs.'
        ),
        L(
          'requestAnimationFrame, Idle Callbacks & Yielding Long Tasks',
          'A smooth 60fps frame gives the main thread just 16.6ms for JS, style, layout, and paint; tasks exceeding 50ms degrade Interaction to Next Paint (INP).',
          'Schedule visual DOM animation steps inside requestAnimationFrame (synced right before paint), defer non-urgent analytics to requestIdleCallback, and chunk heavy loops by yielding back to the event loop.',
          'Keep event handlers lean so button clicks produce immediate visual feedback well under 100ms.',
          'Chunking Heavy Work Without Blocking Input',
          `async function processInChunks(items, chunkSize = 500) {\n  for (let i = 0; i < items.length; i += chunkSize) {\n    const slice = items.slice(i, i + chunkSize);\n    slice.forEach((item) => item.done = true);\n    await new Promise((r) => setTimeout(r, 0)); // Yield to paint & clicks\n  }\n}`,
          undefined,
          [
            'Long synchronous tasks (>50ms) block user clicks and hurt INP.',
            'requestAnimationFrame synchronizes updates cleanly to display refresh rate.',
            'Yielding via setTimeout(0) or scheduler.yield() lets the browser handle pending input and paints.',
          ],
          [
            ['Running a 400ms synchronous filter/sort inside an input keydown handler', 'Debounce input or offload heavy CPU work to a Web Worker.'],
            ['Using setInterval(fn, 16) for visual animations instead of requestAnimationFrame', 'setInterval drifts out of sync with monitor VSync and wastes battery in background tabs; rAF auto-pauses in hidden tabs.'],
          ],
          [
            ['Why does requestAnimationFrame save battery compared to setInterval?', 'Browsers automatically pause rAF callbacks in background tabs and align execution directly to the display’s VSync refresh rate.'],
            ['What Core Web Vital measures UI responsiveness to clicks and key presses?', 'Interaction to Next Paint (INP), targeting <= 200ms.'],
          ],
          'Why is requestAnimationFrame preferred over setInterval(fn, 16) for smooth DOM or canvas animations?',
          [
            'It syncs with monitor VSync and pauses automatically when the tab is hidden',
            'It runs code on a separate CPU thread automatically',
            'It bypasses the microtask queue',
            'It guarantees exact 16.00ms intervals even under heavy CPU load',
          ],
          0,
          'requestAnimationFrame aligns frames to display refresh cycles and throttles/pauses in background tabs.'
        ),
        L(
          'Web Workers & Off-Main-Thread Architecture',
          'Web Workers run JavaScript in genuine OS background threads with isolated heaps, keeping the UI thread 100% responsive during heavy parsing, search indexing, or cryptography.',
          'Workers have NO access to the DOM or window; they communicate via structured-cloned messages (postMessage) or zero-copy Transferable objects (like ArrayBuffer) that hand off ownership in O(1) time.',
          'Use Transferable ArrayBuffers when passing megabytes of binary/image data to a Worker to avoid expensive copy overhead.',
          'Zero-Copy ArrayBuffer Transfer to a Worker',
          `const worker = new Worker(new URL('./indexer.worker.js', import.meta.url), { type: 'module' });\nconst buffer = new Uint8Array(1024 * 1024).buffer;\n// Transfers ownership in O(1); buffer becomes detached on main thread\nworker.postMessage({ buffer }, [buffer]);`,
          undefined,
          [
            'Web Workers execute on a real background thread with zero DOM access.',
            'postMessage uses structured clone by default; pass Transferables ([buffer]) for zero-copy handoff.',
            'Terminate unneeded workers with worker.terminate() to free OS thread resources.',
          ],
          [
            ['Trying to update document.getElementById inside a Web Worker', 'Compute results in the Worker and postMessage lightweight results back to the main thread to render.'],
            ['Reading a transferred ArrayBuffer on the main thread after postMessage(buf, [buf])', 'Once transferred, the sender’s buffer byteLength becomes 0 (detached).'],
          ],
          [
            ['What happens to an ArrayBuffer on the sender side after transferring it via postMessage(data, [buffer])?', 'Ownership moves in O(1) time and the original buffer becomes detached (byteLength 0), preventing unsafe concurrent memory access.'],
            ['Can Web Workers call fetch() and access IndexedDB?', 'Yes—Workers support fetch, WebSockets, IndexedDB, crypto, and timers, just not DOM or synchronous localStorage.'],
          ],
          'What happens to a Transferable ArrayBuffer on the main thread after worker.postMessage(buf, [buf])?',
          [
            'It is transferred in O(1) and becomes detached (unusable) on the main thread',
            'It is deep-copied so both threads mutate independent copies',
            'Both threads share unsynchronized read/write access',
            'It throws a DataCloneError',
          ],
          0,
          'Transferable objects move ownership instantaneously without copying bytes, detaching the sender’s handle.'
        ),
        L(
          'ES Modules: Live Bindings, Tree-Shaking & Dynamic import()',
          'ES Modules (import/export) are statically analyzable, execute in strict mode once per module URL, and export LIVE read-only bindings rather than static value copies.',
          'Because static imports are parsed before execution, bundlers like Vite/Rollup can tree-shake unused exports cleanly. Dynamic import("./heavy.js") loads chunks lazily on demand (just like course JSON files on IT Courses!).',
          'Avoid side effects at module top level so bundlers can safely tree-shake unused exports.',
          'Dynamic Code-Splitting with import()',
          `export let count = 0;\nexport function increment() { count += 1; } // Importers see updated live value!\n\n// On-demand lazy module loading:\nasync function openPdfExporter() {\n  const { downloadCertificatePdf } = await import('./certificatePdf.js');\n  return downloadCertificatePdf;\n}`,
          undefined,
          [
            'ES Module exports are live bindings: mutations inside the exporting module reflect in importers.',
            'Modules are singletons—evaluated once and cached by URL across all importers.',
            'Static imports enable dead-code elimination (tree-shaking); dynamic import() enables route/feature code splitting.',
          ],
          [
            ['Attempting to reassign an imported binding directly (count = 5)', 'Imported bindings are read-only views; mutate via an exported setter function instead.'],
            ['Barrel index.js files importing heavy side-effectful modules eagerly', 'Keep exports pure and mark "sideEffects": false in package.json for optimal tree-shaking.'],
          ],
          [
            ['How do ES Module exports differ from CommonJS module.exports?', 'ES Modules are statically analyzed (enabling tree-shaking), asynchronous, and expose live read-only bindings; CommonJS require() is synchronous, dynamic, and copies primitive exports by value.'],
            ['What does dynamic import(path) return?', 'A Promise that resolves to the Module Namespace Object containing all named exports and default export.'],
          ],
          'If module A exports let n = 1 and a function inc() { n++; }, what does module B see after calling inc()?',
          ['n is 2 (ES modules export live bindings)', 'n remains 1 (copied at import time)', 'Throws a TypeError inside inc()', 'n becomes undefined'],
          0,
          'ES module exports are live read-only references to the original variable binding.'
        ),
      ],
      outputQuestions: [
        {
          prompt: 'What exact sequence does this code print?',
          code: `console.log('A');\nnew Promise((res) => {\n  console.log('B');\n  res('C');\n}).then((v) => console.log(v));\nsetTimeout(() => console.log('D'), 0);\nconsole.log('E');`,
          options: ['A, B, E, C, D', 'A, E, B, C, D', 'A, B, C, E, D', 'A, E, D, B, C'],
          correctIndex: 0,
          explanation: 'Promise executor runs synchronously (B), then sync E, then microtask C, finally macrotask D.',
        },
        {
          prompt: 'What is printed by this async/await Event Loop puzzle?',
          code: `async function run() {\n  console.log(1);\n  await Promise.resolve();\n  console.log(2);\n}\nrun();\nconsole.log(3);`,
          options: ['1, 3, 2', '1, 2, 3', '3, 1, 2', '1, 2'],
          correctIndex: 0,
          explanation: '1 runs synchronously; await yields and schedules console.log(2) as a microtask, so 3 runs before 2.',
        },
      ],
    },
    {
      level: 'Advanced',
      title: 'Metaprogramming, Generators & Memory',
      description: 'Master Symbols, Iterators, Generators, Proxy/Reflect reactivity, and V8 memory leak prevention.',
      lessons: [
        L(
          'Symbols & Custom Iterable Protocols',
          'Symbols create guaranteed-unique property keys that never collide with string keys and stay invisible to Object.keys() and JSON.stringify().',
          'Well-known symbols like Symbol.iterator, Symbol.asyncIterator, and Symbol.toPrimitive let custom classes integrate seamlessly with for..of, spread (...), and string coercion.',
          'Implement [Symbol.iterator]() on custom collections (like pagination cursors or ranges) so consumers can use native for..of loops.',
          'Custom Iterable Range with Symbol.iterator',
          `class Range {\n  constructor(start, end) { this.start = start; this.end = end; }\n  [Symbol.iterator]() {\n    let cur = this.start, end = this.end;\n    return {\n      next: () => (cur <= end ? { value: cur++, done: false } : { value: undefined, done: true }),\n    };\n  }\n}\nconsole.log([...new Range(1, 4)]);`,
          '[ 1, 2, 3, 4 ]',
          [
            'Every Symbol("id") call produces a globally unique token (Symbol("x") !== Symbol("x")).',
            'Symbol.for("key") uses the global symbol registry so cross-realm code can share a symbol.',
            'Implementing [Symbol.iterator] unlocks for..of, array destructuring, and spread syntax.',
          ],
          [
            ['Expecting Symbol properties to appear in JSON.stringify(obj)', 'JSON.stringify ignores Symbol-keyed properties completely.'],
            ['Assuming Symbol("tag") === Symbol("tag")', 'Each Symbol() is unique; use Symbol.for("tag") only when shared lookup is intentional.'],
          ],
          [
            ['How do you inspect Symbol keys on an object if Object.keys() skips them?', 'Use Object.getOwnPropertySymbols(obj) or Reflect.ownKeys(obj) (which returns both string and symbol own keys).'],
            ['What does Symbol.iterator enable?', 'Any object implementing [Symbol.iterator]() becomes natively consumable by for..of, spread (...), destructuring, Array.from(), and Set/Map constructors.'],
          ],
          'What does Symbol("a") === Symbol("a") evaluate to?',
          ['false', 'true', 'undefined', 'Throws a TypeError'],
          0,
          'Every invocation of Symbol() creates a unique primitive; the string argument is strictly a debug description.'
        ),
        L(
          'Generators (function*) & Async Generators',
          'Generator functions (function*) pause execution at each yield expression and resume lazily on demand via .next(), enabling infinite sequences and pull-based streams with O(1) memory.',
          'Async generators (async function*) combine yield with await, letting you stream paginated API pages effortlessly using for await (const page of fetchPages()).',
          'Prefer generators for lazy pipelines over giant datasets so you never allocate millions of intermediate array elements.',
          'Lazy Infinite ID Generator & Paginated Stream',
          `function* idGenerator(prefix = 'ITC') {\n  let n = 1;\n  while (true) yield \`\${prefix}-\${String(n++).padStart(4, '0')}\`;\n}\nconst ids = idGenerator();\nconsole.log(ids.next().value, ids.next().value);`,
          'ITC-0001 ITC-0002',
          [
            'Calling a generator function returns a suspended Generator object—body code doesn’t run until first .next().',
            'yield pauses execution and returns { value, done: false } cleanly.',
            'async function* pairs with for await...of to consume paginated APIs or Node streams lazily.',
          ],
          [
            ['Calling gen() expecting the body up to the first yield to run immediately', 'A generator starts suspended; you must call .next() (or iterate with for..of) to begin execution.'],
            ['Spreading an infinite generator ([...idGenerator()])', 'Spreading pulls values until done: true, which hangs forever on an infinite generator; take a bounded slice instead.'],
          ],
          [
            ['What is a real-world production use case for async generators?', 'Streaming cursor-paginated database or REST API results lazily—fetching the next page only when the consumer requests more items.'],
            ['What does yield* otherIterable do inside a generator?', 'It delegates iteration directly to another generator or iterable, yielding each of its values cleanly.'],
          ],
          'When you invoke const g = myGenerator(); (before calling g.next()), how much of myGenerator’s body has executed?',
          ['None of it—execution starts suspended until the first g.next()', 'Up to the first yield statement', 'The entire function body', 'Only variable declarations'],
          0,
          'Calling a generator constructs and returns the iterator in a suspended state before line 1 executes.'
        ),
        L(
          'Proxy & Reflect Metaprogramming',
          'A Proxy wraps a target object and intercepts fundamental operations (property reads, writes, deletes, function calls) via handler traps—powering reactive frameworks like Vue 3 and Immer.',
          'Always forward default behavior inside Proxy traps using Reflect (Reflect.get, Reflect.set) rather than raw target[prop], so receiver/getter this-binding and boolean return contracts work accurately.',
          'Remember that Proxy traps require returning true from the set trap in strict mode, otherwise JavaScript throws a TypeError.',
          'Reactive Validation Proxy with Reflect',
          `const state = new Proxy({ score: 0 }, {\n  set(target, prop, value, receiver) {\n    if (prop === 'score' && (typeof value !== 'number' || value < 0 || value > 100)) {\n      throw new RangeError('Score must be 0–100');\n    }\n    return Reflect.set(target, prop, value, receiver);\n  }\n});\nstate.score = 92;\nconsole.log(state.score);`,
          '92',
          [
            'Proxy intercepts get, set, has, deleteProperty, apply, construct, and more.',
            'Pair every Proxy trap with the matching Reflect method to preserve receiver semantics.',
            'Returning false from a set trap in strict mode throws a TypeError.',
          ],
          [
            ['Forgetting to return true (or Reflect.set(...)) in a Proxy set trap', 'Strict mode throws TypeError: "set" on proxy returned falsish.'],
            ['Accessing target[prop] directly instead of Reflect.get(target, prop, receiver) on objects with getters', 'Raw target[prop] binds getter this to target instead of the Proxy, bypassing reactive tracking.'],
          ],
          [
            ['Why is Reflect.get(target, prop, receiver) preferred over target[prop] inside a Proxy get trap?', 'When target has an inherited getter that reads another property via this.x, passing receiver ensures this stays the Proxy so nested reads are also intercepted.'],
            ['Can a Proxy intercept private #classFields directly?', 'Private fields are stored in internal slots on the target; calling methods via a Proxy requires binding method this or avoiding raw #field access on the Proxy receiver.'],
          ],
          'What happens in strict mode if a Proxy set trap mutates the target but forgets to return true?',
          ['Throws a TypeError', 'Silently succeeds', 'Reverts the property change', 'Deletes the property'],
          0,
          'The Proxy set invariant requires returning a truthy boolean (which Reflect.set returns automatically) or strict mode throws TypeError.'
        ),
        L(
          'Garbage Collection, Memory Leaks & Debugging Tools',
          'V8 uses generational mark-and-sweep garbage collection, reclaiming objects no longer reachable from GC roots (global scope, active call stack, live DOM listeners).',
          'The top four JavaScript memory leaks are: (1) forgotten timers/setIntervals, (2) unremoved window/document event listeners, (3) detached DOM trees retained in JS arrays or closures, and (4) unbounded in-memory caches.',
          'Use Chrome DevTools Heap Snapshot comparison (Take Snapshot -> perform action -> Take Snapshot -> filter Detached) to verify zero retained leaks.',
          'Leak-Free Cache with WeakRef / Cleanup Pattern',
          `function mountWidget(el) {\n  const controller = new AbortController();\n  const timer = setInterval(() => { el.dataset.tick = Date.now(); }, 1000);\n  window.addEventListener('resize', () => {}, { signal: controller.signal });\n  return function unmount() {\n    clearInterval(timer);\n    controller.abort();\n  };\n}`,
          undefined,
          [
            'Modern JS GC uses reachability (mark-and-sweep), NOT simple reference counting—so unreachable circular references ARE collected cleanly.',
            'Always pair setInterval, WebSockets, Observers, and window listeners with deterministic teardown.',
            'WeakMap/WeakSet prevent cache entries from keeping removed objects alive.',
          ],
          [
            ['Assuming circular references (a.b = b; b.a = a) always leak in modern JS', 'Mark-and-sweep collects unreachable cycles automatically; leaks happen when something stays reachable from a live root.'],
            ['Storing removed DOM elements inside a module-level array', 'Detached DOM subtrees keep every sibling and parent reference in memory until cleared.'],
          ],
          [
            ['How does mark-and-sweep garbage collection handle circular references?', 'Starting from GC roots, it marks every reachable object and sweeps everything unmarked; an isolated cycle unreachable from roots is cleanly collected.'],
            ['Name three common causes of memory leaks in Single Page Applications.', 'Unremoved window event listeners, active setInterval timers after route unmount, detached DOM references held in closures, and unbounded global Map caches.'],
          ],
          'Does an unreachable circular reference ({ a -> b, b -> a }) cause a memory leak in modern V8 mark-and-sweep GC?',
          [
            'No—mark-and-sweep collects any objects unreachable from GC roots, including cycles',
            'Yes—circular references always leak forever in JavaScript',
            'Only if both objects contain functions',
            'Only inside strict mode',
          ],
          0,
          'Mark-and-sweep checks reachability from roots rather than reference counts, so unreachable cycles are reclaimed.'
        ),
      ],
      outputQuestions: [
        {
          prompt: 'What does this generator code print?',
          code: `function* nums() {\n  yield 10;\n  yield 20;\n  return 30;\n}\nconsole.log([...nums()]);`,
          options: ['[10, 20]', '[10, 20, 30]', '[30]', '[]'],
          correctIndex: 0,
          explanation: 'Spread (...) and for..of collect yielded values and stop when done: true, ignoring the final return value (30).',
        },
        {
          prompt: 'What does this Proxy code print?',
          code: `const p = new Proxy({ a: 1 }, {\n  get(t, k, r) { return k in t ? Reflect.get(t, k, r) : 0; }\n});\nconsole.log(p.a, p.missing);`,
          options: ['1 0', '1 undefined', '0 0', 'Throws ReferenceError'],
          correctIndex: 0,
          explanation: 'Property a exists (returns 1); missing triggers the fallback returning 0.',
        },
      ],
    },
    {
      level: 'Advanced',
      title: 'Functional Programming, Patterns & Immutability',
      description: 'Apply pure functions, composition, memoization, debounce/throttle, and predictable state architecture in vanilla JavaScript.',
      lessons: [
        L(
          'Pure Functions, Immutability & ES2023 Copy-by-Value Methods',
          'A pure function always returns the same output for the same inputs and causes zero observable side effects (no global mutations, network calls, or in-place array edits).',
          'ES2023 introduced non-mutating array counterparts—toSorted(), toReversed(), toSpliced(), and with(index, value)—making immutable state updates clean and fast without accidentally mutating shared arrays.',
          'Keep business calculations (quiz scoring, progress math, filtering) in pure functions so they are trivially unit-testable.',
          'Immutable Array Updates with ES2023 Methods',
          `const scores = [82, 95, 74];\nconst ranked = scores.toSorted((a, b) => b - a);\nconst updated = scores.with(2, 88);\nconsole.log(scores, ranked, updated);`,
          '[ 82, 95, 74 ] [ 95, 82, 74 ] [ 82, 95, 88 ]',
          [
            'Array.prototype.sort() mutates in place; Array.prototype.toSorted() returns a fresh sorted array.',
            'Pure functions are deterministic, cacheable, and trivial to test with node:test.',
            'Immutability eliminates spooky action-at-a-distance bugs in shared application state.',
          ],
          [
            ['Calling scores.sort() directly on a state array in React or a shared store', 'Use scores.toSorted() (or [...scores].sort()) so original state references remain unmutated.'],
            ['Forgetting a numeric comparator in sort/toSorted (default sorts lexicographically: 10 before 2)', 'Always pass (a, b) => a - b for numeric sorting.'],
          ],
          [
            ['Why does [10, 2, 1].toSorted() return [1, 10, 2]?', 'Without a compareFn, JavaScript converts elements to UTF-16 strings and sorts alphabetically ("10" < "2").'],
            ['What makes a function "pure" and why do senior engineers isolate pure logic?', 'Same inputs always yield the same output with zero external side effects, enabling reliable memoization, concurrency safety, and fast deterministic unit tests.'],
          ],
          'Which ES2023 method returns a new array with element at index 1 replaced, without mutating the original array?',
          ['arr.with(1, newValue)', 'arr.splice(1, 1, newValue)', 'arr.set(1, newValue)', 'arr.replace(1, newValue)'],
          0,
          'Array.prototype.with(index, value) returns a shallow copy with the specified index updated immutably.'
        ),
        L(
          'Debounce, Throttle & Rate-Limiting Utilities',
          'Debounce waits until a burst of events stops for N milliseconds before executing once (ideal for search inputs), while throttle guarantees execution at most once every N milliseconds during continuous events (ideal for scroll/resize analytics).',
          'Both utilities rely on closures to hold a timer ID or timestamp across calls, and production versions expose a .cancel() method so pending timers can be cleared on unmount.',
          'Be ready to write both debounce and throttle cleanly from scratch on a whiteboard—they are among the top 5 JavaScript frontend interview coding questions.',
          'Production Debounce with Cancellation Support',
          `function debounce(fn, delayMs) {\n  let timerId;\n  const debounced = (...args) => {\n    clearTimeout(timerId);\n    timerId = setTimeout(() => fn(...args), delayMs);\n  };\n  debounced.cancel = () => clearTimeout(timerId);\n  return debounced;\n}`,
          undefined,
          [
            'Debounce resets its timer on every call and fires once activity pauses.',
            'Throttle enforces a steady maximum invocation cadence during continuous streams.',
            'Expose .cancel() on debounced functions so pending callbacks never fire after navigation.',
          ],
          [
            ['Confusing debounce and throttle on a live scroll progress bar', 'Debounce won’t update until scrolling stops completely; use throttle (or rAF) for smooth ongoing updates.'],
            ['Forgetting to forward arguments (...args) and this context inside wrapper utilities', 'Capture ...args cleanly so event objects or query strings reach the wrapped function intact.'],
          ],
          [
            ['Explain the difference between debounce and throttle with one real example each.', 'Debounce delays execution until calls pause for X ms (e.g., search autocomplete API calls). Throttle runs at most once per X ms window during sustained triggers (e.g., button spam protection or mousemove telemetry).'],
            ['Why is a .cancel() method valuable on a debounced function?', 'If a user navigates away 50ms after typing, canceling prevents a stale callback from firing against an unmounted view.'],
          ],
          'Which utility ensures a search API call runs ONLY after the user stops typing for 300ms?',
          ['Debounce', 'Throttle', 'Memoize', 'Curry'],
          0,
          'Debounce resets the 300ms timer on every keystroke and invokes the function once typing pauses.'
        ),
        L(
          'Function Composition, Currying & Memoization',
          'Function composition chains small single-purpose transformations (pipe(trim, toLower, slugify)) into readable data pipelines, while memoization caches pure function results by input key.',
          'Currying transforms f(a, b) into a => b => f(a, b), enabling clean partial application such as filterByLevel("Advanced") without repeating boilerplate lambdas.',
          'Bound memoization caches (e.g., LRU eviction or WeakMap keys) so long-lived single-page apps never leak unbounded memory.',
          'Clean pipe() & Bounded Memoization',
          `const pipe = (...fns) => (x) => fns.reduce((acc, fn) => fn(acc), x);\nconst slugify = pipe(\n  (s) => s.trim(),\n  (s) => s.toLowerCase(),\n  (s) => s.replace(/[^a-z0-9]+/g, '-')\n);\nconsole.log(slugify('  Modern JS & ES2024! '));`,
          'modern-js-es2024-',
          [
            'pipe() applies functions left-to-right; compose() applies right-to-left.',
            'Memoization only works safely on pure functions whose output depends solely on arguments.',
            'Use Map with a max-size eviction or WeakMap for object arguments to avoid cache memory leaks.',
          ],
          [
            ['Memoizing an impure function that reads Date.now() or Math.random()', 'Caching impure outputs returns stale incorrect results on subsequent calls.'],
            ['Using unbounded plain objects as memoization caches in a server process', 'Unbounded caches grow forever until OOM; enforce a max entry count (LRU) or TTL.'],
          ],
          [
            ['What is the difference between currying and partial application?', 'Currying converts an N-argument function into a sequence of N single-argument functions; partial application fixes some arguments upfront and returns a function taking the remaining ones.'],
            ['When can memoization hurt performance instead of helping?', 'When inputs rarely repeat (low cache hit rate) or serialization overhead of cache keys costs more than recomputing a cheap function.'],
          ],
          'In pipe(f, g, h)(x), in what order are the functions applied to x?',
          ['f first, then g, then h: h(g(f(x)))', 'h first, then g, then f: f(g(h(x)))', 'All three run in parallel', 'Only h(x) runs'],
          0,
          'pipe flows data left-to-right using Array.prototype.reduce, so f runs first and h runs last.'
        ),
        L(
          'Pub/Sub Event Bus & Observable State Architecture',
          'Decoupled frontend architectures communicate through typed Pub/Sub channels or unidirectional state stores (state + action -> newState -> notify subscribers) instead of tangled direct DOM dependencies.',
          'Browsers even include a native EventTarget class you can instantiate directly (`new EventTarget()`) to emit CustomEvents with built-in AbortController unsubscription support.',
          'Always return an unsubscribe function from subscribe() so listeners detach cleanly and never pile up across re-renders.',
          'Minimal Reactive Store with Unsubscribe Teardown',
          `function createStore(initialState) {\n  let state = initialState;\n  const listeners = new Set();\n  return {\n    getState: () => state,\n    setState(updater) {\n      state = typeof updater === 'function' ? updater(state) : updater;\n      listeners.forEach((fn) => fn(state));\n    },\n    subscribe(fn) {\n      listeners.add(fn);\n      return () => listeners.delete(fn);\n    },\n  };\n}`,
          undefined,
          [
            'Using a Set for listeners prevents duplicate subscriptions and supports O(1) deletion.',
            'Returning an unsubscribe thunk from subscribe() makes cleanup ergonomic and leak-free.',
            'Unidirectional updates make debugging and time-travel inspection straightforward.',
          ],
          [
            ['Mutating state properties in place without calling setState()', 'Direct mutations bypass subscriber notifications, leaving the UI out of sync.'],
            ['Forgetting to store and call the unsubscribe callback when a view unmounts', 'Zombie subscribers keep executing on removed views and leak memory.'],
          ],
          [
            ['Why is a Set better than an Array for storing Pub/Sub subscriber callbacks?', 'Set automatically deduplicates identical listeners and removes callbacks in O(1) time via listeners.delete(fn) without index shifting.'],
            ['What native browser class can act as a lightweight zero-dependency event bus?', 'EventTarget—any class can extend EventTarget and dispatch CustomEvent instances with standard addEventListener/removeEventListener support.'],
          ],
          'Why does a well-designed store.subscribe(listener) method return a function?',
          [
            'Calling the returned function unsubscribes that specific listener cleanly on teardown',
            'It re-runs the entire application',
            'It freezes the store state permanently',
            'JavaScript requires all callbacks to return functions',
          ],
          0,
          'Returning a teardown thunk lets callers unsubscribe without retaining separate references to the listener and store.'
        ),
      ],
      outputQuestions: [
        {
          prompt: 'What does this ES2023 immutable array snippet print?',
          code: `const a = [3, 1, 2];\nconst b = a.toSorted((x, y) => x - y);\nconsole.log(a[0], b[0]);`,
          options: ['3 1', '1 1', '3 3', '1 3'],
          correctIndex: 0,
          explanation: 'toSorted() leaves original array a untouched (a[0] is 3) and returns a new sorted array b (b[0] is 1).',
        },
        {
          prompt: 'If a debounced function with 200ms delay is called 5 times in 50ms, how many times does the inner function run?',
          code: `const log = debounce(() => console.log('run'), 200);\nfor (let i = 0; i < 5; i++) log();`,
          options: ['1 time (200ms after the 5th call)', '5 times immediately', '2 times (first and last)', '0 times'],
          correctIndex: 0,
          explanation: 'Each call clears the previous timer; only the final scheduled timer completes once 200ms elapse.',
        },
      ],
    },
    {
      level: 'Advanced',
      title: 'Security, Testing & V8 Engine Performance',
      description: 'Defend against XSS and prototype pollution, write fast deterministic unit tests, and write JIT-friendly JavaScript.',
      lessons: [
        L(
          'Client-Side Security: XSS, Prototype Pollution & Sanitization',
          'Cross-Site Scripting (XSS) occurs whenever untrusted text is parsed as executable HTML/JS, while Prototype Pollution lets malicious JSON keys (__proto__, constructor.prototype) inject properties onto every object in the runtime.',
          'Defend in depth: use textContent instead of innerHTML, enforce a strict Content-Security-Policy (CSP), validate URL schemes (https:/http: only), and guard recursive object merges against __proto__, constructor, and prototype keys.',
          'Never pass user strings into eval(), new Function(), or setTimeout(string)—they execute arbitrary code in your origin.',
          'Prototype-Pollution-Safe Deep Merge Guard',
          `const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);\nfunction safeMerge(target, source) {\n  for (const [k, v] of Object.entries(source)) {\n    if (FORBIDDEN_KEYS.has(k)) continue;\n    if (v && typeof v === 'object' && !Array.isArray(v)) {\n      target[k] = safeMerge(target[k] ?? {}, v);\n    } else {\n      target[k] = v;\n    }\n  }\n  return target;\n}`,
          undefined,
          [
            'Use textContent (or trusted framework escaping) instead of innerHTML for user content.',
            'Block __proto__, constructor, and prototype keys in deep merge/clone utilities.',
            'Use Map instead of plain objects for arbitrary untrusted user-supplied keys.',
          ],
          [
            ['Rendering user-submitted markdown or comments with element.innerHTML = userInput', 'Escape HTML or sanitize with a vetted sanitizer like DOMPurify before inserting HTML.'],
            ['Merging raw JSON.parse(req.body) recursively into a config object without key filtering', 'An attacker sending {"__proto__": {"isAdmin": true}} can pollute Object.prototype across the entire process.'],
          ],
          [
            ['What is Prototype Pollution in JavaScript and how do you prevent it?', 'It happens when unsafe recursive merge/path-setter code writes to __proto__ or constructor.prototype, altering Object.prototype globally. Prevent it by blocking forbidden keys, using Map, or freezing Object.prototype.'],
            ['How does Content-Security-Policy (CSP) mitigate XSS even if an injection bug slips through?', 'A strict CSP without unsafe-inline blocks unauthorized inline scripts and external script origins from executing in the browser.'],
          ],
          'Which three property keys must a recursive JavaScript object merge utility explicitly block to prevent Prototype Pollution?',
          ['__proto__, constructor, and prototype', 'id, key, and value', 'toString, valueOf, and length', 'this, super, and new'],
          0,
          'Writing dynamically to __proto__, constructor, or prototype lets untrusted payloads mutate Object.prototype.'
        ),
        L(
          'V8 Hidden Classes, Inline Caches & JIT-Friendly Code',
          'Modern JS engines like V8 compile hot functions with TurboFan/Maglev JIT compilers using Hidden Classes (Shapes/Maps) and Inline Caches to achieve near-native property access speed.',
          'Initializing object properties in a consistent order with consistent types creates monomorphic call sites (1 hidden class), whereas dynamically deleting properties (`delete obj.x`) or adding keys in varying orders degrades objects to slow dictionary mode.',
          'Initialize all expected fields in constructors/factories (using null/undefined placeholders) instead of adding or deleting keys dynamically.',
          'Monomorphic Object Construction for Fast V8 Shapes',
          `// Fast: consistent property order -> single V8 Hidden Class\nfunction createLesson(id, title, score = null) {\n  return { id, title, score };\n}\n// Prefer setting to undefined/null over delete obj.score on hot objects\nconst l1 = createLesson('l1', 'Intro', 95);\nconst l2 = createLesson('l2', 'Scope');`,
          undefined,
          [
            'Objects created with identical keys in the same order share a single Hidden Class (Shape).',
            'Monomorphic functions (receiving one consistent object shape) optimize dramatically better than megamorphic ones.',
            'Avoid using delete on hot objects—assign null/undefined or use a Map for dynamic key deletion.',
          ],
          [
            ['Using delete obj[key] inside a high-frequency animation or parser loop', 'delete transitions V8 objects to slower hash-table dictionary mode; use Map for dynamic deletions.'],
            ['Prematurely micro-optimizing readable code before profiling with DevTools Performance flamegraphs', 'Always measure real bottlenecks first; algorithmic complexity (O(n²) -> O(n)) beats micro-tweaks 99% of the time.'],
          ],
          [
            ['What is a V8 Hidden Class (Shape) and why does property initialization order matter?', 'V8 assigns a hidden structural descriptor mapping property names to fixed memory offsets. Creating objects with the same keys in the same order lets V8 reuse one Shape and read fields in a single pointer offset.'],
            ['Why is algorithmic Big-O optimization usually more impactful than V8 micro-optimizations?', 'Replacing an O(n²) nested array.find() with an O(1) Map lookup cuts 10,000 items from 100M operations to 10k—orders of magnitude larger than micro-tuning.'],
          ],
          'Why can calling delete obj.prop repeatedly on hot objects slow down V8 property access?',
          [
            'It can break the object’s fast Hidden Class shape and transition it into slower dictionary mode',
            'delete triggers a synchronous garbage collection sweep',
            'delete freezes the entire object',
            'V8 does not support delete in strict mode',
          ],
          0,
          'Deleting arbitrary keys disrupts fixed-offset hidden classes, forcing V8 to fall back to hash-table lookups.'
        ),
        L(
          'Deterministic Unit Testing, Fakes & Async Test Patterns',
          'Reliable JavaScript codebases test pure logic directly with fast unit tests (such as Node’s built-in node:test and node:assert/strict) while injecting clocks, storage adapters, and fetch dependencies cleanly.',
          'Instead of letting tests depend on real wall-clock time or network latency, pass dependencies (now, storage, fetcher) as parameters with sensible defaults so every edge case runs deterministically in milliseconds.',
          'Write tests around observable behavior and edge cases (empty lists, pass-mark boundary 69% vs 70%, corrupted input) rather than private implementation details.',
          'Zero-Dependency Unit Test with node:test',
          `import test from 'node:test';\nimport assert from 'node:assert/strict';\n\nconst isPassed = (score, passMark = 70) => score >= passMark;\n\ntest('passes at exact 70% boundary and fails at 69%', () => {\n  assert.equal(isPassed(70), true);\n  assert.equal(isPassed(69), false);\n});`,
          undefined,
          [
            'Node.js ships a built-in test runner (node:test) and strict assertions (node:assert/strict).',
            'Dependency injection (passing clock/storage) eliminates flaky time-dependent tests.',
            'Test boundary values explicitly (0, 69, 70, 100, empty arrays, invalid input).',
          ],
          [
            ['Writing assertions using loose assert.equal when types matter without strict mode', 'Always import node:assert/strict so === equality is enforced and "70" !== 70.'],
            ['Forgetting to await async assertions inside test callbacks', 'Return or await Promises in async tests so failures are never silently missed after the test finishes.'],
          ],
          [
            ['Why should pure domain logic be decoupled from DOM and UI components?', 'Decoupled pure functions run in milliseconds in Node without a browser, have zero flakiness, and stay reusable across web, mobile, and server code.'],
            ['What makes a test "flaky" and how do you eliminate flakiness?', 'Dependence on real timers, network calls, random values, or shared mutable global state; fix it via dependency injection, isolated fixtures, and deterministic inputs.'],
          ],
          'Why should you import from "node:assert/strict" instead of non-strict "node:assert"?',
          [
            'Strict mode enforces === equality and deepStrictEqual, preventing silent type-coercion false passes',
            'Non-strict assert cannot test strings',
            'Strict mode runs tests in parallel automatically',
            'Non-strict assert is removed in Node 22',
          ],
          0,
          'node:assert/strict avoids JS == coercion traps where 0 == "" or "70" == 70 would falsely pass.'
        ),
        L(
          'Strict Mode, Tooling & Production Bundle Discipline',
          'Production JavaScript ships through strict static analysis (ESLint, TypeScript), module bundling with tree-shaking, source maps for error tracking, and code-splitting by route.',
          'Always inspect bundle composition: loading all 23 courses upfront would bloat initial startup, whereas lazy dynamic import() chunks load only the course the learner opens while keeping First Contentful Paint crisp.',
          'Keep your critical initial JS bundle lean by code-splitting heavy libraries (PDF generators, code editors, syntax highlighters) behind lazy imports.',
          'Lazy Route / Feature Loading Pattern',
          `async function generateCertificate(data) {\n  const [{ jsPDF }, QRCode] = await Promise.all([\n    import('jspdf'),\n    import('qrcode'),\n  ]);\n  const doc = new jsPDF({ orientation: 'landscape' });\n  const qr = await QRCode.toDataURL(data.verifyUrl);\n  doc.addImage(qr, 'PNG', 220, 140, 35, 35);\n  return doc;\n}`,
          undefined,
          [
            'Dynamic import() splits heavy features into separate on-demand JS chunks.',
            'Promise.all([import(...), import(...)]) fetches parallel chunks simultaneously.',
            'ES modules enforce strict mode automatically—catching accidental globals and silent write failures.',
          ],
          [
            ['Statically importing giant libraries (like PDF engines or chart suites) on the landing page', 'Dynamically import heavy features only when the user opens that view or clicks export.'],
            ['Shipping unminified development bundles or raw console.log spam to production', 'Run production builds (vite build) which minify, tree-shake dead code, and content-hash assets for caching.'],
          ],
          [
            ['How does code-splitting with dynamic import() improve Core Web Vitals?', 'It shrinks the initial JS downloaded, parsed, and executed on page load—directly improving LCP, TBT, and INP.'],
            ['Why do production bundlers attach content hashes (app.a3f91c.js) to built filenames?', 'Content hashes allow aggressive immutable browser caching (Cache-Control: max-age=31536000) while guaranteeing instant cache busting whenever code changes.'],
          ],
          'What is the main benefit of loading a PDF generator via await import("jspdf") inside a click handler?',
          [
            'Users who never export a PDF never download or parse the PDF library on initial page load',
            'It makes the PDF file smaller in bytes',
            'It bypasses browser CORS restrictions',
            'It runs jsPDF on the backend automatically',
          ],
          0,
          'Dynamic import() moves heavy optional dependencies out of the critical initial bundle into an on-demand chunk.'
        ),
      ],
      outputQuestions: [
        {
          prompt: 'Which object key allows an unsafe recursive merge to pollute Object.prototype?',
          code: `const payload = JSON.parse('{"__proto__": {"polluted": true}}');`,
          options: ['"__proto__"', '"polluted"', '"JSON"', '"parse"'],
          correctIndex: 0,
          explanation: 'Copying the "__proto__" key into a plain object without filtering mutates Object.prototype unless explicitly blocked.',
        },
        {
          prompt: 'What does dynamic import("./math.js") return?',
          code: `const result = import('./math.js');\nconsole.log(result instanceof Promise);`,
          options: ['true', 'false', 'The default export directly', 'undefined'],
          correctIndex: 0,
          explanation: 'Dynamic import() always returns a Promise that resolves to the module namespace object.',
        },
      ],
    },
  ],
  project: {
    title: 'Zero-Dependency Reactive Task & Pomodoro Engine',
    estimatedHours: 6,
    difficulty: 'Beginner to Advanced',
    brief:
      'Build a modular vanilla ES2024 task board and focus timer using Proxy-based reactive state, Event Delegation, AbortController cleanup, localStorage persistence, debounced search filtering, and a clean immutable reducer layer.',
    requirements: [
      'Implement a Proxy-backed reactive store that notifies subscribers automatically when state updates.',
      'Handle all task list clicks (toggle complete, delete, edit) with a single delegated event listener using event.target.closest().',
      'Implement a reusable debounce() utility for live task search filtering.',
      'Use AbortController to cancel pending async quote fetches and detach window keyboard shortcuts cleanly.',
      'Use ES2023 immutable array helpers (toSorted, filter, map) and persist tasks cleanly to localStorage with safe JSON error handling.',
      'Build an accurate drift-corrected Pomodoro timer using Date.now() deltas and clean teardown.',
    ],
    steps: [
      ['Create Reactive Proxy Store', 'Build store.js wrapping state in a Proxy + Reflect.set that dispatches subscriber callbacks cleanly.'],
      ['Write Pure Task Reducers', 'Implement pure addTask, toggleTask, deleteTask, and filterTasks helpers using immutable array patterns.'],
      ['Build Delegated DOM Renderer', 'Render task rows via DocumentFragment + textContent (zero innerHTML XSS) and bind one delegated listener.'],
      ['Add Debounced Search & Keyboard Shortcuts', 'Wire debounce(render, 150) on the search input and register Ctrl+K shortcut using AbortController.'],
      ['Build Drift-Free Timer', 'Compute remaining milliseconds from targetEndTime - Date.now() instead of trusting setInterval drift.'],
      ['Persist & Verify Edge Cases', 'Load/save safely with try/catch around localStorage and test empty, invalid, and rapid-click states.'],
    ],
    referenceSolution: [
      {
        filename: 'store.js',
        language: 'javascript',
        code: `export function createStore(initialState) {
  const listeners = new Set();
  const proxy = new Proxy(initialState, {
    set(target, prop, value, receiver) {
      const ok = Reflect.set(target, prop, value, receiver);
      if (ok) listeners.forEach((fn) => fn(proxy, prop));
      return ok;
    },
  });
  return {
    state: proxy,
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}

export function debounce(fn, ms = 180) {
  let id;
  return (...args) => {
    clearTimeout(id);
    id = setTimeout(() => fn(...args), ms);
  };
}`,
      },
      {
        filename: 'app.js',
        language: 'javascript',
        code: `import { createStore, debounce } from './store.js';

const STORAGE_KEY = 'vanilla_tasks_v1';
const loadTasks = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'); }
  catch { return []; }
};

const { state, subscribe } = createStore({ tasks: loadTasks(), query: '' });
const listEl = document.getElementById('task-list');
const controller = new AbortController();

function render() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
  const q = state.query.trim().toLowerCase();
  const visible = state.tasks
    .filter((t) => !q || t.title.toLowerCase().includes(q))
    .toSorted((a, b) => Number(a.done) - Number(b.done));

  const frag = document.createDocumentFragment();
  for (const task of visible) {
    const li = document.createElement('li');
    const toggle = document.createElement('button');
    toggle.dataset.action = 'toggle';
    toggle.dataset.id = task.id;
    toggle.textContent = task.done ? '[x] ' + task.title : '[ ] ' + task.title;
    const del = document.createElement('button');
    del.dataset.action = 'delete';
    del.dataset.id = task.id;
    del.textContent = 'Delete';
    li.append(toggle, del);
    frag.append(li);
  }
  listEl.replaceChildren(frag);
}

subscribe(render);

listEl.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const { action, id } = btn.dataset;
  if (action === 'toggle') {
    state.tasks = state.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
  } else if (action === 'delete') {
    state.tasks = state.tasks.filter((t) => t.id !== id);
  }
}, { signal: controller.signal });

document.getElementById('search')?.addEventListener(
  'input',
  debounce((e) => { state.query = e.target.value; }, 150),
  { signal: controller.signal }
);

render();`,
      },
    ],
  },
};

buildAndEmitCourse(jsCourse);
console.log('Emitted course: javascript');
