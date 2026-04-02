import { readFileSync, writeFileSync } from 'fs';

let c = readFileSync('components/Integrations.tsx', 'utf8');

// Replace SOC 2 badge - find the entire block from the gradient div to closing tag
const soc2Pattern = /<div className="w-24 h-24 shrink-0 bg-gradient-to-br from-white\/10 to-transparent rounded-full flex flex-col items-center justify-center border-2 border-yellow-500\/30[^"]*"[^>]*>[\s\S]*?(?=<div className="flex flex-col max-w-\[120px\])/;

const soc2Replacement = `<div className="w-24 h-24 shrink-0 bg-white/5 rounded-full flex flex-col items-center justify-center border-2 border-white/20 group-hover:border-red-600 transition-all duration-300">
                           <span className="text-white text-lg font-black leading-tight">SOC 2</span>
                           <span className="text-red-600 text-[9px] font-black tracking-[0.2em] mt-0.5">Type II</span>
                         </div>
                         `;

c = c.replace(soc2Pattern, soc2Replacement);

// Replace GDPR badge
const gdprPattern = /<div className="w-24 h-24 shrink-0 bg-gradient-to-br from-white\/10 to-transparent rounded-full flex flex-col items-center justify-center border-2 border-blue-500\/30[^"]*"[^>]*>[\s\S]*?(?=<div className="flex flex-col max-w-\[120px\])/;

const gdprReplacement = `<div className="w-24 h-24 shrink-0 bg-white/5 rounded-full flex flex-col items-center justify-center border-2 border-white/20 group-hover:border-white transition-all duration-300">
                           <span className="text-white text-lg font-black leading-tight">GDPR</span>
                           <span className="text-gray-400 text-[8px] font-black tracking-[0.2em] mt-0.5">Compliant</span>
                         </div>
                         `;

c = c.replace(gdprPattern, gdprReplacement);

writeFileSync('components/Integrations.tsx', c);

const remaining = (c.match(/bg-gradient-to-br from-white/g) || []).length;
const blurRemaining = (c.match(/blur-\[/g) || []).length;
console.log(`Done. Remaining gradient-from-white: ${remaining}, blur-[ : ${blurRemaining}`);
