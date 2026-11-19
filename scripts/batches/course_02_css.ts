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

const cssCourse: CompactCourse = {
  slug: 'css',
  order: 2,
  title: 'CSS',
  shortTitle: 'CSS3',
  area: 'Web',
  tagline: 'Cascade mastery, Flexbox & Grid layout systems, responsive architecture, animations, and modern CSS.',
  description:
    'Master modern CSS from the box model, specificity, and cascade layers through Flexbox, CSS Grid, subgrid, container queries, fluid typography, custom properties, compositor-only animations, and maintainable design systems.',
  codeLanguage: 'css',
  estimatedHours: 20,
  prerequisites: ['HTML document structure and semantic tags'],
  whatYoullLearn: [
    'Predict and control Cascade, Specificity, Inheritance, and @layer ordering',
    'Build responsive layouts using Flexbox, CSS Grid, auto-fit, and Subgrid',
    'Architect scalable Light/Dark themes with CSS Custom Properties and color-mix()',
    'Use Container Queries (@container), :has(), and clamp() fluid typography',
    'Create jank-free 60fps compositor animations honoring prefers-reduced-motion',
    'Debug stacking contexts, z-index isolation, and overflow clipping bugs',
  ],
  levelSummaries: {
    Beginner: 'Selectors, specificity, box model, units, typography, colors, and normal document flow.',
    Intermediate: 'Flexbox, CSS Grid, positioning, stacking contexts, responsive queries, and transitions.',
    Advanced: 'Cascade @layer, Container Queries, :has(), custom properties, subgrid, and render performance.',
  },
  sections: [
    {
      level: 'Beginner',
      title: 'Selectors, Cascade & Specificity',
      description: 'Understand how browsers resolve competing CSS rules via origin, importance, specificity, and source order.',
      lessons: [
        L(
          'How the Cascade Resolves Conflicts',
          'CSS evaluates competing declarations in strict order: Origin & Importance, Cascade Layers, Specificity, and Source Order.',
          'Inline styles outrank author stylesheets, and !important inverts origin priority so user-agent and user !important rules beat author !important rules. When two selectors share identical specificity, the rule declared later in CSS wins—NOT the order of class names in HTML.',
          'Keep selector specificity flat and predictable (single classes) instead of escalating with IDs or !important.',
          'Source Order vs HTML Class Order',
          `.btn-primary { background: #4f46e5; }\n.btn-danger  { background: #dc2626; }\n\n/* Even with class="btn-danger btn-primary",\n   .btn-danger wins because it appears later in CSS. */`,
          'Background renders #dc2626 (red).',
          [
            'Order of classes in the HTML class attribute has zero effect on cascade priority.',
            'Source order in the stylesheet breaks ties between equal-specificity selectors.',
            'Avoid !important in application code; reserve it only for intentional utility overrides.',
          ],
          [
            ['Expecting class="b a" to make .a override .b regardless of CSS order', 'Cascade tie-breaking follows stylesheet order, not HTML attribute order.'],
            ['Reaching for !important to fix specificity collisions', 'Lower selector specificity or organize overrides with @layer instead.'],
          ],
          [
            ['Does the order of class names inside class="a b" change which CSS rule wins?', 'No. Only stylesheet order, specificity, layers, and importance determine the winning declaration.'],
            ['What are the main steps of the CSS Cascade?', 'Origin & !important, Context, @layer order, Inline styles, Specificity (ID, Class, Element), and Source Order.'],
          ],
          'If .alpha and .beta both set color and .beta appears later in the CSS file, what color applies to <p class="beta alpha">?',
          ['The color declared in .beta', 'The color declared in .alpha', 'The browser averages both colors', 'Neither applies due to conflict'],
          0,
          'Equal specificity ties are always resolved by later stylesheet source order, never HTML class order.'
        ),
        L(
          'Specificity Math: (ID, Class, Type)',
          'Specificity is calculated as a three-column tuple (A, B, C): IDs in A, classes/attributes/pseudo-classes in B, and type/pseudo-elements in C.',
          'Columns never overflow into the next column—100 chained classes (0, 100, 0) still lose to a single ID selector #header (1, 0, 0). The universal selector (*) and combinators (>, +, ~) contribute (0, 0, 0).',
          'Use :where() to wrap complex selectors with zero specificity so downstream overrides stay effortless.',
          'Comparing Specificity Tuples',
          `/* (1, 0, 0) */  #nav a { color: red; }       /* (1, 0, 1) */\n/* (0, 2, 1) */  .nav .link:hover { color: blue; }\n/* (0, 0, 0) */  :where(.nav .link) { color: slategray; }`,
          '#nav a (1,0,1) beats .nav .link:hover (0,2,1).',
          [
            'Specificity is compared lexicographically: ID > Class/Attribute/Pseudo-class > Type/Pseudo-element.',
            ':where() always has 0 specificity; :is() and :not() adopt the highest specificity among their arguments.',
            'Combinators (>, +, ~, space) add zero specificity.',
          ],
          [
            ['Styling components with #id selectors', 'Use reusable .class selectors so components remain easy to override and compose.'],
            ['Assuming :not(.active) adds zero specificity', ':not() adds the specificity of its most specific selector argument (0, 1, 0 here).'],
          ],
          [
            ['What is the difference in specificity between :is(.a, #b) and :where(.a, #b)?', ':is(.a, #b) takes the highest argument specificity (1, 0, 0) for ALL matches, whereas :where(.a, #b) always has (0, 0, 0) specificity.'],
            ['Does a pseudo-element like ::before count in column B or column C?', 'Pseudo-elements (::before, ::after) count in column C (type), while pseudo-classes (:hover, :focus) count in column B (class).'],
          ],
          'What is the specificity of ul#menu > li.active a:hover?',
          ['(1, 2, 3)', '(1, 3, 2)', '(2, 2, 2)', '(0, 3, 3)'],
          0,
          '1 ID (#menu), 2 class/pseudo-class (.active, :hover), and 3 element types (ul, li, a) = (1, 2, 3).'
        ),
        L(
          'Combinators, Attribute Selectors & Pseudo-Classes',
          'Combinators target structural DOM relationships while attribute selectors match exact, prefix, suffix, or substring attribute values.',
          'The child combinator (>) matches direct children only, adjacent sibling (+) matches the immediately following sibling, and general sibling (~) matches all following siblings. Structural pseudo-classes like :nth-child(2n+1) and :focus-visible keep markup clean without extra classes.',
          'Always prefer :focus-visible over :focus for focus outlines so keyboard users get crisp rings without mouse-click flashes.',
          'Precision Combinators & Attribute Selectors',
          `a[href^="https://"]::after { content: " ↗"; }\ninput[type="email"]:invalid:not(:placeholder-shown) {\n  border-color: #dc2626;\n}\nli + li { margin-top: 0.5rem; }`,
          undefined,
          [
            'A + B selects B only when immediately preceded by sibling A (great for spacing between items).',
            'Attribute matchers: ^= (starts with), $= (ends with), *= (contains).',
            ':focus-visible matches keyboard focus while suppressing rings on mouse button clicks.',
          ],
          [
            ['Styling :invalid immediately on page load before the user types', 'Combine :invalid with :user-invalid or :not(:placeholder-shown) so empty fresh forms do not show red errors.'],
            ['Over-nesting descendant selectors (.page .card .body ul li a)', 'Flatten selectors to 1–2 classes to keep specificity low and styles decoupled from DOM depth.'],
          ],
          [
            ['What is the difference between A > B and A B?', 'A > B matches only direct children of A, whereas A B matches B at any nested descendant depth inside A.'],
            ['What does li + li { margin-top: 8px } achieve cleanly?', 'It adds top margin to every list item except the first one, avoiding trailing or leading extra spacing.'],
          ],
          'Which selector targets only <a href="..."> links whose URL ends with ".pdf"?',
          ['a[href$=".pdf"]', 'a[href^=".pdf"]', 'a[href*=".pdf"]', 'a[href~=".pdf"]'],
          0,
          '$= matches attribute values ending with the specified suffix.'
        ),
        L(
          'Inheritance & Explicit Keywords (inherit, initial, revert)',
          'Typography and color properties inherit down the DOM tree automatically, whereas layout properties like border, padding, and margin do not.',
          'Form controls like <button> and <input> often do NOT inherit font-family from body due to browser user-agent styles, so modern resets explicitly declare font: inherit on form controls. revert rolls a property back to the browser’s user-agent default rather than the CSS spec initial value.',
          'Use all: revert or font: inherit deliberately when resetting browser button styles.',
          'Controlling Inheritance on Form Controls',
          `body {\n  font-family: "Plus Jakarta Sans", sans-serif;\n  color: #0f172a;\n}\nbutton, input, select, textarea {\n  font: inherit;\n  color: inherit;\n}`,
          undefined,
          [
            'Inherited by default: color, font-*, line-height, text-align, visibility, cursor.',
            'Not inherited by default: margin, padding, border, background, width, display.',
            'initial resets to spec default (e.g. display: inline even on div); revert resets to browser UA default (display: block on div).',
          ],
          [
            ['Using display: initial on a <div> expecting display: block', 'The CSS spec initial value of display is inline for all elements; use display: revert to restore block.'],
            ['Forgetting font: inherit on buttons and inputs', 'Without font: inherit, inputs fall back to the OS default system font instead of your page typeface.'],
          ],
          [
            ['What is the difference between initial, unset, and revert?', 'initial uses the CSS specification default; unset acts like inherit for inherited properties and initial otherwise; revert rolls back to the browser’s user-agent stylesheet value.'],
            ['Why don’t borders or backgrounds inherit?', 'Inheriting box-model borders or padding to every child span would visually break nested inline elements.'],
          ],
          'What does setting display: initial on a <div> compute to?',
          ['inline', 'block', 'flex', 'none'],
          0,
          'The CSS specification initial value for the display property is always inline regardless of the HTML tag.'
        ),
      ],
      outputQuestions: [
        {
          prompt: 'Which color is applied to <p id="intro" class="lead highlight">Hello</p>?',
          code: `#intro { color: navy; }\n.lead.highlight { color: crimson; }\np.lead.highlight { color: green; }`,
          options: ['navy', 'crimson', 'green', 'Browser default black'],
          correctIndex: 0,
          explanation: '#intro has specificity (1,0,0), which strictly beats (0,2,1) regardless of how many classes are chained.',
        },
        {
          prompt: 'Which text color applies to <span class="badge">New</span>?',
          code: `:where(#app .badge) { color: red; }\n.badge { color: indigo; }`,
          options: ['indigo', 'red', 'black', 'transparent'],
          correctIndex: 0,
          explanation: ':where() always evaluates to (0,0,0) specificity even when containing an ID, so .badge (0,1,0) wins.',
        },
      ],
    },
    {
      level: 'Beginner',
      title: 'Box Model, Sizing & Spacing',
      description: 'Control content, padding, borders, margins, box-sizing, margin collapsing, and logical properties.',
      lessons: [
        L(
          'The Box Model & box-sizing: border-box',
          'Every CSS box consists of content, padding, border, and margin. By default (content-box), width applies only to content, making padding and borders expand total width.',
          'Setting box-sizing: border-box universally includes padding and border inside the declared width and height—making percentage columns like width: 50% with padding fit cleanly side by side.',
          'Apply *, *::before, *::after { box-sizing: border-box; } at the start of every stylesheet.',
          'Universal border-box Reset',
          `*, *::before, *::after {\n  box-sizing: border-box;\n}\n.card {\n  width: 300px;\n  padding: 24px;\n  border: 1px solid #e2e8f0;\n  /* Total rendered width stays exactly 300px */\n}`,
          'Rendered box width = 300px (content width = 250px).',
          [
            'content-box total width = width + padding-left + padding-right + border-left + border-right.',
            'border-box total width = declared width (padding and border carve inward).',
            'Margins are always outside the border box and never included in width.',
          ],
          [
            ['Setting width: 100% plus padding: 16px under content-box', 'Switch to box-sizing: border-box so width: 100% never triggers horizontal scrollbars.'],
            ['Forgetting ::before and ::after pseudo-elements in the border-box reset', 'Include *, *::before, *::after so decorative pseudo-elements size identically.'],
          ],
          [
            ['If a div has width: 200px, padding: 20px, border: 5px solid under content-box, what is its rendered width?', '200 + 40 + 10 = 250px. Under border-box, its rendered width is 200px.'],
            ['Does margin affect element.getBoundingClientRect().width?', 'No; getBoundingClientRect() measures the border box (content + padding + border), excluding margin.'],
          ],
          'An element has box-sizing: content-box; width: 100px; padding: 10px; border: 2px solid black. What is its total rendered width?',
          ['124px', '100px', '112px', '120px'],
          0,
          'Under content-box, rendered width = 100 + (10 * 2) + (2 * 2) = 124px.'
        ),
        L(
          'Margin Collapsing & Formatting Contexts',
          'In normal block flow, adjacent vertical margins collapse into the larger of the two margins rather than summing together.',
          'Margin collapsing happens ONLY on vertical margins in block flow—never on horizontal margins, never inside Flexbox or CSS Grid containers, and never across a Block Formatting Context (BFC) such as display: flow-root or overflow: hidden.',
          'Prefer Flexbox/Grid gap for spacing sibling elements cleanly without margin-collapsing surprises.',
          'Preventing Parent-Child Margin Collapse with flow-root',
          `.wrapper {\n  display: flow-root; /* Establishes BFC without clipping overflow */\n  background: #f8fafc;\n}\n.wrapper > h2 {\n  margin-top: 32px; /* Stays cleanly inside .wrapper */\n}`,
          undefined,
          [
            'Adjacent vertical margins of 24px and 16px collapse to 24px, not 40px.',
            'Flex and Grid items never collapse margins with siblings or parents.',
            'display: flow-root creates a clean BFC without overflow: hidden clipping side effects.',
          ],
          [
            ['Expecting two stacked paragraphs with margin: 20px 0 to sit 40px apart', 'Their vertical margins collapse to 20px in normal block flow.'],
            ['Using overflow: hidden just to contain child margins and accidentally breaking position: sticky', 'Use display: flow-root instead—it establishes a BFC while keeping sticky positioning intact.'],
          ],
          [
            ['When does vertical margin collapsing NOT occur?', 'Inside Flex or Grid containers, on floated or absolutely positioned elements, when separated by padding/border, or across a Block Formatting Context.'],
            ['What does display: flow-root do?', 'It creates a new Block Formatting Context cleanly, containing floats and preventing parent-child margin collapse without clipping shadows or sticky elements.'],
          ],
          'Two sibling <p> elements in normal block flow have margin-bottom: 24px and margin-top: 16px respectively. What is the vertical space between them?',
          ['24px', '40px', '16px', '8px'],
          0,
          'Adjacent vertical margins collapse to max(24px, 16px) = 24px.'
        ),
        L(
          'CSS Logical Properties for Global Layouts',
          'Logical properties replace physical directions (left, right, top, bottom) with writing-mode-aware directions (inline-start, inline-end, block-start, block-end).',
          'Using padding-inline, margin-block, and border-inline-start makes your interface automatically mirror for right-to-left (RTL) languages like Arabic and Hebrew when dir="rtl" is set on <html>.',
          'Adopt shorthand logical utilities like margin-inline: auto for horizontal centering and padding-block for vertical padding.',
          'Logical Spacing & Shorthands',
          `.container {\n  inline-size: min(100% - 2rem, 72rem);\n  margin-inline: auto;\n  padding-block: 3rem;\n  border-inline-start: 2px solid #4f46e5;\n}`,
          undefined,
          [
            'inline axis = reading direction (horizontal in English); block axis = stacking direction (vertical).',
            'margin-inline: auto centers block elements horizontally across LTR and RTL.',
            'inset: 0 is the logical shorthand for top: 0; right: 0; bottom: 0; left: 0.',
          ],
          [
            ['Mixing physical margin-left with logical margin-inline-end on the same component', 'Standardize on logical properties throughout internationalized design systems.'],
            ['Assuming block always means vertical', 'In vertical writing modes (Japanese vertical-rl), the block axis runs horizontally.'],
          ],
          [
            ['What physical properties does padding-inline: 16px map to in standard English (LTR)?', 'padding-left: 16px and padding-right: 16px.'],
            ['How does inset: 0 simplify absolute overlay positioning?', 'It replaces all four top/right/bottom/left: 0 declarations in a single concise line.'],
          ],
          'In horizontal left-to-right English layout, which properties are set by margin-block: 1rem 2rem?',
          ['margin-top: 1rem and margin-bottom: 2rem', 'margin-left: 1rem and margin-right: 2rem', 'All four margins set to 1.5rem', 'padding-top and padding-bottom'],
          0,
          'The block axis runs top-to-bottom in horizontal writing modes, so margin-block sets top and bottom margins.'
        ),
        L(
          'Intrinsic Sizing: min-content, max-content, fit-content & aspect-ratio',
          'Modern CSS sizing keywords and aspect-ratio let boxes adapt to content and preserve media proportions without padding-bottom hacks.',
          'aspect-ratio: 16 / 9 maintains exact video or card geometry across every screen width, while min(), max(), and clamp() compute fluid responsive dimensions in a single line without media queries.',
          'Combine max-width: 100%; height: auto; display: block; on images so media never overflows narrow containers.',
          'Fluid Sizing with aspect-ratio & min()',
          `.video-frame {\n  width: min(100%, 720px);\n  aspect-ratio: 16 / 9;\n  object-fit: cover;\n}\n.pill-tag {\n  width: fit-content;\n}`,
          undefined,
          [
            'aspect-ratio replaces legacy padding-top: 56.25% wrapper hacks.',
            'width: min(100%, 720px) acts as width: 100% + max-width: 720px in one property.',
            'fit-content shrinks to content width while still wrapping safely before overflowing its parent.',
          ],
          [
            ['Setting both fixed height and aspect-ratio simultaneously on a flexible container', 'Set one dimension (width) plus aspect-ratio so the browser calculates the other dimension smoothly.'],
            ['Forgetting object-fit: cover when applying aspect-ratio to <img> tags', 'Without object-fit: cover or contain, non-matching images stretch and distort.'],
          ],
          [
            ['How does fit-content differ from max-content?', 'max-content refuses to wrap text and can overflow narrow parents, whereas fit-content shrinks to content size when space allows but wraps gracefully when constrained.'],
            ['Why does object-fit: cover matter on responsive <img> cards?', 'It crops the image cleanly to fill the aspect-ratio box without distorting proportions.'],
          ],
          'Which CSS property maintains a 16:9 media container ratio across all widths without wrapper hacks?',
          ['aspect-ratio: 16 / 9', 'ratio: 16:9', 'box-ratio: 16 / 9', 'object-ratio: 16 / 9'],
          0,
          'aspect-ratio natively sets the preferred width-to-height ratio of a box.'
        ),
      ],
      outputQuestions: [
        {
          prompt: 'What is the total rendered width (border box) of .panel?',
          code: `.panel {\n  box-sizing: border-box;\n  width: 240px;\n  padding: 20px;\n  border: 4px solid #cbd5e1;\n  margin: 16px;\n}`,
          options: ['240px', '288px', '320px', '272px'],
          correctIndex: 0,
          explanation: 'Under box-sizing: border-box, padding and border fit inside the declared 240px width (margin is external).',
        },
        {
          prompt: 'What is the computed width of .box inside a 500px-wide viewport?',
          code: `.box {\n  width: clamp(200px, 50vw, 400px);\n}`,
          options: ['250px', '200px', '400px', '500px'],
          correctIndex: 0,
          explanation: '50vw of 500px is 250px, which lies between the 200px floor and 400px ceiling.',
        },
      ],
    },
    {
      level: 'Beginner',
      title: 'Units, Typography & Color Systems',
      description: 'Master rem vs em, fluid clamp() type scales, modern viewport units (dvh), and accessible color contrast.',
      lessons: [
        L(
          'Relative Units: rem, em, ch & Dynamic Viewport (dvh)',
          'Relative units scale harmoniously with user font preferences and mobile browser chrome.',
          'rem scales relative to the root <html> font-size (default 16px), preventing compounding bugs that happen with nested em font sizes. On mobile browsers, 100dvh dynamically adjusts as the address bar expands/collapses, solving the classic 100vh overflow bug.',
          'Use ch (width of "0") for reading line length (max-width: 65ch) to keep prose comfortable to scan.',
          'Modern Units in Production Layouts',
          `.hero {\n  min-height: 100dvh;\n}\n.article-prose {\n  font-size: 1rem;\n  line-height: 1.65;\n  max-width: 68ch;\n}`,
          undefined,
          [
            'Never set body font-size in px if it overrides user browser accessibility defaults; use rem.',
            '100dvh adapts dynamically to mobile URL bars; 100svh locks to the smallest visible viewport.',
            '60ch–75ch is the optimal typographic measure for long-form reading.',
          ],
          [
            ['Using em for font-size inside deeply nested <li> elements', 'Nested em font sizes compound multiplicatively (0.9 * 0.9 * 0.9); use rem for font-size and em only for component-local padding.'],
            ['Using height: 100vh on mobile full-screen drawers', 'Use min-height: 100dvh so bottom buttons are never hidden behind iOS/Android address bars.'],
          ],
          [
            ['What problem do svh, lvh, and dvh solve compared to vh?', 'Mobile browsers resize toolbars on scroll; vh stayed fixed to the large viewport, cutting off bottom UI. svh is smallest, lvh is largest, and dvh dynamically tracks the active viewport.'],
            ['Why is ch ideal for prose containers?', '1ch equals the advance width of the "0" glyph in the active font, keeping line length right around 65–75 characters regardless of font size.'],
          ],
          'Which viewport unit dynamically adjusts height as mobile browser address bars collapse and expand?',
          ['100dvh', '100vh', '100vmin', '100vw'],
          0,
          'dvh (dynamic viewport height) updates continuously as browser UI chrome shifts.'
        ),
        L(
          'Fluid Typography, line-height & tabular-nums',
          'Strong typographic hierarchy relies on unitless line-height, balanced headline wrapping, and tabular figures for aligned data.',
          'Always specify line-height as a unitless multiplier (1.5) rather than 24px or 150%, so child elements with larger or smaller font sizes inherit the ratio instead of a frozen pixel value. Apply text-wrap: balance on headings and font-variant-numeric: tabular-nums on timers and scores.',
          'Combine clamp(2rem, 4vw, 3.25rem) with rem + vw (never pure vw) so users can still zoom text up to 200% for WCAG compliance.',
          'Accessible Fluid Heading & Tabular Metrics',
          `h1 {\n  font-size: clamp(2rem, 1.5rem + 2.5vw, 3.25rem);\n  line-height: 1.15;\n  text-wrap: balance;\n}\n.metric-value {\n  font-variant-numeric: tabular-nums;\n}`,
          undefined,
          [
            'Unitless line-height inherits as a multiplier; px or % inherits the computed pixel length.',
            'Include a rem component inside clamp() preferred values so browser text zoom continues to scale.',
            'tabular-nums gives every digit equal width so countdown timers and tables never jitter.',
          ],
          [
            ['Writing font-size: 5vw without a rem floor or clamp()', 'Pure vw text ignores user zoom settings (WCAG failure) and becomes unreadable on tiny or ultrawide displays.'],
            ['Setting line-height: 150% on body', 'Percentage line-height computes once on body (24px) and causes giant h1 lines to collide; use unitless line-height: 1.5.'],
          ],
          [
            ['Why should line-height be unitless (1.5) instead of percentage (150%)?', 'With 150% on a 16px parent, child elements inherit the fixed computed value 24px even if a child has font-size: 40px; unitless 1.5 inherits the factor so 40px gets 60px line-height.'],
            ['What does font-variant-numeric: tabular-nums prevent?', 'Horizontal layout jitter in live timers, counters, and vertically aligned numeric table columns.'],
          ],
          'Why is line-height: 1.5 preferred over line-height: 150% on a parent container?',
          [
            'Unitless 1.5 inherits the scaling factor to children of any font size rather than a fixed computed pixel value',
            'Percentage line-height is invalid in CSS3',
            'Unitless values render faster on the GPU',
            '150% applies only to monospace fonts',
          ],
          0,
          'Percentage line-height inherits its computed pixel length from the parent, causing text overlap on larger descendants.'
        ),
        L(
          'Modern Color Spaces: oklch(), hsl() & color-mix()',
          'CSS Color Level 4 brings perceptually uniform color spaces like oklch() and native color blending via color-mix().',
          'Unlike HSL—where yellow and blue at 50% lightness have vastly different perceived brightness—OKLCH ensures equal L values produce consistent human contrast, making accessible palette ramps and dark-mode variants far easier to engineer.',
          'Verify WCAG AA contrast ratios: at least 4.5:1 for body text and 3:1 for large text and UI boundaries.',
          'Perceptual Palette with oklch() & color-mix()',
          `:root {\n  --accent: oklch(54% 0.22 268);\n  --accent-hover: color-mix(in oklch, var(--accent) 85%, black);\n  --accent-soft: color-mix(in oklch, var(--accent) 12%, white);\n}`,
          undefined,
          [
            'oklch(Lightness Chroma Hue) delivers predictable perceptual brightness across every hue.',
            'color-mix(in oklch, c1 p%, c2) creates hover tints and subtle surfaces dynamically in CSS.',
            'Space-separated rgb(15 23 42 / 0.8) syntax replaces legacy comma-separated rgba().',
          ],
          [
            ['Building dark mode by inverting lightness in HSL blindly', 'HSL lightness is not perceptually uniform; test real contrast ratios (4.5:1+) or use OKLCH.'],
            ['Conveying pass/fail status using green/red color alone', 'Always combine semantic colors with explicit icons or text labels for color-blind accessibility.'],
          ],
          [
            ['Why is OKLCH superior to HSL for generating design system palettes?', 'OKLCH is perceptually uniform: changing hue while holding lightness constant preserves consistent contrast ratios against backgrounds.'],
            ['What are the minimum WCAG AA contrast ratios for normal vs large text?', '4.5:1 for normal text (<18pt / 24px) and 3:1 for large text (>=18pt or >=14pt bold).'],
          ],
          'What is the minimum WCAG AA contrast ratio required for regular body text?',
          ['4.5:1', '2.0:1', '3.0:1', '10.0:1'],
          0,
          'WCAG 2.1 Level AA specifies 4.5:1 minimum contrast for normal text and 3:1 for large text.'
        ),
        L(
          'Web Fonts, font-display: swap & Fallback Metrics',
          'Loading custom fonts cleanly prevents Flash of Invisible Text (FOIT) and minimizes layout jumps when the web font swaps in.',
          'Setting font-display: swap renders system fallback text immediately and swaps in the custom font once downloaded. Modern @font-face descriptors like size-adjust and ascent-override align fallback metrics closely to your web font.',
          'Subset fonts to required scripts (latin) and serve WOFF2 exclusively—it offers 30%+ smaller files with universal browser support.',
          'Fast Web Font Declaration with Swap',
          `@font-face {\n  font-family: "Plus Jakarta Sans";\n  src: url("/fonts/jakarta-var.woff2") format("woff2");\n  font-weight: 400 800;\n  font-display: swap;\n}`,
          undefined,
          [
            'font-display: swap eliminates invisible text during slow network loads.',
            'Variable fonts bundle weights 400–800 in a single compact WOFF2 request.',
            'Always include a well-matched generic fallback family (ui-sans-serif, system-ui, sans-serif).',
          ],
          [
            ['Loading 8 separate static weight/italic font files when only 2 weights are used', 'Load only the active weights (e.g., 400, 600, 700) or one variable WOFF2 file.'],
            ['Omitting font-display (defaulting to auto/block)', 'Set font-display: swap (or optional) so users can read copy immediately on 3G connections.'],
          ],
          [
            ['What is the difference between FOIT and FOUT?', 'FOIT (Flash of Invisible Text) hides text until the web font loads; FOUT (Flash of Unstyled Text) shows the fallback font immediately and swaps once ready—generally better for readability and FCP.'],
            ['What does font-display: optional do?', 'It gives the font a tiny (~100ms) block window; if not cached/loaded in time, the browser keeps the fallback font for that navigation with zero layout shift.'],
          ],
          'Which font-display value shows fallback text immediately and replaces it once the web font finishes downloading?',
          ['swap', 'block', 'fallback-only', 'eager'],
          0,
          'font-display: swap uses an almost zero block period and swaps as soon as the font loads.'
        ),
      ],
      outputQuestions: [
        {
          prompt: 'What is the computed font-size of .inner given default root 16px?',
          code: `.outer { font-size: 1.5em; }\n.inner { font-size: 1.5em; }\n/* <div class="outer"><div class="inner">Hi</div></div> */`,
          options: ['36px', '24px', '16px', '48px'],
          correctIndex: 0,
          explanation: 'em compounds relative to its parent: .outer is 16 * 1.5 = 24px, and .inner is 24 * 1.5 = 36px.',
        },
        {
          prompt: 'What is the computed line-height of <h1> inside <body>?',
          code: `body { font-size: 16px; line-height: 1.5; }\nh1 { font-size: 32px; }`,
          options: ['48px', '24px', '32px', '16px'],
          correctIndex: 0,
          explanation: 'Unitless line-height 1.5 inherits as a multiplier, so 32px * 1.5 = 48px.',
        },
      ],
    },
    {
      level: 'Beginner',
      title: 'Display, Positioning & Stacking Contexts',
      description: 'Master relative, absolute, fixed, sticky positioning, z-index isolation, and overflow behavior.',
      lessons: [
        L(
          'Positioning Modes: relative, absolute, fixed & sticky',
          'CSS positioning removes elements from normal flow or anchors them to their containing block or scrollport.',
          'position: absolute anchors to the nearest ancestor with position other than static (typically position: relative). position: sticky toggles between relative and fixed within its scroll container—and fails silently if any ancestor sets overflow: hidden!',
          'Use overflow: clip instead of overflow: hidden on page wrappers when you want to clip horizontal overflow without breaking position: sticky.',
          'Sticky Header & Anchored Badge',
          `.toolbar {\n  position: sticky;\n  top: 0;\n  z-index: 20;\n}\n.avatar-wrap { position: relative; }\n.avatar-badge { position: absolute; inset-block-end: 0; inset-inline-end: 0; }`,
          undefined,
          [
            'position: relative keeps its original space in normal flow while creating an anchor for absolute children.',
            'position: sticky requires an offset (e.g. top: 0) and breaks if an ancestor uses overflow: hidden/auto.',
            'position: fixed anchors to the viewport unless an ancestor defines transform, filter, or perspective.',
          ],
          [
            ['Putting overflow-x: hidden on a wrapper containing a position: sticky sidebar', 'Use overflow-x: clip instead so sticky positioning continues working.'],
            ['Using position: fixed inside a parent with transform: translateZ(0)', 'An ancestor transform establishes a new containing block, trapping fixed children inside that ancestor.'],
          ],
          [
            ['Why does position: sticky sometimes stop sticking?', 'Either no threshold offset (top/bottom) was specified, the parent container is only as tall as the sticky element itself, or an ancestor sets overflow: hidden/scroll/auto.'],
            ['What changes the containing block of a position: fixed element?', 'An ancestor with transform, filter, backdrop-filter, perspective, or contain: paint becomes its containing block instead of the viewport.'],
          ],
          'Which ancestor CSS property silently breaks position: sticky on a descendant?',
          ['overflow: hidden', 'display: grid', 'background-color: white', 'border-radius: 12px'],
          0,
          'overflow: hidden creates a scroll container that traps sticky positioning; use overflow: clip if clipping is needed.'
        ),
        L(
          'Stacking Contexts & isolation: isolate',
          'z-index only compares elements within the SAME stacking context; a child with z-index: 99999 can never escape above a sibling of its parent stacking context.',
          'Many properties besides positioned z-index create a new stacking context: opacity < 1, transform, filter, backdrop-filter, and isolation: isolate. Explicitly using isolation: isolate on component roots prevents internal z-indexes from leaking into global menus.',
          'Maintain a small semantic z-index scale (10 sticky, 20 dropdown, 40 header, 50 modal) and use isolation: isolate on cards.',
          'Scoped Stacking Context with isolation: isolate',
          `.card {\n  position: relative;\n  isolation: isolate; /* Contains child z-indexes safely */\n}\n.card-bg {\n  position: absolute;\n  inset: 0;\n  z-index: -1; /* Sits behind card text, NOT behind page body */\n}`,
          undefined,
          [
            'z-index has no effect on position: static elements (unless they are flex/grid children).',
            'opacity < 1, transform, and filter implicitly create new stacking contexts.',
            'isolation: isolate creates a clean stacking context with zero visual side effects.',
          ],
          [
            ['Escalating z-index to 999999 when a dropdown renders behind a sibling card', 'Inspect which ancestor created a stacking context with lower z-index rather than inflating numbers.'],
            ['Setting z-index: -1 without isolation: isolate on the parent', 'Without isolation, z-index: -1 drops behind the parent’s own background.'],
          ],
          [
            ['Why can an element with z-index: 9999 appear behind an element with z-index: 2?', 'Because the 9999 element lives inside a parent stacking context whose z-index is lower than 2.'],
            ['Does z-index work on Flex or Grid items without position: relative?', 'Yes—the CSS Flexbox and Grid specs allow z-index directly on flex and grid items even when position is static.'],
          ],
          'Which CSS property creates a new stacking context cleanly with NO visual side effects (unlike opacity or transform)?',
          ['isolation: isolate', 'z-index: auto', 'display: block', 'pointer-events: auto'],
          0,
          'isolation: isolate was designed specifically to create an explicit stacking context cleanly.'
        ),
        L(
          'Overflow, Scrollbar Gutter & Overscroll Behavior',
          'Managing overflow cleanly prevents horizontal layout shifts when scrollbars appear and stops nested drawers from scrolling the background page.',
          'scrollbar-gutter: stable reserves scrollbar space so centered pages do not jump sideways when modals open. overscroll-behavior: contain inside scrollable sidebars stops scroll chaining from hijacking the main document.',
          'Always test scrollable containers at 390px mobile width to verify zero accidental horizontal page overflow.',
          'Polished Scroll Containment',
          `.sidebar-scroll {\n  overflow-y: auto;\n  overscroll-behavior: contain;\n  scrollbar-gutter: stable;\n}`,
          undefined,
          [
            'overscroll-behavior: contain prevents nested modals/sidebars from scrolling the underlying body.',
            'scrollbar-gutter: stable prevents horizontal layout shift when content toggles overflow.',
            'overflow: clip clips paint cleanly without creating a programmatic scroll container.',
          ],
          [
            ['Allowing wide code blocks or tables to stretch the entire <body> horizontally on mobile', 'Apply overflow-x: auto directly on <pre> and table wrappers, keeping min-width: 0 on grid/flex parents.'],
            ['Using overflow: scroll unconditionally (showing permanent empty scrollbars on Windows)', 'Use overflow: auto so scrollbars appear only when content actually overflows.'],
          ],
          [
            ['What does overscroll-behavior: contain do on a scrollable modal body?', 'When the user reaches the top or bottom of the modal content, scroll momentum stops there instead of chaining to scroll the page behind the modal.'],
            ['How does overflow: clip differ from overflow: hidden?', 'overflow: hidden still creates a scroll container that JavaScript can scroll and breaks position: sticky; overflow: clip purely clips visuals.'],
          ],
          'Which property prevents a scrollable sidebar from chaining scroll events to the main page once it hits the bottom?',
          ['overscroll-behavior: contain', 'scroll-snap-type: none', 'overflow-anchor: none', 'touch-action: pan-x'],
          0,
          'overscroll-behavior: contain isolates scroll chaining inside the scrollable container.'
        ),
        L(
          'Visibility, Opacity, display: none & Accessibility',
          'Hiding elements in CSS has three distinct behaviors affecting layout flow, keyboard focus, and assistive technology.',
          'display: none removes the box from layout and the accessibility tree; visibility: hidden preserves empty layout space while hiding content and blocking clicks; opacity: 0 makes an element invisible yet leaves it clickable and focusable unless paired with pointer-events/inert!',
          'Use a dedicated .sr-only class when text must be read by screen readers yet hidden visually.',
          'Visually Hidden (.sr-only) Pattern',
          `.sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip-path: inset(50%);\n  white-space: nowrap;\n  border: 0;\n}`,
          undefined,
          [
            'display: none removes layout box, clicks, Tab focus, and screen reader output.',
            'opacity: 0 stays in layout AND remains clickable and Tab-focusable.',
            '.sr-only hides content visually while keeping it accessible to screen readers.',
          ],
          [
            ['Hiding a closed dropdown with opacity: 0 alone', 'Invisible buttons with opacity: 0 still steal clicks and Tab stops; combine with visibility: hidden or inert/hidden.'],
            ['Using display: none on skip-to-content links or icon button labels', 'Use .sr-only so assistive technology and keyboard users can still reach them.'],
          ],
          [
            ['Compare display: none, visibility: hidden, and opacity: 0.', 'display: none collapses layout space and hides from AT; visibility: hidden reserves layout space and hides from AT/clicks; opacity: 0 reserves space and remains interactive and visible to AT.'],
            ['Can a child of visibility: hidden override it with visibility: visible?', 'Yes—unlike display: none or opacity: 0, a descendant with visibility: visible will render visibly inside a visibility: hidden parent.'],
          ],
          'Which hiding method leaves an element invisible yet still clickable and keyboard-focusable?',
          ['opacity: 0', 'display: none', 'visibility: hidden', 'HTML hidden attribute'],
          0,
          'opacity: 0 only changes visual alpha; pointer events and focus remain active unless explicitly disabled.'
        ),
      ],
      outputQuestions: [
        {
          prompt: 'Which box appears on top visually?',
          code: `.parent-a { position: relative; z-index: 1; }\n.child-a  { position: absolute; z-index: 9999; }\n.parent-b { position: relative; z-index: 2; }`,
          options: ['.parent-b appears on top of .child-a', '.child-a appears on top of .parent-b', 'They blend at 50% opacity', 'Browser throws a layout warning'],
          correctIndex: 0,
          explanation: '.child-a is trapped inside .parent-a’s stacking context (z-index: 1), which sits below sibling .parent-b (z-index: 2).',
        },
        {
          prompt: 'Can a user click a <button style="opacity: 0">Submit</button>?',
          code: `<button style="opacity: 0" onclick="alert('clicked')">Submit</button>`,
          options: ['Yes—opacity: 0 keeps pointer events and focus active', 'No—opacity: 0 disables clicks automatically', 'Only via keyboard, never mouse', 'No—opacity: 0 removes the element from DOM'],
          correctIndex: 0,
          explanation: 'opacity: 0 only alters rendered transparency without disabling pointer events or keyboard focus.',
        },
      ],
    },
    {
      level: 'Intermediate',
      title: 'Flexbox Layout Mastery',
      description: 'Master main vs cross axes, flex-grow/shrink/basis math, min-width: 0 truncation, and gap spacing.',
      lessons: [
        L(
          'Main Axis, Cross Axis & Alignment Properties',
          'Flexbox lays out items along one primary axis (row or column), with justify-content controlling the main axis and align-items controlling the cross axis.',
          'Switching flex-direction to column rotates both axes 90 degrees—so justify-content now aligns vertically and align-items aligns horizontally. Using gap replaces brittle margin hacks cleanly.',
          'Use margin-inline-start: auto on one flex child to push it to the far end of a navbar cleanly.',
          'Flexbox Navbar Alignment with Gap',
          `.navbar {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1.5rem;\n}\n.navbar .cta {\n  margin-inline-start: auto;\n}`,
          undefined,
          [
            'justify-content aligns along the main axis; align-items aligns along the cross axis.',
            'align-content only takes effect on multi-line wrapping containers (flex-wrap: wrap).',
            'gap works identically in both Flexbox and CSS Grid.',
          ],
          [
            ['Using align-content on a single-row flex container and wondering why nothing moves', 'Use align-items for single-line cross-axis alignment; align-content applies only when flex-wrap creates multiple lines.'],
            ['Using space-between without gap on wrapping rows', 'Always pair justify-content with gap so items never touch when viewports narrow.'],
          ],
          [
            ['What happens to justify-content and align-items when flex-direction: column is set?', 'The main axis becomes vertical, so justify-content aligns top-to-bottom and align-items aligns left-to-right.'],
            ['How do you push just the last item in a flex row to the right edge?', 'Apply margin-inline-start: auto (or margin-left: auto) on that specific item.'],
          ],
          'In a container with display: flex; flex-direction: column;, which property centers children horizontally?',
          ['align-items: center', 'justify-content: center', 'justify-items: center', 'text-align: center'],
          0,
          'In flex-direction: column, the cross axis is horizontal, controlled by align-items.'
        ),
        L(
          'Flex Sizing Math: flex-grow, flex-shrink & flex-basis',
          'The flex shorthand (flex: grow shrink basis) distributes leftover space or resolves overflow proportionally across children.',
          'flex: 1 expands to flex: 1 1 0%—giving items equal widths regardless of text length—whereas flex: auto expands to flex: 1 1 auto, distributing only leftover space on top of each item’s intrinsic content size. Use flex: none (0 0 auto) for fixed buttons and icons that must never squash.',
          'Always use the three-value flex shorthand (flex: 1, flex: none) rather than separate flex-grow declarations so flex-basis stays predictable.',
          'Equal Columns vs Non-Shrinking Sidebar',
          `.layout { display: flex; gap: 2rem; }\n.sidebar { flex: 0 0 260px; } /* Fixed 260px, never grows or shrinks */\n.main    { flex: 1 1 0%; }   /* Consumes all remaining space */`,
          undefined,
          [
            'flex: 1 === flex: 1 1 0% (equal-width distribution).',
            'flex: auto === flex: 1 1 auto (content-weighted growth).',
            'flex: none === flex: 0 0 auto (rigid size; ideal for icon badges and buttons).',
          ],
          [
            ['Forgetting flex-shrink: 0 on icons or avatars inside narrow flex rows', 'Add shrink-0 (flex-shrink: 0) so circular avatars never squish into ovals.'],
            ['Assuming flex-grow: 1 makes two differently sized items equal width', 'Without flex-basis: 0%, flex-grow only divides remaining free space; use flex: 1 instead.'],
          ],
          [
            ['What is the exact difference between flex: 1 and flex: auto?', 'flex: 1 sets flex-basis to 0% so space is split purely by grow ratios; flex: auto sets flex-basis to auto so each item starts at its content width before extra space is divided.'],
            ['How does flex-shrink distribute negative space when items overflow?', 'Shrinkage is weighted by (flex-shrink * flex-basis), so wider items shrink proportionally faster unless flex-shrink: 0 is set.'],
          ],
          'What longhand values does flex: 1 expand to in CSS?',
          ['flex-grow: 1; flex-shrink: 1; flex-basis: 0%', 'flex-grow: 1; flex-shrink: 0; flex-basis: auto', 'flex-grow: 1; flex-shrink: 1; flex-basis: auto', 'flex-grow: 1; flex-shrink: 0; flex-basis: 100%'],
          0,
          'flex: 1 sets grow: 1, shrink: 1, and basis: 0% so columns distribute space equally.'
        ),
        L(
          'The min-width: 0 Truncation Rule in Flexbox',
          'Flex items default to min-width: auto (their minimum content size), which silently stops text-overflow: ellipsis and wide <pre> blocks from shrinking!',
          'Whenever a flex child contains long unbroken text, code blocks, or truncated titles, setting min-width: 0 on that flex item overrides min-width: auto and lets text truncate or scroll cleanly inside the flex track.',
          'Remember: min-width: 0 belongs on the flex item wrapper—not just the nested heading inside it.',
          'Working Ellipsis Inside a Flex Row',
          `.lesson-row { display: flex; align-items: center; gap: 0.75rem; }\n.lesson-meta { flex: 1; min-width: 0; } /* Crucial! */\n.lesson-title {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}`,
          undefined,
          [
            'Flex items default to min-width: auto, preventing them from shrinking narrower than their content.',
            'Adding min-width: 0 allows flex children to shrink and enables text-overflow: ellipsis.',
            'The same rule applies to min-height: 0 inside flex-direction: column scroll panes.',
          ],
          [
            ['Putting overflow: hidden; text-overflow: ellipsis on a title inside flex without min-width: 0', 'Add min-width: 0 to the flex child so the ellipsis triggers instead of overflowing the viewport.'],
            ['Flex column inner scroll container expanding infinitely instead of scrolling', 'Apply min-height: 0 on the flex column item holding overflow-y: auto.'],
          ],
          [
            ['Why does text-overflow: ellipsis frequently fail inside Flexbox?', 'Because flex items have an automatic minimum size (min-width: auto) equal to their unbreakable content width; setting min-width: 0 allows the item to shrink.'],
            ['When is min-height: 0 required in Flexbox?', 'Inside a fixed-height flex-direction: column layout when a child panel needs internal vertical scrolling (overflow-y: auto).'],
          ],
          'Why does a flex item containing a long <pre> code block overflow its parent container by default?',
          [
            'Flex items default to min-width: auto, refusing to shrink below minimum content size unless min-width: 0 is set',
            'Flexbox disables overflow-x: auto on descendants',
            'flex-shrink defaults to 0',
            '<pre> forces position: absolute inside flex',
          ],
          0,
          'Setting min-width: 0 unlocks shrinking below intrinsic content width inside Flexbox.'
        ),
        L(
          'Flex Wrapping, Order & Accessibility Caveats',
          'flex-wrap: wrap enables fluid tag bars and responsive card rows, while order rearranges visual display without altering DOM order.',
          'Be careful with the CSS order property: keyboard Tab navigation and screen readers still follow the DOM source order, creating jarring jumps if order visually rearranges interactive controls.',
          'Reserve CSS order strictly for non-interactive visual adjustments, or reorder the DOM directly for major layout shifts.',
          'Wrapping Action Toolbar',
          `.filter-bar {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 0.5rem;\n}`,
          undefined,
          [
            'flex-wrap: wrap moves overflowing items onto new lines cleanly with row-gap and column-gap.',
            'CSS order changes visual paint order only—never DOM or keyboard Tab order.',
            'Use CSS Grid instead of Flexbox whenever you need strict 2D column alignment across rows.',
          ],
          [
            ['Using order: -1 to move a primary CTA button visually to the start while leaving it last in HTML', 'Reorder the actual HTML element so visual reading order and Tab focus order stay synchronized.'],
            ['Forcing a 3-column card grid in Flexbox where the last row stretches unevenly', 'Use CSS Grid (grid-template-columns: repeat(3, 1fr)) for symmetrical multi-row grids.'],
          ],
          [
            ['What accessibility hazard does CSS order introduce?', 'Screen readers and keyboard Tab order follow DOM sequence, not CSS visual order, causing focus to jump unpredictably across the screen.'],
            ['When should you pick Flexbox vs CSS Grid?', 'Use Flexbox for 1D content-driven flows (navbars, button groups, media rows); use CSS Grid for 2D track-driven layouts (page shells, card matrices).'],
          ],
          'When you change an element’s visual placement with CSS order: -1, what happens to keyboard Tab order?',
          [
            'Tab order remains unchanged, following the original HTML DOM order',
            'Tab order automatically updates to match the new visual position',
            'The element is removed from Tab order',
            'Tab order reverses for the whole page',
          ],
          0,
          'CSS order is strictly visual and does not update DOM or keyboard focus order.'
        ),
      ],
      outputQuestions: [
        {
          prompt: 'Inside a 600px wide flex container with 0 gap, what are the widths of .a and .b?',
          code: `.row { display: flex; width: 600px; }\n.a { flex: 1; }\n.b { flex: 2; }`,
          options: ['.a is 200px, .b is 400px', '.a is 300px, .b is 300px', '.a is 100px, .b is 200px', 'Depends strictly on their text length'],
          correctIndex: 0,
          explanation: 'flex: 1 and flex: 2 both set flex-basis: 0%, dividing 600px in a 1:2 ratio (200px and 400px).',
        },
        {
          prompt: 'Inside a 400px flex row, .icon has width: 40px; flex-shrink: 0; and .text has flex: 1; min-width: 0;. What width is .text?',
          code: `.row { display: flex; width: 400px; gap: 16px; }\n.icon { width: 40px; flex-shrink: 0; }\n.text { flex: 1; min-width: 0; }`,
          options: ['344px', '360px', '400px', '200px'],
          correctIndex: 0,
          explanation: '400px total minus 40px icon minus 16px gap leaves 344px for .text.',
        },
      ],
    },
    {
      level: 'Intermediate',
      title: 'CSS Grid & Subgrid Systems',
      description: 'Design two-dimensional layouts with fr tracks, minmax(), auto-fit responsive grids, named areas, and subgrid.',
      lessons: [
        L(
          'Explicit vs Implicit Tracks & minmax(0, 1fr)',
          'CSS Grid defines rows and columns simultaneously using fr (fractional free space) units and explicit vs auto-generated implicit tracks.',
          'A subtle trap: 1fr actually means minmax(auto, 1fr), which lets wide content blow out a column just like Flexbox! Writing minmax(0, 1fr) guarantees equal column widths even when a child contains a wide code block.',
          'Use grid-template-columns: repeat(3, minmax(0, 1fr)) for rock-solid equal columns.',
          'Blowout-Proof 3-Column Grid',
          `.course-grid {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 1.5rem;\n}`,
          undefined,
          [
            '1fr defaults to minmax(auto, 1fr); use minmax(0, 1fr) to prevent wide children from breaking columns.',
            'Implicit rows created beyond grid-template-rows are sized by grid-auto-rows.',
            'place-items: center centers both block and inline axes in one declaration.',
          ],
          [
            ['Using repeat(3, 1fr) with wide <pre> elements inside cards', 'Switch to repeat(3, minmax(0, 1fr)) (or min-width: 0 on items) so tracks stay equal.'],
            ['Hardcoding fixed pixel row heights on text cards', 'Leave rows auto-sized so cards grow gracefully when users zoom text or translate content.'],
          ],
          [
            ['Why can a 1fr grid column grow wider than its siblings?', 'Because 1fr is shorthand for minmax(auto, 1fr), allowing an item’s min-content width to expand the track unless capped with minmax(0, 1fr).'],
            ['What is the difference between explicit and implicit grid tracks?', 'Explicit tracks are declared via grid-template-columns/rows; implicit tracks are automatically generated by the browser when more items overflow into additional rows or columns.'],
          ],
          'Why is minmax(0, 1fr) safer than plain 1fr for columns holding code snippets or long URLs?',
          [
            'It lowers the track minimum from auto to 0 so unbreakable content cannot blow out the column width',
            'It doubles rendering performance in Safari',
            'It automatically enables vertical scrolling',
            'It converts the grid into Flexbox on mobile',
          ],
          0,
          'Plain 1fr behaves as minmax(auto, 1fr); lowering the minimum to 0 prevents track blowout.'
        ),
        L(
          'Zero-Media-Query Responsive Grids (auto-fit vs auto-fill)',
          'Combining repeat(), auto-fit, and minmax() creates intrinsically responsive card grids that adapt to any screen width without breakpoint boilerplate.',
          'auto-fit collapses empty trailing tracks to 0px so existing items stretch to fill the row, whereas auto-fill preserves empty tracks to maintain exact column widths even when only 1 or 2 cards exist. Wrap the minimum inside min(280px, 100%) so cards never overflow tiny 260px screens.',
          'Use auto-fill for catalog grids where 1 search result shouldn’t stretch awkwardly across the full 1200px page.',
          'Intrinsic Responsive Catalog Grid',
          `.catalog-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr));\n  gap: 1.5rem;\n}`,
          undefined,
          [
            'auto-fit collapses empty tracks and stretches populated cards; auto-fill preserves empty track slots.',
            'min(280px, 100%) guarantees zero horizontal overflow on screens narrower than 280px.',
            'Intrinsic grids eliminate repetitive media-query column rules.',
          ],
          [
            ['Writing minmax(320px, 1fr) without min(320px, 100%)', 'On a 300px container, 320px overflows; wrap it as minmax(min(320px, 100%), 1fr).'],
            ['Using auto-fit on a search results grid when only 1 result returns', 'Use auto-fill when you want a single result card to retain realistic column width.'],
          ],
          [
            ['What is the practical difference between auto-fit and auto-fill?', 'When a row has fewer items than available columns, auto-fit collapses empty tracks to 0 and expands existing items to fill the row, whereas auto-fill keeps empty tracks reserved.'],
            ['Why wrap 280px inside min(280px, 100%)?', 'If the container narrows below 280px, min() clamps the track minimum to 100%, preventing horizontal overflow.'],
          ],
          'On a 1200px wide row containing only 2 cards, how does auto-fit behave compared to auto-fill?',
          [
            'auto-fit collapses empty tracks so the 2 cards stretch to fill 1200px; auto-fill preserves empty slots',
            'auto-fill stretches the 2 cards to 1200px; auto-fit keeps them narrow',
            'Both produce identical layouts in all cases',
            'auto-fit stacks cards vertically while auto-fill keeps them horizontal',
          ],
          0,
          'auto-fit collapses empty trailing tracks so populated items expand; auto-fill preserves the empty track space.'
        ),
        L(
          'Named Grid Template Areas & Spanning',
          'grid-template-areas provides a readable visual ASCII map of your page shell right inside CSS, making responsive rearrangements trivial.',
          'Every named area must form a single rectangle (no L-shapes), and a period (.) represents an empty cell. Swapping a desktop sidebar-and-content layout to a mobile stacked layout takes only a single grid-template-areas update inside a media query.',
          'Combine named areas for macro app shells with numeric grid-column: span 2 for asymmetric bento features.',
          'Readable App Shell with grid-template-areas',
          `.workspace {\n  display: grid;\n  grid-template-columns: 260px minmax(0, 1fr);\n  grid-template-areas:\n    "sidebar header"\n    "sidebar main";\n}\n.sidebar { grid-area: sidebar; }\n.header  { grid-area: header; }\n.main    { grid-area: main; }`,
          undefined,
          [
            'Each named area in grid-template-areas must be a contiguous rectangle.',
            'Use a dot (.) to leave intentional empty cells in the grid map.',
            'grid-column: 1 / -1 spans from the very first line to the very last explicit column line.',
          ],
          [
            ['Defining an L-shaped named area in grid-template-areas', 'Non-rectangular area maps invalidate the entire grid-template-areas declaration; keep every area rectangular.'],
            ['Using grid-column: 1 / -1 on an implicit column grid', '-1 refers to the last EXPLICIT grid line; ensure explicit columns are declared first.'],
          ],
          [
            ['What does grid-column: 1 / -1 accomplish in CSS Grid?', 'It spans the item across every explicit column track from the first line (1) to the last explicit line (-1).'],
            ['What happens if one row in grid-template-areas has a different column count than another?', 'The entire grid-template-areas declaration is treated as invalid and ignored by the browser.'],
          ],
          'In grid-template-areas, what character represents an intentionally empty grid cell?',
          ['A period (.)', 'An underscore (_)', 'The word null', 'An empty string ""'],
          0,
          'One or more periods (e.g. . or ...) represent an empty unnamed cell in grid-template-areas.'
        ),
        L(
          'CSS Subgrid for Cross-Card Alignment',
          'CSS Subgrid lets nested child grids inherit the exact row or column tracks of their parent grid—finally aligning card titles, descriptions, and footers horizontally across neighboring cards.',
          'By setting grid-row: span 3 and grid-template-rows: subgrid on each card, a 2-line title in Card A automatically pushes down the description baseline of Card B in the same row so every card lines up cleanly.',
          'Subgrid is supported across all modern browsers (Chrome, Edge, Firefox, Safari) and degrades gracefully.',
          'Perfect Card Row Alignment with Subgrid',
          `.cards {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 1.5rem;\n}\n.card {\n  display: grid;\n  grid-row: span 3; /* Title, body, footer */\n  grid-template-rows: subgrid;\n  row-gap: 0.75rem;\n}`,
          undefined,
          [
            'grid-template-rows: subgrid shares parent row tracks with nested card children.',
            'The subgrid item must span the number of parent tracks matching its internal rows (e.g., grid-row: span 3).',
            'Subgrids can override the parent’s gap with their own tighter internal gap.',
          ],
          [
            ['Declaring grid-template-rows: subgrid without display: grid on the child', 'The child container itself must be display: grid to adopt subgrid tracks.'],
            ['Forgetting grid-row: span N on the subgrid card', 'Without spanning N rows, all card children stack into a single 1-row track.'],
          ],
          [
            ['What layout problem does CSS Subgrid solve that regular nested grids cannot?', 'Regular nested grids create independent track sizing, so a tall title in one card cannot align sibling cards’ footers; subgrid shares the parent’s tracks across cards.'],
            ['Can a subgrid customize its own gap independent of the parent grid?', 'Yes—setting row-gap or column-gap on the subgrid overrides the inherited parent gap for its internal tracks.'],
          ],
          'What must a child card declare to align its internal title, body, and footer rows with neighboring cards in a parent grid?',
          [
            'display: grid; grid-row: span 3; grid-template-rows: subgrid;',
            'display: subgrid; align-items: stretch;',
            'grid-inherit: rows;',
            'display: flex; flex-direction: column;',
          ],
          0,
          'A subgrid container uses display: grid, spans the matching number of parent rows, and sets grid-template-rows: subgrid.'
        ),
      ],
      outputQuestions: [
        {
          prompt: 'How many columns does .grid create on a 1000px container?',
          code: `.grid {\n  display: grid;\n  width: 1000px;\n  grid-template-columns: 200px 1fr 2fr;\n}`,
          options: ['3 columns: 200px, ~266.7px, ~533.3px', '3 equal columns of 333.3px', '2 columns: 200px and 800px', 'Invalid mixing of px and fr'],
          correctIndex: 0,
          explanation: 'After subtracting the fixed 200px column, 800px remains and is split in a 1:2 ratio (266.67px and 533.33px).',
        },
        {
          prompt: 'Which grid columns does .banner span in a 4-column explicit grid?',
          code: `.grid { display: grid; grid-template-columns: repeat(4, 1fr); }\n.banner { grid-column: 1 / -1; }`,
          options: ['All 4 columns (full width)', 'Only column 1', 'Columns 1 to 3', 'Places banner outside the grid'],
          correctIndex: 0,
          explanation: 'Line 1 is the start edge and line -1 is the final explicit column edge, spanning all 4 columns.',
        },
      ],
    },
    {
      level: 'Intermediate',
      title: 'Responsive Design & Modern Queries',
      description: 'Engineer mobile-first breakpoints, range media syntax, Container Queries, and user preference queries.',
      lessons: [
        L(
          'Mobile-First Breakpoints & Media Query Range Syntax',
          'Mobile-first CSS writes single-column base styles for small screens and layers progressive complexity upward via min-width (or modern range syntax width >= 768px).',
          'CSS Media Queries Level 4 introduces clean mathematical comparisons like @media (width >= 48rem) and @media (40rem <= width < 64rem), eliminating confusing off-by-1px max-width overlaps.',
          'Define breakpoints in rem or around where your content naturally breaks rather than chasing specific phone model pixel dimensions.',
          'Clean Media Query Range Syntax',
          `.grid {\n  display: grid;\n  gap: 1.5rem;\n}\n@media (width >= 48rem) {\n  .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }\n}\n@media (width >= 64rem) {\n  .grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }\n}`,
          undefined,
          [
            'Mobile-first base styles keep CSS smaller and prevent overriding desktop properties downward.',
            'Modern range syntax (@media (width >= 48rem)) prevents 1px boundary collisions.',
            'Avoid targeting device-specific sizes; place breakpoints where typography or layout feels cramped.',
          ],
          [
            ['Writing overlapping max-width: 768px and min-width: 768px queries', 'At exactly 768px both apply; use (width < 768px) and (width >= 768px) to make ranges mutually exclusive.'],
            ['Hiding core features completely on mobile with display: none', 'Reflow navigation and tables responsibly instead of stripping functionality on smaller screens.'],
          ],
          [
            ['Why is mobile-first CSS generally cleaner than desktop-first?', 'Narrow single-column layouts match normal HTML document flow naturally, so you add layout complexity incrementally rather than undoing multi-column desktop overrides.'],
            ['What advantage does @media (width >= 64rem) have over min-width: 1024px?', 'It uses intuitive comparison operators and scales proportionally if the user changes their browser’s default root font size.'],
          ],
          'Which modern media query matches viewports strictly between 640px (inclusive) and 1024px (exclusive)?',
          [
            '@media (640px <= width < 1024px)',
            '@media (min-width: 640px) and (max-width: 1024px)',
            '@media (width in 640px..1024px)',
            '@media (640px < width <= 1024px)',
          ],
          0,
          'Media Queries Level 4 range syntax cleanly expresses inclusive/exclusive bounds without 1px overlap.'
        ),
        L(
          'Container Queries (@container) & cqi Units',
          'Container Queries let a component adapt to the width of its PARENT container rather than the full browser viewport.',
          'A CourseCard placed in a 300px sidebar renders stacked vertically, while the exact same card in a 700px main feature slot switches to horizontal split layout—with zero duplicate modifier classes! Declare container-type: inline-size on the parent wrapper.',
          'Always use container-type: inline-size (not size), because size disables intrinsic height sizing and collapses height to 0 unless explicitly set.',
          'Reusable Card Powered by @container',
          `.card-host {\n  container-type: inline-size;\n  container-name: card;\n}\n.card { display: grid; gap: 1rem; }\n@container card (width >= 460px) {\n  .card { grid-template-columns: 180px 1fr; }\n}`,
          undefined,
          [
            'container-type: inline-size enables width-based @container queries while preserving automatic height.',
            'cqi (1% of container inline size) lets component typography scale smoothly with its slot.',
            'A container cannot query itself—style descendants inside the container.',
          ],
          [
            ['Using container-type: size and watching the container collapse to 0px height', 'Use container-type: inline-size so vertical block height still wraps content naturally.'],
            ['Applying @container rules directly to the container element itself', 'Wrap the component in a container host and style inner descendants inside @container.'],
          ],
          [
            ['Why do Container Queries transform reusable component design?', 'Components become truly portable—they adapt to whatever sidebar, modal, or main column hosts them rather than assuming viewport width equals component width.'],
            ['Why is container-type: inline-size almost always preferred over container-type: size?', 'inline-size only constrains width containment while letting height grow naturally with content; size forces block containment too, collapsing auto height to 0.'],
          ],
          'Which container-type value enables width-based @container queries while keeping automatic content height?',
          ['inline-size', 'size', 'block-size', 'normal'],
          0,
          'inline-size applies inline-axis size containment without collapsing automatic block height.'
        ),
        L(
          'User Preference Media Queries (Dark Mode, Reduced Motion, Pointer)',
          'CSS can respect OS-level accessibility and input preferences natively through preference media features.',
          'Honor prefers-reduced-motion: reduce to replace jarring slide/parallax animations with subtle opacity fades, use prefers-color-scheme: dark for default theme matching, and check (pointer: coarse) to enlarge touch targets on phones and tablets.',
          'Pair prefers-color-scheme with an explicit user theme toggle (.dark class) so users can override their OS preference inside your app.',
          'Accessibility-First Preference Queries',
          `@media (prefers-reduced-motion: reduce) {\n  *, *::before, *::after {\n    animation-duration: 0.01ms !important;\n    transition-duration: 0.01ms !important;\n    scroll-behavior: auto !important;\n  }\n}\n@media (hover: hover) and (pointer: fine) {\n  .card:hover { transform: translateY(-2px); }\n}`,
          undefined,
          [
            'prefers-reduced-motion protects users with vestibular disorders from motion sickness.',
            '(hover: hover) prevents sticky hover states from firing awkwardly on touchscreens.',
            'prefers-contrast: more lets you sharpen hairline borders for high-contrast OS modes.',
          ],
          [
            ['Triggering complex hover animations on touch-only mobile devices', 'Guard pure hover flourish inside @media (hover: hover) so taps feel snappy.'],
            ['Ignoring prefers-reduced-motion on looping CSS animations', 'Disable or minimize motion whenever prefers-reduced-motion: reduce matches.'],
          ],
          [
            ['What does @media (hover: hover) check?', 'Whether the user’s primary pointing device can conveniently hover over elements (like a mouse or trackpad), avoiding sticky tap-hover bugs on phones.'],
            ['How should Tailwind v4 handle manual dark mode toggles alongside prefers-color-scheme?', 'Add @custom-variant dark (&:where(.dark, .dark *)); below @import "tailwindcss"; so toggling class="dark" on <html> activates all dark:* utilities.'],
          ],
          'Which media query prevents hover-only lift animations from getting stuck on touchscreens?',
          ['@media (hover: hover)', '@media (pointer: coarse)', '@media (prefers-hover: true)', '@media (touch: none)'],
          0,
          '(hover: hover) matches only when the primary input supports true hover states.'
        ),
        L(
          'Print Stylesheets & Responsive Data Tables',
          'Production SaaS apps and learning platforms often get printed or saved as PDFs—making clean @media print styles and responsive table containers essential.',
          'Inside @media print, hide sticky navigation bars and interactive buttons, switch backgrounds to crisp white with dark ink, and prevent code blocks or cards from splitting awkwardly mid-line using break-inside: avoid.',
          'Wrap wide tables in an overflow-x-auto region on narrow screens rather than shrinking text below 12px.',
          'Clean Print Media Rules',
          `@media print {\n  header, nav, .no-print { display: none !important; }\n  body { background: #fff; color: #000; }\n  pre, .card { break-inside: avoid; }\n}`,
          undefined,
          [
            'break-inside: avoid keeps cards and code snippets intact across PDF page breaks.',
            'Hide navigation chrome inside @media print so content uses full page width.',
            'Wrap wide data tables in horizontally scrollable containers on mobile.',
          ],
          [
            ['Leaving dark-mode backgrounds active during print', 'Force high-contrast white background and dark text inside @media print to save ink and maintain legibility.'],
            ['Allowing HTML tables to push mobile viewport width past 100vw', 'Place tables inside a div with overflow-x: auto and width: 100%.'],
          ],
          [
            ['What does break-inside: avoid accomplish in print and multi-column layouts?', 'It instructs the pagination engine not to split an element (such as a code listing or certificate box) across a page or column boundary.'],
            ['How do you show the destination URL after links when printing?', 'Using a[href^="http"]::after { content: " (" attr(href) ")"; } inside @media print.'],
          ],
          'Which CSS property prevents a code block or card from splitting awkwardly across two printed pages?',
          ['break-inside: avoid', 'page-lock: true', 'overflow: clip', 'display: inline-block'],
          0,
          'break-inside: avoid is the standard modern property replacing legacy page-break-inside.'
        ),
      ],
      outputQuestions: [
        {
          prompt: 'When a .card-host is 320px wide inside a 1440px desktop window, which background color applies to .card?',
          code: `.card-host { container-type: inline-size; }\n.card { background: white; }\n@container (width >= 500px) { .card { background: indigo; } }`,
          options: ['white', 'indigo', 'transparent', 'Both merge'],
          correctIndex: 0,
          explanation: '@container evaluates the container’s width (320px), NOT the 1440px viewport, so (width >= 500px) is false.',
        },
        {
          prompt: 'At a viewport width of exactly 768px, which rule(s) apply?',
          code: `@media (width < 768px)  { .box { color: red; } }\n@media (width >= 768px) { .box { color: blue; } }`,
          options: ['Only color: blue', 'Only color: red', 'Both red and blue match', 'Neither matches'],
          correctIndex: 0,
          explanation: '768 < 768 is false, while 768 >= 768 is true—mutually exclusive with zero ambiguity.',
        },
      ],
    },
    {
      level: 'Intermediate',
      title: 'Transitions, Transforms & Keyframes',
      description: 'Craft smooth 60fps micro-interactions using compositor properties, easing curves, and keyframe animations.',
      lessons: [
        L(
          'Compositor-Only Animations & Browser Rendering Pipeline',
          'Every frame follows Style -> Layout -> Paint -> Composite; animating layout properties like top, left, width, or margin forces expensive reflow on every frame.',
          'Restrict hover and scroll animations strictly to transform, opacity, and filter, which run directly on the GPU compositor thread for silky 60–120fps motion without triggering main-thread Layout or Paint.',
          'Keep routine UI micro-interactions brisk (120ms–200ms) with ease-out curves like cubic-bezier(0.16, 1, 0.3, 1).',
          'Smooth Compositor-Only Card Lift',
          `.interactive-card {\n  transition: transform 180ms cubic-bezier(0.16, 1, 0.3, 1),\n              border-color 180ms ease-out;\n}\n.interactive-card:hover {\n  transform: translateY(-2px);\n}`,
          undefined,
          [
            'Animate transform and opacity for zero-layout-reflow compositor performance.',
            'Never write transition: all—explicitly list the properties you intend to animate.',
            'Routine UI transitions feel snappiest between 120ms and 220ms.',
          ],
          [
            ['Writing transition: all 0.3s on interactive components', 'transition: all accidentally animates theme switches, focus rings, and unexpected layout changes; name exact properties.'],
            ['Animating height or margin-top on hover', 'Use transform: translateY() or scale() to avoid main-thread layout thrashing.'],
          ],
          [
            ['Why is animating transform: translateX(20px) faster than animating left: 20px?', 'left triggers Layout + Paint + Composite every frame on the CPU, whereas transform runs directly on the GPU compositor layer without reflowing sibling elements.'],
            ['When should you use will-change: transform?', 'Sparingly and temporarily right before an animation—applying will-change everywhere wastes GPU texture memory and can degrade scrolling.'],
          ],
          'Which pair of CSS properties can be animated purely on the browser compositor thread without triggering Layout?',
          ['transform and opacity', 'width and height', 'margin-top and padding', 'top and left'],
          0,
          'transform and opacity bypass Layout and Paint, running directly on the compositor.'
        ),
        L(
          'Individual Transform Properties & transform-origin',
          'Modern CSS provides standalone translate, rotate, and scale properties so you can animate one transform component without overwriting the others.',
          'Previously, adding transform: scale(1.05) on hover wiped out an existing transform: translateY(-4px) unless you repeated both. Standalone translate, rotate, and scale compose independently in a fixed deterministic order (translate -> rotate -> scale).',
          'Set transform-origin deliberately (e.g., top left for dropdown menus) so scale animations open naturally from their trigger.',
          'Composable Individual Transforms',
          `.menu-panel {\n  transform-origin: top right;\n  scale: 0.96;\n  opacity: 0;\n  transition: scale 160ms ease-out, opacity 160ms ease-out;\n}\n.menu-panel.open {\n  scale: 1;\n  opacity: 1;\n}`,
          undefined,
          [
            'Individual translate, rotate, and scale properties compose cleanly without clobbering each other.',
            'transform-origin defaults to 50% 50% (center); adjust for natural dropdown/drawer pivots.',
            'Unlike transform, individual properties apply in spec order: translate, then rotate, then scale.',
          ],
          [
            ['Overwriting a base transform: translateX(-50%) when adding hover transform: scale(1.05)', 'Use standalone translate: -50% 0; and hover scale: 1.05; so they never overwrite each other.'],
            ['Forgetting that transforms create a new stacking context and containing block for fixed children', 'Keep position: fixed modals outside transformed ancestor wrappers.'],
          ],
          [
            ['In what order do individual CSS transform properties execute?', 'translate first, then rotate, then scale, followed by any declarations in the transform property.'],
            ['Why is transform-origin: top left helpful for popover menus?', 'Scaling from 0.95 to 1 grows outward from the anchor corner rather than expanding from the center.'],
          ],
          'What advantage do standalone CSS translate, rotate, and scale properties offer over the classic transform shorthand?',
          [
            'Each axis/operation can be changed or animated independently without overwriting the others',
            'They bypass stacking context creation',
            'They work only on 3D WebGL canvases',
            'They trigger layout reflow so siblings move out of the way',
          ],
          0,
          'Independent transform properties prevent hover/state rules from accidentally wiping out base translations.'
        ),
        L(
          'Keyframe Animations, Fill Modes & Timing Functions',
          '@keyframes define multi-step motion sequences with precise control over iteration count, direction, and resting states via animation-fill-mode.',
          'animation-fill-mode: forwards holds the final 100% keyframe styles after the animation ends, while both also applies the 0% frame during animation-delay so elements do not flash visibly before fading in.',
          'Use steps() timing functions for crisp sprite or progress-step ticks, and cubic-bezier easing for organic motion.',
          'Entrance Keyframe with Fill Mode Both',
          `@keyframes fadeSlideUp {\n  from { opacity: 0; translate: 0 12px; }\n  to   { opacity: 1; translate: 0 0; }\n}\n.toast {\n  animation: fadeSlideUp 220ms cubic-bezier(0.16, 1, 0.3, 1) both;\n}`,
          undefined,
          [
            'animation-fill-mode: both applies 0% styles during delay AND retains 100% styles after completion.',
            'Avoid animating critical above-the-fold content from opacity: 0 with long delays (hurts LCP).',
            'Pause running animations declaratively with animation-play-state: paused.',
          ],
          [
            ['Using animation-delay without fill-mode: backwards or both', 'Elements flash at full opacity during the delay before snapping to 0; use both to hold the initial keyframe immediately.'],
            ['Hiding main page copy behind slow scroll-triggered fade-ins', 'Keep core content immediately readable with zero delay.'],
          ],
          [
            ['What does animation-fill-mode: both do?', 'It applies the starting (0%) keyframe immediately during any animation-delay AND preserves the ending (100%) keyframe after the animation completes.'],
            ['How do CSS transitions differ from @keyframes animations?', 'Transitions interpolate smoothly between two states triggered by a property change (hover, class toggle); @keyframes run multi-step timelines automatically and can loop.'],
          ],
          'Which animation-fill-mode value keeps the final 100% keyframe state applied after an animation finishes AND applies 0% during delay?',
          ['both', 'forwards', 'backwards', 'persist'],
          0,
          'both combines backwards (during delay) and forwards (after completion).'
        ),
        L(
          'Animating Entry from display: none with @starting-style',
          'Historically, transitioning an element from display: none (like <dialog> or popover) was impossible because no prior computed state existed; @starting-style solves this cleanly in pure CSS.',
          'Combined with transition-behavior: allow-discrete on display and overlay, browsers smoothly fade and scale native <dialog> and popover elements both on entry and exit!',
          'Provide clean fallback behavior—browsers without @starting-style still open and close instantly with zero breakage.',
          'Smooth Native Dialog Entry with @starting-style',
          `dialog[open] {\n  opacity: 1;\n  scale: 1;\n  transition: opacity 180ms ease-out, scale 180ms ease-out;\n  @starting-style {\n    opacity: 0;\n    scale: 0.96;\n  }\n}`,
          undefined,
          [
            '@starting-style defines the initial "before-change" style for newly rendered elements.',
            'Pairs seamlessly with native <dialog> and the HTML Popover API.',
            'transition-behavior: allow-discrete delays flipping display: none until exit transitions finish.',
          ],
          [
            ['Expecting a CSS transition to fire on display: none -> block without @starting-style', 'Without @starting-style, browsers compute only the final style on the first frame, skipping the transition.'],
            ['Animating complex shadows during dialog entry', 'Stick to opacity and scale inside @starting-style for crisp 60fps dialogs.'],
          ],
          [
            ['What problem does @starting-style solve?', 'It lets CSS define an initial keyframe state when an element first renders or switches from display: none, enabling pure-CSS entry transitions without JavaScript setTimeout/requestAnimationFrame hacks.'],
            ['What role does transition-behavior: allow-discrete play?', 'It lets discrete properties like display and overlay flip at the end of an exit transition rather than immediately hiding the element.'],
          ],
          'Which CSS at-rule lets you define the initial transition state when an element changes from display: none to visible?',
          ['@starting-style', '@initial-frame', '@enter-transition', '@keyframes-start'],
          0,
          '@starting-style supplies the before-change style on first paint so CSS transitions fire smoothly.'
        ),
      ],
      outputQuestions: [
        {
          prompt: 'After a 1s fade-in animation finishes with animation-fill-mode: none (default), what opacity does the element return to?',
          code: `.box { opacity: 0; animation: show 1s; }\n@keyframes show { to { opacity: 1; } }`,
          options: ['0 (snaps back to its base CSS rule)', '1 (stays visible)', '0.5', 'Browser keeps the last frame automatically'],
          correctIndex: 0,
          explanation: 'With default fill-mode: none, animated values are discarded as soon as the animation completes unless fill-mode: forwards/both is specified.',
        },
        {
          prompt: 'Which step of the browser rendering pipeline is triggered when only opacity transitions from 0 to 1?',
          code: `.fade { transition: opacity 200ms ease; }`,
          options: ['Composite only (skips Layout and Paint)', 'Layout, Paint, and Composite', 'Paint and Composite only', 'Full DOM re-parse'],
          correctIndex: 0,
          explanation: 'opacity changes on promoted layers run strictly in the Composite stage on the GPU.',
        },
      ],
    },
    {
      level: 'Advanced',
      title: 'Cascade Layers, Nesting & :has()',
      description: 'Master CSS Cascade Layers (@layer), native CSS nesting, and the relational parent selector :has().',
      lessons: [
        L(
          'Architecture with Cascade Layers (@layer)',
          'Cascade Layers (@layer) sit ABOVE specificity in the Cascade—allowing low-specificity utilities to cleanly override higher-specificity component rules without !important.',
          'Declare your layer priority order once at the top of your main stylesheet (@layer reset, base, components, utilities;). Unlayered styles always beat layered styles for normal declarations, while !important reverses layer order.',
          'Tailwind CSS v4 uses native @layer theme, base, components, utilities under the hood.',
          'Deterministic Layer Priority Order',
          `@layer reset, components, utilities;\n\n@layer components {\n  .card .title.highlighted { color: slategray; } /* (0,3,0) */\n}\n@layer utilities {\n  .text-indigo { color: #4f46e5; } /* (0,1,0) STILL WINS! */\n}`,
          'text-indigo (#4f46e5) wins despite lower specificity.',
          [
            'Later-declared layers beat earlier layers regardless of selector specificity.',
            'Unlayered author CSS beats all @layer rules for normal declarations.',
            'Ordering layers upfront (@layer base, components, utilities;) makes cascade intent explicit.',
          ],
          [
            ['Writing unlayered overrides mixed randomly with @layer styles', 'Unlayered styles outrank every layer; keep your architecture consistently layered.'],
            ['Forgetting that !important reverses layer precedence', 'An !important rule in an EARLIER layer beats an !important rule in a LATER layer (designed to protect resets/accessibility).'],
          ],
          [
            ['How does @layer interact with selector specificity?', 'Layer order takes priority BEFORE specificity is even compared; a single class in a higher layer overrides an ID selector in a lower layer.'],
            ['Where do unlayered styles rank compared to @layer rules?', 'For normal declarations, unlayered styles rank above all named layers.'],
          ],
          'Given @layer base, utilities;, which declaration wins on <p class="lead text-indigo" id="hero">?',
          [
            '.text-indigo inside @layer utilities',
            '#hero.lead inside @layer base',
            'Whichever has more classes',
            'They throw a cascade error',
          ],
          0,
          'Cascade layer precedence outranks specificity; @layer utilities comes after @layer base, so it wins.'
        ),
        L(
          'The Relational Selector :has() ("Parent Selector")',
          ':has() lets you style an element based on its descendants, subsequent siblings, or checked/invalid child inputs—replacing countless JavaScript state classes.',
          'You can highlight a form group when its input is focused (:has(:focus-visible)), adjust a card grid when an image is absent (:not(:has(img))), or lock page scroll whenever an open modal dialog exists (body:has(dialog[open])).',
          'Keep :has() scopes narrow on specific components rather than sweeping universal selectors across huge DOM trees.',
          'Pure CSS Interactive States with :has()',
          `.field-group:has(input:focus-visible) {\n  border-color: #4f46e5;\n}\n.card:not(:has(img)) {\n  padding-block-start: 2rem;\n}\nbody:has(dialog[open]) {\n  overflow: hidden;\n}`,
          undefined,
          [
            ':has() checks descendant and sibling conditions relative to the subject element.',
            'Enables pure-CSS parent styling for checked checkboxes, invalid inputs, and open dialogs.',
            ':has() takes the highest specificity of its selector list (just like :is()).',
          ],
          [
            ['Nesting :has() inside another :has()', 'Nested :has() is disallowed by the CSS specification and ignored as invalid.'],
            ['Writing overly broad :has(*) selectors on document root', 'Scope :has() tightly (e.g. .form-row:has(input:checked)) for instant selector matching.'],
          ],
          [
            ['How can you lock background scroll when a native <dialog> is open using zero JavaScript?', 'With body:has(dialog[open]) { overflow: hidden; }.'],
            ['Can :has() match previous siblings?', 'Yes! h2:has(+ p) selects any <h2> immediately followed by a <p>, effectively acting as a previous-sibling selector.'],
          ],
          'Which selector selects a <label> element that contains a checked checkbox?',
          ['label:has(input:checked)', 'label:contains(input:checked)', 'input:checked < label', 'label:parent(input:checked)'],
          0,
          ':has() matches any element whose relative selector matches at least one descendant or sibling.'
        ),
        L(
          'Native CSS Nesting & & Selector Semantics',
          'Modern browsers support native CSS nesting directly without Sass/Preprocessors, including nested media and container queries.',
          'Unlike Sass string concatenation (.card { &__title }), native CSS nesting treats & as a real selector wrapped in :is()—meaning you nest full combinators (& > h2, &:hover, .dark &) cleanly while preserving valid CSS syntax.',
          'Limit nesting depth to 2–3 levels so specificity stays flat and readable.',
          'Native CSS Nesting with Nested @media',
          `.course-card {\n  padding: 1.5rem;\n  border: 1px solid #e2e8f0;\n\n  &:hover {\n    border-color: #6366f1;\n  }\n\n  @media (width >= 48rem) {\n    padding: 2rem;\n  }\n}`,
          undefined,
          [
            'Native CSS nesting works across Chrome, Firefox, Safari, and Edge with zero build step.',
            '& represents the parent selector wrapped in :is(), inheriting its highest specificity.',
            'String suffix concatenation like &__item is Sass-only and invalid in native CSS nesting.',
          ],
          [
            ['Writing BEM concatenation .card { &__title {} } in native CSS', 'Native CSS & cannot concatenate identifiers; write .card-title separately or nest descendant selectors.'],
            ['Nesting 5+ levels deep', 'Keep nesting shallow (<= 3 levels) for maintainability and low specificity.'],
          ],
          [
            ['How does & in native CSS nesting differ from Sass &?', 'In Sass, & is textual substitution (allowing &__elem); in native CSS, & is a live compound selector equivalent to :is(parent).'],
            ['Can you nest @media or @container directly inside a selector in native CSS?', 'Yes—nested at-rules automatically scope their declarations to the enclosing selector.'],
          ],
          'Why is .btn { &__icon { width: 16px; } } invalid in native browser CSS nesting?',
          [
            'Native CSS & represents a selector, not a string prefix for concatenating class names',
            'Native CSS nesting does not support double underscores in class names',
            'The & symbol is forbidden in native CSS',
            'Nested rules cannot contain width declarations',
          ],
          0,
          'Native CSS nesting parses & as a selector token (:is(parent)), not a preprocessor text macro.'
        ),
        L(
          'Scoped Styles (@scope) & Donut Scoping',
          'CSS @scope limits styling to a specific DOM root and optionally stops at an inner boundary ("donut scope") so nested child components are never polluted.',
          'Writing @scope (.article) to (.embedded-widget) styles headings and links inside the article prose while leaving any nested .embedded-widget untouched—solving the classic cascade bleed problem without Shadow DOM overhead.',
          'Inside @scope, rules closer in DOM proximity to the target element win ties before source order!',
          'Donut Scoping with @scope',
          `@scope (.lesson-prose) to (.code-block) {\n  p { line-height: 1.75; color: #334155; }\n  a { text-decoration: underline; }\n}`,
          undefined,
          [
            '@scope (.root) to (.limit) creates a lower boundary preventing styles from leaking into nested components.',
            'Proximity in the DOM tree becomes a cascade tie-breaker inside @scope.',
            ':scope inside @scope matches the scope root element itself.',
          ],
          [
            ['Assuming descendant selectors stop automatically at nested widgets', 'Use @scope (.outer) to (.inner) when you need true donut scoping boundaries.'],
            ['Relying on @scope without checking fallback needs for older enterprise browsers', 'Use progressive enhancement or verify target browser baselines when adopting @scope.'],
          ],
          [
            ['What is "donut scoping" in CSS?', 'Scoping styles starting at an outer root (.card) and stopping at an inner limit (.nested-slot) so styles apply to the outer shell without bleeding into nested sub-components.'],
            ['How does @scope add proximity to the CSS Cascade?', 'When two scoped rules have equal specificity, the rule whose scope root is a closer ancestor in the DOM tree wins.'],
          ],
          'In @scope (.article) to (.demo-box) { p { color: blue; } }, which paragraphs turn blue?',
          [
            'Paragraphs inside .article that are NOT inside .demo-box',
            'Only paragraphs inside .demo-box',
            'Every paragraph on the page',
            'Only direct children of .demo-box',
          ],
          0,
          'The to (.demo-box) clause defines an exclusive lower boundary, excluding descendants of .demo-box.'
        ),
      ],
      outputQuestions: [
        {
          prompt: 'Which background color applies to <button class="btn primary">Save</button>?',
          code: `@layer components, overrides;\n@layer overrides { .primary { background: teal; } }\n@layer components { button.btn.primary { background: orange; } }`,
          options: ['teal', 'orange', 'transparent', 'Browser default gray'],
          correctIndex: 0,
          explanation: '@layer overrides is declared after @layer components, so .primary beats the higher-specificity rule in components.',
        },
        {
          prompt: 'Which element receives the red border from this rule?',
          code: `.form-row:has(input:invalid) { border: 1px solid red; }`,
          options: [
            'The parent .form-row container whenever an invalid <input> exists inside it',
            'Only the <input> element itself',
            'Every .form-row on the page',
            'The next sibling after .form-row',
          ],
          correctIndex: 0,
          explanation: 'The subject of .form-row:has(...) is .form-row; :has() checks the descendant condition.',
        },
      ],
    },
    {
      level: 'Advanced',
      title: 'Design Systems, Custom Properties & Performance',
      description: 'Engineer reactive CSS custom properties, typed @property animations, dark-mode tokens, and paint containment.',
      lessons: [
        L(
          'CSS Custom Properties (--vars) & Dual-Theme Architecture',
          'CSS Custom Properties are live, inherited, runtime-reactive variables that cascade through the DOM and respond instantly to theme toggles without re-rendering styles.',
          'Define semantic design tokens (--surface-canvas, --surface-card, --text-primary, --border-subtle) in :root and swap their values under .dark. Components reference only semantic tokens so Light and Dark modes stay perfectly paired with zero split-brain contrast bugs.',
          'Never use global !important color-inversion hacks for Light/Dark mode—pair every surface and text token cleanly.',
          'Semantic Dual-Theme Token Architecture',
          `:root {\n  --canvas: #f8fafc;\n  --surface: #ffffff;\n  --ink: #0f172a;\n  --accent: #4f46e5;\n}\n.dark {\n  --canvas: #0b1120;\n  --surface: #111827;\n  --ink: #f8fafc;\n  --accent: #6366f1;\n}\nbody { background: var(--canvas); color: var(--ink); }`,
          undefined,
          [
            'Custom properties resolve at computed-value time, enabling dynamic runtime theming.',
            'Provide fallback values cleanly: var(--accent, #4f46e5).',
            'Two-tier tokens (primitive palette -> semantic role tokens) make dark mode effortless.',
          ],
          [
            ['Using global .light-mode .bg-slate-900 { background: #fff !important; } hacks', 'Such overrides destroy contrast inside primary buttons and overlays; use semantic tokens or paired dark:* utilities.'],
            ['Forgetting @custom-variant dark in Tailwind CSS v4 when toggling .dark on <html>', 'Declare @custom-variant dark (&:where(.dark, .dark *)); directly below @import "tailwindcss";.'],
          ],
          [
            ['How do CSS Custom Properties differ from Sass $variables?', 'Sass variables are compiled away at build time and cannot respond to DOM state, media queries, or JavaScript; CSS custom properties live in the DOM and update dynamically at runtime.'],
            ['What happens if a custom property contains an invalid value for the target property (e.g. color: var(--spacing))?', 'The declaration becomes "invalid at computed-value time" and falls back to the property’s inherited or initial value—NOT to an earlier fallback declaration!'],
          ],
          'In Tailwind CSS v4, why must you add @custom-variant dark (&:where(.dark, .dark *)); when using a manual Light/Dark class toggle?',
          [
            'By default Tailwind v4 binds dark:* to prefers-color-scheme media query and ignores <html class="dark">',
            'Tailwind v4 removed dark mode completely without plugins',
            'It improves CSS minification size by 50%',
            'Browsers require @custom-variant to read localStorage',
          ],
          0,
          'Without @custom-variant dark, Tailwind v4 dark:* classes only follow OS prefers-color-scheme.'
        ),
        L(
          'Typed Custom Properties with @property (Houdini)',
          'Standard CSS variables are untyped strings, so browsers cannot interpolate them smoothly inside gradients or animations. @property registers a variable’s exact syntax (<color>, <angle>, <percentage>), inheritance, and initial value.',
          'Once registered with syntax: "<percentage>" or "<color>", you can smoothly transition progress rings, animated gradient angles, and numeric counters purely in CSS.',
          'Always set inherits: false on high-frequency animated @property tokens so changing them doesn’t trigger style recalculations across deep descendant trees.',
          'Smoothly Animated Gradient Angle via @property',
          `@property --ring-angle {\n  syntax: "<angle>";\n  inherits: false;\n  initial-value: 0deg;\n}\n.progress-ring {\n  background: conic-gradient(#4f46e5 var(--ring-angle), #e2e8f0 0);\n  transition: --ring-angle 400ms ease-out;\n}`,
          undefined,
          [
            '@property unlocks smooth CSS transitions on custom properties inside gradients.',
            'Valid syntaxes include <color>, <length>, <percentage>, <angle>, and <number>.',
            'inherits: false boosts performance by preventing variable propagation down subtrees.',
          ],
          [
            ['Attempting to transition a regular --angle custom property inside conic-gradient()', 'Without @property syntax: "<angle>", the browser snaps abruptly instead of interpolating.'],
            ['Omitting initial-value when using a typed @property syntax', 'Typed @property definitions require an initial-value matching the declared syntax.'],
          ],
          [
            ['Why can’t CSS smoothly transition linear-gradient() colors directly without @property?', 'Gradients are treated as <image> values, which are discrete; registering color stops as typed <color> custom properties via @property allows smooth frame-by-frame interpolation.'],
            ['Why does setting inherits: false on an animated @property improve frame rate?', 'It stops the browser from invalidating and recomputing inherited styles on every descendant element each animation frame.'],
          ],
          'What does registering a CSS custom property with @property { syntax: "<color>"; ... } enable?',
          [
            'Smooth CSS transitions and keyframe interpolation of that variable inside gradients and color functions',
            'Compile-time TypeScript checking',
            'Automatic dark-mode inversion',
            'Cross-origin stylesheet sharing',
          ],
          0,
          '@property teaches the browser the data type of a CSS variable so it can interpolate intermediate frames.'
        ),
        L(
          'CSS Containment & content-visibility: auto',
          'On long documentation pages or catalogs with hundreds of cards, content-visibility: auto lets the browser skip layout and paint for off-screen sections until they scroll near the viewport.',
          'Pair content-visibility: auto with contain-intrinsic-size: auto 320px so the scrollbar height remains stable without jumping as off-screen sections render. Unlike display: none, off-screen text remains searchable via Ctrl+F and accessible to screen readers!',
          'Apply content-visibility: auto to heavy below-the-fold sections (like long syllabus lists or FAQ archives), never to above-the-fold heroes.',
          'Zero-Cost Off-Screen Rendering Optimization',
          `.syllabus-section {\n  content-visibility: auto;\n  contain-intrinsic-size: auto 380px;\n}`,
          undefined,
          [
            'content-visibility: auto skips Layout & Paint for off-screen subtrees, cutting initial render time dramatically.',
            'contain-intrinsic-size supplies a placeholder height so scrollbars do not jitter.',
            'Off-screen content stays discoverable by browser Find-in-Page (Ctrl+F) and assistive tech.',
          ],
          [
            ['Using content-visibility: auto without contain-intrinsic-size', 'Without an intrinsic size hint, off-screen sections collapse to 0px height and cause jumpy scrollbars.'],
            ['Applying content-visibility: auto to sticky headers or tooltips', 'Keep content-visibility strictly on self-contained flow sections below the fold.'],
          ],
          [
            ['How does content-visibility: auto differ from virtualized JS lists?', 'Virtualization unmounts DOM nodes completely (breaking Ctrl+F and native anchor jumps), whereas content-visibility: auto keeps nodes in the DOM while skipping rendering work off-screen.'],
            ['What does the auto keyword inside contain-intrinsic-size: auto 380px do?', 'It instructs the browser to remember the real measured height of the section once rendered, replacing the 380px estimate permanently.'],
          ],
          'Which CSS property skips off-screen Layout and Paint while keeping content searchable via Ctrl+F?',
          ['content-visibility: auto', 'display: none', 'visibility: collapse', 'will-change: contents'],
          0,
          'content-visibility: auto defers rendering of off-screen subtrees without hiding them from the DOM or Ctrl+F.'
        ),
        L(
          'Scroll-Driven Animations & View Transitions API',
          'CSS Scroll-Driven Animations tie progress bars and reveals directly to scroll() or view() timelines on the compositor thread—zero scroll event listeners required.',
          'A reading progress bar at the top of a lesson page takes just 4 lines of CSS with animation-timeline: scroll(root), running smoothly even when the JavaScript main thread is busy.',
          'Always wrap scroll-driven animations inside @media (prefers-reduced-motion: no-preference) and @supports (animation-timeline: scroll()).',
          'Pure CSS Reading Progress Bar',
          `@supports (animation-timeline: scroll()) {\n  @keyframes grow-bar { from { scale: 0 1; } to { scale: 1 1; } }\n  .reading-progress {\n    transform-origin: left;\n    animation: grow-bar linear both;\n    animation-timeline: scroll(root);\n  }\n}`,
          undefined,
          [
            'scroll() maps animation progress 0%–100% to a scroll container’s scroll position.',
            'view() maps animation progress to an element entering and leaving the viewport.',
            'Guard cutting-edge CSS features cleanly with @supports feature queries.',
          ],
          [
            ['Attaching window.addEventListener("scroll") to animate width: X% on every pixel', 'Use compositor-driven scaleX with animation-timeline: scroll() for zero main-thread jank.'],
            ['Skipping @supports checks on newer CSS specifications', 'Use @supports so unsupported browsers fall back gracefully without layout glitches.'],
          ],
          [
            ['What is the difference between scroll() and view() animation timelines?', 'scroll() tracks overall scroll container progress from top to bottom, whereas view() tracks a specific element’s visibility progress as it enters and exits the scrollport.'],
            ['Why do CSS scroll-driven animations feel smoother than JS scroll listeners?', 'They execute directly on the browser’s compositor thread synchronized with scroll frames, eliminating main-thread lag.'],
          ],
          'What does @supports (animation-timeline: scroll()) allow a stylesheet to do?',
          [
            'Progressively apply CSS rules only in browsers that support scroll-driven animation timelines',
            'Polyfill scroll timelines automatically in legacy browsers',
            'Disable scrolling when animations run',
            'Import an external JavaScript scroll library',
          ],
          0,
          '@supports feature queries let you gate progressive enhancements safely in pure CSS.'
        ),
      ],
      outputQuestions: [
        {
          prompt: 'What color renders on .btn when --brand is NOT defined anywhere?',
          code: `.btn {\n  color: red;\n  color: var(--brand, indigo);\n}`,
          options: ['indigo', 'red', 'black', 'transparent'],
          correctIndex: 0,
          explanation: 'Because --brand is unset, var() resolves to its fallback value indigo.',
        },
        {
          prompt: 'What color renders on .box when --not-a-color is set to 20px?',
          code: `:root { --not-a-color: 20px; }\n.box { color: green; color: var(--not-a-color); }`,
          options: ['Inherited text color (NOT green)', 'green', '20px', 'transparent'],
          correctIndex: 0,
          explanation: 'A valid var() substitution that yields an invalid value at computed-value time discards earlier declarations and falls back to the inherited/initial value.',
        },
      ],
    },
    {
      level: 'Advanced',
      title: 'Modern Color Spaces, Blending & Visual Effects',
      description: 'Master perceptual OKLCH/OKLAB color manipulation, color-mix(), backdrop-filter glassmorphism, masks, and clip-path geometry.',
      lessons: [
        L(
          'Perceptual Color Spaces: OKLCH, Relative Color Syntax & color-mix()',
          'Perceptual color spaces like OKLCH (Lightness, Chroma, Hue) keep perceived brightness uniform across hues—unlike HSL where yellow at 50% lightness looks far brighter than blue at 50%.',
          'Combining color-mix(in oklch, var(--accent) 85%, white) and Relative Color Syntax lets design systems derive hover states, tinted surfaces, and translucent rings dynamically from a single brand token.',
          'Store base brand hues in OKLCH and derive tints/shades via color-mix() so light and dark contrast ratios stay predictable.',
          'Dynamic Hover & Tinted Surface Tokens with color-mix()',
          `:root {\n  --brand: oklch(54% 0.22 264);\n  --brand-hover: color-mix(in oklch, var(--brand) 88%, black);\n  --brand-soft: color-mix(in oklch, var(--brand) 14%, transparent);\n}`,
          undefined,
          [
            'OKLCH lightness (L) matches human brightness perception across every hue angle.',
            'color-mix(in oklch, c1 p%, c2) creates vivid, muddy-free gradients and hover tokens.',
            'Modern browsers also support wide-gamut Display P3 colors inside oklch().',
          ],
          [
            ['Assuming HSL lightness 50% gives identical WCAG contrast across yellow and indigo', 'Yellow HSL 50% has much higher relative luminance than blue; use OKLCH and verify contrast ratios explicitly.'],
            ['Mixing colors in sRGB when interpolating opposite hues', 'sRGB interpolation passes through dull gray midpoints; interpolate in oklch for clean vibrant transitions.'],
          ],
          [
            ['Why is OKLCH superior to HSL for building accessible multi-color design systems?', 'In OKLCH, two colors with the same L value share nearly identical perceptual lightness, making consistent contrast across hues dramatically easier.'],
            ['What does color-mix(in oklch, var(--brand) 20%, transparent) produce?', 'A 20%-opaque tinted version of --brand without needing separate RGB channel variables.'],
          ],
          'Why do gradients and color scales built in OKLCH look more consistent than HSL?',
          [
            'OKLCH models uniform human perceptual lightness across all hues',
            'OKLCH only uses 256 web-safe colors',
            'HSL does not support alpha transparency',
            'OKLCH automatically disables dark mode',
          ],
          0,
          'OKLCH is perceptually uniform, meaning equal L values look equally bright regardless of hue.'
        ),
        L(
          'clip-path, mask-image & Non-Rectangular UI Shapes',
          'clip-path crops an element to geometric polygons, circles, or SVG paths without altering layout flow, while mask-image applies alpha/luminance gradients for smooth fade-outs.',
          'Hardware-accelerated clip-path animations create crisp reveal wipes, and CSS mask-image: linear-gradient(to right, black 85%, transparent) smoothly fades horizontally scrollable tab bars with zero hard-coded background color overlays.',
          'Prefer mask-image over absolute-positioned gradient overlay divs so scrollable containers work seamlessly on both light and dark surfaces.',
          'Theme-Agnostic Scroll Edge Fade Using mask-image',
          `.scroll-tabs {\n  overflow-x: auto;\n  mask-image: linear-gradient(to right, black 0%, black 88%, transparent 100%);\n}\n.avatar-hex {\n  clip-path: polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%);\n}`,
          undefined,
          [
            'clip-path clips both visuals AND pointer hit-testing cleanly to the shape.',
            'mask-image uses alpha transparency so underlying backgrounds show through seamlessly.',
            'Animating clip-path between two polygons requires the same number of vertices.',
          ],
          [
            ['Faking a scroll fade with a white linear-gradient overlay div', 'Hard-coded white overlays break in dark mode and block clicks; mask-image works on any background and keeps clicks intact.'],
            ['Animating clip-path between polygon() shapes with different vertex counts', 'Mismatched vertex counts snap instead of interpolating smoothly; keep vertex counts equal.'],
          ],
          [
            ['What is the key difference between clip-path and mask-image?', 'clip-path creates a hard vector boundary (in or out), whereas mask-image supports partial semi-transparent alpha gradients and image masks.'],
            ['Does clip-path affect where clicks register on an element?', 'Yes—regions clipped outside the clip-path do not receive pointer events.'],
          ],
          'Why is mask-image preferred over a background-colored overlay div for fading the edge of a scrollable list?',
          [
            'It fades the element’s own alpha channel so it works over any background or theme automatically',
            'It improves database query speed',
            'It forces the container to use CSS Grid',
            'It automatically adds scrollbars in all browsers',
          ],
          0,
          'mask-image modulates element opacity directly, avoiding mismatched overlay colors in dark mode or over gradients.'
        ),
        L(
          'backdrop-filter, Filters & Blend Modes',
          'filter applies graphical effects (blur, drop-shadow, saturate) to an element and its children, while backdrop-filter blurs or tints whatever renders BEHIND a translucent element.',
          'Remember that both filter and backdrop-filter create a new stacking context AND a containing block for position: fixed descendants—a classic CSS debugging gotcha!',
          'Use drop-shadow() instead of box-shadow when shadowing transparent PNGs or clipped SVG silhouettes, and keep backdrop-filter blur radii modest (8px–16px) for GPU frame budget.',
          'Frosted Sticky Header with Graceful Fallback',
          `.top-nav {\n  background: color-mix(in srgb, var(--surface) 88%, transparent);\n}\n@supports (backdrop-filter: blur(12px)) {\n  .top-nav {\n    background: color-mix(in srgb, var(--surface) 72%, transparent);\n    backdrop-filter: blur(12px) saturate(140%);\n  }\n}`,
          undefined,
          [
            'backdrop-filter requires a semi-transparent background to be visible.',
            'filter: drop-shadow() follows transparent alpha contours instead of the rectangular border box.',
            'Applying filter or backdrop-filter creates a new stacking context and traps position: fixed children.',
          ],
          [
            ['Applying backdrop-filter: blur(12px) on an element with an opaque background: #fff', 'If the element background is 100% opaque, nothing behind it shows through; use alpha transparency.'],
            ['Placing a position: fixed modal inside a parent with filter: brightness(1)', 'Any non-none filter/backdrop-filter makes the element a containing block for fixed children, breaking viewport centering.'],
          ],
          [
            ['What is the difference between box-shadow and filter: drop-shadow()?', 'box-shadow draws a shadow around the rectangular CSS box, whereas filter: drop-shadow() traces the visible alpha channel of transparent PNGs, SVGs, or clipped shapes.'],
            ['Why did a position: fixed modal suddenly stop covering the viewport when backdrop-filter was added to its parent?', 'backdrop-filter establishes a containing block for fixed-positioned descendants, anchoring them to that parent instead of the viewport.'],
          ],
          'Which CSS property applies a shadow that follows the non-rectangular alpha silhouette of an SVG icon?',
          ['filter: drop-shadow(...)', 'box-shadow', 'outline-shadow', 'backdrop-filter: shadow(...)'],
          0,
          'filter: drop-shadow() respects alpha transparency contours rather than the rectangular box model.'
        ),
        L(
          'Scroll Snap, Overscroll Behavior & Smooth Scroll Margins',
          'CSS Scroll Snap creates crisp carousel and section alignment natively on the compositor thread, while scroll-margin-top prevents sticky headers from covering anchor-linked headings.',
          'Setting overscroll-behavior: contain inside drawers, modals, and sidebar outlines prevents scroll chaining—stopping the background page from scrolling once the user hits the bottom of the sidebar.',
          'Always apply scroll-margin-top: 5rem on headings with IDs when your layout has a sticky navigation bar.',
          'Sticky-Header-Safe Headings & Scroll Chaining Prevention',
          `h2[id], h3[id] {\n  scroll-margin-top: 5.5rem;\n}\n.sidebar-outline {\n  overflow-y: auto;\n  overscroll-behavior: contain;\n}\n.carousel {\n  display: flex;\n  overflow-x: auto;\n  scroll-snap-type: x mandatory;\n}\n.carousel > article { scroll-snap-align: start; }`,
          undefined,
          [
            'scroll-margin-top offsets anchor navigation (#section-id) cleanly below sticky headers.',
            'overscroll-behavior: contain stops scroll chaining from modals and sidebars to the body.',
            'scroll-snap-type: x mandatory (or proximity) gives silky native snapping without JS listeners.',
          ],
          [
            ['Using scroll-snap-type: y mandatory on tall articles with varying heights', 'Mandatory vertical snapping can trap users mid-section; prefer proximity for long vertical text pages.'],
            ['Forgetting scroll-margin-top with a sticky navbar', 'Clicking table-of-contents hash links hides the heading underneath the sticky top bar.'],
          ],
          [
            ['What does overscroll-behavior: contain solve on a scrollable sidebar or modal?', 'It prevents scroll chaining so reaching the top or bottom of the inner scroll container does not scroll the underlying page.'],
            ['How do you stop a sticky 64px header from overlapping #anchor headings without ugly padding hacks?', 'Set scroll-margin-top: 5rem on anchored heading elements.'],
          ],
          'Which CSS property stops scrolling inside a modal dialog from scrolling the background page once you hit the bottom?',
          ['overscroll-behavior: contain', 'scroll-behavior: locked', 'overflow: clip-parent', 'touch-action: none'],
          0,
          'overscroll-behavior: contain isolates scrolling inside the container and prevents scroll chaining to ancestors.'
        ),
      ],
      outputQuestions: [
        {
          prompt: 'Which background lets backdrop-filter: blur(10px) actually show a frosted glass effect?',
          code: `.panel-a { background: #ffffff; backdrop-filter: blur(10px); }\n.panel-b { background: rgb(255 255 255 / 0.75); backdrop-filter: blur(10px); }`,
          options: ['.panel-b only', '.panel-a only', 'Both .panel-a and .panel-b', 'Neither—blur requires z-index: 999'],
          correctIndex: 0,
          explanation: 'backdrop-filter blurs content visible behind the element; an opaque #ffffff background hides the backdrop completely.',
        },
        {
          prompt: 'What happens when a user clicks <a href="#faq"> and #faq has scroll-margin-top: 80px?',
          code: `#faq { scroll-margin-top: 80px; }`,
          options: [
            'The browser scrolls so #faq stops 80px below the top of the viewport',
            '80px of visible blank margin is permanently added above #faq in layout',
            'The page scrolls 80px past #faq',
            'The link fails to scroll',
          ],
          correctIndex: 0,
          explanation: 'scroll-margin-top affects only scroll-into-view snap offset without altering visual layout spacing.',
        },
      ],
    },
    {
      level: 'Advanced',
      title: 'CSS Architecture, Accessibility & Print Engineering',
      description: 'Engineer WCAG-compliant focus systems, forced-colors support, logical internationalization CSS, and print-ready stylesheets.',
      lessons: [
        L(
          'Accessible Focus Rings (:focus-visible) & Contrast Engineering',
          ':focus-visible matches only when the browser determines a visible focus indicator is helpful (such as keyboard Tab navigation), eliminating ugly click rings while keeping keyboard users fully oriented.',
          'Never write outline: none without replacing it with a high-contrast ring, and prefer outline + outline-offset over box-shadow because Windows High Contrast (forced-colors) preserves outlines while stripping box-shadows.',
          'Style :focus-visible globally with a crisp 2px outline and 2px outline-offset using your accent token.',
          'WCAG-Compliant :focus-visible Pattern',
          `:is(a, button, input, select, textarea, [tabindex]):focus-visible {\n  outline: 2px solid var(--accent);\n  outline-offset: 2px;\n}\n.btn:focus:not(:focus-visible) {\n  outline: none;\n}`,
          undefined,
          [
            ':focus-visible displays focus rings for keyboard navigation without cluttering mouse clicks.',
            'outline survives Windows High Contrast Mode (forced-colors); box-shadow gets stripped.',
            'WCAG 2.2 requires non-text UI indicators (focus rings, borders) to hit at least 3:1 contrast.',
          ],
          [
            ['Writing * { outline: none; } globally to "clean up" focus styles', 'Removing focus outlines makes keyboard navigation impossible and violates WCAG 2.4.7.'],
            ['Using box-shadow alone for focus states with outline: none', 'Add outline: 2px solid transparent alongside box-shadow so forced-colors mode renders a visible system outline.'],
          ],
          [
            ['Why is outline better than box-shadow alone for keyboard focus indicators?', 'In OS Forced Colors / High Contrast mode, browsers strip box-shadows for legibility but automatically recolor CSS outlines to the user’s high-contrast highlight color.'],
            ['How does :focus-visible differ from :focus?', ':focus matches on both mouse clicks and keyboard focus; :focus-visible matches primarily on keyboard navigation and text inputs.'],
          ],
          'Why should you include a transparent CSS outline even if you style focus states with a custom box-shadow?',
          [
            'Windows High Contrast (forced-colors) strips box-shadows but renders outlines in the system highlight color',
            'box-shadow cannot be animated',
            'outline is required for :hover to work',
            'Transparent outlines increase specificity',
          ],
          0,
          'Transparent outlines stay invisible in standard themes but automatically become visible in High Contrast / forced-colors mode.'
        ),
        L(
          'Logical Properties for Global LTR/RTL & Writing Modes',
          'CSS Logical Properties replace physical directions (left, right, top, bottom) with flow-relative dimensions (inline-start, inline-end, block-start, block-end).',
          'When an app switches to <html dir="rtl"> for Arabic or Hebrew, padding-inline-start, margin-inline-end, and border-inline-start automatically mirror with zero duplicate RTL override stylesheets.',
          'Adopt margin-inline, padding-block, and inset-inline as your default vocabulary in modern CSS and Tailwind (ms-, me-, ps-, pe-).',
          'Automatic RTL Mirroring with Logical Properties',
          `.callout {\n  padding-block: 1rem;\n  padding-inline: 1.25rem;\n  margin-block-end: 1.5rem;\n  border-inline-start: 3px solid var(--accent);\n  text-align: start;\n}`,
          undefined,
          [
            'inline axis follows text flow (horizontal in English/Arabic); block axis follows stacking flow (vertical).',
            'inset: 0 is logical shorthand for top/right/bottom/left: 0.',
            'Logical properties eliminate hand-maintained [dir="rtl"] override blocks.',
          ],
          [
            ['Mixing text-align: left with logical padding-inline-start', 'Use text-align: start so text alignment mirrors automatically in RTL locales.'],
            ['Using margin-left/right on icon-text buttons in internationalized apps', 'Use gap inside Flexbox or margin-inline-end so icon spacing stays accurate in RTL.'],
          ],
          [
            ['In horizontal English (writing-mode: horizontal-tb), what do inline and block axes map to?', 'inline maps to horizontal (left-to-right), and block maps to vertical (top-to-bottom).'],
            ['How does padding-inline: 1rem 2rem behave when dir="rtl" is set?', 'The 1rem start padding moves to the right side and the 2rem end padding moves to the left side automatically.'],
          ],
          'In standard horizontal-tb writing mode with dir="rtl", which physical side does margin-inline-start apply to?',
          ['The right side', 'The left side', 'The top side', 'The bottom side'],
          0,
          'In RTL horizontal text, the inline-start edge is the right side.'
        ),
        L(
          'Media Preference Queries: Reduced Motion, Contrast & Color Scheme',
          'User preference media queries let CSS adapt respectfully to system accessibility settings: prefers-color-scheme, prefers-reduced-motion, prefers-contrast, and forced-colors.',
          'Setting color-scheme: light dark on :root also themes native browser scrollbars, form controls, date pickers, and canvas backgrounds cleanly without hacking custom widgets.',
          'Always treat prefers-reduced-motion: reduce by disabling large translations/parallax while keeping subtle instant opacity transitions.',
          'Comprehensive User Preference Adaptation',
          `:root { color-scheme: light dark; }\n\n@media (prefers-reduced-motion: reduce) {\n  *, *::before, *::after {\n    animation-duration: 0.01ms !important;\n    transition-duration: 0.01ms !important;\n    scroll-behavior: auto !important;\n  }\n}\n\n@media (prefers-contrast: more) {\n  .card { border-width: 2px; border-color: currentColor; }\n}`,
          undefined,
          [
            'color-scheme: light dark styles native scrollbars and form inputs to match dark mode.',
            'prefers-reduced-motion protects users sensitive to vestibular motion triggers.',
            'prefers-contrast: more lets you strengthen borders and text contrast automatically.',
          ],
          [
            ['Forgetting color-scheme: dark on dark-mode apps, leaving blinding white native scrollbars', 'Set color-scheme: dark on html.dark so native scrollbars and form controls match seamlessly.'],
            ['Only checking prefers-color-scheme without honoring an explicit user toggle', 'Apply explicit class/data-theme tokens first and use prefers-color-scheme as the initial default.'],
          ],
          [
            ['What does setting color-scheme: dark on <html> change immediately?', 'It tells the browser to render native scrollbars, checkboxes, select menus, and default canvas backgrounds in dark mode styling.'],
            ['Does prefers-reduced-motion: reduce mean you must remove every visual state change?', 'No—eliminate spatial movement, scaling, and parallax, while retaining instant or subtle opacity/color cues so feedback stays clear.'],
          ],
          'What is the main visual effect of adding color-scheme: dark to the root element in dark mode?',
          [
            'Native browser UI such as scrollbars, date pickers, and form controls render in dark styling',
            'It automatically inverts every JPEG photo on the page',
            'It forces every CSS color to #000000',
            'It disables @media queries',
          ],
          0,
          'color-scheme informs the browser’s user-agent stylesheet to render native controls and scrollbars in dark theme.'
        ),
        L(
          'Print Stylesheets & Rendering Performance Auditing',
          'A well-crafted @media print stylesheet turns documentation, invoices, and course certificates into clean printable pages by hiding navigation chrome, avoiding awkward page breaks, and printing link URLs.',
          'On the rendering performance side, use content-visibility: auto with contain-intrinsic-size on long off-screen sections so the browser skips layout and paint for out-of-viewport content until scrolled near.',
          'Use break-inside: avoid on cards and code blocks in @media print, and audit CLS/paint flashing in Chrome DevTools Rendering panel.',
          'Print Rules & Off-Screen content-visibility Optimization',
          `@media print {\n  nav, .sidebar, .no-print { display: none !important; }\n  pre, .lesson-card { break-inside: avoid; }\n  body { color: #000; background: #fff; font-size: 11pt; }\n}\n\n.long-course-section {\n  content-visibility: auto;\n  contain-intrinsic-size: 1px 600px;\n}`,
          undefined,
          [
            '@media print strips navbars/buttons and prevents sliced code blocks with break-inside: avoid.',
            'content-visibility: auto skips rendering off-screen sections for dramatic initial load speedups.',
            'Always pair content-visibility: auto with contain-intrinsic-size to prevent scrollbar jumping.',
          ],
          [
            ['Using content-visibility: auto without contain-intrinsic-size', 'Without an intrinsic placeholder size, collapsed off-screen sections cause scrollbar jitter as you scroll.'],
            ['Printing dark-mode pages with dark backgrounds intact', 'Override background to #fff and text to #000 inside @media print to save ink and keep printouts crisp.'],
          ],
          [
            ['How does content-visibility: auto speed up rendering of very long pages?', 'The browser skips style, layout, and paint work for off-screen elements until they approach the viewport, dramatically cutting initial render time.'],
            ['Which CSS property prevents a card or code block from being split across two printed pages?', 'break-inside: avoid (the modern standard replacing page-break-inside: avoid).'],
          ],
          'Why should you pair content-visibility: auto with contain-intrinsic-size?',
          [
            'So the browser reserves an estimated height for skipped off-screen elements and prevents scrollbar jumping',
            'Because content-visibility causes a syntax error without it',
            'To force images to load eagerly',
            'To enable CSS Grid subgrid automatically',
          ],
          0,
          'contain-intrinsic-size gives off-screen skipped blocks a stable estimated height so scrollbars stay accurate.'
        ),
      ],
      outputQuestions: [
        {
          prompt: 'When a page switches to <html dir="rtl">, which edge gets the 4px indigo border?',
          code: `.note { border-inline-start: 4px solid #4f46e5; }`,
          options: ['The right edge', 'The left edge', 'The top edge', 'Both left and right edges'],
          correctIndex: 0,
          explanation: 'border-inline-start mirrors automatically to the right side in RTL reading direction.',
        },
        {
          prompt: 'What does break-inside: avoid do inside @media print?',
          code: `@media print {\n  .code-block { break-inside: avoid; }\n}`,
          options: [
            'Keeps the code block together on one printed page instead of splitting it mid-block',
            'Prevents line wrapping inside the code block',
            'Hides the code block when printing',
            'Forces a page break after every line of code',
          ],
          correctIndex: 0,
          explanation: 'break-inside: avoid instructs the print paginator not to slice the box across page boundaries.',
        },
      ],
    },
  ],
  project: {
    title: 'Dual-Theme SaaS Pricing & Dashboard System in Pure Modern CSS',
    estimatedHours: 5,
    difficulty: 'Beginner to Advanced',
    brief:
      'Build a responsive Light/Dark SaaS pricing matrix and analytics grid powered strictly by modern CSS: @layer architecture, OKLCH custom properties, Container Queries for portable cards, CSS Subgrid for row alignment, :has() interactive billing toggle styling, and prefers-reduced-motion compositor animations.',
    requirements: [
      'Organize styles into explicit @layer reset, tokens, layout, components, utilities.',
      'Define Light and Dark semantic tokens using CSS custom properties and oklch() colors meeting WCAG AA (4.5:1+) contrast.',
      'Build an intrinsic responsive pricing card grid with CSS Grid and align card titles, prices, and CTA buttons across columns using CSS Subgrid.',
      'Implement a Container Query (@container) card component that switches from stacked to horizontal layout when its host is >= 460px wide.',
      'Style the monthly/annual billing toggle and highlighted plan card purely via CSS :has(input:checked).',
      'Add compositor-only hover transitions (transform, opacity) and wrap motion cleanly with @media (prefers-reduced-motion: reduce).',
    ],
    steps: [
      ['Establish Cascade Layers & Reset', 'Declare @layer order at the top of styles.css and apply border-box + font: inherit resets.'],
      ['Build OKLCH Dual-Theme Tokens', 'Create :root and .dark semantic variables for canvas, surface, border, primary text, muted text, and indigo accent.'],
      ['Compose the Subgrid Pricing Matrix', 'Set up a 3-column grid with minmax(0, 1fr) and configure each card with grid-row: span 4; grid-template-rows: subgrid;.'],
      ['Add Container Query Portability', 'Wrap feature callouts in container-type: inline-size so the same card adapts inside sidebars and main columns.'],
      ['Wire :has() Interactive States', 'Highlight the selected plan card border and elevation using .plan-card:has(input:checked) without extra state classes.'],
      ['Polish Motion & Accessibility', 'Add 180ms compositor-only hover transitions, tabular-nums on pricing metrics, and prefers-reduced-motion safeguards.'],
    ],
    referenceSolution: [
      {
        filename: 'styles.css',
        language: 'css',
        code: `@layer reset, tokens, layout, components, utilities;

@layer reset {
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; font-family: "Plus Jakarta Sans", system-ui, sans-serif; line-height: 1.6; }
  button, input { font: inherit; }
}

@layer tokens {
  :root {
    --canvas: oklch(98.4% 0.003 247);
    --surface: oklch(100% 0 0);
    --border: oklch(90% 0.01 255);
    --ink: oklch(20% 0.03 260);
    --muted: oklch(48% 0.02 255);
    --accent: oklch(52% 0.22 268);
  }
  .dark {
    --canvas: oklch(16% 0.02 260);
    --surface: oklch(21% 0.02 260);
    --border: oklch(30% 0.02 260);
    --ink: oklch(97% 0.005 247);
    --muted: oklch(72% 0.02 255);
    --accent: oklch(64% 0.20 268);
  }
}

@layer layout {
  .pricing-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr));
    gap: 1.5rem;
    max-inline-size: 72rem;
    margin-inline: auto;
    padding: 2rem 1rem;
  }
}

@layer components {
  .plan-card {
    display: grid;
    grid-row: span 4;
    grid-template-rows: subgrid;
    gap: 0.75rem;
    padding: 1.5rem;
    border-radius: 1rem;
    background: var(--surface);
    border: 1px solid var(--border);
    transition: transform 180ms cubic-bezier(0.16, 1, 0.3, 1), border-color 180ms ease;
  }

  .plan-card:has(input:checked) {
    border-color: var(--accent);
  }

  .plan-price {
    font-variant-numeric: tabular-nums;
    font-size: clamp(1.75rem, 1.2rem + 1.5vw, 2.5rem);
    font-weight: 800;
  }

  .feature-slot { container-type: inline-size; }
  @container (width >= 460px) {
    .feature-banner { display: grid; grid-template-columns: 1fr auto; align-items: center; }
  }
}

@media (hover: hover) {
  .plan-card:hover { transform: translateY(-2px); }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { transition-duration: 0.01ms !important; }
}`,
      },
      {
        filename: 'index.html',
        language: 'html',
        code: `<section class="pricing-grid" aria-label="Plans">
  <label class="plan-card">
    <input type="radio" name="plan" value="starter" checked />
    <h2>Starter</h2>
    <p class="plan-price">$0</p>
    <p>All 23 core tracks, quizzes, and local progress tracking.</p>
  </label>
  <label class="plan-card">
    <input type="radio" name="plan" value="team" />
    <h2>Team Engineering</h2>
    <p class="plan-price">$29</p>
    <p>Shared cohort analytics, SSO, and team benchmark exams.</p>
  </label>
</section>`,
      },
    ],
  },
};

buildAndEmitCourse(cssCourse);
console.log('Emitted course: css');
