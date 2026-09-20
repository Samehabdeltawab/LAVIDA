const fs = require('fs');
const fp = 'd:\\لافيدا\\Latest\\Lavida-Properties-main\\Lavida-Properties-main\\src\\components\\Projects.tsx';
let c = fs.readFileSync(fp, 'utf8');

// ── Step 1: remove orphaned old code ────────────────────────────────────────
// The clean projects array closes with "  ];"
// Immediately after it, the orphaned block starts with "details: lang"
// We need to remove everything from that "details:" up to "\n  const categories"

// Handle both LF and CRLF
let si = c.indexOf('  ];\n      details:');
if (si === -1) si = c.indexOf('  ];\r\n      details:');

let ei = c.indexOf('\n  const categories');
if (ei === -1) ei = c.indexOf('\r\n  const categories');

console.log('orphanStart idx:', si, '  categoriesStart idx:', ei);

if (si !== -1 && ei !== -1) {
  // keep "  ];" (4 chars) then jump straight to "\n  const categories ..."
  c = c.substring(0, si + 4) + c.substring(ei);
  console.log('✓ Orphaned block removed');
} else {
  console.log('✗ Pattern not found — no change made to orphaned block');
}

// ── Step 2: fix Mojibake in categories array ─────────────────────────────────
// Replace the whole const categories block with a clean version
const catRegex = /const categories = \[[\s\S]*?\];/;
const catMatch = c.match(catRegex);
if (catMatch) {
  const cleanCats = `const categories = [
    { value: "All",       label: t(lang, "projects_all") },
    { value: lang === "ar" ? "\u0633\u0643\u0646\u064A"  : "Residential", label: t(lang, "projects_residential") },
    { value: lang === "ar" ? "\u062A\u062C\u0627\u0631\u064A" : "Commercial",  label: t(lang, "projects_commercial") },
    { value: lang === "ar" ? "\u0633\u0627\u062D\u0644\u064A" : "Coastal",     label: t(lang, "projects_coastal") },
  ];`;
  c = c.replace(catMatch[0], cleanCats);
  console.log('✓ Categories fixed');
} else {
  console.log('✗ const categories not found');
}

fs.writeFileSync(fp, c, 'utf8');
console.log('✓ File written successfully');
