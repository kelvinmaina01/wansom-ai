const fs = require("fs");
let c = fs.readFileSync("components/CaseManager.tsx", "utf8");

c = c.replace(/Mrs\. Adaobi Okeke vs Zenith Bank Plc/g, "Kelvin Maina vs Zenith Bank Plc");

c = c.replace(/bg-\[#050505\]/g, "bg-[#f8fafc]");
c = c.replace(/bg-\[#080808\]/g, "bg-white");
c = c.replace(/text-white/g, "text-gray-900");
c = c.replace(/border-white\/5(?!0)/g, "border-gray-200");
c = c.replace(/border-white\/10/g, "border-gray-200");
c = c.replace(/bg-white\/5(?!0)/g, "bg-white");
c = c.replace(/bg-white\/10/g, "bg-gray-50");
c = c.replace(/bg-black\/40/g, "bg-[#f8fafc]");
c = c.replace(/text-gray-400/g, "text-gray-500");
c = c.replace(/text-gray-500/g, "text-gray-500");

// Hovers
c = c.replace(/hover:bg-white\/5(?!0)/g, "hover:bg-gray-50");
c = c.replace(/hover:bg-white\/10/g, "hover:bg-gray-100");
c = c.replace(/hover:border-white\/10/g, "hover:border-gray-300");
c = c.replace(/hover:text-white/g, "hover:text-gray-900");

// Restore white text for specific badges/buttons
c = c.replace(/bg-red-600 hover:bg-red-700 text-gray-900/g, "bg-red-600 hover:bg-red-700 text-white");
c = c.replace(/bg-red-600 text-gray-900/g, "bg-red-600 text-white");
c = c.replace(/bg-gray-900 text-gray-900/g, "bg-gray-900 text-white");
c = c.replace(/text-emerald-500 bg-emerald-500\/10/g, "text-emerald-600 bg-emerald-50");
c = c.replace(/text-yellow-500 bg-yellow-500\/10/g, "text-yellow-600 bg-yellow-50");

// Rounding
c = c.replace(/rounded-2xl/g, "rounded-[15px]");
c = c.replace(/rounded-3xl/g, "rounded-[15px]");
c = c.replace(/rounded-\[2\.5rem\]/g, "rounded-[15px]");

fs.writeFileSync("components/CaseManager.tsx", c);
console.log("Updated size:", c.length);
