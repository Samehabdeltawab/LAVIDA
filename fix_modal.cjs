const fs = require('fs');
const fp = 'd:\\لافيدا\\Latest\\Lavida-Properties-main\\Lavida-Properties-main\\src\\components\\Projects.tsx';

// Convert correct Arabic → Windows-1252 Mojibake (matches what's actually in the file)
const decoder = new TextDecoder('windows-1252');
function mj(ar) { return decoder.decode(Buffer.from(ar, 'utf8')); }

let c = fs.readFileSync(fp, 'utf8');
let n = 0;

function rep(ar, to) {
  const bad = mj(ar);
  if (c.includes(bad)) { c = c.split(bad).join(to); n++; }
  else console.warn('NOT FOUND:', ar);
}

rep('الموقع الجغرافي',               'الموقع الجغرافي');
rep('أسعار الوحدات',                  'أسعار الوحدات');
rep('حول المشروع',                    'حول المشروع');
rep('المواصفات العامة والمميزات',     'المواصفات العامة والمميزات');
rep('مرافق وتجهيزات مدمجة',           'مرافق وتجهيزات مدمجة');
rep('طلب تسعيرة أو معاينة خاصة',     'طلب تسعيرة أو معاينة خاصة');

// Long paragraph
const fragAr = 'يتميز هذا المشروع بتصميمات معمارية';
const frag = mj(fragAr);
const si = c.indexOf(frag);
if (si !== -1) {
  const qi = c.indexOf('"', si + frag.length + 80);
  if (qi !== -1) {
    c = c.substring(0, si) +
      'يتميز هذا المشروع بتصميمات معمارية تجمع بين الفخامة المعاصرة والاستدامة التشغيلية. نوفر باقة سكنية أو سياحية أو تجارية فريدة وحصرية لعملائنا في لاڤيدا بروبيرتز لضمان استثمار آمن ومتميز للأجيال القادمة.' +
      c.substring(qi);
    n++;
  }
} else { console.warn('NOT FOUND: paragraph'); }

// Footer note
const frag2 = mj('* يتوفر تسهيلات في السداد والتمويل');
const si2 = c.indexOf(frag2);
if (si2 !== -1) {
  const qi2 = c.indexOf('"', si2 + frag2.length + 20);
  if (qi2 !== -1) {
    c = c.substring(0, si2) +
      '* يتوفر تسهيلات في السداد والتمويل العقاري تصل إلى 8 سنوات بدون فوائد.' +
      c.substring(qi2);
    n++;
  }
} else { console.warn('NOT FOUND: footer note'); }

fs.writeFileSync(fp, c, 'utf8');
console.log('Done. Fixed', n, 'strings.');
