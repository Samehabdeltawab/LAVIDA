// Rewrites UnitsManager.tsx with full bilingual (AR/EN) support
const fs = require('fs');
const fp = 'd:\\لافيدا\\Latest\\Lavida-Properties-main\\Lavida-Properties-main\\src\\components\\UnitsManager.tsx';
let c = fs.readFileSync(fp, 'utf8');

// ─── Normalize CRLF → LF ─────────────────────────────────────────────────────
c = c.replace(/\r\n/g, '\n');

// Helpers
function rep(from, to) {
  if (c.includes(from)) { c = c.split(from).join(to); }
  else console.warn('NOT FOUND:', from.substring(0,60));
}
// Regex replace - for JSX text content where whitespace varies
function rrep(pattern, to) {
  if (pattern.test(c)) { c = c.replace(pattern, to); }
  else console.warn('REGEX NOT FOUND:', pattern.toString().substring(0,60));
}

// ─── 1. Add useLang import ────────────────────────────────────────────────────
rep(
  'import { storeBlob, getBlobUrl, removeBlob, compressImage } from "../utils/mediaDB";',
  'import { storeBlob, getBlobUrl, removeBlob, compressImage } from "../utils/mediaDB";\nimport { useLang } from "../LangContext";'
);

// ─── 2. Add bilingual display maps before component fn ───────────────────────
const MAPS = `// ── Bilingual display maps ───────────────────────────────────────────────────
const TYPE_DISPLAY: Record<string, {ar:string;en:string}> = {
  "\u0633\u0643\u0646\u064A":  {ar:"\u0633\u0643\u0646\u064A",  en:"Residential"},
  "\u0641\u0646\u062F\u0642\u064A": {ar:"\u0641\u0646\u062F\u0642\u064A", en:"Hotel"},
  "\u062A\u062C\u0627\u0631\u064A": {ar:"\u062A\u062C\u0627\u0631\u064A", en:"Commercial"},
  "\u0625\u062F\u0627\u0631\u064A": {ar:"\u0625\u062F\u0627\u0631\u064A", en:"Administrative"},
  "\u0637\u0628\u064A":   {ar:"\u0637\u0628\u064A",   en:"Medical"},
  "\u0633\u0627\u062D\u0644\u064A": {ar:"\u0633\u0627\u062D\u0644\u064A", en:"Coastal"},
};
const FINISHING_DISPLAY: Record<string, {ar:string;en:string}> = {
  "\u062A\u0634\u0637\u064A\u0628 \u0643\u0627\u0645\u0644":  {ar:"\u062A\u0634\u0637\u064A\u0628 \u0643\u0627\u0645\u0644",  en:"Full Finishing"},
  "\u0633\u0648\u0628\u0631 \u0644\u0648\u0643\u0633":   {ar:"\u0633\u0648\u0628\u0631 \u0644\u0648\u0643\u0633",   en:"Super Lux"},
  "\u0646\u0635\u0641 \u062A\u0634\u0637\u064A\u0628":   {ar:"\u0646\u0635\u0641 \u062A\u0634\u0637\u064A\u0628",   en:"Semi Finishing"},
  "\u0628\u062F\u0648\u0646 \u062A\u0634\u0637\u064A\u0628": {ar:"\u0628\u062F\u0648\u0646 \u062A\u0634\u0637\u064A\u0628", en:"No Finishing"},
};
const STATUS_DISPLAY: Record<string, {ar:string;en:string}> = {
  "\u0645\u062A\u0627\u062D": {ar:"\u0645\u062A\u0627\u062D", en:"Available"},
  "\u0645\u062D\u062C\u0648\u0632": {ar:"\u0645\u062D\u062C\u0648\u0632", en:"Reserved"},
  "\u0645\u0628\u0627\u0639":  {ar:"\u0645\u0628\u0627\u0639",  en:"Sold"},
};

`;
rep('export default function UnitsManager', MAPS + 'export default function UnitsManager');

// ─── 3. Add lang + L() inside component ──────────────────────────────────────
rep(
  'export default function UnitsManager({ isOpen, onClose }: UnitsManagerProps) {\n  const [units,',
  'export default function UnitsManager({ isOpen, onClose }: UnitsManagerProps) {\n  const { lang } = useLang();\n  const L = (ar: string, en: string) => lang === "ar" ? ar : en;\n  const [units,'
);

// ─── 4. Error messages ────────────────────────────────────────────────────────
rep('setFormError("اسم الوحدة مطلوب")',   'setFormError(L("اسم الوحدة مطلوب", "Unit name is required"))');
rep('setFormError("اسم المشروع مطلوب")', 'setFormError(L("اسم المشروع مطلوب", "Project name is required"))');

// ─── 5. CSV headers ───────────────────────────────────────────────────────────
rep(
  '"الاسم", "النوع", "المشروع", "العنوان", "المساحة م²", "الدور", "السعر الإجمالي", "سعر المتر", "الغرف", "الحمامات", "التشطيب", "الحالة", "ملاحظات", "تاريخ الإضافة"',
  'L("الاسم","Name"),L("النوع","Type"),L("المشروع","Project"),L("العنوان","Address"),L("المساحة م²","Area m²"),L("الدور","Floor"),L("السعر الإجمالي","Total Price"),L("سعر المتر","Price/m²"),L("الغرف","Rooms"),L("الحمامات","Bathrooms"),L("التشطيب","Finishing"),L("الحالة","Status"),L("ملاحظات","Notes"),L("تاريخ الإضافة","Date Added")'
);
rep(
  'new Date(u.addedDate).toLocaleDateString("ar-EG")',
  'new Date(u.addedDate).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US")'
);

// ─── 6. Stats labels ─────────────────────────────────────────────────────────
rep('{ label: "إجمالي الوحدات"', '{ label: L("إجمالي الوحدات","Total Units")');
rep('{ label: "متاحة",',         '{ label: L("متاحة","Available"),');
rep('{ label: "محجوزة",',        '{ label: L("محجوزة","Reserved"),');
rep('{ label: "مباعة",',         '{ label: L("مباعة","Sold"),');

// ─── 7. Header buttons (using regex for whitespace-flexible JSX text) ─────────
rep('title="إغلاق"',        'title={L("إغلاق","Close")}');
rep('title="تسجيل الخروج"', 'title={L("تسجيل الخروج","Logout")}');
c = c.replace(/(<Download[^/]*\/>)\s*\n\s*تصدير CSV/, '$1\n              {L("تصدير CSV","Export CSV")}');
c = c.replace(/(<LogOut[^/]*\/>)\s*\n\s*خروج/, '$1\n              {L("خروج","Logout")}');
c = c.replace(/إضافة وحدة\s*\n\s*(<Plus)/, '{L("إضافة وحدة","Add Unit")}\n            $1');
c = c.replace(/>إدارة الوحدات العقارية<\/h2>/, '>{L("إدارة الوحدات العقارية","Property Units Manager")}</h2>');
c = c.replace(/>إضافة · تعديل · تتبع الحالة · تصدير<\/p>/, '>{L("إضافة · تعديل · تتبع الحالة · تصدير","Add · Edit · Track · Export")}</p>');

// ─── 8. Filter bar ────────────────────────────────────────────────────────────
rep('placeholder="بحث باسم الوحدة أو المشروع..."',
    'placeholder={L("بحث باسم الوحدة أو المشروع...","Search unit or project...")}');
c = c.replace(/<option value="\u0627\u0644\u0643\u0644">\u0643\u0644 \u0627\u0644\u0623\u0646\u0648\u0627\u0639<\/option>/,
  '<option value="الكل">{L("كل الأنواع","All Types")}</option>');
c = c.replace(/<option value="\u0627\u0644\u0643\u0644">\u0643\u0644 \u0627\u0644\u062D\u0627\u0644\u0627\u062A<\/option>/,
  '<option value="الكل">{L("كل الحالات","All Statuses")}</option>');
// Replace UNIT_TYPES options in filter
rep('{UNIT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}',
    '{UNIT_TYPES.map(t => <option key={t} value={t}>{TYPE_DISPLAY[t]?.[lang] ?? t}</option>)}');
// Replace STATUS_TYPES options in filter
rep('{STATUS_TYPES.map(s => <option key={s} value={s}>{s}</option>)}',
    '{STATUS_TYPES.map(s => <option key={s} value={s}>{STATUS_DISPLAY[s]?.[lang] ?? s}</option>)}');
c = c.replace(/>\s*مسح الفلاتر ×\s*<\/button>/, '>{L("مسح الفلاتر ×","Clear Filters ×")}</button>');
rep('{filtered.length} وحدة', '{filtered.length} {L("وحدة","unit(s)")}');

// ─── 9. Empty state ───────────────────────────────────────────────────────────
rep('"لا توجد وحدات بعد" : "لا توجد نتائج للفلتر الحالي"',
    'L("لا توجد وحدات بعد","No units yet") : L("لا توجد نتائج للفلتر الحالي","No results")');
c = c.replace(/>\s*إضافة أول وحدة\s*<\/button>/, '>{L("إضافة أول وحدة","Add First Unit")}</button>');

// ─── 10. Unit row ─────────────────────────────────────────────────────────────
rep('>{unit.rooms} غرف<', '>{unit.rooms} {L("غرف","rms")}<');
rep('title="تعديل"', 'title={L("تعديل","Edit")}');
rep('title="حذف"',   'title={L("حذف","Delete")}');
c = c.replace(/>\s*لا\s*<\/button>/, '>{L("لا","No")}</button>');
c = c.replace(/>\s*نعم\s*<\/button>/, '>{L("نعم","Yes")}</button>');
c = c.replace(/<span className="text-xs text-red-600 font-medium">حذف؟<\/span>/,
  '<span className="text-xs text-red-600 font-medium">{L("حذف؟","Delete?")}</span>');
c = c.replace(/\{unit\.type\}(?=<\/span>)/, '{TYPE_DISPLAY[unit.type]?.[lang] ?? unit.type}');
c = c.replace(/\{unit\.status\}(?=<\/span>)/, '{STATUS_DISPLAY[unit.status]?.[lang] ?? unit.status}');
rep('unit.floor ? ` · الدور ${unit.floor}` : ""',
    'unit.floor ? ` · ${L("الدور","Fl.")} ${unit.floor}` : ""');

// ─── 11. Form header ──────────────────────────────────────────────────────────
rep('{editingId ? "تعديل بيانات الوحدة" : "إضافة وحدة عقارية جديدة"}',
    '{editingId ? L("تعديل بيانات الوحدة","Edit Unit") : L("إضافة وحدة عقارية جديدة","Add New Unit")}');

// ─── 12. Form labels (regex for flexible whitespace) ──────────────────────────
const LABELS = [
  ['\u0627\u0633\u0645 \u0627\u0644\u0648\u062D\u062F\u0629',              'Unit Name'],      // اسم الوحدة
  ['\u0627\u0633\u0645 \u0627\u0644\u0645\u0634\u0631\u0648\u0639',         'Project Name'],  // اسم المشروع
  ['\u0627\u0633\u0645 \u0627\u0644\u0645\u0637\u0648\u0631',              'Developer Name'], // اسم المطور
  ['\u0627\u0644\u0639\u0646\u0648\u0627\u0646',                            'Address'],        // العنوان
  ['\u0627\u0644\u0646\u0648\u0639',                                        'Type'],           // النوع
  ['\u0627\u0644\u062D\u0627\u0644\u0629',                                  'Status'],         // الحالة
  ['\u0627\u0644\u062A\u0634\u0637\u064A\u0628',                            'Finishing'],      // التشطيب
  ['\u0627\u0644\u0645\u0633\u0627\u062D\u0629 (\u0645\u00B2)',             'Area (m\u00B2)'], // المساحة (م²)
  ['\u0627\u0644\u062F\u0648\u0631',                                        'Floor'],          // الدور
  ['\u0627\u0644\u063A\u0631\u0641',                                        'Rooms'],          // الغرف
  ['\u0627\u0644\u062D\u0645\u0627\u0645\u0627\u062A',                      'Bathrooms'],      // الحمامات
  ['\u0627\u0644\u0633\u0639\u0631 \u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A (\u062C.\u0645)', 'Total Price (EGP)'], // السعر الإجمالي (ج.م)
  ['\u0633\u0639\u0631 \u0627\u0644\u0645\u062A\u0631 (\u062C.\u0645)',     'Price/m\u00B2 (EGP)'], // سعر المتر (ج.م)
  ['\u0635\u0648\u0631 \u0627\u0644\u0648\u062D\u062F\u0629',              'Unit Photos'],    // صور الوحدة
  ['\u0641\u064A\u062F\u064A\u0648 \u0627\u0644\u0648\u062D\u062F\u0629',  'Unit Video'],     // فيديو الوحدة
  ['\u0645\u0644\u0627\u062D\u0638\u0627\u062A',                            'Notes'],          // ملاحظات
];
for (const [ar, en] of LABELS) {
  // label with required star
  c = c.replace(
    new RegExp(`(<label[^>]+>)\\s*${ar}\\s*(<span className="text-red-500">)`, 'g'),
    `$1{L("${ar}","${en}")} $2`
  );
  // plain label
  c = c.replace(
    new RegExp(`(<label[^>]+>)\\s*${ar}\\s*(<\\/label>)`, 'g'),
    `$1{L("${ar}","${en}")}$2`
  );
}

// ─── 13. Form dropdowns ───────────────────────────────────────────────────────
// UNIT_TYPES in form (second occurrence after filter was already replaced)
c = c.replace(/{UNIT_TYPES\.map\(t => <option key=\{t\} value=\{t\}>\{t\}<\/option>\)}/g,
  '{UNIT_TYPES.map(t => <option key={t} value={t}>{TYPE_DISPLAY[t]?.[lang] ?? t}</option>)}');
c = c.replace(/{STATUS_TYPES\.map\(s => <option key=\{s\} value=\{s\}>\{s\}<\/option>\)}/g,
  '{STATUS_TYPES.map(s => <option key={s} value={s}>{STATUS_DISPLAY[s]?.[lang] ?? s}</option>)}');
rep('{FINISHING_TYPES.map(f => <option key={f} value={f}>{f}</option>)}',
    '{FINISHING_TYPES.map(f => <option key={f} value={f}>{FINISHING_DISPLAY[f]?.[lang] ?? f}</option>)}');

// ─── 14. Form placeholders ────────────────────────────────────────────────────
const PLACEHOLDERS = [
  ['مثال: شقة A-301',                                           'e.g. Apt A-301'],
  ['مثال: كمبوند لاڤيدا ريزيدنس',                             'e.g. Lavida Residence'],
  ['مثال: شركة تطوير مصر',                                      'e.g. Developer Co.'],
  ['مثال: التجمع الخامس، القاهرة الجديدة',                    'e.g. New Cairo'],
  ['الثالث',                                                     '3rd'],
  ['أي ملاحظات إضافية عن الوحدة، الموقع، المميزات الخاصة...', 'Additional notes...'],
];
for (const [ar, en] of PLACEHOLDERS) {
  rep(`placeholder="${ar}"`, `placeholder={L("${ar}","${en}")}`);
}

// ─── 15. Image zone ───────────────────────────────────────────────────────────
c = c.replace(/{formData\.images\.length}\/15 صورة/,        '{formData.images.length}/15 {L("صورة","photo(s)")}');
c = c.replace(/>\s*جاري ضغط الصور\.\.\.\s*<\/span>/,       '>{L("جاري ضغط الصور...","Compressing...")}</span>');
c = c.replace(/وصلت الحد الأقصى \(15 صورة\)/,               '{L("وصلت الحد الأقصى (15 صورة)","Max 15 photos reached")}');
c = c.replace(/>\s*اضغط لاختيار الصور من جهازك\s*<\/p>/,   '>{L("اضغط لاختيار الصور","Click to choose photos")}</p>');
c = c.replace(/JPG · PNG · WebP · تُضغط تلقائياً/,          'JPG · PNG · WebP · {L("تُضغط تلقائياً","auto-compressed")}');
c = c.replace(/<span className="absolute bottom-1 left-1 bg-black\/50 text-white text-\[9px\] px-1 rounded">رئيسية<\/span>/,
  '<span className="absolute bottom-1 left-1 bg-black/50 text-white text-[9px] px-1 rounded">{L("رئيسية","Main")}</span>');

// ─── 16. Video zone ───────────────────────────────────────────────────────────
c = c.replace(/>\s*جاري الرفع\.\.\.\s*<\/span>/, '>{L("جاري الرفع...","Uploading...")}</span>');
c = c.replace(/>\s*رفع من الجهاز\s*<\/p>/,       '>{L("رفع من الجهاز","Upload from device")}</p>');
c = c.replace(/>\s*جاري تحميل الفيديو\.\.\.\s*<\/span>/, '>{L("جاري تحميل الفيديو...","Loading video...")}</span>');
c = c.replace(/>\s*× حذف الفيديو\s*</,           '>{L("× حذف الفيديو","× Remove video")}<');
rep('"فيديو مرفوع من الجهاز" : "رابط خارجي"',
    'L("فيديو مرفوع من الجهاز","Local video") : L("رابط خارجي","External link")');
c = c.replace(/>\s*أو رابط YouTube \/ Vimeo\s*<\/p>/,
  '>{L("أو رابط YouTube / Vimeo","or YouTube / Vimeo URL")}</p>');

// ─── 17. Form action buttons ──────────────────────────────────────────────────
rep('{editingId ? "حفظ التعديلات" : "إضافة الوحدة"}',
    '{editingId ? L("حفظ التعديلات","Save Changes") : L("إضافة الوحدة","Add Unit")}');
c = c.replace(/>\s*إلغاء\s*<\/button>(?=\s*\n\s*<button\s+type="submit")/, '>{L("إلغاء","Cancel")}</button>');

// ─── 18. Make form direction conditional ──────────────────────────────────────
rep('className="p-6 space-y-5 text-right"',
    'className={`p-6 space-y-5 ${lang === "ar" ? "text-right" : "text-left"}`}');

// ─── 19. Write file ───────────────────────────────────────────────────────────
fs.writeFileSync(fp, c, 'utf8');
console.log('Done! Lines:', c.split('\n').length);
