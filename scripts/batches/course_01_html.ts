import { buildAndEmitCourse, type CompactCourse, type CompactLesson, type CompactSection } from '../curriculumFactory';

function makeLesson(
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
  mcqPrompt: string,
  mcqOptions: [string, string, string, string],
  correctIndex: 0 | 1 | 2 | 3,
  explanation: string
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
    mcq: [{ prompt: mcqPrompt, options: mcqOptions, correctIndex, explanation }],
  };
}

const htmlCourse: CompactCourse = {
  slug: 'html',
  order: 1,
  title: 'HTML',
  shortTitle: 'HTML5',
  area: 'Web',
  tagline: 'Semantic document architecture, accessible forms, media APIs, and modern web standards.',
  description:
    'Master HTML5 from foundational document structure and semantic landmarks through accessible form engineering, responsive media, ARIA patterns, microdata SEO, and native browser elements like dialog and popover.',
  codeLanguage: 'html',
  estimatedHours: 16,
  prerequisites: ['Basic familiarity with a web browser and text editor'],
  whatYoullLearn: [
    'Author valid, accessible HTML5 documents with proper landmark hierarchy',
    'Build keyboard-friendly forms with native Constraint Validation API attributes',
    'Optimize responsive images with srcset, sizes, picture, and lazy loading',
    'Apply WCAG AA semantics, ARIA roles, live regions, and focus management',
    'Use modern native elements including dialog, details, template, and popover',
    'Structure metadata, Open Graph tags, and JSON-LD for search engine indexing',
  ],
  levelSummaries: {
    Beginner: 'Document anatomy, headings, semantic landmarks, links, lists, and core text markup.',
    Intermediate: 'Accessible forms, validation attributes, responsive media, tables, and embedded content.',
    Advanced: 'WAI-ARIA engineering, native interactive dialogs/templates, performance hints, and structured SEO.',
  },
  sections: [
    {
      level: 'Beginner',
      title: 'Document Structure & Metadata',
      description: 'Understand DOCTYPE, character encoding, viewport directives, and how browsers parse HTML into the DOM.',
      lessons: [
        makeLesson(
          'HTML5 Document Boilerplate & DOCTYPE',
          'Every modern HTML document starts with <!DOCTYPE html>, which triggers standards-compliant rendering mode instead of legacy quirks mode.',
          'The root <html> element declares the document language via lang="en", allowing screen readers to select the right pronunciation voice and search engines to index regional content accurately. Inside <head>, metadata configures parsing before body paint.',
          'Place <meta charset="UTF-8"> as the very first element inside <head> so the browser determines encoding within the first 1024 bytes.',
          'Minimal Standards-Mode HTML5 Document',
          `<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>Engineering Handbook</title>\n  </head>\n  <body>\n    <main><h1>Welcome</h1></main>\n  </body>\n</html>`,
          'Renders in Standards Mode with UTF-8 decoding and mobile-responsive viewport scaling.',
          [
            '<!DOCTYPE html> is case-insensitive and prevents browser quirks mode.',
            'Always set the lang attribute on <html> for screen readers and translation tools.',
            'The viewport meta tag ensures CSS pixels match device-independent pixels on mobile.',
          ],
          [
            ['Omitting <!DOCTYPE html> in legacy templates', 'Always place <!DOCTYPE html> on line 1 with zero preceding whitespace or comments.'],
            ['Disabling zoom with user-scalable=no', 'Keep zoom enabled (width=device-width, initial-scale=1.0) to satisfy WCAG accessibility guidelines.'],
          ],
          [
            ['What happens if you omit <!DOCTYPE html>?', 'Browsers fall back to quirks mode, altering box-model sizing, table inheritance, and font scaling for backward compatibility with 1990s pages.'],
            ['Why does <meta charset="UTF-8"> belong near the top of <head>?', 'HTML parsers scan the first 1024 bytes for encoding; placing it early prevents reparsing and mojibake characters.'],
          ],
          'What is the primary purpose of <!DOCTYPE html> at the top of an HTML file?',
          [
            'Instruct the browser to render the page in Standards Mode',
            'Import the latest HTML5 standard library from W3C',
            'Enable JavaScript strict mode globally',
            'Automatically set the page encoding to UTF-8',
          ],
          0,
          '<!DOCTYPE html> switches browsers into Standards Mode so CSS layout and DOM APIs behave consistently.'
        ),
        makeLesson(
          'Head Metadata, Favicons & Resource Hints',
          'The <head> element holds machine-readable metadata, stylesheets, icons, and network hints that shape loading speed and social previews.',
          'Using <link rel="preconnect"> warms up DNS, TCP, and TLS handshakes for critical third-party origins such as font CDNs, while <meta name="description"> supplies concise summaries for search result snippets.',
          'Defer non-critical scripts with defer so HTML parsing is never blocked during initial render.',
          'Head Configuration with Preconnect & Deferred Script',
          `<head>\n  <meta charset="UTF-8" />\n  <title>API Docs — IT Courses</title>\n  <meta name="description" content="Complete REST and GraphQL reference." />\n  <link rel="preconnect" href="https://fonts.googleapis.com" />\n  <link rel="stylesheet" href="/styles/app.css" />\n  <script src="/scripts/app.js" defer></script>\n</head>`,
          undefined,
          [
            'defer downloads scripts in parallel and executes them in document order after HTML parsing completes.',
            'async executes immediately upon download, which can break script dependency order.',
            'Avoid placing visible content elements inside <head>; parsers will prematurely close <head>.',
          ],
          [
            ['Putting blocking <script> tags in <head> without defer or async', 'Add defer (or type="module", which defers by default) so parsing continues uninterrupted.'],
            ['Duplicate <title> elements or missing descriptions', 'Provide one unique, descriptive <title> per route for tabs, bookmarks, and screen readers.'],
          ],
          [
            ['How do defer and async differ on <script> tags?', 'Both download asynchronously without blocking HTML parsing, but defer preserves execution order and runs right before DOMContentLoaded, whereas async executes as soon as download finishes in arbitrary order.'],
            ['When should you use preconnect vs dns-prefetch?', 'Use preconnect for critical origins needed immediately (it completes DNS + TCP + TLS); use dns-prefetch as a lightweight fallback for lower-priority domains.'],
          ],
          'Which script attribute downloads in parallel and executes in document order after HTML parsing finishes?',
          ['defer', 'async', 'nomodule', 'preload'],
          0,
          'defer downloads asynchronously and guarantees ordered execution once the document is parsed.'
        ),
        makeLesson(
          'Block vs Inline Flow & Content Models',
          'HTML5 classifies elements by content models—such as flow content, phrasing content, and heading content—governing valid nesting.',
          'Nesting a block-level flow element like <div> or <p> inside an inline phrasing element like <span> produces invalid markup and unpredictable DOM repair by browsers. Note that HTML5 specifically permits <a> to wrap block elements when it acts as a transparent content model.',
          'Validate nesting rules mentally: paragraphs (<p>) cannot contain nested <p>, <div>, or <ul> elements—the parser auto-closes the outer <p>.',
          'Valid Transparent Anchor vs Auto-Closed Paragraph',
          `<a href="/courses/html" class="card-link">\n  <h2>HTML Track</h2>\n  <p>Learn semantic web standards.</p>\n</a>\n\n<!-- Valid sibling paragraphs -->\n<p>First paragraph of prose.</p>\n<p>Second paragraph of prose.</p>`,
          undefined,
          [
            'HTML5 replaces the old strict block/inline binary with content categories (flow, phrasing, sectioning, interactive).',
            'Interactive elements (<button>, <a>) must never be nested inside each other.',
            'A <p> element automatically closes if the parser encounters another block tag like <div> or <section>.',
          ],
          [
            ['Nesting a <button> inside an <a> tag', 'Choose one interactive element: use <a> for navigation and <button> for in-page actions.'],
            ['Wrapping a <ul> inside a <p> tag', 'Place lists as siblings after </p> because <p> only accepts phrasing content.'],
          ],
          [
            ['Why is nesting <button> inside <a> invalid HTML?', 'Both are interactive content; nesting them creates ambiguous keyboard focus, click propagation bugs, and broken screen reader announcements.'],
            ['What happens when a browser parses <p>Hello<div>World</div></p>?', 'The HTML parser implicitly closes the first <p> before <div>, leaving an empty trailing <p></p> or discarded closing tag in the DOM.'],
          ],
          'Which nesting pattern is INVALID according to the HTML5 specification?',
          [
            '<a href="/go"><button>Click</button></a>',
            '<a href="/go"><div><h2>Card</h2></div></a>',
            '<button type="button"><span>Save</span></button>',
            '<article><header><h2>Post</h2></header></article>',
          ],
          0,
          'Interactive content such as <button> cannot be nested inside another interactive element like <a>.'
        ),
        makeLesson(
          'HTML Parsing, Entities & Whitespace Collapsing',
          'Browsers collapse consecutive spaces, tabs, and newlines in normal flow into a single space while decoding named and numeric character references.',
          'Reserved syntax characters like <, >, and & must be escaped as &lt;, &gt;, and &amp; when displayed literally inside prose or <code> blocks to prevent accidental tag parsing or XSS injection.',
          'Use semantic elements like <pre> and <code> when preserving indentation instead of chaining &nbsp; entities.',
          'Escaping Code Characters & Preserving Whitespace',
          `<p>Use <code>&lt;main&gt;</code> once per document &amp; avoid extra &nbsp; hacks.</p>\n<pre><code>function greet() {\n  return "Hello";\n}</code></pre>`,
          'Use <main> once per document & avoid extra   hacks.',
          [
            'HTML collapses runs of ASCII whitespace into a single space outside <pre> or CSS white-space: pre.',
            'Escape <, >, &, and quotes inside attributes to prevent malformed DOM trees.',
            'UTF-8 eliminates the need for most named entities beyond reserved syntax characters.',
          ],
          [
            ['Using multiple &nbsp; entities for layout spacing', 'Use CSS margin, padding, or gap utilities instead of non-breaking space characters.'],
            ['Writing unescaped < or > inside <code> examples', 'Always encode < as &lt; and > as &gt; so the browser renders text rather than parsing an HTML tag.'],
          ],
          [
            ['Why must & be escaped as &amp; in HTML text and URLs?', 'An unescaped & signals the start of a character entity reference, which can corrupt query strings like ?a=1&copy=2 into ©=2.'],
            ['How does <pre> behave compared to normal <p> elements?', '<pre> preserves both line breaks and consecutive spaces and renders in a monospace font by default.'],
          ],
          'How does a browser render the raw HTML text: <p>Hello     \n   World</p> by default?',
          [
            'Hello World (collapsed to a single space)',
            'Hello followed by five spaces and a newline before World',
            'HelloWorld with all spaces stripped',
            'A syntax error in strict HTML5 mode',
          ],
          0,
          'Standard HTML whitespace collapsing merges consecutive spaces, tabs, and line breaks into a single space.'
        ),
      ],
      outputQuestions: [
        {
          prompt: 'What DOM structure does the browser construct for this HTML snippet?',
          code: `<p>Intro text\n  <div>Inner block</div>\n</p>`,
          options: [
            '<p> is auto-closed before <div>, making them sibling elements',
            '<div> is nested cleanly inside <p>',
            'The browser ignores the <div> tag completely',
            'The page throws a fatal XML parsing error',
          ],
          correctIndex: 0,
          explanation: '<p> only accepts phrasing content, so encountering <div> implicitly closes <p> and inserts <div> as its sibling.',
        },
        {
          prompt: 'What visible text is rendered by this HTML line?',
          code: `<p>Price: &lt; $50 &amp; free&nbsp;shipping</p>`,
          options: [
            'Price: < $50 & free shipping',
            'Price: &lt; $50 &amp; free&nbsp;shipping',
            'Price: $50 free shipping',
            'Price: < $50',
          ],
          correctIndex: 0,
          explanation: '&lt; decodes to <, &amp; decodes to &, and &nbsp; decodes to a non-breaking space.',
        },
      ],
    },
    {
      level: 'Beginner',
      title: 'Semantic Landmarks & Headings',
      description: 'Replace generic div soup with meaningful landmarks that power navigation, reader mode, and assistive technology.',
      lessons: [
        makeLesson(
          'Page Landmarks: header, nav, main, aside, footer',
          'Landmark elements expose the macro layout of a page directly to the browser accessibility tree.',
          'Screen reader users jump directly between landmarks like <main> and <nav> instead of tabbing through dozens of links. Only one visible <main> element should exist per page, and multiple <nav> regions should be distinguished with aria-label.',
          'Avoid wrapping every card in <section> unless it has its own heading; use <div> for purely stylistic layout wrappers.',
          'Semantic Page Landmark Skeleton',
          `<header>\n  <a href="/">IT Courses</a>\n  <nav aria-label="Primary">\n    <a href="/courses">Courses</a>\n    <a href="/practice">Practice</a>\n  </nav>\n</header>\n<main>\n  <article><h1>Semantic HTML</h1></article>\n</main>\n<footer><p>© 2026 IT Courses</p></footer>`,
          undefined,
          [
            'Every page should have a single primary <main> landmark.',
            'Label multiple <nav> elements with aria-label (e.g. "Primary", "Breadcrumb").',
            '<header> and <footer> can also be scoped inside <article> or <section>.',
          ],
          [
            ['Using <div class="header"> and <div class="main"> everywhere', 'Use native <header>, <nav>, <main>, and <footer> landmarks for built-in accessibility roles.'],
            ['Placing <main> inside <header> or <article>', 'Keep <main> as a top-level landmark unique to the document content.'],
          ],
          [
            ['When should you use <article> vs <section>?', 'Use <article> for self-contained content that still makes sense syndicated on its own (blog post, product card); use <section> to group thematically related content with a heading.'],
            ['Why is labeling multiple <nav> landmarks important?', 'Assistive technology lists all navigation landmarks; without distinct aria-label names, users hear "navigation" repeated without context.'],
          ],
          'Which element should appear only once as the dominant content landmark per HTML document?',
          ['<main>', '<section>', '<article>', '<header>'],
          0,
          'A document must not have more than one visible <main> element.'
        ),
        makeLesson(
          'Heading Hierarchy (h1–h6) & Document Outline',
          'Headings create a navigable table of contents for both human scanners and assistive technology users.',
          'Start every page with one clear <h1> describing the primary view, then nest <h2>, <h3>, and <h4> sequentially without skipping levels purely for font size. Style visual size with CSS classes rather than choosing <h4> because it looks smaller.',
          'Check your heading outline during code review: every section heading should nest logically under its parent topic.',
          'Proper Sequential Heading Hierarchy',
          `<main>\n  <h1>PostgreSQL Indexing Guide</h1>\n  <section>\n    <h2>B-Tree Indexes</h2>\n    <h3>Composite Key Ordering</h3>\n  </section>\n  <section>\n    <h2>GIN Indexes</h2>\n  </section>\n</main>`,
          undefined,
          [
            'Never skip heading levels (e.g., jumping from <h1> straight to <h4>) just to shrink text.',
            'Decouple heading semantics (h1–h6) from visual font size using CSS.',
            'Screen reader users rely on heading shortcuts (H key) as their #1 navigation method.',
          ],
          [
            ['Using <h1> for the small navbar logo on every page', 'Use <a> or <span> for the navbar brand and reserve <h1> for the unique main heading of the page.'],
            ['Using bold <p> tags instead of <h2> for section titles', 'Use true heading elements so document outlines and anchor links work properly.'],
          ],
          [
            ['Is having multiple <h1> elements allowed in HTML5?', 'Although early specs proposed an outline algorithm for nested <h1>s, browsers never implemented it; best practice for accessibility and SEO is one <h1> per page with sequential h2–h6 levels.'],
            ['How do you make an <h2> look smaller without breaking semantics?', 'Keep the tag as <h2> and apply a smaller CSS font-size utility class.'],
          ],
          'Why should you avoid jumping directly from <h1> to <h4> in a page outline?',
          [
            'It breaks logical hierarchy for screen readers and assistive navigation',
            'Browsers refuse to render <h4> without an <h3> above it',
            'CSS font-weight stops working on skipped headings',
            'Search engines de-index any page containing an <h4> tag',
          ],
          0,
          'Assistive technologies announce heading depth; skipping levels disorients users navigating by headings.'
        ),
        makeLesson(
          'Inline Text Semantics: strong, em, time, abbr, mark',
          'Inline semantic tags communicate emphasis, machine-readable dates, abbreviations, and highlighted matches beyond raw styling.',
          '<strong> conveys strong importance while <em> conveys vocal stress emphasis—unlike purely stylistic <b> and <i>. The <time datetime="..."> element lets crawlers and calendar tools parse ISO timestamps reliably.',
          'Pair <time> with an ISO 8601 datetime attribute so human-friendly text like "Nov 18" remains machine-readable.',
          'Rich Inline Text Semantics',
          `<p>\n  Published on <time datetime="2026-11-18">November 18, 2026</time>.\n  <strong>Warning:</strong> Always escape <abbr title="HyperText Markup Language">HTML</abbr>\n  in <em>untrusted</em> user input.\n</p>`,
          undefined,
          [
            '<strong> marks high importance; <em> marks stress emphasis that changes sentence meaning.',
            '<time datetime="YYYY-MM-DD"> bridges human readability and machine parsing.',
            '<mark> highlights search query matches or relevant reference passages.',
          ],
          [
            ['Using <b> and <i> for warnings or key terms', 'Use <strong> for critical warnings and <em> for emphasis; reserve <b>/<i> for stylistic offset only.'],
            ['Writing human text inside datetime="Nov 18"', 'Always use valid ISO 8601 format like datetime="2026-11-18" in the datetime attribute.'],
          ],
          [
            ['What is the semantic difference between <strong> and <b>?', '<strong> indicates importance or urgency (conveyed semantically), while <b> merely draws visual attention (like keywords in a summary) without extra importance.'],
            ['When is <mark> preferred over <strong>?', 'Use <mark> when highlighting text relevant to the user’s current context (such as search matches), not intrinsic authorial importance.'],
          ],
          'Which element provides both human-readable text and a machine-parseable ISO timestamp?',
          ['<time datetime="2026-11-18">', '<date value="2026-11-18">', '<span data-iso="2026-11-18">', '<meta time="2026-11-18">'],
          0,
          '<time> with an ISO datetime attribute exposes structured temporal data to browsers and search engines.'
        ),
        makeLesson(
          'Figures, Quotations & Code Annotations',
          'Use <figure>, <figcaption>, <blockquote>, <cite>, <kbd>, and <samp> to annotate technical documentation cleanly.',
          '<figure> associates self-contained diagrams, code listings, or charts with a descriptive <figcaption>. For technical tutorials, <kbd> denotes keyboard input and <samp> denotes program output.',
          'Place the cite attribute on <blockquote> for machine-readable source URLs and wrap visible work titles in <cite>.',
          'Technical Documentation Figure & Quotation',
          `<figure>\n  <pre><code>npm run build</code></pre>\n  <figcaption>Run <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop the server; output shows <samp>dist/ ready</samp>.</figcaption>\n</figure>\n<blockquote cite="https://www.w3.org/TR/html52/">\n  <p>Semantic markup improves interoperability across devices.</p>\n</blockquote>`,
          undefined,
          [
            '<figure> is not limited to images—it can wrap code blocks, tables, or SVG charts.',
            '<figcaption> must be the first or last child inside <figure>.',
            '<kbd> represents user keyboard input; <samp> represents system output.',
          ],
          [
            ['Putting <figcaption> outside <figure>', 'Always place <figcaption> directly inside <figure> as its first or last child.'],
            ['Using <blockquote> just to indent text visually', 'Use CSS padding/margin for indentation; reserve <blockquote> strictly for quoted external content.'],
          ],
          [
            ['Can a <figure> contain a code snippet or table?', 'Yes. Any self-contained content referenced from the main flow—diagrams, code blocks, quotes, or tables—belongs in <figure>.'],
            ['What does <kbd> signify in HTML?', 'It represents user input such as keyboard shortcuts, voice commands, or terminal keystrokes.'],
          ],
          'Where must a <figcaption> element be placed to be valid HTML5?',
          [
            'As the first or last direct child of a <figure> element',
            'Immediately after any <img> element anywhere in the DOM',
            'Inside the <head> alongside image metadata',
            'Wrapped inside a <p> element below a <figure>',
          ],
          0,
          'The HTML spec requires <figcaption> to be either the first or last child of its parent <figure>.'
        ),
      ],
      outputQuestions: [
        {
          prompt: 'How many distinct navigation landmarks with accessible names are exposed by this markup?',
          code: `<header>\n  <nav aria-label="Main Menu"><a href="/">Home</a></nav>\n</header>\n<footer>\n  <nav aria-label="Footer Links"><a href="/about">About</a></nav>\n</footer>`,
          options: ['2 named navigation landmarks', '1 navigation landmark (footer nav is ignored)', '0 landmarks because role="navigation" is missing', '4 landmarks (one per anchor)'],
          correctIndex: 0,
          explanation: 'Each <nav> natively maps to role="navigation", and both provide distinct aria-label names.',
        },
        {
          prompt: 'Which element in this snippet represents keyboard input by the user?',
          code: `<p>Press <kbd>Enter</kbd> to run <code>npm test</code> and see <samp>PASS</samp>.</p>`,
          options: ['<kbd>Enter</kbd>', '<code>npm test</code>', '<samp>PASS</samp>', '<p>'],
          correctIndex: 0,
          explanation: '<kbd> represents user keyboard input, <code> marks code text, and <samp> marks sample program output.',
        },
      ],
    },
    {
      level: 'Beginner',
      title: 'Links, Navigation & Lists',
      description: 'Master relative vs root-relative URLs, secure external links, download links, and structured list types.',
      lessons: [
        makeLesson(
          'Hyperlinks, Target Security & Fragment Navigation',
          'Anchor elements connect documents, jump to in-page IDs, initiate downloads, and trigger mailto or tel schemes.',
          'Opening external links in a new tab with target="_blank" should include rel="noopener noreferrer" (modern browsers default to noopener, but explicit attributes protect older environments and control referrer leakage).',
          'Write descriptive link text ("Read the PostgreSQL syllabus") instead of generic "Click here" so screen reader link lists make sense out of context.',
          'Secure External Links & In-Page Anchors',
          `<a href="#syllabus">Jump to syllabus</a>\n<a href="https://developer.mozilla.org" target="_blank" rel="noopener noreferrer">\n  MDN HTML Reference\n</a>\n<a href="/files/cheatsheet.pdf" download="html-cheatsheet.pdf">\n  Download PDF Cheatsheet\n</a>`,
          undefined,
          [
            'rel="noopener" prevents the opened tab from accessing window.opener (reverse tabnabbing).',
            'The download attribute only works cleanly for same-origin URLs or blob/data URLs.',
            'Fragment links (#section-id) scroll to and focus the element with matching id.',
          ],
          [
            ['Using <span onclick="..."> for page navigation', 'Always use <a href="..."> so right-click, open-in-new-tab, and keyboard Enter work natively.'],
            ['Writing "Click here" or "Read more" for every link', 'Include the link destination in the anchor text for accessibility and SEO clarity.'],
          ],
          [
            ['Why is rel="noopener" paired with target="_blank"?', 'It severs the window.opener reference so an external page cannot redirect the originating tab to a phishing page.'],
            ['When is the download attribute ignored by browsers?', 'When pointing to a cross-origin resource without matching Content-Disposition headers, browsers navigate instead of forcing a download for security.'],
          ],
          'Which rel value prevents a newly opened tab from manipulating window.opener?',
          ['noopener', 'nofollow', 'canonical', 'alternate'],
          0,
          'rel="noopener" sets window.opener to null in the new browsing context, blocking reverse tabnabbing.'
        ),
        makeLesson(
          'Ordered, Unordered & Description Lists',
          'HTML provides three list types: <ul> for unordered collections, <ol> for sequential steps, and <dl> for key-value term definitions.',
          'Description lists (<dl> with <dt> terms and <dd> definitions) are ideal for glossaries, metadata specs, and FAQ pairs. Ordered lists support start, reversed, and type attributes for custom numbering.',
          'Only <li> elements are valid direct children of <ul> and <ol>; place nested lists inside an <li>, never directly inside the parent <ul>.',
          'Ordered Steps & Key-Value Description List',
          `<ol start="3" reversed>\n  <li>Deploy build</li>\n  <li>Run tests</li>\n  <li>Write code</li>\n</ol>\n\n<dl>\n  <dt>HTTP 201</dt>\n  <dd>Resource created successfully.</dd>\n  <dt>HTTP 409</dt>\n  <dd>Conflict with current server state.</dd>\n</dl>`,
          '3. Deploy build  2. Run tests  1. Write code',
          [
            'Use <ol> when sequence order changes meaning (steps, rankings); use <ul> otherwise.',
            '<dl> pairs one or more <dt> terms with one or more <dd> descriptions.',
            'Nested lists must live inside an <li> of the outer list.',
          ],
          [
            ['Placing a <ul> directly inside another <ul> instead of inside an <li>', 'Close nested lists inside the parent <li> before starting the next <li>.'],
            ['Using <div> stacks for glossary key-value pairs', 'Use <dl>, <dt>, and <dd> to convey term-definition relationships semantically.'],
          ],
          [
            ['What direct child elements are allowed inside <ul> and <ol>?', 'Strictly <li> (and script-supporting elements like <template>); headings or nested lists must sit inside an <li>.'],
            ['Can a single <dt> have multiple <dd> descriptions?', 'Yes, HTML allows multiple <dt> terms to share a <dd>, or one <dt> to have multiple <dd> values.'],
          ],
          'Which HTML element group is specifically designed for key-value metadata or glossary terms?',
          ['<dl>, <dt>, and <dd>', '<ul> and <li>', '<menu> and <item>', '<list> and <def>'],
          0,
          '<dl> (description list) pairs <dt> (term) with <dd> (description).'
        ),
        makeLesson(
          'Breadcrumb & Skip Navigation Patterns',
          'Accessible navigation includes a visually hidden skip link at the top of <body> and structured breadcrumb trails on nested pages.',
          'A skip link lets keyboard-only users bypass repeated header links on every page load and land directly on <main id="main-content">. Breadcrumbs use <nav aria-label="Breadcrumb"> with an <ol> and aria-current="page" on the final item.',
          'Always apply aria-current="page" to the active navigation link so screen readers announce the user’s current location.',
          'Skip Link & Accessible Breadcrumb Trail',
          `<a href="#main-content" class="sr-only focus:not-sr-only">Skip to main content</a>\n<nav aria-label="Breadcrumb">\n  <ol>\n    <li><a href="/">Home</a></li>\n    <li><a href="/courses">Courses</a></li>\n    <li><a href="/courses/html" aria-current="page">HTML</a></li>\n  </ol>\n</nav>`,
          undefined,
          [
            'Skip links are the first focusable element inside <body> and become visible on :focus.',
            'Breadcrumbs use <ol> because hierarchy order matters.',
            'aria-current="page" announces the current route in nav bars and breadcrumbs.',
          ],
          [
            ['Using display: none on skip links', 'Use visually-hidden (sr-only) CSS that reveals on :focus; display: none removes the link from Tab order completely.'],
            ['Using <ul> instead of <ol> for breadcrumbs', 'Use <ol> to reflect the ordered parent-to-child path.'],
          ],
          [
            ['What does aria-current="page" communicate?', 'It tells assistive technology which link inside a set represents the currently displayed page.'],
            ['Why shouldn’t skip links use display: none?', 'Elements with display: none are non-focusable and excluded from the accessibility tree, making them unreachable by keyboard.'],
          ],
          'Which attribute marks the active item inside a navigation menu or breadcrumb?',
          ['aria-current="page"', 'data-active="true"', 'aria-selected="page"', 'role="current"'],
          0,
          'aria-current="page" is the standard WAI-ARIA attribute for indicating the current page in navigation.'
        ),
        makeLesson(
          'Relative Paths, Base URLs & Fragment IDs',
          'Understanding relative (./, ../), root-relative (/courses), and absolute URLs prevents broken assets across nested routes.',
          'In Single Page Applications with nested routes like /courses/html/lesson/1, a relative path like images/logo.png resolves relative to /courses/html/lesson/ and breaks; root-relative /images/logo.png always resolves from the domain root.',
          'Use root-relative paths for shared assets and avoid <base href> unless you fully understand its effect on in-page #fragment links.',
          'URL Resolution Patterns',
          `<!-- Root-relative (safe on nested routes) -->\n<img src="/assets/diagram.png" alt="DOM Tree" />\n\n<!-- Relative to current directory -->\n<a href="./next-lesson.html">Next</a>\n\n<!-- Parent directory -->\n<a href="../index.html">Parent Index</a>`,
          undefined,
          [
            'Root-relative paths start with / and resolve against the site origin.',
            'Relative paths without a leading slash resolve against the current document URL directory.',
            'Element IDs must be unique within a document and cannot contain whitespace.',
          ],
          [
            ['Using relative asset paths (assets/img.png) inside nested SPA routes', 'Prefix public static paths with / so they resolve consistently regardless of route depth.'],
            ['Assigning duplicate id attributes on the same page', 'Keep every id globally unique per document so fragment jumps and <label for> bindings never collide.'],
          ],
          [
            ['How does /img/hero.jpg differ from img/hero.jpg on /courses/html?', '/img/hero.jpg resolves to https://site.com/img/hero.jpg; img/hero.jpg resolves to https://site.com/courses/img/hero.jpg.'],
            ['What subtle side effect does <base href="https://example.com/app/"> have?', 'It rewrites ALL relative URLs on the page, including anchor fragment links like href="#top", which will navigate to /app/#top instead of staying on the current subpage.'],
          ],
          'On the URL https://itcourses.dev/courses/html, where does <a href="/practice"> navigate?',
          [
            'https://itcourses.dev/practice',
            'https://itcourses.dev/courses/practice',
            'https://itcourses.dev/courses/html/practice',
            'https://practice.itcourses.dev/',
          ],
          0,
          'A leading slash makes the URL root-relative, resolving directly from the origin.'
        ),
      ],
      outputQuestions: [
        {
          prompt: 'What numbering sequence does the browser render for this ordered list?',
          code: `<ol start="5" reversed>\n  <li>Alpha</li>\n  <li>Beta</li>\n  <li>Gamma</li>\n</ol>`,
          options: ['5. Alpha, 4. Beta, 3. Gamma', '5. Alpha, 6. Beta, 7. Gamma', '3. Alpha, 2. Beta, 1. Gamma', '1. Alpha, 2. Beta, 3. Gamma'],
          correctIndex: 0,
          explanation: 'start="5" begins the counter at 5, and reversed decrements by 1 for each item: 5, 4, 3.',
        },
        {
          prompt: 'If a user is on https://site.com/docs/html/forms.html and clicks <a href="../css/grid.html">, what URL opens?',
          code: `<a href="../css/grid.html">CSS Grid</a>`,
          options: [
            'https://site.com/docs/css/grid.html',
            'https://site.com/css/grid.html',
            'https://site.com/docs/html/css/grid.html',
            'https://site.com/docs/html/../grid.html',
          ],
          correctIndex: 0,
          explanation: '../ moves up one directory from /docs/html/ to /docs/, then enters css/grid.html.',
        },
      ],
    },
    {
      level: 'Beginner',
      title: 'Images, Tables & Embedded Content',
      description: 'Deliver crisp accessible images, well-structured data tables, and sandboxed iframes.',
      lessons: [
        makeLesson(
          'Accessible Images: alt, width/height & Lazy Loading',
          'Images require thoughtful alternative text and explicit intrinsic dimensions to prevent Cumulative Layout Shift (CLS).',
          'Informative images need concise alt text describing what the image communicates; purely decorative images should use empty alt="" so screen readers skip them rather than reading the filename. Setting width and height lets browsers reserve aspect-ratio space before download.',
          'Use loading="lazy" for below-the-fold images, but keep the above-the-fold hero image eager with fetchpriority="high".',
          'Zero-CLS Accessible Image Markup',
          `<img\n  src="/images/architecture.png"\n  alt="Client, API gateway, and PostgreSQL cluster diagram"\n  width="800"\n  height="450"\n  loading="lazy"\n  decoding="async"\n/>`,
          undefined,
          [
            'Use descriptive alt text for meaningful images and alt="" for decorative graphics.',
            'Always include width and height attributes to prevent layout shifts while loading.',
            'Never put loading="lazy" on the Largest Contentful Paint (LCP) hero image.',
          ],
          [
            ['Omitting the alt attribute completely on decorative icons', 'Use alt="" (empty string) for decorative images; omitting alt causes screen readers to read the raw file URL.'],
            ['Lazy-loading the hero banner at the top of the viewport', 'Keep above-the-fold hero images eager so LCP stays fast.'],
          ],
          [
            ['What is the difference between alt="" and omitting alt?', 'alt="" marks the image as decorative so assistive tech ignores it; omitting alt treats it as missing metadata and may announce the file path.'],
            ['How do width and height HTML attributes prevent Cumulative Layout Shift?', 'Browsers compute the intrinsic aspect ratio immediately from width/height and reserve exact vertical space before the image bytes arrive.'],
          ],
          'How should alt be written on a purely decorative background flourish image?',
          ['alt=""', 'Omit the alt attribute entirely', 'alt="decorative image"', 'alt="none"'],
          0,
          'An empty alt="" signals to assistive technology that the image is purely decorative and should be skipped.'
        ),
        makeLesson(
          'Data Tables: thead, tbody, scope & caption',
          'HTML tables exist for tabular data—never page layout—and rely on semantic header associations for screen reader cell announcements.',
          'Provide a <caption> describing the table, group headers in <thead> and body rows in <tbody>, and set scope="col" or scope="row" on <th> cells so users know which header applies to any cell.',
          'Wrap wide tables in an overflow-x-auto container on mobile screens so they never break viewport width.',
          'Accessible Tabular Data Markup',
          `<table>\n  <caption>Course Completion Thresholds</caption>\n  <thead>\n    <tr>\n      <th scope="col">Assessment</th>\n      <th scope="col">Pass Mark</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <th scope="row">Section Quiz</th>\n      <td>70%</td>\n    </tr>\n  </tbody>\n</table>`,
          undefined,
          [
            '<caption> acts as the accessible title for a <table>.',
            'Use <th scope="col"> for column headers and <th scope="row"> for row headers.',
            'Use <thead>, <tbody>, and <tfoot> to enable sticky headers and print pagination.',
          ],
          [
            ['Using <td> with bold CSS instead of <th> for header rows', 'Always use <th> with scope attributes so screen readers announce column context per cell.'],
            ['Using tables for multi-column page layouts', 'Use CSS Grid or Flexbox for visual layout; keep <table> strictly for relational data.'],
          ],
          [
            ['What does scope="col" on a <th> element do?', 'It explicitly associates that header cell with all data cells below it in the same column for assistive technologies.'],
            ['How do complex multi-level header tables link cells?', 'By giving <th> cells unique id attributes and referencing them in each <td> via the headers="id1 id2" attribute.'],
          ],
          'Which element provides an accessible title directly associated with an HTML <table>?',
          ['<caption>', '<title>', '<legend>', '<thead>'],
          0,
          '<caption> must be the first child of <table> and names the dataset for all users.'
        ),
        makeLesson(
          'Native Audio & Video Elements',
          'HTML5 embeds media natively with <video> and <audio>, supporting multiple codec <source> fallbacks and accessible <track> captions.',
          'Always provide captions via <track kind="captions" src="...vtt" srclang="en"> and set preload="metadata" to avoid downloading gigabytes of video until the user interacts.',
          'Autoplay in modern browsers only succeeds when muted is also present (<video autoplay muted playsinline>).',
          'Accessible Multi-Source Video Player',
          `<video controls preload="metadata" poster="/media/thumb.jpg" width="720">\n  <source src="/media/intro.webm" type="video/webm" />\n  <source src="/media/intro.mp4" type="video/mp4" />\n  <track kind="captions" src="/media/intro.vtt" srclang="en" label="English" default />\n  Your browser does not support embedded video.\n</video>`,
          undefined,
          [
            'Order <source> elements from most efficient codec (AV1/WebM) to widest fallback (MP4).',
            'Always include <track kind="captions"> using WebVTT (.vtt) for accessibility.',
            'Browsers block unmuted autoplay; include muted and playsinline for ambient background video.',
          ],
          [
            ['Setting autoplay without muted', 'Include muted (or avoid autoplay altogether) so browser autoplay policies do not silently fail playback.'],
            ['Omitting the poster attribute on video players', 'Provide a crisp poster image and preload="metadata" so the player looks complete before playback.'],
          ],
          [
            ['Why do browsers allow <video autoplay muted> but block unmuted autoplay?', 'Autoplay policies prevent unexpected audio from disrupting users while permitting silent ambient motion.'],
            ['What file format does the HTML <track> element use?', 'WebVTT (.vtt), a plain-text timestamped subtitle and caption format.'],
          ],
          'Which element attaches closed captions or subtitles to an HTML5 <video>?',
          ['<track kind="captions">', '<subtitle>', '<caption src="...">', '<meta kind="captions">'],
          0,
          '<track> binds timed WebVTT text tracks (captions, subtitles, chapters) to media elements.'
        ),
        makeLesson(
          'Iframes, Sandboxing & Security Headers',
          'The <iframe> element embeds external documents in an isolated browsing context, requiring strict security hardening.',
          'Always give every <iframe> a descriptive title attribute for screen readers, use loading="lazy", and apply the sandbox attribute with minimal capabilities (e.g., sandbox="allow-scripts") to block top-level navigation and form hijacking.',
          'Never combine allow-scripts and allow-same-origin in sandbox on untrusted third-party embeds, as that lets the embedded script strip its own sandbox.',
          'Hardened Sandboxed Iframe',
          `<iframe\n  src="https://sandbox.example.dev/demo"\n  title="Interactive CSS Grid Demo"\n  width="640"\n  height="360"\n  loading="lazy"\n  sandbox="allow-scripts"\n  referrerpolicy="no-referrer"\n></iframe>`,
          undefined,
          [
            'Every <iframe> requires a descriptive title attribute for WCAG compliance.',
            'An empty sandbox="" applies maximum restrictions; add only minimal allow-* tokens.',
            'Combining allow-scripts + allow-same-origin on untrusted content defeats sandboxing.',
          ],
          [
            ['Embedding untrusted iframes without the sandbox attribute', 'Apply sandbox with least-privilege permissions and strict referrerPolicy.'],
            ['Leaving out the title attribute on iframes', 'Screen reader users hear "frame" with no context unless title describes the embedded content.'],
          ],
          [
            ['Why is sandbox="allow-scripts allow-same-origin" dangerous for untrusted embeds?', 'If the iframe shares origin and can execute JavaScript, it can access its own frameElement in the parent DOM and remove the sandbox attribute.'],
            ['How does a server prevent its own pages from being clickjacked inside an attacker’s iframe?', 'By sending Content-Security-Policy: frame-ancestors \'none\' (or \'self\').'],
          ],
          'Which attribute restricts an <iframe> from running scripts, submitting forms, or navigating the top window?',
          ['sandbox', 'isolated', 'readonly', 'csp-lock'],
          0,
          'The sandbox attribute applies strict security restrictions that can be selectively relaxed with allow-* tokens.'
        ),
      ],
      outputQuestions: [
        {
          prompt: 'How many data cells are merged horizontally in the second row of this table?',
          code: `<table>\n  <tr><th>Name</th><th>Q1</th><th>Q2</th></tr>\n  <tr><td>Total</td><td colspan="2">94%</td></tr>\n</table>`,
          options: ['2 columns merged into one cell', '2 rows merged vertically', '3 columns merged', 'Invalid attribute—must be span="2"'],
          correctIndex: 0,
          explanation: 'colspan="2" stretches the single <td> across both the Q1 and Q2 columns.',
        },
        {
          prompt: 'What happens when a browser encounters an <iframe sandbox="" src="..."> containing JavaScript?',
          code: `<iframe src="/widget.html" title="Widget" sandbox></iframe>`,
          options: [
            'JavaScript execution inside the iframe is blocked',
            'JavaScript runs normally with full parent DOM access',
            'The iframe fails to render any HTML at all',
            'Only inline scripts run while external scripts are blocked',
          ],
          correctIndex: 0,
          explanation: 'An empty sandbox attribute applies all restrictions, including disabling script execution until allow-scripts is added.',
        },
      ],
    },
    {
      level: 'Intermediate',
      title: 'Forms & Input Controls',
      description: 'Design resilient, accessible HTML forms with proper labels, input types, fieldsets, and mobile keyboards.',
      lessons: [
        makeLesson(
          'Form Architecture: action, method, label & name',
          'Forms collect structured user input and submit key-value pairs determined strictly by each control’s name attribute.',
          'Every input must be programmatically associated with a <label> via matching for/id attributes (or wrapping). Without a name attribute, an input’s value is omitted from FormData and HTTP form submission.',
          'Always specify type="button" on non-submit buttons inside a <form>; the default type of <button> inside a form is submit!',
          'Accessible Form with Explicit Labels',
          `<form action="/api/enroll" method="post">\n  <label for="email">Work Email</label>\n  <input id="email" name="email" type="email" autocomplete="email" required />\n  <button type="button" id="cancel-btn">Cancel</button>\n  <button type="submit">Enroll</button>\n</form>`,
          undefined,
          [
            'Only form controls with a name attribute are serialized on submit.',
            'Explicit <label for="id"> increases click target area and informs screen readers.',
            'Default <button> type inside <form> is "submit"—always set type="button" for secondary buttons.',
          ],
          [
            ['Using placeholder instead of <label>', 'Placeholders vanish as soon as typing begins and fail WCAG contrast/accessibility; always include a visible <label>.'],
            ['Forgetting type="button" on a Cancel or toggle button inside a form', 'Set type="button" explicitly so clicking it does not accidentally submit the form.'],
          ],
          [
            ['Why is a control missing from new FormData(form)?', 'Most commonly because the input lacks a name attribute or is currently disabled (disabled inputs are excluded from submission, unlike readonly inputs).'],
            ['What is the difference between disabled and readonly inputs?', 'disabled inputs cannot receive focus and are NOT submitted with the form; readonly inputs can be focused/copied and ARE submitted.'],
          ],
          'What is the default behavior of a <button> inside a <form> when no type attribute is specified?',
          ['It acts as type="submit"', 'It acts as type="button"', 'It acts as type="reset"', 'It is disabled until JavaScript attaches a listener'],
          0,
          'Per the HTML specification, the missing-value default for <button> type is submit.'
        ),
        makeLesson(
          'Semantic Input Types, inputmode & autocomplete',
          'Modern HTML input types unlock native pickers, tailored mobile keyboards, and password-manager autofill.',
          'Use type="email", type="url", type="date", type="number", and type="search" appropriately. For numeric codes like OTPs or postal codes that should not show increment spinners or strip leading zeros, pair type="text" with inputmode="numeric".',
          'Add standard autocomplete tokens (email, current-password, new-password, one-time-code) to dramatically reduce form friction.',
          'Mobile-Friendly Inputs with inputmode & autocomplete',
          `<label for="otp">6-Digit Verification Code</label>\n<input\n  id="otp"\n  name="otp"\n  type="text"\n  inputmode="numeric"\n  autocomplete="one-time-code"\n  pattern="[0-9]{6}"\n  maxlength="6"\n/>`,
          undefined,
          [
            'inputmode="numeric" opens the numeric keypad on mobile without <input type="number"> quirks.',
            'autocomplete="one-time-code" enables automatic SMS code autofill on iOS and Android.',
            'type="number" strips leading zeros and allows "e" for scientific notation.',
          ],
          [
            ['Using type="number" for credit cards, ZIP codes, or OTPs', 'Use type="text" with inputmode="numeric" and pattern so leading zeros are preserved and scroll-wheel changes don’t corrupt values.'],
            ['Setting autocomplete="off" on login forms', 'Use autocomplete="username" and autocomplete="current-password" so password managers work smoothly.'],
          ],
          [
            ['Why is type="text" inputmode="numeric" preferred over type="number" for postal codes?', 'Postal codes like "02138" have significant leading zeros and are identifiers, not arithmetic quantities; type="number" also changes value on mouse wheel scroll.'],
            ['How does autocomplete="new-password" help users?', 'It signals password managers to generate and save a strong password instead of autofilling an existing login credential.'],
          ],
          'Which input configuration best captures a 6-digit OTP code while preserving leading zeros and showing a mobile number pad?',
          [
            '<input type="text" inputmode="numeric" autocomplete="one-time-code" />',
            '<input type="number" maxlength="6" />',
            '<input type="tel" min="0" max="999999" />',
            '<input type="password" inputmode="text" />',
          ],
          0,
          'type="text" preserves leading zeros and honors maxlength, while inputmode="numeric" triggers the numeric keypad.'
        ),
        makeLesson(
          'Fieldset, Legend, Radios, Checkboxes & Datalist',
          'Group related controls like radio buttons or shipping fields inside <fieldset> with a <legend> for crystal-clear accessible context.',
          'Radio buttons belong to the same mutually exclusive group when they share the exact same name attribute. For combo-box suggestions without heavy JS libraries, link an <input list="..."> to a <datalist>.',
          'Screen readers announce the <legend> text before reading each radio option inside a <fieldset>, eliminating ambiguity.',
          'Accessible Radio Group & Datalist Suggestions',
          `<fieldset>\n  <legend>Experience Level</legend>\n  <label><input type="radio" name="level" value="beginner" checked /> Beginner</label>\n  <label><input type="radio" name="level" value="advanced" /> Advanced</label>\n</fieldset>\n\n<label for="lang">Primary Language</label>\n<input id="lang" name="lang" list="languages" />\n<datalist id="languages">\n  <option value="TypeScript"></option>\n  <option value="Python"></option>\n  <option value="Rust"></option>\n</datalist>`,
          undefined,
          [
            'Radio buttons become mutually exclusive strictly by sharing the same name attribute.',
            '<fieldset> + <legend> gives screen readers group-level context for radio and checkbox sets.',
            '<datalist> offers native autocomplete suggestions while still allowing free-form text.',
          ],
          [
            ['Giving each radio button a different name attribute', 'Use one shared name for the radio group and distinct value attributes per option.'],
            ['Using a heading <h3> instead of <legend> for a radio group question', 'Wrap the group in <fieldset> with <legend> so assistive technology announces the question on focus.'],
          ],
          [
            ['How do <select> and <datalist> differ?', '<select> restricts users strictly to predefined options, whereas <datalist> provides autocomplete suggestions on an <input> while still permitting arbitrary custom input.'],
            ['Why must radio buttons share a name attribute?', 'Sharing a name links them into a single form field so selecting one automatically deselects the others and arrow keys cycle through them.'],
          ],
          'What links multiple <input type="radio"> elements into one mutually exclusive choice group?',
          ['Sharing the same name attribute', 'Sharing the same id attribute', 'Sharing the same value attribute', 'Placing them in the same <div>'],
          0,
          'Browsers group radio buttons solely by matching name attributes within the same form.'
        ),
        makeLesson(
          'Native Constraint Validation & Error Messaging',
          'HTML5 ships with built-in declarative validation attributes (required, minlength, pattern, min, max) backed by the JavaScript Constraint Validation API.',
          'When custom styling is needed, set novalidate on <form> and inspect input.validity (e.g., valueMissing, patternMismatch) on submit, then link custom error paragraphs to inputs using aria-invalid="true" and aria-describedby="error-id".',
          'Never rely solely on client-side HTML validation for security—always re-validate on the server.',
          'Accessible Custom Error Binding',
          `<label for="username">Username</label>\n<input\n  id="username"\n  name="username"\n  required\n  minlength="3"\n  pattern="[a-zA-Z0-9_]+" \n  aria-invalid="true"\n  aria-describedby="username-error"\n/>\n<p id="username-error" role="alert">\n  Use 3+ letters, numbers, or underscores.\n</p>`,
          undefined,
          [
            'Built-in attributes (required, pattern, min, max) expose ValidityState via JS.',
            'Connect custom error text to inputs with aria-describedby and aria-invalid="true".',
            'Client-side validation improves UX; server-side validation enforces security.',
          ],
          [
            ['Showing red border color alone on invalid inputs', 'Pair color with explicit error text linked via aria-describedby so color-blind and screen-reader users know what to fix.'],
            ['Disabling the Submit button until the form is valid without explaining why', 'Keep Submit clickable and announce or focus the first invalid field with clear guidance.'],
          ],
          [
            ['What does adding novalidate to a <form> do?', 'It suppresses native browser tooltip popups on submit so your application can display consistent accessible error summaries while still reading input.validity via JS.'],
            ['How does aria-describedby improve form error UX?', 'When a user focuses the invalid input, screen readers read both the label and the associated error message text.'],
          ],
          'Which attribute links an invalid form input to its visible validation error message for screen readers?',
          ['aria-describedby', 'aria-controls', 'data-error-for', 'for'],
          0,
          'aria-describedby="error-id" tells assistive technologies to announce the referenced error message when the input is focused.'
        ),
      ],
      outputQuestions: [
        {
          prompt: 'Which field values will be included when this form is submitted?',
          code: `<form>\n  <input name="plan" value="pro" readonly />\n  <input name="coupon" value="SAVE10" disabled />\n  <input value="anonymous" />\n</form>`,
          options: [
            'Only plan="pro"',
            'plan="pro" and coupon="SAVE10"',
            'All three fields',
            'Only coupon="SAVE10"',
          ],
          correctIndex: 0,
          explanation: 'readonly fields ARE submitted, disabled fields are excluded, and inputs without a name attribute are ignored.',
        },
        {
          prompt: 'What happens when a user clicks the "Clear" button inside this form?',
          code: `<form action="/search">\n  <input name="q" value="html" />\n  <button>Clear</button>\n</form>`,
          options: [
            'The form submits to /search?q=html',
            'The input clears to empty string',
            'Nothing happens because there is no onclick handler',
            'A browser validation error occurs',
          ],
          correctIndex: 0,
          explanation: 'A <button> without a type attribute inside a <form> defaults to type="submit" and submits via GET.',
        },
      ],
    },
    {
      level: 'Intermediate',
      title: 'Responsive Media & Graphics',
      description: 'Serve optimal image resolutions with srcset, picture art direction, inline SVG accessibility, and canvas fundamentals.',
      lessons: [
        makeLesson(
          'Responsive Images with srcset & sizes',
          'Shipping a 2400px desktop photo to a 390px phone wastes bandwidth and slows LCP; srcset and sizes let the browser choose the ideal file.',
          'Width descriptors (400w, 800w, 1600w) tell the browser each file’s pixel width, while sizes tells the browser how wide the image will render in CSS pixels at each viewport breakpoint—allowing the preload scanner to pick the right asset before CSS finishes parsing.',
          'Always include a standard src fallback for older clients and test DPR scaling in browser DevTools.',
          'Resolution Switching with srcset and sizes',
          `<img\n  src="/img/hero-800.jpg"\n  srcset="/img/hero-400.jpg 400w, /img/hero-800.jpg 800w, /img/hero-1600.jpg 1600w"\n  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"\n  alt="Developer workspace"\n  width="800"\n  height="450"\n/>`,
          undefined,
          [
            'Use w descriptors + sizes for fluid responsive images; use 1x/2x descriptors only for fixed-width icons.',
            'The browser factors in devicePixelRatio automatically (e.g., 400px slot on 2x screen picks 800w).',
            'sizes must reflect your actual CSS layout width, not the file dimensions.',
          ],
          [
            ['Omitting sizes when using w descriptors in srcset', 'Without sizes, browsers assume 100vw, causing oversized downloads on multi-column grids.'],
            ['Mixing 2x density descriptors and 800w width descriptors in the same srcset', 'Use either width descriptors OR density descriptors, never both together.'],
          ],
          [
            ['Why can the browser select the right srcset image before CSS loads?', 'Because the sizes attribute gives the HTML preload scanner layout width hints directly in the markup.'],
            ['Which image will a 2x Retina phone at 375px wide pick from 400w, 800w, 1600w with sizes="100vw"?', '375 * 2 = 750 physical pixels, so the browser chooses the 800w candidate.'],
          ],
          'If an image renders at 400px wide on a 2x pixel-density display, which srcset candidate is the closest optimal match?',
          ['800w', '400w', '1600w', '200w'],
          0,
          '400 CSS px × 2x DPR = 800 device pixels, matching the 800w source cleanly.'
        ),
        makeLesson(
          'Art Direction & Modern Formats with <picture>',
          'The <picture> element lets you serve next-gen formats like AVIF and WebP with JPEG fallbacks, or swap crops per viewport.',
          'The browser evaluates <source> children in order and selects the first matching media query and supported MIME type. The inner <img> element is still mandatory—it holds alt text, sizing, and renders the chosen source.',
          'Place AVIF first, WebP second, and JPEG on the fallback <img> for maximum compression with 100% browser support.',
          'AVIF/WebP Progressive Enhancement with <picture>',
          `<picture>\n  <source type="image/avif" srcset="/img/banner.avif" />\n  <source type="image/webp" srcset="/img/banner.webp" />\n  <img src="/img/banner.jpg" alt="Course catalog banner" width="1200" height="600" />\n</picture>`,
          undefined,
          [
            'Browsers pick the first <source> whose type and media attributes both match.',
            '<img> inside <picture> is required; styling and alt attributes go on the <img>.',
            'Use <picture> for art direction (portrait mobile crop vs landscape desktop crop).',
          ],
          [
            ['Putting alt or class styles on <picture> instead of the nested <img>', 'Always place alt, width, height, and styling on the inner <img> element.'],
            ['Listing JPEG <source> before AVIF', 'Put the smallest modern format (AVIF, then WebP) first because browsers stop at the first supported <source>.'],
          ],
          [
            ['When should you use <picture> instead of plain <img srcset>?', 'Use <picture> when changing image formats (AVIF/WebP fallback) or changing the visual crop/aspect ratio across breakpoints (art direction).'],
            ['What happens if you omit <img> inside <picture>?', 'Nothing renders because <picture> is only a wrapper providing source candidates to its inner <img>.'],
          ],
          'In a <picture> element with AVIF, WebP, and JPEG options, where must the alt text be placed?',
          ['On the inner <img> element', 'On the <picture> element', 'On every <source> element', 'Inside a <figcaption> only'],
          0,
          '<picture> delegates rendering and accessibility attributes to its required fallback <img> child.'
        ),
        makeLesson(
          'Inline SVG, viewBox & Accessible Vector Icons',
          'Scalable Vector Graphics remain razor-sharp at any DPI and can inherit CSS currentColor when inlined directly in HTML.',
          'Always define viewBox="0 0 W H" so vectors scale predictably. Decorative icons inside labeled buttons should carry aria-hidden="true"; standalone meaningful SVGs need role="img" and an accessible <title>.',
          'Use fill="currentColor" or stroke="currentColor" so icons adapt effortlessly between light and dark themes.',
          'Accessible Inline SVG Patterns',
          `<!-- Decorative icon inside a labeled button -->\n<button type="button">\n  <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16">\n    <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" fill="none" stroke-width="2" />\n  </svg>\n  <span>Continue</span>\n</button>`,
          undefined,
          [
            'viewBox defines the internal coordinate system enabling crisp responsive scaling.',
            'Mark decorative icons aria-hidden="true" to avoid noisy screen reader output.',
            'currentColor binds SVG stroke/fill directly to the parent element’s CSS text color.',
          ],
          [
            ['Leaving out aria-hidden="true" on decorative button icons', 'Hide decorative icons from assistive tech and rely on the button’s visible text or aria-label.'],
            ['Using inline SVGs for massive complex photographs', 'Keep SVG for icons, logos, and diagrams; use AVIF/WebP/JPEG for photography.'],
          ],
          [
            ['How does viewBox differ from width and height on an <svg>?', 'viewBox sets the internal virtual coordinate grid, while width and height control the rendered CSS box size on screen.'],
            ['How do you make a standalone SVG chart accessible?', 'Add role="img", aria-labelledby="chart-title", and a child <title id="chart-title"> describing the insight.'],
          ],
          'Which attribute should be added to an inline <svg> icon placed inside a button that already has visible text?',
          ['aria-hidden="true"', 'role="button"', 'tabindex="0"', 'alt=""'],
          0,
          'aria-hidden="true" prevents screen readers from announcing redundant or unlabelled graphics inside a labeled button.'
        ),
        makeLesson(
          'HTML5 Canvas vs SVG Decision Guide',
          'The <canvas> element provides a pixel-based bitmap drawing surface driven by JavaScript 2D or WebGL APIs.',
          'Unlike SVG—where every shape is a DOM node with event listeners and CSS styling—<canvas> paints directly onto a pixel buffer. Because pixels are opaque to screen readers, provide fallback content between <canvas> and </canvas> or mirror key metrics in accessible HTML.',
          'Scale canvas backing store by window.devicePixelRatio so lines and text stay crisp on Retina screens.',
          'Accessible Canvas with Fallback Description',
          `<canvas id="chart" width="600" height="300" role="img" aria-label="Quiz score trend showing 88% average">\n  <p>Quiz score trend: 75% in Section 1, 88% in Section 2, 95% in Section 3.</p>\n</canvas>`,
          undefined,
          [
            'SVG is retained-mode (DOM nodes); Canvas is immediate-mode (pixel bitmap).',
            'Choose Canvas for thousands of animated particles, games, or real-time video effects.',
            'Always provide accessible fallback text or ARIA labels for informational canvases.',
          ],
          [
            ['Resizing a <canvas> with CSS width/height without matching the backing buffer', 'Set canvas.width = cssWidth * dpr and scale the 2D context so drawings never look blurry or stretched.'],
            ['Using <canvas> for simple UI icons or static charts', 'Prefer SVG for crisp zoomable UI graphics and built-in DOM accessibility.'],
          ],
          [
            ['When is <canvas> faster than <svg>?', 'When rendering thousands of dynamic shapes per frame (games, heatmaps, particle physics), because SVG DOM reconciliation becomes a bottleneck.'],
            ['What is the text placed inside <canvas>...</canvas> used for?', 'It serves as accessible fallback content for assistive technologies and environments without canvas support.'],
          ],
          'Which rendering model describes HTML5 <canvas>?',
          [
            'Immediate-mode pixel bitmap drawn via JavaScript',
            'Retained-mode XML vector DOM tree',
            'Declarative CSS layout grid',
            'Server-side raster template',
          ],
          0,
          'Canvas paints pixels imperatively without keeping individual shape objects in the DOM.'
        ),
      ],
      outputQuestions: [
        {
          prompt: 'Which image file does a modern browser supporting WebP (but not AVIF) download here?',
          code: `<picture>\n  <source type="image/avif" srcset="/hero.avif" />\n  <source type="image/webp" srcset="/hero.webp" />\n  <img src="/hero.jpg" alt="Hero" />\n</picture>`,
          options: ['/hero.webp', '/hero.avif', '/hero.jpg', 'Both /hero.webp and /hero.jpg'],
          correctIndex: 0,
          explanation: 'The browser skips unsupported image/avif, matches image/webp, and downloads only /hero.webp.',
        },
        {
          prompt: 'What happens if you scale an SVG with viewBox="0 0 24 24" to width="96" height="96"?',
          code: `<svg viewBox="0 0 24 24" width="96" height="96"><circle cx="12" cy="12" r="10" /></svg>`,
          options: [
            'The circle scales cleanly 4x larger with crisp vector edges',
            'The circle stays 24px wide in the top-left corner',
            'The circle becomes pixelated 4x',
            'The SVG clips the circle at 24px',
          ],
          correctIndex: 0,
          explanation: 'viewBox maps the 24×24 coordinate space proportionally across the 96×96 viewport with mathematically smooth edges.',
        },
      ],
    },
    {
      level: 'Intermediate',
      title: 'Native Interactive Elements',
      description: 'Build zero-dependency disclosures, modals, popovers, and templates using modern standard HTML.',
      lessons: [
        makeLesson(
          'Disclosures & Accordions with <details> and <summary>',
          '<details> and <summary> create keyboard-accessible expandable sections without a single line of JavaScript.',
          'Adding the same name attribute across sibling <details> elements (supported in modern browsers) turns them into an exclusive accordion where opening one automatically closes the others.',
          'Keep <summary> concise and avoid putting headings or interactive links inside <summary> without careful testing.',
          'Exclusive Native HTML Accordion',
          `<details name="faq" open>\n  <summary>How is progress stored?</summary>\n  <p>Progress saves automatically in local storage.</p>\n</details>\n<details name="faq">\n  <summary>Do certificates include a QR code?</summary>\n  <p>Yes, every PDF certificate embeds a scannable verification QR.</p>\n</details>`,
          undefined,
          [
            '<summary> is the always-visible interactive disclosure trigger.',
            'Adding the boolean open attribute renders the panel expanded by default.',
            'Matching name attributes create mutually exclusive accordions natively.',
          ],
          [
            ['Building custom <div onclick> accordions without aria-expanded or keyboard handlers', 'Use native <details>/<summary> for free keyboard Enter/Space support and accessible semantics.'],
            ['Omitting <summary> inside <details>', 'Always provide a clear <summary>; otherwise browsers display a generic "Details" label.'],
          ],
          [
            ['What event fires when a <details> element opens or closes?', 'The toggle event fires on the <details> element, where event.target.open reflects the new boolean state.'],
            ['How do you make native <details> elements behave as a single-open accordion?', 'Assign the exact same name attribute to each <details> in the group.'],
          ],
          'Which boolean attribute makes a <details> element expanded on initial page load?',
          ['open', 'expanded', 'active', 'visible'],
          0,
          'The open boolean attribute controls whether a <details> element displays its content.'
        ),
        makeLesson(
          'Native Modals with <dialog>',
          'The HTML <dialog> element renders accessible modals on the browser top layer—above every z-index stacking context.',
          'Calling dialog.showModal() activates the ::backdrop pseudo-element, traps keyboard focus inside the modal, enables Escape-to-close automatically, and makes background content inert. Using <form method="dialog"> closes the dialog and sets dialog.returnValue automatically.',
          'Prefer dialog.showModal() for blocking confirmations and dialog.show() for non-modal floating panels.',
          'Native Modal with form method="dialog"',
          `<dialog id="confirm-reset">\n  <form method="dialog">\n    <h2>Reset Progress?</h2>\n    <p>This clears all local quiz scores.</p>\n    <menu>\n      <button value="cancel">Cancel</button>\n      <button value="confirm">Reset</button>\n    </menu>\n  </form>\n</dialog>`,
          undefined,
          [
            'showModal() places the dialog in the top layer, defeating z-index bugs permanently.',
            'Escape key automatically fires the cancel and close events on modal dialogs.',
            '<form method="dialog"> closes the dialog on submit and stores the clicked button value in dialog.returnValue.',
          ],
          [
            ['Toggling <dialog open> via attribute instead of calling showModal()', 'Setting the open attribute creates a non-modal dialog with NO backdrop and NO focus trap; use showModal() for true modals.'],
            ['Fighting z-index: 999999 on custom modal overlays', 'Native <dialog> via showModal() lives in the browser Top Layer above all page z-indexes.'],
          ],
          [
            ['What is the difference between dialog.show() and dialog.showModal()?', 'show() opens a non-modal dialog where the rest of the page stays interactive; showModal() renders on the top layer with ::backdrop, Esc-to-close, and inert background.'],
            ['What does <form method="dialog"> do when submitted?', 'It closes the ancestor <dialog> without making a network request and sets dialog.returnValue to the submit button’s value.'],
          ],
          'Which JavaScript method opens a <dialog> in the browser top layer with a ::backdrop and Escape-to-close?',
          ['dialog.showModal()', 'dialog.open()', 'dialog.show()', 'dialog.activateModal()'],
          0,
          'showModal() promotes the dialog to the top layer and makes background content inert.'
        ),
        makeLesson(
          'The Native Popover API',
          'The HTML Popover API (popover attribute + popovertarget) creates light-dismiss tooltips, menus, and dropdowns natively in the top layer.',
          'With popover="auto" (or bare popover), clicking outside or pressing Escape automatically dismisses the popover and closes other auto popovers—zero event-listener cleanup required.',
          'Use popover="manual" only for persistent notifications or toasts that should not close when the user clicks elsewhere.',
          'Declarative Zero-JS Popover Menu',
          `<button popovertarget="course-menu" popovertargetaction="toggle">\n  Quick Jump\n</button>\n<div id="course-menu" popover>\n  <a href="/courses/html">HTML</a>\n  <a href="/courses/css">CSS</a>\n</div>`,
          undefined,
          [
            'popover renders in the top layer without clipping inside overflow: hidden containers.',
            'popover="auto" provides automatic light-dismiss (outside click + Escape).',
            'popovertarget links a <button> to a popover element’s id declaratively.',
          ],
          [
            ['Confusing <dialog> showModal() with popover', 'Use showModal() when the background must become inert; use popover for non-blocking dropdowns, menus, and tooltips.'],
            ['Forgetting that popovers are display: none until opened', 'Style the open state with the :popover-open CSS pseudo-class.'],
          ],
          [
            ['How does popover="auto" differ from popover="manual"?', 'auto popovers light-dismiss on outside clicks/Escape and auto-close sibling auto popovers; manual popovers must be closed explicitly.'],
            ['Why does the Popover API eliminate overflow: hidden clipping bugs?', 'Because open popovers are promoted to the browser’s top layer outside normal ancestor stacking and clipping contexts.'],
          ],
          'What behavior does popover="auto" provide by default?',
          [
            'Light-dismiss on outside click or Escape and closing other open auto popovers',
            'Makes the entire background page inert like showModal()',
            'Persists across page reloads automatically',
            'Requires JavaScript click listeners to close',
          ],
          0,
          'popover="auto" handles light-dismiss and mutual exclusion declaratively.'
        ),
        makeLesson(
          'HTML <template>, <slot> & inert Attribute',
          '<template> holds inert DOM fragments for client-side cloning, while the global inert attribute disables entire subtrees from focus, clicks, and screen readers.',
          'Markup inside <template> is parsed into a DocumentFragment without loading images or running scripts until cloned with template.content.cloneNode(true). Meanwhile, inert is the cleanest way to disable background regions behind drawers.',
          'Use document.importNode(tpl.content, true) or tpl.content.cloneNode(true) when stamping repeated DOM rows.',
          'Inert Template Cloning',
          `<template id="badge-tpl">\n  <li class="badge"><strong class="title"></strong></li>\n</template>\n\n<div id="background-panel" inert>\n  <button>Cannot be focused or clicked while inert</button>\n</div>`,
          undefined,
          [
            'Content inside <template> does not render and does not fetch images until cloned into the live DOM.',
            'The global inert boolean attribute removes all descendants from tab order, pointer events, and the accessibility tree.',
            '<slot> projects light-DOM children inside Shadow DOM Web Components.',
          ],
          [
            ['Querying elements directly inside <template> via tpl.querySelector()', 'Always query tpl.content.querySelector(...) because template children live on its DocumentFragment .content property.'],
            ['Using pointer-events: none alone to disable a drawer background', 'Use the inert attribute so keyboard Tab navigation and screen readers are also properly blocked.'],
          ],
          [
            ['Why don’t <img> tags inside <template> trigger network requests?', 'The HTML parser places template contents in an inert DocumentFragment belonging to an inactive document until cloned into the active DOM.'],
            ['What three interactions does the global inert attribute disable?', 'Pointer/click events, keyboard focus/tabbing, and exposure to assistive technologies (accessibility tree).'],
          ],
          'What happens to keyboard focus and screen reader access on elements inside a container with the inert attribute?',
          [
            'All descendants are skipped by keyboard focus, clicks, and assistive technology',
            'Only mouse clicks are blocked while Tab focus still enters',
            'The container is visually hidden with display: none',
            'Only <input> elements become readonly',
          ],
          0,
          'inert cleanly disables pointer interaction, keyboard focusability, and accessibility tree exposure across the subtree.'
        ),
      ],
      outputQuestions: [
        {
          prompt: 'When the user clicks "Confirm" inside this modal dialog, what is dialog.returnValue?',
          code: `<dialog id="d">\n  <form method="dialog">\n    <button value="cancel">Cancel</button>\n    <button value="confirm">Confirm</button>\n  </form>\n</dialog>`,
          options: ['"confirm"', '"Confirm"', 'true', 'undefined'],
          correctIndex: 0,
          explanation: 'Submitting a <form method="dialog"> sets dialog.returnValue to the clicked submit button’s value attribute ("confirm").',
        },
        {
          prompt: 'If a page contains this markup, how many HTTP requests are sent for preview.png on initial page load?',
          code: `<template id="card">\n  <img src="/preview.png" alt="Preview" />\n</template>`,
          options: ['0 requests until cloned into the live document', '1 immediate request during HTML parsing', '2 requests (preload + render)', 'Throws a DOM exception'],
          correctIndex: 0,
          explanation: 'Markup inside <template> is inert; images are not fetched and scripts do not run until stamped into the live DOM.',
        },
      ],
    },
    {
      level: 'Intermediate',
      title: 'Metadata, Open Graph & Structured Data',
      description: 'Optimize pages for search indexing, rich link previews, canonical URLs, and international audiences.',
      lessons: [
        makeLesson(
          'SEO Fundamentals: Canonical, Robots & Meta Descriptions',
          'Clean HTML metadata prevents duplicate-content indexing penalties and guides search crawlers accurately.',
          'Whenever query strings (?ref=nav or ?sort=asc) generate duplicate URLs for the same page, <link rel="canonical"> tells search engines which single authoritative URL should accumulate ranking signals.',
          'Keep <title> around 50–60 characters and <meta name="description"> concise (140–160 characters) with genuine page specifics.',
          'Canonical & Crawler Directives',
          `<head>\n  <title>PostgreSQL Course — IT Courses</title>\n  <meta name="description" content="Master PostgreSQL indexing, MVCC, window functions, and query tuning across 48 lessons." />\n  <link rel="canonical" href="https://itcourses.dev/courses/postgresql" />\n  <meta name="robots" content="index, follow" />\n</head>`,
          undefined,
          [
            'rel="canonical" consolidates SEO signals when multiple URLs serve identical content.',
            'Use noindex on private dashboards or temporary staging previews.',
            'Every route should dynamically update its <title> and canonical link.',
          ],
          [
            ['Using relative URLs inside <link rel="canonical">', 'Always provide a full absolute URL including https:// and domain in canonical links.'],
            ['Accidentally leaving noindex on production marketing pages', 'Audit <meta name="robots"> before production launches so search engines can crawl public routes.'],
          ],
          [
            ['Why is <link rel="canonical"> important on paginated or filtered catalog pages?', 'It prevents query parameter variants like ?utm_source=twitter from splitting search authority across duplicate URLs.'],
            ['Does <meta name="keywords"> still influence Google search rankings?', 'No, modern search engines ignore meta keywords due to historical spam; focus on semantic headings, content quality, and structured data.'],
          ],
          'What problem does <link rel="canonical" href="https://example.com/courses/sql" /> solve?',
          [
            'Consolidates duplicate URL variants under one authoritative URL for search engines',
            'Redirects users via HTTP 301 immediately',
            'Blocks bots from crawling query parameters',
            'Caches the page permanently in Service Workers',
          ],
          0,
          'Canonical link elements tell search engines which URL is the primary version among duplicates.'
        ),
        makeLesson(
          'Open Graph & Twitter/X Social Share Cards',
          'Open Graph (og:*) and Twitter Card meta tags control the title, summary, and preview image rendered when links are shared in chat apps and feeds.',
          'Always provide an absolute HTTPS URL for og:image with a 1.91:1 landscape aspect ratio (1200×630) and pair it with og:image:alt for accessibility.',
          'Include twitter:card="summary_large_image" so platforms display a prominent preview banner rather than a tiny thumbnail.',
          'Complete Social Share Meta Block',
          `<meta property="og:type" content="website" />\n<meta property="og:title" content="IT Courses — 23 Programming Tracks" />\n<meta property="og:description" content="Learn languages, databases, and interview DSA with verifiable certificates." />\n<meta property="og:image" content="https://itcourses.dev/og-card.png" />\n<meta property="og:image:alt" content="IT Courses curriculum overview" />\n<meta name="twitter:card" content="summary_large_image" />`,
          undefined,
          [
            'Open Graph uses property="og:*" while standard meta and Twitter tags use name="...".',
            'og:image must be an absolute URL—social scrapers do not execute client-side JS.',
            'Standard recommended dimensions for og:image are 1200×630 pixels.',
          ],
          [
            ['Using a relative path like content="/og.png" in og:image', 'Social link scrapers require full absolute https:// URLs to fetch preview images reliably.'],
            ['Injecting Open Graph tags only via client-side React useEffect', 'Social bots generally read raw initial HTML; emit OG tags in static HTML or SSR responses.'],
          ],
          [
            ['Why do Open Graph tags use property instead of name?', 'Open Graph is based on RDFa, which specifies the property attribute for predicate URIs like og:title.'],
            ['Why might social previews fail on a client-rendered SPA?', 'Most social crawlers do not execute JavaScript, so dynamic route-specific OG tags must be server-rendered or prerendered.'],
          ],
          'Which attribute name is used by Open Graph meta tags such as og:title?',
          ['property="og:title"', 'name="og:title"', 'rel="og:title"', 'itemprop="og:title"'],
          0,
          'Open Graph tags follow RDFa syntax using the property attribute.'
        ),
        makeLesson(
          'JSON-LD Structured Data (Schema.org)',
          'Embedding <script type="application/ld+json"> supplies explicit Schema.org entities (Course, FAQPage, Organization) directly to search engines.',
          'JSON-LD is preferred over inline Microdata attributes because it stays cleanly decoupled from HTML layout markup and is easy to validate and maintain.',
          'Ensure every claim in JSON-LD (course title, provider, pricing) matches visible text on the page to avoid manual search penalties.',
          'Schema.org Course JSON-LD Block',
          `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Course",\n  "name": "Python Engineering Track",\n  "description": "Beginner to Advanced Python with 48 lessons and exams.",\n  "provider": {\n    "@type": "Organization",\n    "name": "IT Courses"\n  }\n}\n</script>`,
          undefined,
          [
            'Browsers do not execute scripts with type="application/ld+json"; they treat them as data blocks.',
            'JSON-LD enables rich search results (course cards, ratings, breadcrumbs, FAQs).',
            'Structured data must accurately reflect visible on-page content.',
          ],
          [
            ['Leaving trailing commas inside JSON-LD blocks', 'JSON-LD must be strictly valid JSON—no comments and no trailing commas.'],
            ['Marking up hidden content that users cannot see on the page', 'Only include structured data describing visible content on that URL.'],
          ],
          [
            ['Why is JSON-LD preferred over Microdata (itemscope/itemprop)?', 'JSON-LD separates structured metadata from presentation DOM, preventing layout refactors from breaking schema markup.'],
            ['Does the browser run JavaScript inside <script type="application/ld+json">?', 'No; any non-JavaScript MIME type causes the browser to skip script execution and simply preserve the text data block.'],
          ],
          'How does the browser treat a <script type="application/ld+json"> element?',
          [
            'Stores it as an inert structured data block without executing it as JavaScript',
            'Executes it immediately as an ES module',
            'Throws a syntax error unless JSON.parse() is called',
            'Strips it from the DOM before rendering',
          ],
          0,
          'Non-JS MIME types on <script> act as embedded data blocks read by crawlers or app scripts.'
        ),
        makeLesson(
          'Internationalization: lang, dir & hreflang',
          'Global web apps declare script direction (dir="ltr" or dir="rtl"), inline language shifts, and localized alternate URLs via hreflang.',
          'When quoting a phrase in another language inside an English paragraph, mark the span with lang="fr" or lang="ja". Use <bdi> (Bidirectional Isolate) around user-generated usernames so right-to-left characters never scramble surrounding punctuation.',
          'Include rel="alternate" hreflang="x-default" alongside localized versions so search engines serve the right regional page.',
          'Multilingual Markup & Bidirectional Isolation',
          `<link rel="alternate" hreflang="en" href="https://itcourses.dev/en/html" />\n<link rel="alternate" hreflang="es" href="https://itcourses.dev/es/html" />\n<link rel="alternate" hreflang="x-default" href="https://itcourses.dev/en/html" />\n\n<p>Top scorer: <bdi>أحمد</bdi> — 98% (<span lang="fr">Félicitations</span>)</p>`,
          undefined,
          [
            'dir="rtl" on <html> flips document layout and reading direction for Arabic and Hebrew.',
            '<bdi> isolates unknown-direction user text so adjacent numbers and punctuation stay intact.',
            'hreflang links must be reciprocal across language variants.',
          ],
          [
            ['Interpolating arbitrary user names next to numbers without <bdi>', 'Wrap user-supplied strings in <bdi> to prevent Unicode bidirectional algorithm scrambling.'],
            ['Forgetting lang attributes on inline foreign-language phrases', 'Add lang="es" (etc.) on inline elements so screen readers switch pronunciation engines smoothly.'],
          ],
          [
            ['What problem does the <bdi> element solve?', 'It isolates bidirectional text (such as an Arabic username inside an English sentence) so the Unicode BiDi algorithm doesn’t reorder neighboring punctuation or numbers.'],
            ['What does hreflang="x-default" designate?', 'The fallback page URL for users whose language/region does not match any explicitly listed hreflang variant.'],
          ],
          'Which HTML element isolates user-generated text of unknown reading direction (LTR/RTL) from surrounding text?',
          ['<bdi>', '<bdo>', '<dir>', '<rtl>'],
          0,
          '<bdi> (Bidirectional Isolate) prevents RTL/LTR text inside it from reordering surrounding characters.'
        ),
      ],
      outputQuestions: [
        {
          prompt: 'Will the browser execute JavaScript code placed inside this tag?',
          code: `<script type="application/ld+json">\n  alert("hello");\n</script>`,
          options: ['No—it is ignored by the JS engine as a data block', 'Yes—it shows an alert popup', 'It throws a ReferenceError', 'It runs only in quirks mode'],
          correctIndex: 0,
          explanation: 'Browsers only execute JavaScript MIME types (or module/importmap); application/ld+json is treated strictly as inert data.',
        },
        {
          prompt: 'Which element forces an explicit reading direction override rather than mere isolation?',
          code: `<bdo dir="rtl">HTML5</bdo>`,
          options: ['<bdo> reverses character rendering to 5LMTH', '<bdo> isolates text without reversing', '<bdo> aligns the paragraph right', '<bdo> is deprecated and ignored'],
          correctIndex: 0,
          explanation: '<bdo> (Bidirectional Override) overrides the Unicode BiDi algorithm and renders characters strictly right-to-left.',
        },
      ],
    },
    {
      level: 'Advanced',
      title: 'WAI-ARIA & Accessibility Engineering',
      description: 'Apply the First Rule of ARIA, live regions, keyboard roving tabindex, and accessible custom widgets.',
      lessons: [
        makeLesson(
          'The First Rule of ARIA & Accessibility Tree',
          'Every browser builds an Accessibility Tree from the DOM—and native HTML elements already carry built-in roles, states, and keyboard behaviors.',
          'The First Rule of ARIA states: if you can use a native HTML element (<button>, <a href>, <input>) with the semantics you need, do so instead of repurposing a <div> with ARIA. Remember: ARIA only changes what assistive technology announces—it NEVER adds keyboard listeners.',
          'Test every interactive screen using only Tab, Shift+Tab, Enter, Space, and Arrow keys.',
          'Native Button vs Incomplete ARIA Div',
          `<!-- Preferred: built-in role, focus, Enter & Space handling -->\n<button type="button" aria-expanded="false" aria-controls="filters">\n  Filter Courses\n</button>\n\n<div id="filters" hidden>...</div>`,
          undefined,
          [
            'Native HTML beats ARIA-patched divs because native elements include keyboard and focus behavior.',
            'ARIA attributes modify the Accessibility Tree only—never visual styling or JS events.',
            'aria-expanded + aria-controls communicate disclosure state cleanly.',
          ],
          [
            ['Adding role="button" to a <div> without tabindex="0" and Enter/Space keydown handlers', 'Use a real <button type="button"> instead.'],
            ['Putting role="presentation" on a focusable element', 'Never hide focusable elements from the accessibility tree; screen reader users will land on silent phantom stops.'],
          ],
          [
            ['What is the First Rule of ARIA?', 'Do not use ARIA if a native HTML element or attribute already provides the semantics and behavior you need.'],
            ['What happens if you put aria-hidden="true" on a focusable button?', 'Keyboard users can still Tab to it, creating a confusing "ghost" focus stop that screen readers cannot announce—a WCAG violation.'],
          ],
          'What does adding role="button" to a <div> NOT automatically provide?',
          [
            'Keyboard focusability and Enter/Space activation',
            'Announcement as a button in the accessibility tree',
            'A valid WAI-ARIA role attribute',
            'Compatibility with screen reader role queries',
          ],
          0,
          'ARIA only changes accessibility metadata; it never adds tabindex focusability or keyboard event handling.'
        ),
        makeLesson(
          'ARIA Live Regions & Dynamic Status Announcements',
          'Single-page applications update content without full reloads, so screen readers rely on ARIA live regions to announce toasts, quiz feedback, and search result counts.',
          'Use aria-live="polite" (or role="status") for non-urgent updates like "Showing 12 courses" or "Code copied", and aria-live="assertive" (or role="alert") strictly for urgent errors like failed form validation.',
          'Render the live region container in the DOM BEFORE injecting text into it; inserting a brand-new element with aria-live simultaneously can be missed by some screen readers.',
          'Polite Status vs Assertive Alert Live Regions',
          `<!-- Mount container early, inject text dynamically -->\n<div role="status" aria-live="polite" aria-atomic="true">\n  Quiz saved: 7 of 8 correct.\n</div>\n\n<div role="alert">\n  Please enter a valid email address.\n</div>`,
          undefined,
          [
            'role="status" implies aria-live="polite"; role="alert" implies aria-live="assertive".',
            'aria-atomic="true" announces the entire region text rather than just the changed text node.',
            'Keep live region containers mounted before updating their inner text.',
          ],
          [
            ['Using aria-live="assertive" for routine notifications or counters', 'Reserve assertive/alert for urgent errors; use polite/status for normal updates so you do not interrupt ongoing speech.'],
            ['Mounting and unmounting the aria-live wrapper at the exact moment text changes', 'Keep the live region node persistent in the layout and update its children.'],
          ],
          [
            ['When should you choose aria-live="polite" over aria-live="assertive"?', 'Use polite for non-critical feedback (toast confirmations, filter counts) so the screen reader finishes its current sentence; use assertive only for critical errors or warnings.'],
            ['What does aria-atomic="true" control?', 'It instructs assistive tech to read the whole live region as one coherent unit when any part of it changes.'],
          ],
          'Which live-region setting should be used for a non-urgent "Copied to clipboard" toast notification?',
          ['role="status" (aria-live="polite")', 'role="alert" (aria-live="assertive")', 'aria-live="off"', 'role="dialog"'],
          0,
          'Polite live regions wait for the screen reader to finish speaking before announcing routine status feedback.'
        ),
        makeLesson(
          'Focus Management, tabindex & Roving Tabindex',
          'Predictable focus order lets keyboard users navigate complex UIs like tabs, toolbars, and drawers effortlessly.',
          'Never use positive tabindex values (tabindex="1", "2") because they hijack natural DOM reading order. Use tabindex="0" to include a custom widget in natural order, and tabindex="-1" to make headings or panels programmatically focusable via element.focus().',
          'For composite widgets like tab lists, apply roving tabindex: active tab has tabindex="0", inactive tabs have tabindex="-1", and Left/Right arrow keys move focus between them.',
          'Accessible Tablist with Roving Tabindex',
          `<div role="tablist" aria-label="Course levels">\n  <button role="tab" aria-selected="true" tabindex="0">Beginner</button>\n  <button role="tab" aria-selected="false" tabindex="-1">Intermediate</button>\n  <button role="tab" aria-selected="false" tabindex="-1">Advanced</button>\n</div>`,
          undefined,
          [
            'tabindex="0" inserts an element into natural DOM tab order; tabindex="-1" allows JS .focus() only.',
            'Avoid positive tabindex (>0)—fix DOM source order instead.',
            'Roving tabindex keeps Tab presses fast across multi-item toolbars and tab lists.',
          ],
          [
            ['Using tabindex="1", tabindex="2" to patch visual CSS reordering', 'Keep DOM order matching visual order and avoid positive tabindex values completely.'],
            ['Removing focus outlines with outline: none', 'Style crisp :focus-visible rings so keyboard users always see where focus is located.'],
          ],
          [
            ['What is the difference between tabindex="0" and tabindex="-1"?', 'tabindex="0" makes an element reachable by pressing Tab in natural DOM order; tabindex="-1" excludes it from Tab order while still allowing JavaScript element.focus().'],
            ['Why is :focus-visible better than :focus for styling outlines?', ':focus-visible displays the focus ring for keyboard navigation while avoiding distracting outlines on mouse clicks for buttons.'],
          ],
          'What does tabindex="-1" allow on a non-interactive element such as a heading or modal container?',
          [
            'Programmatic focus via element.focus() without adding it to the Tab sequence',
            'Places it first in the keyboard Tab sequence',
            'Prevents all click and scroll events',
            'Hides the element from screen readers',
          ],
          0,
          'tabindex="-1" enables script-driven focus management (e.g., focusing a newly opened panel heading) without cluttering Tab order.'
        ),
        makeLesson(
          'Accessible Name Computation: aria-label vs aria-labelledby',
          'Assistive technologies compute an element’s accessible name using a strict precedence algorithm.',
          'aria-labelledby takes highest priority (even overriding visible text and aria-label), followed by aria-label, then native host-language labels (<label for>, alt, visible button text), and finally title as a last resort.',
          'Prefer aria-labelledby pointing to visible headings over hidden aria-label strings so labels automatically stay translated and synchronized.',
          'Accessible Name Precedence Examples',
          `<section aria-labelledby="quiz-heading">\n  <h2 id="quiz-heading">Section 1 Quiz</h2>\n  <button type="button" aria-label="Close modal">\n    <span aria-hidden="true">×</span>\n  </button>\n</section>`,
          undefined,
          [
            'Accessible name precedence: aria-labelledby > aria-label > native label/text > title.',
            'Icon-only buttons MUST have an aria-label or sr-only text.',
            'aria-labelledby can combine multiple IDs (aria-labelledby="item-name delete-verb").',
          ],
          [
            ['Putting aria-label="Edit" on a button whose visible text is "Save Changes"', 'aria-label overrides visible text for screen readers and breaks voice-control commands ("Click Save Changes"); ensure accessible names start with visible label text.'],
            ['Using title attributes as the sole label on icon buttons', 'title tooltips are inaccessible on touch devices and unreliable across screen readers; use aria-label.'],
          ],
          [
            ['What happens if a button has both visible text "Submit" and aria-label="Send Exam"?', 'Screen readers announce "Send Exam" because aria-label takes precedence over inner text—which violates WCAG Label in Name unless the visible text is included.'],
            ['Why can aria-labelledby reference a hidden element?', 'The Accessible Name spec explicitly resolves IDs referenced by aria-labelledby even if the target element has hidden or display: none.'],
          ],
          'Which attribute has the HIGHEST precedence in the W3C Accessible Name Computation algorithm?',
          ['aria-labelledby', 'aria-label', 'title', 'placeholder'],
          0,
          'aria-labelledby overrides aria-label, native labels, inner text, and title.'
        ),
      ],
      outputQuestions: [
        {
          prompt: 'What accessible name will a screen reader announce for this button?',
          code: `<span id="title">Python Course</span>\n<button aria-labelledby="title" aria-label="Ignore Me">Open</button>`,
          options: ['"Python Course"', '"Ignore Me"', '"Open"', '"Python Course Open"'],
          correctIndex: 0,
          explanation: 'aria-labelledby takes precedence over both aria-label and visible text content.',
        },
        {
          prompt: 'In what order does pressing Tab visit these elements?',
          code: `<button>First</button>\n<button tabindex="2">Second</button>\n<button tabindex="1">Third</button>`,
          options: ['Third -> Second -> First', 'First -> Second -> Third', 'First -> Third -> Second', 'Second -> Third -> First'],
          correctIndex: 0,
          explanation: 'Positive tabindex values are visited first in ascending numeric order (1, then 2), followed by elements in natural order (0). This is why positive tabindex is an anti-pattern.',
        },
      ],
    },
    {
      level: 'Advanced',
      title: 'Web Components & Shadow DOM',
      description: 'Author reusable framework-agnostic Custom Elements with Shadow DOM encapsulation and declarative slots.',
      lessons: [
        makeLesson(
          'Custom Elements Lifecycle & Naming Rules',
          'Web Components let you define native HTML tags with custom behavior backed by standard browser APIs.',
          'Every custom element tag name MUST contain a hyphen (e.g., <course-badge>) so it never collides with future built-in HTML tags. Lifecycle callbacks—connectedCallback, disconnectedCallback, and attributeChangedCallback—manage setup, cleanup, and reactive attributes.',
          'Clean up event listeners and timers in disconnectedCallback to prevent memory leaks in single-page apps.',
          'Custom Element Tag Usage & Definition',
          `<course-badge level="Advanced" score="95"></course-badge>\n<script type="module">\n  class CourseBadge extends HTMLElement {\n    connectedCallback() {\n      this.textContent = \`\${this.getAttribute('level')} (\${this.getAttribute('score')}%)\`;\n    }\n  }\n  customElements.define('course-badge', CourseBadge);\n</script>`,
          'Advanced (95%)',
          [
            'Custom element names must be lowercase and include at least one hyphen (-).',
            'Never read attributes or append children inside constructor(); use connectedCallback().',
            'Observe specific attributes via static observedAttributes = ["score"].',
          ],
          [
            ['Naming a custom element <badge> without a hyphen', 'Always include a hyphen such as <it-badge> or customElements.define() throws a SyntaxError.'],
            ['Mutating DOM children inside the constructor()', 'Wait until connectedCallback() so the parser has finished constructing the element.'],
          ],
          [
            ['Why must Custom Element names contain a hyphen?', 'The HTML specification guarantees built-in standard tags will never contain a hyphen, permanently preventing name collisions.'],
            ['Which lifecycle callback fires when an observed attribute changes?', 'attributeChangedCallback(name, oldValue, newValue) fires only for attributes listed in static observedAttributes.'],
          ],
          'Which of the following is a VALID Custom Element tag name?',
          ['<code-viewer>', '<codeviewer>', '<Code-Viewer>', '<1-code>'],
          0,
          'Custom element names must start with a lowercase ASCII letter and contain at least one hyphen.'
        ),
        makeLesson(
          'Shadow DOM Encapsulation & Declarative Shadow DOM',
          'Shadow DOM scopes component CSS and internal markup so global styles cannot leak in and component styles cannot leak out.',
          'Modern browsers also support Declarative Shadow DOM (<template shadowrootmode="open">), allowing server-rendered HTML to attach a Shadow Root during initial HTML parsing with zero JavaScript flash.',
          'Expose deliberate styling hooks via CSS custom properties (--accent) and ::part() rather than breaking encapsulation.',
          'Declarative Shadow DOM in Pure HTML',
          `<status-card>\n  <template shadowrootmode="open">\n    <style>\n      p { font-weight: 600; color: var(--card-accent, #4f46e5); }\n    </style>\n    <p part="label"><slot></slot></p>\n  </template>\n  Passed with 92%\n</status-card>`,
          'Passed with 92% (scoped styling immediately during HTML parse)',
          [
            'Declarative Shadow DOM renders scoped components before any JavaScript executes.',
            'CSS custom properties (variables) inherit across Shadow DOM boundaries intentionally.',
            'part="name" allows external CSS to style specific internal elements via ::part(name).',
          ],
          [
            ['Assuming CSS variables cannot cross Shadow DOM', 'Inherited properties (color, font-family) and CSS custom properties DO cross Shadow boundaries; regular selectors do not.'],
            ['Using shadowrootmode="closed" unnecessarily', 'Prefer mode="open" so testing tools, analytics, and accessibility audits can inspect the component cleanly.'],
          ],
          [
            ['What problem does Declarative Shadow DOM solve?', 'It enables SSR (Server-Side Rendering) of Web Components without waiting for JavaScript to hydrate and call attachShadow().'],
            ['How can page CSS style a specific element inside an open Shadow Root?', 'Through inherited CSS custom properties (--var) or by targeting exposed parts with host::part(button).'],
          ],
          'Which attribute on <template> creates a Declarative Shadow Root during HTML parsing without JavaScript?',
          ['shadowrootmode="open"', 'shadow="true"', 'scoped-dom="open"', 'encapsulate="shadow"'],
          0,
          '<template shadowrootmode="open"> instructs the HTML parser to attach a Shadow Root automatically.'
        ),
        makeLesson(
          'Content Projection with Named & Default <slot>s',
          'Slots compose user-supplied light DOM children inside a Shadow DOM layout template while keeping them accessible and SEO-indexable.',
          'An unnamed <slot></slot> captures default children, while <slot name="footer"></slot> captures light-DOM elements carrying slot="footer". Fallback content placed inside <slot>Default</slot> renders whenever nothing is projected.',
          'Remember that slotted elements remain in the light DOM and are styled by the host page’s stylesheet (or via ::slotted() in Shadow CSS).',
          'Named & Fallback Slots',
          `<course-card>\n  <span slot="eyebrow">Databases</span>\n  <h3>PostgreSQL</h3>\n</course-card>\n\n<!-- Inside Shadow Root -->\n<div class="card">\n  <slot name="eyebrow">General</slot>\n  <slot></slot>\n</div>`,
          undefined,
          [
            'Light DOM children stay in the main document tree and project visually into matching <slot>s.',
            'Content inside <slot>Fallback</slot> displays only when no matching node is assigned.',
            'Listen to the slotchange event to react when projected children are added or removed.',
          ],
          [
            ['Trying to select slotted descendants with .card h3 inside Shadow CSS', 'Shadow CSS cannot descend into slotted trees; use ::slotted(h3) for top-level slotted elements.'],
            ['Forgetting that slot="..." only works on direct children of the custom element host', 'Place the slot attribute directly on a top-level child of the custom element.'],
          ],
          [
            ['Where do slotted elements physically live in the DOM?', 'They remain in the host’s light DOM and are merely projected visually into the Shadow DOM’s composed tree.'],
            ['When does fallback content inside <slot> appear?', 'Whenever zero light-DOM nodes are assigned to that slot.'],
          ],
          'Where must the slot="header" attribute be placed to project into <slot name="header"> inside a custom element?',
          [
            'On a direct child element of the custom element host',
            'On the custom element host itself',
            'Inside the Shadow Root stylesheet',
            'On the <template> tag',
          ],
          0,
          'Only direct children of a Shadow host can be assigned to named slots via the slot attribute.'
        ),
        makeLesson(
          'Form-Associated Custom Elements (ElementInternals)',
          'Standard custom elements do not participate in <form> submission until they opt in via static formAssociated = true and attachInternals().',
          'ElementInternals lets a custom control register its value with FormData, report Constraint Validation errors via setValidity(), and respond to formResetCallback().',
          'Use ElementInternals when building design-system inputs like custom date pickers or tag inputs that must work inside plain HTML forms.',
          'Using a Form-Associated Custom Control',
          `<form action="/profile" method="post">\n  <label for="rating">Confidence Score</label>\n  <star-rating id="rating" name="confidence" value="4"></star-rating>\n  <button type="submit">Save</button>\n</form>`,
          undefined,
          [
            'static formAssociated = true enables native <form> integration for custom elements.',
            'internals.setFormValue(val) includes the custom element in FormData automatically.',
            'internals.setValidity() connects custom components to native browser validation.',
          ],
          [
            ['Expecting <my-input name="x"> to appear in FormData automatically', 'Unless static formAssociated = true and setFormValue() are implemented, forms ignore custom elements.'],
            ['Skipping formResetCallback()', 'Implement formResetCallback() so clicking <button type="reset"> restores the custom control’s default value.'],
          ],
          [
            ['What API lets a Web Component integrate with native <form> validation and FormData?', 'ElementInternals via this.attachInternals() combined with static formAssociated = true.'],
            ['Can ElementInternals also set default ARIA roles on a custom element?', 'Yes—internals.role and internals.ariaChecked set default accessibility states without cluttering host HTML attributes.'],
          ],
          'Which static class property allows a Custom Element to participate in native HTML <form> submission?',
          ['static formAssociated = true', 'static isFormControl = true', 'static submitEnabled = true', 'static nativeForm = true'],
          0,
          'Setting static formAssociated = true notifies the browser that the custom element interacts with ancestor <form> elements.'
        ),
      ],
      outputQuestions: [
        {
          prompt: 'What text renders inside <info-pill></info-pill> given this Declarative Shadow DOM template?',
          code: `<info-pill>\n  <template shadowrootmode="open">\n    <slot>Unassigned</slot>\n  </template>\n</info-pill>`,
          options: ['Unassigned', 'Empty string', '<slot>Unassigned</slot>', 'Throws a ShadowRoot error'],
          correctIndex: 0,
          explanation: 'Because no light-DOM child was supplied, the default <slot> renders its fallback content "Unassigned".',
        },
        {
          prompt: 'What does customElements.define("widget", MyWidget) do at runtime?',
          code: `customElements.define("widget", class extends HTMLElement {});`,
          options: [
            'Throws a SyntaxError (DOMException) because the tag name has no hyphen',
            'Registers <widget> successfully',
            'Automatically renames it to <x-widget>',
            'Silently ignores the call',
          ],
          correctIndex: 0,
          explanation: 'All custom element names must contain at least one hyphen; otherwise define() throws a SyntaxError.',
        },
      ],
    },
    {
      level: 'Advanced',
      title: 'Performance, Security & Browser Pipeline',
      description: 'Optimize Critical Rendering Path, resource priority hints, CSP hardening, and Subresource Integrity.',
      lessons: [
        makeLesson(
          'Critical Rendering Path, Preload & fetchpriority',
          'HTML markup directly controls how quickly the browser discovers, fetches, and paints the Largest Contentful Paint (LCP) element.',
          'The browser’s HTML preload scanner scans raw markup for <img>, <link>, and <script> URLs before JS executes. Adding fetchpriority="high" on the hero image and <link rel="preload" as="font" crossorigin> for primary display fonts cuts layout shifts and speeds up first paint.',
          'Avoid overusing rel="preload"—preloading too many assets starves the actual LCP resource of bandwidth.',
          'Optimizing LCP Discovery & Font Preloading',
          `<head>\n  <link rel="preload" href="/fonts/jakarta.woff2" as="font" type="font/woff2" crossorigin />\n  <link rel="preload" href="/img/hero.webp" as="image" fetchpriority="high" />\n</head>\n<body>\n  <img src="/img/hero.webp" alt="Workspace" width="1200" height="675" fetchpriority="high" />\n</body>`,
          undefined,
          [
            'Font preloads MUST include the crossorigin attribute or the browser downloads the font twice.',
            'fetchpriority="high" elevates the hero image ahead of lower-priority scripts.',
            'Keep critical hero images directly in HTML rather than hidden behind CSS background-image.',
          ],
          [
            ['Forgetting crossorigin on <link rel="preload" as="font">', 'Fonts are always fetched in CORS mode; omitting crossorigin causes a double download.'],
            ['Preloading 10+ assets in <head>', 'Preload only the 1–2 truly critical LCP resources so bandwidth stays focused.'],
          ],
          [
            ['Why must <link rel="preload" as="font"> include the crossorigin attribute even for same-origin fonts?', 'The CSS Fonts specification requires fonts to be fetched with CORS credentials mode anonymous; without crossorigin, the preload cache key mismatches the CSS request and downloads twice.'],
            ['Why is <img> faster for LCP than a CSS background-image?', 'The HTML preload scanner discovers <img src> immediately in the initial HTML stream, whereas CSS background images cannot be discovered until CSS is downloaded, parsed, and matched to DOM nodes.'],
          ],
          'Why is the crossorigin attribute mandatory on <link rel="preload" as="font">?',
          [
            'Without it, the preload cache key mismatches CSS font requests and downloads the font twice',
            'Browsers refuse to parse WOFF2 files without crossorigin',
            'It automatically compresses the font with Brotli',
            'It prevents third-party sites from hotlinking the font',
          ],
          0,
          'Font fetches always use anonymous CORS mode, so matching crossorigin prevents duplicate downloads.'
        ),
        makeLesson(
          'Subresource Integrity (SRI) & Cross-Origin Policies',
          'When loading scripts or stylesheets from third-party CDNs, Subresource Integrity verifies a cryptographic hash before execution.',
          'If a CDN is compromised and the file bytes change by even one character, the browser refuses to execute the script because its SHA-384 digest no longer matches the integrity attribute.',
          'Always pair integrity with crossorigin="anonymous" so the browser can read the response bytes and verify the hash.',
          'Subresource Integrity on External Assets',
          `<script\n  src="https://cdn.example.net/lib@2.1.0/index.min.js"\n  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"\n  crossorigin="anonymous"\n  defer\n></script>`,
          undefined,
          [
            'SRI protects against compromised third-party CDNs using SHA-256/384/512 hashes.',
            'crossorigin="anonymous" is required for SRI checks on cross-origin URLs.',
            'Pin exact version URLs—never use SRI on mutable /latest/ URLs that change silently.',
          ],
          [
            ['Adding integrity to a mutable CDN URL like /library@latest.js', 'When the CDN updates @latest, the hash mismatches and breaks your production site; always pin immutable version URLs.'],
            ['Omitting crossorigin="anonymous" alongside integrity', 'Without CORS headers and crossorigin, browsers cannot inspect cross-origin bytes to validate SRI.'],
          ],
          [
            ['What happens if an external script fails its Subresource Integrity check?', 'The browser blocks execution completely and logs a security error to the console, protecting users from supply-chain tampering.'],
            ['Which hash algorithms are valid in the integrity attribute?', 'sha256, sha384, and sha512 (base64-encoded); sha384 is the common default.'],
          ],
          'What does the browser do if a third-party stylesheet fails its integrity="sha384-..." verification?',
          [
            'Blocks the stylesheet from being applied',
            'Applies the stylesheet anyway with a console warning',
            'Falls back to HTTP without TLS',
            'Prompts the user with a confirmation dialog',
          ],
          0,
          'SRI enforces fail-closed security: tampered resources are rejected completely.'
        ),
        makeLesson(
          'HTML Security: XSS Prevention & Content Security Policy',
          'Cross-Site Scripting (XSS) occurs when untrusted strings are injected into HTML markup or event attributes without proper escaping.',
          'Never concatenate untrusted input into innerHTML or inline attributes like onclick="..." or href="javascript:...". Combine context-aware escaping with a strict Content-Security-Policy (CSP) disallowing inline scripts.',
          'Use textContent instead of innerHTML whenever inserting plain text into the DOM.',
          'Safe DOM Rendering vs CSP Meta Tag',
          `<meta\n  http-equiv="Content-Security-Policy"\n  content="default-src 'self'; script-src 'self'; object-src 'none'"\n/>\n\n<!-- Safe: never construct href from unvalidated schemes -->\n<a href="https://itcourses.dev/verify/ITC-2026">Verify</a>`,
          undefined,
          [
            'Escape HTML special characters or use textContent when rendering user strings.',
            'Validate URL schemes (allow only https:, http:, mailto:) to block javascript: XSS.',
            'A strict CSP without unsafe-inline blocks injected inline script execution.',
          ],
          [
            ['Allowing arbitrary user URLs directly into <a href={userUrl}>', 'Check new URL(userUrl).protocol is http: or https: so javascript:alert(1) cannot execute on click.'],
            ['Using innerHTML to display a user’s display name', 'Use textContent (or React JSX text interpolation) which never parses HTML tags.'],
          ],
          [
            ['Why isn’t HTML-escaping alone enough for <a href="USER_INPUT">?', 'Even with < and > escaped, a value like javascript:fetch(...) is valid inside href and executes when clicked; you must validate the URL protocol.'],
            ['How does Content-Security-Policy mitigate XSS?', 'By restricting which origins and nonces are allowed to execute scripts, blocking attacker-injected inline <script> blocks even if an injection bug exists.'],
          ],
          'Why is inserting user-supplied text via element.textContent safer than element.innerHTML?',
          [
            'textContent inserts raw literal text without invoking the HTML parser',
            'textContent automatically strips only <script> tags while keeping <b> tags',
            'textContent encodes URLs with encodeURIComponent',
            'innerHTML is deprecated in HTML5',
          ],
          0,
          'textContent never parses markup, making HTML/script injection impossible.'
        ),
        makeLesson(
          'Speculation Rules & View Transitions Meta',
          'Modern HTML enables instant multi-page navigations using declarative Speculation Rules prerendering and cross-document View Transitions.',
          'A <script type="speculationrules"> JSON block tells Chromium-based browsers which high-probability links to prefetch or prerender on hover/moderate eagerness, while maintaining graceful fallback in other browsers.',
          'Only prerender idempotent GET pages—never prerender logout, checkout, or state-mutating URLs.',
          'Declarative Speculation Rules for Instant Navigation',
          `<script type="speculationrules">\n{\n  "prerender": [\n    {\n      "where": { "href_matches": "/courses/*" },\n      "eagerness": "moderate"\n    }\n  ]\n}\n</script>`,
          undefined,
          [
            'type="speculationrules" is safely ignored by browsers that do not support it (progressive enhancement).',
            'eagerness: "moderate" waits for pointer hover (~200ms), balancing speed and bandwidth.',
            'Exclude state-changing endpoints like /logout or /cart/remove from prerender rules.',
          ],
          [
            ['Prerendering every link on a page with eagerness: "immediate"', 'Use moderate or conservative eagerness to avoid wasting mobile data and server load.'],
            ['Including /signout in a wildcard prerender pattern', 'Explicitly exclude mutating URLs with not href_matches rules.'],
          ],
          [
            ['How does Speculation Rules prerendering differ from <link rel="prefetch">?', 'prefetch only downloads the HTML document into cache, whereas prerender loads, parses, and renders the full page in an invisible background tab for near-0ms navigation.'],
            ['What happens in browsers that do not support type="speculationrules"?', 'They treat the unknown script type as an inert data block with zero errors, preserving standard link navigation.'],
          ],
          'Which eagerness level in Speculation Rules triggers prerendering when a user hovers over a link?',
          ['moderate', 'immediate', 'lazy', 'hover-only'],
          0,
          'moderate eagerness triggers on pointer hover (~200ms) or pointerdown, saving bandwidth compared to immediate.'
        ),
      ],
      outputQuestions: [
        {
          prompt: 'Which protocol inside <a href="..."> poses an XSS risk even if quotes and angle brackets are escaped?',
          code: `<a href="javascript:document.title='hacked'">Profile</a>`,
          options: ['javascript:', 'mailto:', 'https:', 'tel:'],
          correctIndex: 0,
          explanation: 'javascript: URLs execute arbitrary script when clicked unless filtered to an allowlist of safe schemes (http:, https:, mailto:).',
        },
        {
          prompt: 'What happens if a browser that does not support Speculation Rules parses this tag?',
          code: `<script type="speculationrules">{"prefetch":[{"source":"document"}]}</script>`,
          options: [
            'It safely ignores the block with no runtime error',
            'It throws an Uncaught SyntaxError',
            'It executes the JSON as JavaScript',
            'It blocks rendering of the rest of the page',
          ],
          correctIndex: 0,
          explanation: 'HTML parsers ignore <script> elements with unrecognized MIME types, making speculationrules safe progressive enhancement.',
        },
      ],
    },
    {
      level: 'Advanced',
      title: 'HTML5 Browser APIs & Declarative Streaming',
      description: 'Connect semantic HTML directly to native browser capabilities: data-* attributes, File/Clipboard APIs, Declarative Shadow DOM, and streaming SSR.',
      lessons: [
        makeLesson(
          'Custom data-* Attributes & Dataset Contracts',
          'HTML5 data-* attributes provide a standards-compliant namespace for attaching structured metadata to DOM elements without polluting global IDs or CSS classes.',
          'Browsers map hyphenated attributes like data-course-slug="html" automatically to camelCase properties on element.dataset (el.dataset.courseSlug), while CSS can read them via [data-state="open"] or attr().',
          'Keep data-* values small, non-sensitive strings—never store secrets, PII, or megabytes of serialized JSON in HTML attributes.',
          'Declarative State Hooks with data-* Attributes',
          `<button\n  type="button"\n  data-course-slug="html"\n  data-lesson-index="48"\n  data-state="ready"\n>\n  Complete Lesson\n</button>`,
          undefined,
          [
            'Every custom data attribute must start with data- followed by lowercase letters, digits, or hyphens.',
            'JavaScript reads and writes them via element.dataset using camelCase property names.',
            'Styling via [data-state="active"] decouples UI state cleanly from utility or BEM class names.',
          ],
          [
            ['Using uppercase letters in data-userId attributes in HTML', 'HTML attribute names are lowercased by the parser; write data-user-id so dataset.userId maps predictably.'],
            ['Embedding auth tokens or raw user PII inside data-* attributes', 'Anyone can inspect DOM attributes via DevTools or third-party scripts; keep sensitive data server-side or in HttpOnly cookies.'],
          ],
          [
            ['How does data-quiz-score="95" map onto element.dataset in JavaScript?', 'Hyphens are stripped and converted to camelCase, producing element.dataset.quizScore === "95" (always a string).'],
            ['Why is [data-state="open"] often preferred over toggling .is-open classes?', 'Attribute selectors enforce mutually exclusive states (e.g., idle, loading, open, error) instead of accumulating conflicting boolean classes.'],
          ],
          'How do you access the HTML attribute data-section-id="s12" via the DOM dataset API?',
          ['element.dataset.sectionId', 'element.dataset["section-id"]', 'element.data.sectionId', 'element.dataset.dataSectionId'],
          0,
          'The dataset API removes the data- prefix and converts kebab-case to camelCase (sectionId).'
        ),
        makeLesson(
          'Native File Inputs, Accept Filters & Drag-and-Drop',
          'HTML <input type="file"> combined with accept, multiple, and capture attributes provides accessible file selection across desktop and mobile devices without custom plugins.',
          'Setting accept=".pdf,image/png,image/jpeg" guides the OS file picker, while the native Drag-and-Drop attributes (draggable="true") work alongside keyboard-accessible button alternatives.',
          'Always re-validate uploaded file types and magic bytes on the server; HTML accept is a UX convenience, never a security barrier.',
          'Accessible Multi-File Upload Input',
          `<label for="project-files">Upload project screenshots (PNG/JPG)</label>\n<input\n  id="project-files"\n  name="screenshots"\n  type="file"\n  accept="image/png,image/jpeg"\n  multiple\n/>`,
          undefined,
          [
            'accept filters file pickers by MIME type or file extension.',
            'multiple allows selecting more than one file in a single dialog.',
            'Always pair visual drag-and-drop zones with a real keyboard-focusable <input type="file">.',
          ],
          [
            ['Relying solely on accept="image/png" for upload security', 'Users can select "All Files" or spoof requests; always inspect MIME/bytes server-side.'],
            ['Building a drag-and-drop upload box with no clickable/focusable file input', 'Keyboard and screen reader users cannot drag files with a mouse; always expose a labeled file input.'],
          ],
          [
            ['Why must a drag-and-drop file uploader still include a standard <input type="file">?', 'To satisfy keyboard accessibility (WCAG 2.1.1) and support touch devices where desktop drag-and-drop does not exist.'],
            ['What does capture="environment" do on a mobile file input?', 'It hints mobile browsers to open the rear-facing camera directly when accept="image/*" or "video/*" is set.'],
          ],
          'Does setting accept=".png" on <input type="file"> guarantee the server only receives valid PNG files?',
          [
            'No—it is a client-side picker hint and must always be verified server-side',
            'Yes—browsers cryptographically verify file headers before submission',
            'Yes—HTML forms reject non-matching MIME types automatically',
            'Only when paired with the required attribute',
          ],
          0,
          'The accept attribute only filters the OS picker UI; attackers or users switching to "All Files" can upload anything.'
        ),
        makeLesson(
          'Declarative Shadow DOM & Server-Side Rendering',
          'Declarative Shadow DOM lets servers stream encapsulated Web Component shadow trees directly in HTML via <template shadowrootmode="open"> with zero JavaScript required for first paint.',
          'Before Declarative Shadow DOM, Web Components suffered a flash of unstyled content (FOUC) because attachShadow() only ran after JS booted. Now the HTML parser attaches the shadow root immediately as bytes arrive.',
          'Use Declarative Shadow DOM when SSR-ing design system components so crawlers and slow devices receive complete styled markup immediately.',
          'Zero-JS Server-Rendered Shadow DOM',
          `<status-card>\n  <template shadowrootmode="open">\n    <style>\n      :host { display: block; border: 1px solid #cbd5e1; padding: 1rem; border-radius: 0.75rem; }\n    </style>\n    <slot></slot>\n  </template>\n  <p>Rendered immediately during HTML parsing.</p>\n</status-card>`,
          undefined,
          [
            '<template shadowrootmode="open"> attaches a shadow root during HTML parsing without JS.',
            'Eliminates Flash of Unstyled Custom Elements (FOUCE) in SSR architectures.',
            'Supports <slot> projection identically to imperative attachShadow().',
          ],
          [
            ['Calling this.attachShadow() blindly in a custom element constructor when DSD already attached one', 'Check if (!this.shadowRoot) before calling attachShadow() so SSR hydration does not throw.'],
            ['Using deprecated shadowroot="open" attribute instead of shadowrootmode="open"', 'The standardized cross-browser attribute is shadowrootmode="open" or "closed".'],
          ],
          [
            ['What problem does Declarative Shadow DOM solve for Web Components?', 'It allows Shadow DOM trees and scoped <style> blocks to be server-rendered and parsed immediately into HTML before JavaScript downloads or executes.'],
            ['What happens if a custom element upgrades when Declarative Shadow DOM already exists?', 'this.shadowRoot is already populated, so the class can bind events directly without re-creating the shadow tree.'],
          ],
          'Which attribute on <template> instructs the HTML parser to attach a Declarative Shadow DOM immediately?',
          ['shadowrootmode="open"', 'shadow="true"', 'encapsulate="open"', 'attach-shadow="auto"'],
          0,
          '<template shadowrootmode="open"> (or "closed") creates the shadow root directly during HTML parsing.'
        ),
        makeLesson(
          'Internationalization (i18n), RTL & Bidirectional Text',
          'Truly global HTML marks language changes with lang, text direction with dir="rtl" or dir="auto", and isolates embedded opposite-direction strings using <bdi>.',
          'Without <bdi> (Bidirectional Isolation), inserting an Arabic or Hebrew username inside an English sentence followed by a number can scramble punctuation and digits due to the Unicode Bidirectional Algorithm.',
          'Always set lang and dir on <html>, use dir="auto" for unpredictable user-generated fields, and wrap dynamic usernames in <bdi>.',
          'Safe Bidirectional Markup with lang, dir & <bdi>',
          `<p lang="en" dir="ltr">\n  Top scorer: <bdi>أحمد</bdi> — 98 points (<span lang="es">Excelente</span>)\n</p>`,
          undefined,
          [
            'lang changes pronunciation rules for screen readers and hyphenation/spellcheck in browsers.',
            'dir="rtl" flips reading order and aligns CSS logical properties (margin-inline-start) automatically.',
            '<bdi> isolates user-supplied text so mixed LTR/RTL punctuation never scrambles.',
          ],
          [
            ['Hardcoding physical left/right layout assumptions instead of dir + logical CSS', 'Use dir="rtl" on <html> paired with CSS logical properties (inline-start/end) so layouts mirror effortlessly.'],
            ['Injecting user names directly into mixed-direction strings without <bdi>', 'Wrap dynamic user strings in <bdi> so RTL characters do not reorder adjacent numbers or punctuation.'],
          ],
          [
            ['When should you use the <bdi> element instead of <span>?', 'Whenever rendering user-generated text of unknown directionality (such as usernames or search terms) inside surrounding text so bidirectional reordering stays isolated.'],
            ['Why is setting lang on inline foreign-language phrases important?', 'Screen readers switch voice synthesizers and pronunciation rules to match the inline lang attribute, preventing garbled speech.'],
          ],
          'Which HTML element isolates a short piece of text whose directionality (LTR/RTL) is unknown from surrounding punctuation?',
          ['<bdi>', '<bdo>', '<rtl>', '<isolate>'],
          0,
          '<bdi> (Bidirectional Isolate) prevents opposite-direction text from corrupting surrounding punctuation and numbers.'
        ),
      ],
      outputQuestions: [
        {
          prompt: 'What does el.dataset.courseLevel return for this element?',
          code: `<div id="card" data-course-level="Advanced"></div>`,
          options: ['"Advanced"', 'undefined', '"course-level"', 'Throws TypeError'],
          correctIndex: 0,
          explanation: 'HTML data-course-level maps automatically to element.dataset.courseLevel.',
        },
        {
          prompt: 'When does the browser attach the shadow root for this markup?',
          code: `<my-badge><template shadowrootmode="open"><span>Pro</span></template></my-badge>`,
          options: [
            'Immediately during HTML parsing—before JavaScript executes',
            'Only after customElements.define() runs',
            'Only after window.onload fires',
            'Never—template tags are always inert',
          ],
          correctIndex: 0,
          explanation: 'Declarative Shadow DOM (<template shadowrootmode="open">) is instantiated directly by the HTML parser.',
        },
      ],
    },
  ],
  project: {
    title: 'Accessible Developer Conference Landing & Registration Page',
    estimatedHours: 4,
    difficulty: 'Beginner to Advanced',
    brief:
      'Build a single-page semantic HTML5 conference site featuring a skip link, landmark layout, accessible schedule data table, responsive speaker gallery using <picture>, native <details> FAQ accordion, native <dialog> ticket confirmation, and a validated registration form with JSON-LD Event metadata.',
    requirements: [
      'Include a valid HTML5 boilerplate with lang, UTF-8 charset, viewport, Open Graph tags, and JSON-LD Event structured data.',
      'Implement full landmark structure (header, labeled nav, single main, footer) plus a keyboard-visible skip-to-content link.',
      'Build the conference schedule using a semantic <table> with <caption>, <thead>, <tbody>, and <th scope="col|row">.',
      'Display speaker portraits with <picture> (WebP + JPEG fallback), explicit width/height, lazy loading, and descriptive alt text.',
      'Create an exclusive FAQ accordion using native <details name="faq"> and <summary> elements with zero JavaScript.',
      'Build a registration <form> with explicit <label for>, <fieldset>/<legend>, inputmode="numeric", native validation attributes, and a <dialog> confirmation modal.',
    ],
    steps: [
      ['Configure Document Head & SEO', 'Create index.html with <!DOCTYPE html>, metadata, canonical URL, Open Graph tags, and a Schema.org Event JSON-LD block.'],
      ['Build Landmarks & Skip Navigation', 'Add the skip link as the first child of <body>, followed by <header>, labeled <nav>, <main id="main-content">, and <footer>.'],
      ['Author the Schedule Table', 'Structure talks into a <table> with <caption>, time slots using <time datetime="...">, and proper scope attributes.'],
      ['Add Responsive Media & Native FAQ', 'Implement <picture> speaker cards and an exclusive <details name="conf-faq"> accordion.'],
      ['Engineer the Accessible Registration Form', 'Wire <label>, <fieldset>/<legend>, autocomplete tokens, required/pattern constraints, and aria-describedby error text.'],
      ['Add Native <dialog> Confirmation', 'Use <dialog> with showModal() and <form method="dialog"> to confirm registration cleanly on the top layer.'],
    ],
    referenceSolution: [
      {
        filename: 'index.html',
        language: 'html',
        code: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DevSummit 2026 — Systems &amp; Web Engineering</title>
    <meta name="description" content="Two-day engineering conference covering web standards, databases, and distributed systems." />
    <link rel="canonical" href="https://devsummit.example.dev/" />
    <meta property="og:title" content="DevSummit 2026" />
    <meta property="og:type" content="website" />
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": "DevSummit 2026",
        "startDate": "2026-11-20T09:00:00Z"
      }
    </script>
  </head>
  <body>
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <header>
      <a href="/">DevSummit</a>
      <nav aria-label="Primary">
        <a href="#schedule">Schedule</a>
        <a href="#faq">FAQ</a>
        <a href="#register">Register</a>
      </nav>
    </header>

    <main id="main-content">
      <h1>DevSummit 2026</h1>
      <p>Join engineers on <time datetime="2026-11-20">November 20, 2026</time>.</p>

      <section id="schedule" aria-labelledby="schedule-heading">
        <h2 id="schedule-heading">Conference Schedule</h2>
        <table>
          <caption>Day 1 Technical Sessions</caption>
          <thead>
            <tr>
              <th scope="col">Time</th>
              <th scope="col">Session</th>
              <th scope="col">Track</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row"><time datetime="09:30">09:30</time></th>
              <td>Accessibility Tree Internals</td>
              <td>Web Standards</td>
            </tr>
            <tr>
              <th scope="row"><time datetime="11:00">11:00</time></th>
              <td>PostgreSQL Query Planning</td>
              <td>Databases</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section id="faq" aria-labelledby="faq-heading">
        <h2 id="faq-heading">Frequently Asked Questions</h2>
        <details name="conf-faq" open>
          <summary>Are sessions captioned live?</summary>
          <p>Yes, every track includes live human captioning and WebVTT transcripts.</p>
        </details>
        <details name="conf-faq">
          <summary>Can I transfer my ticket?</summary>
          <p>Tickets may be reassigned up to 48 hours before opening keynote.</p>
        </details>
      </section>

      <section id="register" aria-labelledby="reg-heading">
        <h2 id="reg-heading">Register Your Seat</h2>
        <form id="reg-form">
          <label for="full-name">Full Name</label>
          <input id="full-name" name="fullName" type="text" autocomplete="name" required minlength="2" />

          <label for="email">Work Email</label>
          <input id="email" name="email" type="email" autocomplete="email" required />

          <fieldset>
            <legend>Pass Type</legend>
            <label><input type="radio" name="pass" value="in-person" checked /> In-Person</label>
            <label><input type="radio" name="pass" value="remote" /> Remote Stream</label>
          </fieldset>

          <button type="submit">Reserve Ticket</button>
        </form>
      </section>
    </main>

    <dialog id="confirm-dialog" aria-labelledby="dialog-title">
      <form method="dialog">
        <h2 id="dialog-title">Registration Confirmed</h2>
        <p id="dialog-summary">Your seat is reserved.</p>
        <button value="ok">Done</button>
      </form>
    </dialog>

    <footer>
      <p>© 2026 DevSummit Engineering Conference</p>
    </footer>
    <script src="./register.js" defer></script>
  </body>
</html>`,
      },
      {
        filename: 'register.js',
        language: 'javascript',
        code: `const form = document.getElementById('reg-form');
const dialog = document.getElementById('confirm-dialog');
const summary = document.getElementById('dialog-summary');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  const data = new FormData(form);
  summary.textContent = \`Confirmed \${data.get('pass')} pass for \${data.get('fullName')} (\${data.get('email')}).\`;
  dialog.showModal();
  form.reset();
});`,
      },
    ],
  },
};

buildAndEmitCourse(htmlCourse);
console.log('Emitted course: html');
