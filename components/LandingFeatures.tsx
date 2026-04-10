import React, { useEffect } from 'react';

const SCRIPT_CONTENT = `
// ── UTILS ──
const sl = ms => new Promise(r => setTimeout(r, ms));
function mv(id, x, y, d=420) { const c=document.getElementById(id); if(c){c.style.transition=\`all \${d}ms cubic-bezier(.16,1,.3,1)\`;c.style.left=x+'px';c.style.top=y+'px';} }
function clk(mc,cr,x,y) { mv(mc,x,y,220); setTimeout(()=>{const r=document.getElementById(cr);if(r){r.style.left=x+'px';r.style.top=y+'px';r.classList.remove('pop');void r.offsetWidth;r.classList.add('pop');}},230); }
function getXY(frameId, el) {
  if(!el) return {x:100,y:100};
  const fr=document.getElementById(frameId).getBoundingClientRect();
  const er=el.getBoundingClientRect();
  return {x:er.left-fr.left+er.width/2, y:er.top-fr.top+er.height/2};
}
function counterUp(el, to, suffix, dur) {
  const s=performance.now(); const t=n=>{const p=Math.min((n-s)/dur,1);const e=1-Math.pow(1-p,3);el.textContent=Math.round(to*e)+suffix;if(p<1)requestAnimationFrame(t);};requestAnimationFrame(t);
}

// ── IO ──
const io = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('vis');
      const id=e.target.id;
      if(id==='fr0') setTimeout(runDA,400);
      if(id==='fr1') setTimeout(runS1,400);
      if(id==='fr2') setTimeout(runAmani,400);
      if(id==='fr3') setTimeout(runJA,400);
      if(id==='minigrid') animMini();
      io.unobserve(e.target);
    }
  });
},{threshold:0.2});
document.querySelectorAll('.feat-row,#minigrid').forEach(el=>io.observe(el));

// ════════════════════════════════════════
// DOCUMENT DRAFTING AGENT
// ════════════════════════════════════════
window.daTabActive='prev'; window.daSaveOpen=false;
window.switchDaTab = function(t) {
  ['prev','code','edit'].forEach(tab=>{
    const btn=document.getElementById('da-tab-'+tab); if(btn) btn.className='da-tab'+(tab===t?' act':'');
  });
  document.getElementById('da-preview').style.display=t==='prev'?'block':'none';
  document.getElementById('da-code-view').style.display=t==='code'?'block':'none';
  window.daTabActive=t;
}
window.toggleSaveMenu = function() {
  const m=document.getElementById('da-save-menu');
  window.daSaveOpen=!window.daSaveOpen; m.style.display=window.daSaveOpen?'block':'none';
}
window.doSave = function(dest) {
  const m=document.getElementById('da-save-menu'); m.style.display='none'; window.daSaveOpen=false;
  const msgs={drive:'✓ Saved to Google Drive',onedrive:'✓ Saved to OneDrive',pdf:'✓ Downloading PDF…',copy:'✓ Copied to clipboard'};
  const toast=document.createElement('div');
  toast.style.cssText=\`position:absolute;bottom:50px;right:10px;background:#111;color:#fff;padding:7px 14px;border-radius:8px;font-size:10px;font-weight:700;font-family:var(--font2);z-index:20;animation:slideU .3s ease\`;
  toast.textContent=msgs[dest]||'✓ Saved';
  document.getElementById('sf0').querySelector('.sc').appendChild(toast);
  setTimeout(()=>toast.remove(),2500);
}

const NDA_TOKENS = ['<strong>MUTUAL NON-DISCLOSURE AGREEMENT</strong>','<br><br>','<em>TechBridge Limited (Kenya) · and · DataVault Uganda Ltd</em>','<br><br>','This Mutual Non-Disclosure Agreement is entered into on [DATE] between ','<strong>TechBridge Limited</strong>',', a company incorporated under the Companies Act 2015 of Kenya, PIN: [NUMBER]','<br><br>','...and ','<strong>DataVault Uganda Limited</strong>',', incorporated under the Companies Act 2012 of Uganda.','<br><br>','<strong>1. DEFINITIONS</strong>','<br>','"Confidential Information" means any information disclosed by one party (the Disclosing Party) to the other (the Receiving Party) that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information…','<br><br>','<strong>2. MUTUAL OBLIGATIONS</strong>','<br>','Each party as Receiving Party shall keep all Confidential Information strictly secret and not disclose it to any third party without prior written consent…'];

window.runDA = async function() {
  const msgs=document.getElementById('da-msgs');
  const inp=document.getElementById('da-inp-txt');
  const preview=document.getElementById('da-preview');
  const codeView=document.getElementById('da-code-view');
  msgs.innerHTML='';
  preview.innerHTML=\`<div style="font-size:9px;color:var(--t4);font-family:var(--font2);padding:12px">// Legal Documents Prep Agent Workspace initialized.<br>// Describe the document you need in the chat, and the results will load here.</div>\`;
  document.getElementById('da-words').textContent='DOCUMENT · 0 WORDS';
  window.switchDaTab('prev');

  const addMsg=(role,html,delay)=>new Promise(res=>{
    setTimeout(()=>{
      const d=document.createElement('div'); d.className=\`da-msg \${role==='u'?'u':''}\`;
      d.innerHTML=\`<div class="da-av \${role==='ai'?'ai':'u'}">\${role==='ai'?'⚖':'K'}</div><div class="da-bub \${role==='ai'?'ai':'u'}">\${html}</div>\`;
      msgs.appendChild(d); requestAnimationFrame(()=>{d.classList.add('show'); msgs.scrollTop=msgs.scrollHeight;}); res();
    },delay);
  });

  // Type question
  await sl(500);
  inp.textContent='';
  const q='Draft a mutual NDA between TechBridge Ltd (Kenya) and DataVault Uganda for a software integration project. 3-year confidentiality, NCIA arbitration.';
  for(let ch of q) { inp.textContent+=ch; await sl(20); }
  await sl(300);
  // Click send
  const fr=document.getElementById('sf0').getBoundingClientRect();
  const sb=document.querySelector('.da-inp .sendbtn').getBoundingClientRect();
  clk('mc0','cr0',sb.left-fr.left+10,sb.top-fr.top+10);
  await sl(350);
  inp.textContent='Assign a task to Legal Documents Prep Agent...';
  await addMsg('u','Draft a mutual NDA between TechBridge Ltd (Kenya) and DataVault Uganda for a software integration project. 3-year confidentiality, NCIA arbitration.',0);
  await addMsg('ai','<div class="spill sp-t"><span class="pdot" style="color:#9333ea"></span>Planning your document…</div>',400);
  await sl(700);
  // Update pill
  const pill=msgs.lastElementChild.querySelector('.spill');
  if(pill){pill.className='spill sp-s';pill.innerHTML='<span class="spinner"></span>Drafting your NDA…';}
  await sl(900);
  if(pill){pill.className='spill sp-d';pill.innerHTML='<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>Document ready';}

  // Stream document to canvas
  preview.innerHTML='<div style="padding:14px 16px;font-family:Georgia,serif;font-size:9px;color:#333;line-height:1.7"></div>';
  const docEl=preview.querySelector('div');
  let wordCount=0;
  for(const tok of NDA_TOKENS) {
    if(tok.startsWith('<')) docEl.innerHTML+=tok;
    else { docEl.innerHTML+=tok; wordCount+=tok.split(' ').length; document.getElementById('da-words').textContent=\`DOCUMENT · \${wordCount} WORDS\`; }
    await sl(60);
  }

  // Add message with save suggestion
  await addMsg('ai','Your Mutual NDA is ready. Review the preview, then save to Drive or download as PDF.',500);

  // Move cursor to Code tab
  await sl(1000);
  const codeTab=document.getElementById('da-tab-code');
  const ctr=codeTab.getBoundingClientRect();
  clk('mc0','cr0',ctr.left-fr.left+ctr.width/2, ctr.top-fr.top+ctr.height/2);
  await sl(400);
  // Show code view
  codeView.innerHTML=\`<div><span class="tag">&lt;!DOCTYPE html&gt;</span></div><div><span class="tag">&lt;html</span> <span class="attr">lang</span>=<span class="val">"en"</span><span class="tag">&gt;</span></div><div><span class="tag">&lt;head&gt;</span></div><div>  <span class="tag">&lt;title&gt;</span><span style="color:#f0f6fc">Mutual NDA — TechBridge × DataVault</span><span class="tag">&lt;/title&gt;</span></div><div><span class="tag">&lt;/head&gt;</span></div><div><span class="tag">&lt;body&gt;</span></div><div>  <span class="tag">&lt;h1</span> <span class="attr">class</span>=<span class="val">"doc-title"</span><span class="tag">&gt;</span><span style="color:#f0f6fc">MUTUAL NON-DISCLOSURE AGREEMENT</span><span class="tag">&lt;/h1&gt;</span></div><div>  <span class="tag">&lt;div</span> <span class="attr">class</span>=<span class="val">"parties"</span><span class="tag">&gt;</span><span style="color:#f0f6fc">TechBridge Limited (Kenya) · DataVault Uganda</span><span class="tag">&lt;/div&gt;</span></div><div>  <span class="tag">&lt;section</span> <span class="attr">id</span>=<span class="val">"definitions"</span><span class="tag">&gt;</span></div><div>    <span class="tag">&lt;h2&gt;</span><span style="color:#f0f6fc">1. Definitions</span><span class="tag">&lt;/h2&gt;</span></div><div>    <span class="tag">&lt;p&gt;</span><span style="color:#f0f6fc">"Confidential Information" means…</span><span class="tag">&lt;/p&gt;</span></div><div>  <span class="tag">&lt;/section&gt;</span></div><div><span class="tag">&lt;/body&gt;</span></div><div><span class="tag">&lt;/html&gt;</span></div>\`;
  window.switchDaTab('code');

  await sl(1200);
  // Back to preview
  const prevTab=document.getElementById('da-tab-prev');
  const ptr=prevTab.getBoundingClientRect();
  clk('mc0','cr0',ptr.left-fr.left+ptr.width/2, ptr.top-fr.top+ptr.height/2);
  await sl(400); window.switchDaTab('prev');

  // Click download button
  await sl(800);
  const dlBtn=document.getElementById('da-save-btn');
  const dr=dlBtn.getBoundingClientRect();
  clk('mc0','cr0',dr.left-fr.left+dr.width/2, dr.top-fr.top+dr.height/2);
  await sl(350);
  window.toggleSaveMenu();
  await sl(600);
  // Move cursor to Drive option
  const menu=document.getElementById('da-save-menu');
  const items=menu.querySelectorAll('.da-save-item');
  if(items[0]) {
    const ir=items[0].getBoundingClientRect();
    mv('mc0',ir.left-fr.left+ir.width/2, ir.top-fr.top+ir.height/2);
    items[0].style.background='var(--redl)';
    await sl(400);
    clk('mc0','cr0',ir.left-fr.left+ir.width/2, ir.top-fr.top+ir.height/2);
    await sl(300); window.doSave('drive');
  }

  await sl(5000);
  window.runDA();
}

// ════════════════════════════════════════
// LEGAL AI with FOLLOW-UP CARDS
// ════════════════════════════════════════
window.runS1 = async function() {
  const msgs=document.getElementById('s1-msgs');
  const inp=document.getElementById('s1-inp-txt');
  msgs.innerHTML='';

  const addMsg=(role,html,delay)=>new Promise(res=>{
    setTimeout(()=>{
      const d=document.createElement('div'); d.className=\`s1-msg\${role==='u'?' u':''}\`;
      d.innerHTML=\`<div class="cav \${role==='ai'?'ai':'u'}">\${role==='ai'?'⚖':'K'}</div><div class="cbub \${role==='ai'?'ai':'u'}">\${html}</div>\`;
      msgs.appendChild(d); requestAnimationFrame(()=>{d.classList.add('show'); msgs.scrollTop=msgs.scrollHeight;}); res();
    },delay);
  });

  const fr=document.getElementById('sf1').getBoundingClientRect();

  // Type ambiguous question
  await sl(400);
  inp.textContent='';
  const q='What are my rights regarding land?';
  for(let ch of q) { inp.textContent+=ch; await sl(40); }
  const sb=document.querySelector('#sf1 .s1-inp .sendbtn').getBoundingClientRect();
  await sl(200); clk('mc1','cr1',sb.left-fr.left+10,sb.top-fr.top+10);
  await sl(350); inp.textContent='Assign a task...';
  await addMsg('u','What are my rights regarding land?',0);

  // AI thinking
  await addMsg('ai','<div class="spill sp-t"><span class="pdot" style="color:#9333ea"></span>Analysing your query…</div>',500);
  await sl(800);
  const pill=msgs.lastElementChild.querySelector('.spill');
  if(pill){pill.className='spill sp-t';pill.innerHTML='<span class="pdot" style="color:#9333ea"></span>I need more details to answer accurately…';}

  // Follow-up card
  await sl(500);
  const fcard=document.createElement('div'); fcard.className='fup-card';
  fcard.innerHTML=\`
    <div class="fup-hd"><span style="font-size:12px">💬</span><div class="fup-hd-title">AI needs a few details</div><div class="fup-hd-sub">2 questions</div></div>
    <div class="fup-body">
      <div class="fup-q">To give you precise legal advice, I need to understand your situation better:</div>
      <div style="font-size:10px;font-weight:600;color:var(--text);margin-bottom:6px;font-family:var(--font2)">What is your land matter about?</div>
      <div class="fup-opts" id="fup-opts1">
        <div class="fup-opt" onclick="selFup(this,'opts1')"><div class="fup-radio">○</div>I want to buy or sell land</div>
        <div class="fup-opt" onclick="selFup(this,'opts1')"><div class="fup-radio">○</div>I'm in a land ownership dispute</div>
        <div class="fup-opt" onclick="selFup(this,'opts1')"><div class="fup-radio">○</div>My land has been compulsorily acquired</div>
        <div class="fup-opt" onclick="selFup(this,'opts1')"><div class="fup-radio">○</div>Landlord/tenant rights</div>
      </div>
      <div style="font-size:10px;font-weight:600;color:var(--text);margin:8px 0 5px;font-family:var(--font2)">Which country?</div>
      <div class="fup-opts" id="fup-opts2">
        <div class="fup-opt" onclick="selFup(this,'opts2')"><div class="fup-radio">○</div>Kenya</div>
        <div class="fup-opt" onclick="selFup(this,'opts2')"><div class="fup-radio">○</div>Uganda</div>
        <div class="fup-opt" onclick="selFup(this,'opts2')"><div class="fup-radio">○</div>Tanzania</div>
      </div>
      <button class="fup-submit" id="fup-submit1">Continue →</button>
    </div>\`;
  fcard._cb = async () => await continueS1(msgs, pill, fr);
  msgs.appendChild(fcard); msgs.scrollTop=msgs.scrollHeight;

  // Simulate user clicking options
  await sl(1000);
  const opts1=fcard.querySelectorAll('#fup-opts1 .fup-opt');
  if(opts1[1]) {
    const or=opts1[1].getBoundingClientRect();
    clk('mc1','cr1',or.left-fr.left+or.width/2,or.top-fr.top+or.height/2);
    await sl(350); window.selFup(opts1[1],'opts1');
  }
  await sl(600);
  const opts2=fcard.querySelectorAll('#fup-opts2 .fup-opt');
  if(opts2[0]) {
    const or=opts2[0].getBoundingClientRect();
    clk('mc1','cr1',or.left-fr.left+or.width/2,or.top-fr.top+or.height/2);
    await sl(350); window.selFup(opts2[0],'opts2');
  }
  await sl(500);
  const submitBtn=fcard.querySelector('.fup-submit');
  if(submitBtn) {
    const sr=submitBtn.getBoundingClientRect();
    clk('mc1','cr1',sr.left-fr.left+sr.width/2,sr.top-fr.top+sr.height/2);
    await sl(350); fcard._cb();
  }
}

window.selFup=function(el,group) {
  el.closest(\`#fup-\${group}\`).querySelectorAll('.fup-opt').forEach(o=>{o.classList.remove('sel');o.querySelector('.fup-radio').textContent='○';});
  el.classList.add('sel'); el.querySelector('.fup-radio').textContent='●';
};

async function continueS1(msgs, pill, fr) {
  const fcard=msgs.querySelector('.fup-card'); if(fcard){fcard.querySelectorAll('button,.fup-opt').forEach(e=>e.style.pointerEvents='none');fcard.querySelector('.fup-submit').textContent='✓ Continuing…';fcard.querySelector('.fup-submit').style.background='var(--green)';}
  if(pill){pill.className='spill sp-s';pill.innerHTML='<span class="spinner"></span>Searching Kenya Land Law…';}

  await sl(1000);
  if(pill){pill.className='spill sp-d';pill.innerHTML='<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>Analysis complete';}

  // Stream answer
  const aid=document.createElement('div'); aid.className='s1-msg';
  const bub=document.createElement('div'); bub.className='cbub ai';
  const cur=document.createElement('span'); cur.className='cur';
  bub.appendChild(cur);
  const av=document.createElement('div'); av.className='cav ai'; av.textContent='⚖';
  aid.appendChild(av); aid.appendChild(bub);
  msgs.appendChild(aid); requestAnimationFrame(()=>{aid.classList.add('show');});

  const toks=[
    'Under the ',{ci:'Land Act 2012 (Cap 280)'},' and the ',{ci:'Land Registration Act 2012'},', you have strong constitutional protections for private property ownership — ',{g:'Article 40 of the Constitution 2010'},'.',
    '\\n\\nFor a land ownership dispute, your primary remedies are: (1) filing a suit at the ',{ci:'Environment and Land Court (ELC)'},', and (2) obtaining a caution on the title while the case is pending under ',{ci:'LRA s.71'},'.',
  ];

  for(const t of toks) {
    if(typeof t==='string'){
      if(t==='\\n\\n'){bub.insertBefore(document.createElement('br'),cur);bub.insertBefore(document.createElement('br'),cur);}
      else bub.insertBefore(document.createTextNode(t),cur);
    } else if(t.ci){const s=document.createElement('span');s.className='cbadge';s.textContent=t.ci;bub.insertBefore(s,cur);}
    else if(t.g){const s=document.createElement('strong');s.textContent=t.g;s.style.color='#16a34a';bub.insertBefore(s,cur);}
    msgs.scrollTop=msgs.scrollHeight; await sl(typeof t==='string'?Math.min(t.length*16,70):35);
  }
  cur.remove();

  // Citation cards
  await sl(500);
  const cgrid=document.createElement('div'); cgrid.className='cite-grid';
  const cites=[
    {type:'⚖ STATUTE',title:'Land Act 2012, s.24',sub:'Rights of registered owners'},
    {type:'📋 CASE',title:'Mwangi v Ndegwa [2021] eKLR',sub:'ELC — ownership dispute test'},
    {type:'⚖ STATUTE',title:'Constitution 2010, Art. 40',sub:'Right to property — Kenya'},
    {type:'🌐 WEB',title:'Kenya Law — Land Disputes',sub:'kenyalaw.org › ELC'},
  ];
  cites.forEach((c,i)=>{
    const cc=document.createElement('div'); cc.className='cite-card'; cc.style.animationDelay=i*.08+'s';
    cc.innerHTML=\`<div class="cc-type">\${c.type}</div><div class="cc-title">\${c.title}</div><div class="cc-sub">\${c.sub}</div>\`;
    cc.onclick=()=>window.showCiteExpand(c,cc,fr);
    cgrid.appendChild(cc);
  });
  msgs.appendChild(cgrid); msgs.scrollTop=msgs.scrollHeight;

  // Simulate user clicking a citation
  await sl(1200);
  const firstCite=cgrid.children[0];
  if(firstCite){
    const cr=firstCite.getBoundingClientRect();
    clk('mc1','cr1',cr.left-fr.left+cr.width/2,cr.top-fr.top+cr.height/2);
    await sl(350); window.showCiteExpand(cites[0],firstCite,fr);
  }

  await sl(5000);
  document.getElementById('s1-msgs').innerHTML='';
  await sl(300); window.runS1();
}

window.showCiteExpand = function(cite, card, fr) {
  const existing=document.getElementById('sf1').querySelector('.thoughts-drawer'); if(existing)existing.remove();
  const drawer=document.createElement('div'); drawer.className='thoughts-drawer';
  drawer.innerHTML=\`
    <div class="td-hd">Sources & Thoughts <span class="td-close" onclick="this.closest('.thoughts-drawer').remove()">✕</span></div>
    <div class="td-item"><div class="td-icon tdi-s">🔍</div><div class="td-body"><div class="td-title">\${cite.title}</div><div class="td-src">kenyalaw.org › Acts › \${cite.title.split(',')[0]}</div></div></div>
    <div class="td-item"><div class="td-icon tdi-r">📖</div><div class="td-body"><div class="td-title">Section analysed: rights of registered owner, indefeasibility of title, exceptions for fraud.</div></div></div>
    <div class="td-item"><div class="td-icon tdi-c">✓</div><div class="td-body"><div class="td-title">Cross-referenced with 3 ELRC judgments on title disputes (2020–2024)</div></div></div>\`;
  document.getElementById('sf1').querySelector('.sc').appendChild(drawer);
  setTimeout(()=>{ if(drawer.parentElement) drawer.remove(); }, 4000);
}

// ════════════════════════════════════════
// AMANI VIDEO CALL
// ════════════════════════════════════════
window.amRunning=false;
window.runAmani = async function() {
  if(window.amRunning) return; window.amRunning=true;
  const score=document.getElementById('am-score'); score.style.display='none';
  document.getElementById('am-judge').classList.remove('speaking');
  document.getElementById('am-user').classList.remove('speaking');
  document.getElementById('am-tr-lines').innerHTML='';

  const speak = async (who, text, dur) => {
    const judgeEl=document.getElementById('am-judge'), userEl=document.getElementById('am-user');
    const bubble=document.getElementById(\`am-\${who}-bubble\`);
    judgeEl.classList.remove('speaking'); userEl.classList.remove('speaking');
    document.getElementById(\`am-\${who}\`).classList.add('speaking');
    bubble.textContent=text; bubble.classList.add('show');
    const line=document.createElement('div'); line.className='am-tr-line';
    line.innerHTML=\`<span>\${who==='judge'?'Justice Kamau':'Kelvin'}:</span> \${text}\`;
    document.getElementById('am-tr-lines').appendChild(line);
    requestAnimationFrame(()=>line.classList.add('show'));
    document.getElementById('am-tr-lines').scrollTop=9999;
    await sl(dur);
    bubble.classList.remove('show');
  };

  await speak('judge','Mock Judge Session active. You are appearing for an injunction in TechBridge v Beta Ltd. Please begin.',3500);
  await speak('user','My Lord, the applicant seeks an interlocutory injunction to restrain the respondent from disposing of assets pending the hearing of this suit.',3200);
  await speak('judge','What is the locus classicus for the test for an interlocutory injunction in Kenya, Counsel?',2800);
  await speak('user','The test is from Giella v Cassman Brown — prima facie case, balance of convenience, and irreparable harm, My Lord.',3000);
  await speak('judge','Correct. Has the applicant established that damages would not be an adequate remedy? The respondent says they would be.',3200);
  await speak('user','My Lord, the assets are being actively dissipated. Monetary compensation post-judgment would be inadequate as the respondent may be insolvent by then.',3500);
  await speak('judge','I see. Thank you, Counsel. I will consider the matter.',2500);

  // End session, show score
  document.getElementById('am-judge').classList.remove('speaking');
  document.getElementById('am-user').classList.remove('speaking');
  await sl(600);
  score.style.display='flex';
  counterUp(document.getElementById('am-score-val'),78,'',1200);
  await sl(8000);
  window.amRunning=false;
  score.style.display='none';
  await sl(300);
  window.runAmani();
}
window.amFollowup = async (type) => {
  const score=document.getElementById('am-score');
  const types={balance:'Balance of convenience requires you to weigh harm to both sides. If the injunction is granted and the applicant loses — what is the harm to the respondent? That is what you need to address.',pacis:'Pacis Credit v Kamau [2019] eKLR — the Court held that evidence of ongoing transactions showing dissipation of proceeds was sufficient to establish risk of asset disposal warranting an injunction.',retry:'Starting a new Mock Judge session…'};
  if(type==='retry'){score.style.display='none';window.amRunning=false;setTimeout(window.runAmani,400);return;}
  const fb=score.querySelector('.am-score-feedback');
  const note=document.createElement('div');
  note.style.cssText='background:#1a1a1a;border:1px solid #2a2a2a;border-radius:8px;padding:10px 12px;margin-top:8px;font-size:9px;color:#aaa;line-height:1.6;font-family:var(--font2);text-align:left;animation:slideU .3s ease';
  note.innerHTML=\`<strong style="color:var(--red);font-size:8px;text-transform:uppercase;letter-spacing:.06em">Amani AI · Follow-up</strong><br>\${types[type]}\`;
  score.insertBefore(note, score.querySelector('.am-followup'));
};

// ════════════════════════════════════════
// JUDICIAL ANALYTICS
// ════════════════════════════════════════
window.jaToggleDD = function(n) {
  const dd=document.getElementById('ja-dd'+n); const f=document.getElementById('ja-f'+n);
  const isOpen=dd.style.display==='block';
  document.querySelectorAll('.ja-dd').forEach(d=>d.style.display='none');
  document.querySelectorAll('.ja-filter').forEach(f=>f.classList.remove('open'));
  if(!isOpen){dd.style.display='block';f.classList.add('open');}
}
window.jaSelectRegion = function(r) {
  const f=document.getElementById('ja-f1'); f.childNodes[0].textContent=r+' ';
  document.querySelectorAll('.ja-dd').forEach(d=>d.style.display='none');
  document.querySelectorAll('.ja-filter').forEach(f=>f.classList.remove('open'));
}
window.jaSelectCourt = function(c) {
  const f=document.getElementById('ja-f2'); f.childNodes[0].textContent=c+' ';
  document.querySelectorAll('.ja-dd').forEach(d=>d.style.display='none');
  document.querySelectorAll('.ja-filter').forEach(f=>f.classList.remove('open'));
}

window.runJA = async function() {
  const body=document.getElementById('ja-body'); body.innerHTML='';
  const inp=document.getElementById('ja-inp'); inp.value='';
  const fr=document.getElementById('sf3').getBoundingClientRect();

  // Open region dropdown
  await sl(600);
  const f1=document.getElementById('ja-f1'); const f1r=f1.getBoundingClientRect();
  clk('mc3','cr3',f1r.left-fr.left+f1r.width/2, f1r.top-fr.top+f1r.height/2);
  window.jaToggleDD('1'); await sl(700);

  // Select Kenya
  const kn=document.getElementById('ja-kenya'); const knr=kn.getBoundingClientRect();
  mv('mc3',knr.left-fr.left+knr.width/2, knr.top-fr.top+knr.height/2);
  await sl(400); clk('mc3','cr3',knr.left-fr.left+knr.width/2, knr.top-fr.top+knr.height/2);
  window.jaSelectRegion('Kenya'); await sl(300);

  // Open courts dropdown
  const f2=document.getElementById('ja-f2'); const f2r=f2.getBoundingClientRect();
  mv('mc3',f2r.left-fr.left+f2r.width/2, f2r.top-fr.top+f2r.height/2);
  await sl(400); clk('mc3','cr3',f2r.left-fr.left+f2r.width/2, f2r.top-fr.top+f2r.height/2);
  window.jaToggleDD('2'); await sl(600);

  const elrc=document.getElementById('ja-elrc'); const er=elrc.getBoundingClientRect();
  mv('mc3',er.left-fr.left+er.width/2, er.top-fr.top+er.height/2);
  await sl(350); clk('mc3','cr3',er.left-fr.left+er.width/2, er.top-fr.top+er.height/2);
  window.jaSelectCourt('ELRC'); await sl(300);

  // Type search
  const si=document.getElementById('ja-inp'); const sir=si.getBoundingClientRect();
  clk('mc3','cr3',sir.left-fr.left+sir.width/2, sir.top-fr.top+sir.height/2);
  for(let ch of 'Achode') { si.value+=ch; await sl(90); }
  await sl(400);

  // Render judge card
  const card=buildJudgeCard();
  body.appendChild(card);

  // Animate stats
  await sl(200);
  counterUp(document.getElementById('ja-allow'),74,'%',1200);
  counterUp(document.getElementById('ja-c1'),312,'',1400);
  counterUp(document.getElementById('ja-c2'),74,'%',1200);
  counterUp(document.getElementById('ja-c3'),89,'%',1300);
  await sl(500);
  document.getElementById('ja-b1').style.width='74%';
  setTimeout(()=>document.getElementById('ja-b2').style.width='61%',200);
  setTimeout(()=>document.getElementById('ja-b3').style.width='48%',400);
  setTimeout(()=>document.getElementById('ja-i1').classList.add('show'),1400);
  setTimeout(()=>document.getElementById('ja-i2').classList.add('show'),1900);

  // Move cursor to Generate Summary button
  await sl(2800);
  const sumBtn=document.getElementById('ja-sumBtn'); if(sumBtn){
    const br=sumBtn.getBoundingClientRect();
    mv('mc3',br.left-fr.left+br.width/2, br.top-fr.top+br.height/2);
    await sl(400); clk('mc3','cr3',br.left-fr.left+br.width/2, br.top-fr.top+br.height/2);
    await sl(350);
    const sumPanel=document.getElementById('ja-summary'); if(sumPanel) sumPanel.style.display='block';
  }

  await sl(2500);
  // Move cursor to Ask Follow-up button
  const fupBtn=document.getElementById('ja-fupBtn'); if(fupBtn){
    const br=fupBtn.getBoundingClientRect();
    mv('mc3',br.left-fr.left+br.width/2, br.top-fr.top+br.height/2);
    await sl(400); clk('mc3','cr3',br.left-fr.left+br.width/2, br.top-fr.top+br.height/2);
    await sl(350);
    const fupPanel=document.getElementById('ja-fup'); if(fupPanel) {
      fupPanel.style.display='block';
      await sl(300);
      const msgs=fupPanel.querySelector('.jfup-msgs');
      const q1=document.createElement('div'); q1.className='jfup-msg q'; q1.textContent='What should I do differently for a constructive dismissal case?';
      msgs.appendChild(q1); await sl(800);
      const a1=document.createElement('div'); a1.className='jfup-msg a'; a1.innerHTML='For constructive dismissal, Justice Achode focuses on whether the employer\\'s conduct made continuation of employment impossible. Lead with the contract breach first, then the subjective test — this bench prefers objective evidence over personal distress.';
      msgs.appendChild(a1);
    }
  }

  await sl(6000);
  body.innerHTML=''; inp.value='';
  window.jaSelectRegion('All Regions'); window.jaSelectCourt('All Courts');
  await sl(400); window.runJA();
}

function buildJudgeCard() {
  const c=document.createElement('div'); c.className='jcard';
  c.innerHTML=\`
    <div class="jcard-hd">
      <div class="jcard-av">⚖️</div>
      <div class="jcard-info"><div class="jcard-name">Justice Achode</div><div class="jcard-court">ELRC Nairobi · Employment Division</div></div>
      <div class="jcard-allow"><div class="val" id="ja-allow">0%</div><div class="lbl">Allow Rate</div></div>
    </div>
    <div class="jcard-stats">
      <div class="jstat"><div class="jstat-val" id="ja-c1">0</div><div class="jstat-lbl">Cases Analysed</div></div>
      <div class="jstat"><div class="jstat-val g" id="ja-c2">0%</div><div class="jstat-lbl">Allow Rate</div></div>
      <div class="jstat"><div class="jstat-val r" id="ja-c3">0%</div><div class="jstat-lbl">s.41 Enforced</div></div>
    </div>
    <div class="jcard-bars">
      <div class="jbars-title">Allow rate by case type</div>
      <div class="brow"><span class="brow-lbl">Unfair dismissal</span><div class="brow-track"><div class="brow-fill bf-g" id="ja-b1"></div></div><span class="brow-pct">74%</span></div>
      <div class="brow"><span class="brow-lbl">Constructive dismissal</span><div class="brow-track"><div class="brow-fill bf-a" id="ja-b2"></div></div><span class="brow-pct">61%</span></div>
      <div class="brow"><span class="brow-lbl">Redundancy disputes</span><div class="brow-track"><div class="brow-fill bf-r" id="ja-b3"></div></div><span class="brow-pct">48%</span></div>
    </div>
    <div class="jcard-insights">
      <div class="insight-row" id="ja-i1"><div class="ir-dot" style="background:#22c55e"></div><div class="ir-txt"><strong>Lead with s.41</strong> — fair hearing breach alone grants compensation in 89% of cases before this bench</div></div>
      <div class="insight-row" id="ja-i2"><div class="ir-dot" style="background:#f59e0b"></div><div class="ir-txt"><strong>File written submissions</strong> — prefers detailed written over oral arguments in complex matters</div></div>
    </div>
    <div class="jcard-actions">
      <button class="ja-btn ja-btn-p" id="ja-sumBtn" onclick="document.getElementById('ja-summary').style.display='block'">✦ Generate Summary</button>
      <button class="ja-btn ja-btn-s" id="ja-fupBtn" onclick="document.getElementById('ja-fup').style.display='block'">💬 Ask Follow-up</button>
    </div>
    <div class="ja-summary-panel" id="ja-summary">
      <div class="jsp-title">AI Judge Summary — Justice Achode</div>
      <div class="jsp-text">Justice Achode is a <strong>claimant-friendly bench</strong> on employment matters, with a 74% overall allow rate. She strictly enforces <strong>Section 41 procedural fairness</strong> — failing to conduct a pre-termination hearing is almost always fatal to the employer's case before her (89% enforcement rate). She <strong>strongly prefers written submissions</strong> over oral arguments in complex matters and frequently cites the <em>Kenya Airways v Akunga</em> test for procedural fairness. On quantum, she tends toward the <strong>higher end of the 12-month compensation scale</strong> for long-serving employees. Strategy: file comprehensive written submissions, lead with s.41, and particularise quantum meticulously.</div>
    </div>
    <div class="ja-fup-chat" id="ja-fup">
      <div class="jfup-label">Ask follow-up about this judge</div>
      <div class="jfup-msgs"></div>
    </div>\`;
  return c;
}

// MINI
function animMini(){ document.querySelectorAll('.mini-c').forEach((c,i)=>setTimeout(()=>c.classList.add('vis'),i*70)); }

// Auto-start visible
setTimeout(()=>{
  document.querySelectorAll('.feat-row,#minigrid').forEach(el=>{
    if(el.getBoundingClientRect().top < window.innerHeight){
      el.classList.add('vis');
      const id=el.id;
      if(id==='fr0') setTimeout(window.runDA,400);
      if(id==='fr1') setTimeout(window.runS1,400);
      if(id==='fr2') setTimeout(window.runAmani,400);
      if(id==='fr3') setTimeout(window.runJA,400);
      if(id==='minigrid') animMini();
    }
  });
},200);
`;

const HTML_CONTENT = `
<style>
/* ── SECTION ── */
.features{padding:100px 0 60px;position:relative}
.feat-bg{background-image:radial-gradient(rgba(255,255,255,.05) 1px,transparent 1px);background-size:22px 22px;position:absolute;inset:0;pointer-events:none}
.feat-hdr{text-align:center;padding:0 24px 80px;position:relative;z-index:1}
.feat-ey{font-size:11px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:var(--red);margin-bottom:14px}
.feat-ttl{font-size:clamp(32px,5vw,52px);font-weight:800;color:var(--white);line-height:1.1;margin-bottom:16px;letter-spacing:-.02em}
.feat-ttl span{color:var(--red)}
.feat-sb{font-size:16px;color:gray;max-width:520px;margin:0 auto;line-height:1.7;font-weight:400}

/* ── ROW ── */
.feat-row{display:grid;grid-template-columns:1fr 1fr;max-width:1240px;margin:0 auto;padding:70px 48px;align-items:center;gap:40px;min-height:580px;position:relative;z-index:1;opacity:0;transform:translateY(28px);transition:opacity .6s ease,transform .6s ease}
.feat-row.vis{opacity:1;transform:translateY(0)}
.feat-row+.feat-row{border-top:1px solid rgba(255,255,255,0.05)}
.feat-row.rev .ft{order:2}.feat-row.rev .fs{order:1}
.ft{padding-right:36px}.feat-row.rev .ft{padding-right:0;padding-left:36px}
.fn{font-size:10px;font-weight:800;letter-spacing:.15em;text-transform:uppercase;color:var(--red);margin-bottom:14px;display:flex;align-items:center;gap:10px;font-family:var(--font2)}
.fn::before{content:'';width:22px;height:1.5px;background:var(--red)}
.fh{font-size:clamp(24px,2.4vw,34px);font-weight:800;color:var(--white);line-height:1.2;margin-bottom:16px;letter-spacing:-.01em}
.fp{font-size:14px;color:gray;line-height:1.8;margin-bottom:24px;font-weight:400}
.fbuls{display:flex;flex-direction:column;gap:9px;margin-bottom:26px}
.fb{display:flex;align-items:flex-start;gap:9px;font-size:13px;color:lightgray;line-height:1.6;font-family:var(--font2)}
.fbd{width:17px;height:17px;border-radius:50%;background:rgba(239,68,68,.07);border:1px solid rgba(239,68,68,.2);display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px}
.fbd svg{width:8px;height:8px;stroke:var(--red);fill:none;stroke-width:2.5}
.fbadge{display:inline-flex;align-items:center;gap:5px;padding:5px 12px;border-radius:99px;font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;font-family:var(--font2);border:1px solid}
.fb-live{background:rgba(34,197,94,.07);color:#16a34a;border-color:rgba(34,197,94,.25)}
.fb-new{background:rgba(239,68,68,.07);color:var(--red);border-color:rgba(239,68,68,.2)}
.fb-ent{background:rgba(59,130,246,.07);color:var(--blue);border-color:rgba(59,130,246,.2)}
.fb-soon{background:rgba(245,158,11,.07);color:#d97706;border-color:rgba(245,158,11,.25)}
.fbadge::before{content:'';width:5px;height:5px;border-radius:50%;background:currentColor}

/* ── SCREEN FRAME ── */
.fs{position:relative;height:500px}
.sframe{position:absolute;inset:0;background:var(--white);border:1px solid var(--border);border-radius:14px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.09),0 0 0 1px rgba(0,0,0,.03)}
.stb{height:36px;background:#fafafa;border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 14px;gap:6px;flex-shrink:0}
.sd{width:9px;height:9px;border-radius:50%}
.sd:nth-child(1){background:#ff5f57}.sd:nth-child(2){background:#ffbd2e}.sd:nth-child(3){background:#28c840}
.stitle{margin-left:8px;font-size:10px;color:gray;font-weight:500;flex:1;text-align:center;font-family:var(--font2)}
.sc{height:calc(100% - 36px);overflow:hidden;position:relative}

/* CURSOR */
.mc{position:absolute;width:14px;height:14px;border-radius:50%;border:2px solid var(--red);background:rgba(239,68,68,.12);pointer-events:none;z-index:30;transition:all .4s cubic-bezier(.16,1,.3,1);transform:translate(-50%,-50%)}
.cr{position:absolute;width:14px;height:14px;border-radius:50%;background:rgba(239,68,68,.25);pointer-events:none;z-index:29;transform:translate(-50%,-50%) scale(0);transform-origin:center}
.cr.pop{animation:ripple .4s ease both}
@keyframes ripple{0%{transform:translate(-50%,-50%) scale(0);opacity:.6}100%{transform:translate(-50%,-50%) scale(2.8);opacity:0}}

/* ANIMATIONS */
@keyframes msgIn{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideU{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideR{from{opacity:0;transform:translateX(10px)}to{opacity:1;transform:translateX(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.65)}}
@keyframes wave{0%,100%{transform:scaleY(.4)}50%{transform:scaleY(1.2)}}
@keyframes ping{0%{transform:scale(1);opacity:.8}100%{transform:scale(2);opacity:0}}

.spinner{width:10px;height:10px;border:1.5px solid currentColor;border-top-color:transparent;border-radius:50%;animation:spin .7s linear infinite;display:inline-block;flex-shrink:0}
.pdot{width:6px;height:6px;border-radius:50%;background:currentColor;animation:pulse 1.1s ease-in-out infinite;flex-shrink:0;display:inline-block}
.cur{display:inline-block;width:2px;height:13px;background:var(--red);animation:blink .65s step-end infinite;vertical-align:text-bottom;margin-left:1px}
.spill{display:inline-flex;align-items:center;gap:5px;padding:3px 8px;border-radius:5px;font-size:9px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;font-family:var(--font2);border:1px solid;margin-bottom:6px}
.sp-t{color:#9333ea;border-color:rgba(147,51,234,.2)}.sp-s{color:var(--blue);border-color:rgba(59,130,246,.2)}.sp-d{color:#16a34a;border-color:rgba(34,197,94,.25);background:rgba(34,197,94,.05)}

/* ═══════════════════════════════════
   S0: DOCUMENT DRAFTING AGENT
═══════════════════════════════════ */
.da-wrap{height:100%;display:flex;flex-direction:column}
.da-topbar{height:34px;background:#fff;border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 12px;gap:8px;flex-shrink:0;font-size:10px;color:gray;font-family:var(--font2)}
.da-bc{display:flex;align-items:center;gap:5px}
.da-bc svg{width:9px;height:9px;stroke:currentColor;fill:none}
.da-body{flex:1;display:flex;overflow:hidden}
.da-chat{width:52%;border-right:1px solid var(--border);display:flex;flex-direction:column;background:white}
.da-chat-title{padding:10px 12px;border-bottom:1px solid var(--border);font-size:10px;font-weight:700;color:#222;font-family:var(--font2);display:flex;align-items:center;gap:6px}
.da-msgs{flex:1;padding:10px;overflow:hidden;display:flex;flex-direction:column;gap:8px}
.da-msg{display:flex;gap:6px;align-items:flex-start;opacity:0;transform:translateY(5px);transition:all .35s ease}
.da-msg.show{opacity:1;transform:translateY(0)}
.da-msg.u{flex-direction:row-reverse}
.da-av{width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:7px;font-weight:800;flex-shrink:0;margin-top:1px}
.da-av.ai{background:var(--red);color:#fff}
.da-av.u{background:#f0f0f0;color:gray}
.da-bub{max-width:180px;padding:6px 9px;border-radius:9px;font-size:10px;line-height:1.6;font-family:var(--font2)}
.da-bub.ai{background:#fff;border:1px solid var(--border);border-radius:2px 9px 9px 9px;color:#222;box-shadow:0 1px 4px rgba(0,0,0,.04)}
.da-bub.u{background:#111;color:#fff;border-radius:9px 2px 9px 9px}
.da-inp{padding:8px 10px;border-top:1px solid var(--border);background:#fff;flex-shrink:0}
.da-inp-inner{background:#f9fafb;border:1px solid var(--border);border-radius:7px;padding:6px 10px;font-size:10px;color:gray;display:flex;align-items:center;justify-content:space-between;font-family:var(--font2)}
.da-canvas{flex:1;display:flex;flex-direction:column;background:white;}
.da-canvas-hd{padding:8px 12px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px;flex-shrink:0}
.da-canvas-title{font-size:10px;font-weight:800;color:black;font-family:var(--font2)}
.da-canvas-words{font-size:9px;color:gray;font-family:var(--font2)}
.da-canvas-tabs{display:flex;gap:4px;margin-left:auto}
.da-tab{padding:4px 10px;border-radius:5px;font-size:9px;font-weight:700;font-family:var(--font2);cursor:pointer;border:none;background:transparent;color:gray;transition:all .15s}
.da-tab.act{background:rgba(239,68,68,.07);color:var(--red)}
.da-tab:hover{color:black}
.da-dl-btn{padding:5px 10px;border-radius:6px;background:#111;color:#fff;border:none;font-size:9px;font-weight:700;font-family:var(--font2);cursor:pointer;display:flex;align-items:center;gap:4px}
.da-canvas-body{flex:1;overflow:hidden;position:relative}
.da-preview{padding:14px 16px;font-family:Georgia,serif;font-size:9px;color:#333;line-height:1.7;background:#fff;height:100%;overflow:hidden}
.da-preview h4{font-size:10px;font-weight:700;text-align:center;margin-bottom:6px}
.da-preview .dp{text-align:center;font-weight:700;margin:6px 0;font-size:9px;padding:5px;background:#fafafa;border:1px solid var(--border);border-radius:3px}
.da-code-view{padding:12px 14px;font-family:'Courier New',monospace;font-size:9px;color:#a8b4c0;background:#0d1117;height:100%;overflow:hidden;display:none;line-height:1.7}
.da-code-view .tag{color:#7ee787}.da-code-view .attr{color:#79c0ff}.da-code-view .val{color:#a5d6ff}
.da-doc-cursor{display:inline-block;width:2px;height:11px;background:var(--red);animation:blink .65s step-end infinite;vertical-align:text-bottom}
.da-save-menu{position:absolute;bottom:8px;right:8px;background:#fff;border:1px solid var(--border);border-radius:10px;padding:8px;box-shadow:0 8px 28px rgba(0,0,0,.12);animation:slideU .3s ease;z-index:10;display:none;min-width:160px; color: black;}
.da-save-item{display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:6px;cursor:pointer;font-size:10px;font-weight:600;color:#222;font-family:var(--font2);transition:background .15s}
.da-save-item:hover{background:rgba(239,68,68,.07)}
.da-save-item span{font-size:14px}

/* ═══════════════════════════════════
   S1: LEGAL AI with FOLLOW-UP CARDS
═══════════════════════════════════ */
.s1-wrap{height:100%;display:flex;background:white;}
.s1-sb{width:165px;background:#000;padding:10px 8px;flex-shrink:0;display:flex;flex-direction:column}
.s1-logo{font-size:10px;font-weight:800;color:#fff;padding-bottom:8px;border-bottom:1px solid #1a1a1a;margin-bottom:8px}
.s1-logo span{color:var(--red)}
.s1-nb{background:var(--red);color:#fff;border-radius:7px;padding:7px 10px;font-size:9px;font-weight:700;margin-bottom:8px;display:flex;align-items:center;gap:5px;cursor:pointer}
.s1-sr{background:#1a1a1a;border-radius:5px;padding:5px 9px;font-size:9px;color:#555;margin-bottom:9px;display:flex;align-items:center;gap:5px}
.s1-ni{padding:6px 7px;border-radius:5px;font-size:9px;color:#666;display:flex;align-items:center;gap:5px;margin-bottom:1px}
.s1-ni.act{background:#1a1a1a;color:#fff}
.s1-nd{width:5px;height:5px;border-radius:50%;background:var(--red);flex-shrink:0}
.s1-ua{margin-top:auto;display:flex;align-items:center;gap:7px;padding:6px;border-top:1px solid #1a1a1a}
.s1-uav{width:22px;height:22px;border-radius:50%;background:var(--red);display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:800;color:#fff;flex-shrink:0;position:relative}
.s1-uav::after{content:'';position:absolute;bottom:0;right:0;width:6px;height:6px;border-radius:50%;background:var(--green);border:1.5px solid #000}
.s1-main{flex:1;display:flex;flex-direction:column;overflow:hidden}
.s1-msgs{flex:1;padding:12px 14px;overflow:hidden;display:flex;flex-direction:column;gap:9px}
.s1-msg{display:flex;gap:6px;align-items:flex-start;opacity:0;transform:translateY(5px);transition:all .35s ease}
.s1-msg.show{opacity:1;transform:translateY(0)}
.s1-msg.u{flex-direction:row-reverse}
.cav{width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:800;flex-shrink:0;margin-top:1px}
.cav.ai{background:var(--red);color:#fff;position:relative}
.cav.ai::after{content:'';position:absolute;bottom:0;right:0;width:6px;height:6px;border-radius:50%;background:var(--green);border:1.5px solid #fff}
.cav.u{background:#f0f0f0;color:gray}
.cbub{max-width:200px;padding:6px 10px;border-radius:9px;font-size:10px;line-height:1.6;font-family:var(--font2)}
.cbub.ai{background:#fff;border:1px solid var(--border);border-radius:2px 9px 9px 9px;color:#222;box-shadow:0 1px 3px rgba(0,0,0,.05)}
.cbub.u{background:#111;color:#fff;border-radius:9px 2px 9px 9px}
.cbadge{display:inline-flex;align-items:center;background:rgba(239,68,68,.07);border:1px solid rgba(239,68,68,.2);border-radius:4px;padding:1px 6px;font-size:9px;font-weight:700;color:var(--red);cursor:pointer;margin:0 1px;vertical-align:middle;transition:all .15s;font-family:var(--font2)}
.cbadge:hover{background:rgba(239,68,68,.15);transform:scale(1.05)}

/* Follow-up card */
.fup-card{background:#fff;border:1px solid rgba(168,85,247,.25);border-radius:12px;padding:0;margin:4px 0 4px 28px;overflow:hidden;box-shadow:0 3px 16px rgba(168,85,247,.08);animation:slideU .35s ease both}
.fup-hd{background:rgba(168,85,247,.05);border-bottom:1px solid rgba(168,85,247,.12);padding:8px 12px;display:flex;align-items:center;gap:6px}
.fup-hd-title{font-size:9px;font-weight:800;color:#9333ea;text-transform:uppercase;letter-spacing:.06em;font-family:var(--font2)}
.fup-hd-sub{font-size:9px;color:gray;margin-left:auto;font-family:var(--font2)}
.fup-body{padding:10px 12px}
.fup-q{font-size:10px;color:#222;margin-bottom:9px;line-height:1.6;font-family:var(--font)}
.fup-opts{display:flex;flex-direction:column;gap:5px}
.fup-opt{display:flex;align-items:center;gap:7px;padding:6px 10px;background:#fafafa;border:1px solid var(--border);border-radius:7px;cursor:pointer;font-size:10px;color:#222;font-family:var(--font2);transition:all .2s}
.fup-opt:hover,.fup-opt.sel{border-color:rgba(168,85,247,.4);background:rgba(168,85,247,.05);color:#9333ea}
.fup-radio{width:14px;height:14px;border-radius:50%;border:1.5px solid var(--border2);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:7px;transition:all .2s;color:transparent}
.fup-opt.sel .fup-radio{background:#9333ea;border-color:#9333ea;color:#fff}
.fup-submit{margin-top:8px;width:100%;padding:7px;background:#9333ea;color:#fff;border:none;border-radius:7px;font-size:10px;font-weight:700;cursor:pointer;font-family:var(--font2);transition:opacity .15s}
.fup-submit:hover{opacity:.88}

/* Citation card grid */
.cite-grid{display:grid;grid-template-columns:1fr 1fr;gap:5px;margin:4px 0 4px 28px;animation:slideU .35s ease both}
.cite-card{background:#fff;border:1px solid var(--border);border-radius:8px;padding:8px 10px;cursor:pointer;transition:all .2s;animation:slideU .3s ease both}
.cite-card:hover{border-color:rgba(239,68,68,.2);background:rgba(239,68,68,.07);transform:translateY(-1px);box-shadow:0 4px 14px rgba(0,0,0,.07)}
.cc-type{font-size:8px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--red);margin-bottom:3px;font-family:var(--font2)}
.cc-title{font-size:9px;font-weight:700;color:black;line-height:1.3;font-family:var(--font2)}
.cc-sub{font-size:8px;color:gray;margin-top:2px;font-family:var(--font2)}

/* Thoughts drawer */
.thoughts-drawer{position:absolute;bottom:0;left:0;right:0;background:#fff;border-top:1px solid var(--border);border-radius:12px 12px 0 0;padding:12px 14px;box-shadow:0 -8px 32px rgba(0,0,0,.1);animation:slideU .35s ease;z-index:10;max-height:200px;overflow:hidden}
.td-hd{font-size:9px;font-weight:800;color:black;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px;display:flex;align-items:center;justify-content:space-between;font-family:var(--font2)}
.td-close{cursor:pointer;font-size:12px;color:gray}
.td-item{display:flex;align-items:flex-start;gap:7px;padding:5px 0;border-bottom:1px solid var(--border2);font-family:var(--font2);color:black;}
.td-item:last-child{border-bottom:none}
.td-icon{width:18px;height:18px;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:9px;flex-shrink:0}
.tdi-s{background:#eff6ff;color:var(--blue)}.tdi-r{background:#fffbeb;color:var(--amber)}.tdi-c{background:#f0fdf4;color:var(--green)}
.td-body{flex:1}
.td-title{font-size:10px;font-weight:700;color:black;margin-bottom:1px}
.td-src{font-size:9px;color:var(--blue);cursor:pointer;text-decoration:underline}
.s1-inp{padding:9px 12px;border-top:1px solid var(--border);background:#fff;flex-shrink:0}
.s1-inp-inner{background:#f9fafb;border:1px solid var(--border);border-radius:7px;padding:6px 10px;font-size:10px;color:gray;display:flex;align-items:center;justify-content:space-between;font-family:var(--font2)}
.sendbtn{width:22px;height:22px;background:var(--red);border-radius:5px;display:flex;align-items:center;justify-content:center;flex-shrink:0;cursor:pointer}
.sendbtn svg{width:9px;height:9px;stroke:#fff;fill:none;stroke-width:2}

/* ═══════════════════════════════════
   S2: AMANI — VIDEO CALL STYLE
═══════════════════════════════════ */
.am-call{height:100%;background:#0d0d14;display:flex;flex-direction:column;position:relative}
.am-call-body{flex:1;display:grid;grid-template-columns:1fr 1fr;gap:2px;overflow:hidden;padding:10px;gap:8px}
.am-participant{border-radius:10px;overflow:hidden;position:relative;background:#111;border:1px solid #2a2a2a;display:flex;flex-direction:column;align-items:center;justify-content:center}
.am-participant.speaking{border-color:rgba(34,197,94,.5);box-shadow:0 0 0 2px rgba(34,197,94,.2)}
.am-part-av{width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;margin-bottom:8px;position:relative;border:2px solid transparent;transition:border-color .3s}
.am-participant.speaking .am-part-av{border-color:var(--green)}
.am-part-name{font-size:10px;font-weight:700;color:#ccc;font-family:var(--font2);margin-bottom:3px}
.am-part-role{font-size:8px;color:#555;font-family:var(--font2);text-transform:uppercase;letter-spacing:.06em}
.am-wave{display:flex;gap:2px;align-items:center;height:16px;margin-top:8px}
.am-wave-bar{width:3px;border-radius:2px;background:var(--green)}
.am-participant.speaking .am-wave-bar{animation:wave .6s ease-in-out infinite}
.am-participant:not(.speaking) .am-wave-bar{height:3px !important}
.am-wave-bar:nth-child(1){height:8px;animation-delay:0s}
.am-wave-bar:nth-child(2){height:14px;animation-delay:.1s}
.am-wave-bar:nth-child(3){height:10px;animation-delay:.2s}
.am-wave-bar:nth-child(4){height:16px;animation-delay:.15s}
.am-wave-bar:nth-child(5){height:8px;animation-delay:.05s}
.am-wave-bar:nth-child(6){height:12px;animation-delay:.25s}
.am-wave-bar:nth-child(7){height:6px;animation-delay:.1s}
.am-speech-bubble{position:absolute;bottom:8px;left:8px;right:8px;background:rgba(0,0,0,.7);border-radius:6px;padding:6px 9px;font-size:9px;color:#ddd;font-family:var(--font2);line-height:1.5;opacity:0;transition:opacity .3s;backdrop-filter:blur(4px)}
.am-speech-bubble.show{opacity:1}
.am-ping{position:absolute;top:8px;right:8px;width:10px;height:10px}
.am-ping-dot{width:10px;height:10px;border-radius:50%;background:var(--green)}
.am-ping-ring{position:absolute;inset:0;border-radius:50%;background:var(--green);animation:ping 1.2s cubic-bezier(0,0,.2,1) infinite}
.am-transcript{background:#111;border-top:1px solid #1a1a1a;padding:8px 12px;max-height:90px;overflow:hidden;flex-shrink:0}
.am-tr-label{font-size:8px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#444;margin-bottom:4px;font-family:var(--font2)}
.am-tr-line{font-size:9px;color:#666;line-height:1.6;font-family:var(--font2);opacity:0;transition:opacity .3s}
.am-tr-line.show{opacity:1}
.am-tr-line span{color:var(--red);font-weight:700}
.am-controls{background:#0a0a12;border-top:1px solid #1a1a1a;padding:8px 16px;display:flex;align-items:center;justify-content:center;gap:10px;flex-shrink:0}
.am-ctrl{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;cursor:pointer;background:#1a1a1a;border:1px solid #2a2a2a;transition:all .2s}
.am-ctrl:hover{background:#222}
.am-end{background:var(--red);border-color:var(--red);font-size:10px;padding:0 16px;border-radius:20px;font-weight:700;color:#fff;font-family:var(--font2);width:auto}
.am-score{position:absolute;inset:0;background:#0d0d14;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:16px;animation:fadeIn .5s ease;display:none}
.am-score-title{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:#555;margin-bottom:12px;font-family:var(--font2)}
.am-score-val{font-size:52px;font-weight:800;color:var(--green);line-height:1;margin-bottom:6px}
.am-score-label{font-size:10px;color:#555;margin-bottom:16px;font-family:var(--font2)}
.am-score-feedback{background:#111;border:1px solid #2a2a2a;border-radius:10px;padding:12px;width:100%;margin-bottom:12px;text-align:left}
.am-sf-row{display:flex;align-items:flex-start;gap:6px;margin-bottom:6px;font-size:10px;color:#888;font-family:var(--font2);line-height:1.5}
.am-sf-row:last-child{margin-bottom:0}
.am-sf-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;margin-top:4px}
.am-followup{display:flex;gap:6px;flex-wrap:wrap;width:100%}
.am-fq-btn{padding:5px 10px;background:#1a1a1a;border:1px solid #2a2a2a;border-radius:6px;font-size:9px;color:#aaa;cursor:pointer;font-family:var(--font2);transition:all .15s}
.am-fq-btn:hover{border-color:rgba(239,68,68,.3);color:var(--red)}

/* ═══════════════════════════════════
   S3: JUDICIAL ANALYTICS
═══════════════════════════════════ */
.ja-wrap{height:100%;display:flex;flex-direction:column;background:white;}
.ja-hd{padding:10px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px;flex-shrink:0}
.ja-hd-icon{width:26px;height:26px;border-radius:6px;background:rgba(239,68,68,.07);border:1px solid rgba(239,68,68,.2);display:flex;align-items:center;justify-content:center;font-size:12px}
.ja-hd-info .name{font-size:11px;font-weight:800;color:black}
.ja-hd-info .sub{font-size:9px;color:gray;font-family:var(--font2)}
.ja-filters{display:flex;gap:5px;padding:8px 14px;border-bottom:1px solid var(--border);flex-shrink:0;align-items:center}
.ja-filter{background:#fff;border:1px solid var(--border);border-radius:6px;padding:4px 9px;font-size:9px;font-weight:600;color:#222;cursor:pointer;display:flex;align-items:center;gap:4px;font-family:var(--font2);transition:all .15s;position:relative}
.ja-filter:hover,.ja-filter.open{border-color:rgba(239,68,68,.2);color:var(--red)}
.ja-filter svg{width:8px;height:8px;stroke:currentColor;fill:none;stroke-width:2}
.ja-dd{position:absolute;top:calc(100% + 3px);left:0;background:#fff;border:1px solid var(--border);border-radius:8px;min-width:100px;box-shadow:0 8px 24px rgba(0,0,0,.1);z-index:20;overflow:hidden;animation:slideU .2s ease;display:none}
.ja-dd-item{padding:6px 11px;font-size:9px;color:#222;cursor:pointer;font-family:var(--font2);transition:background .1s}
.ja-dd-item:hover,.ja-dd-item.sel{background:rgba(239,68,68,.07);color:var(--red);font-weight:700}
.ja-search-wrap{flex:1;display:flex;align-items:center;gap:5px;background:#fafafa;border:1px solid var(--border);border-radius:6px;padding:4px 9px}
.ja-search-wrap svg{width:9px;height:9px;stroke:var(--t4);fill:none;flex-shrink:0}
.ja-search-inp{background:transparent;border:none;outline:none;font-size:9px;color:black;font-family:var(--font2);width:100%}
.ja-body{flex:1;overflow-y:auto;padding:10px 14px}
.ja-body::-webkit-scrollbar{width:0}
.jcard{background:#fff;border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:8px;animation:slideU .35s ease both}
.jcard-hd{padding:10px 12px;display:flex;align-items:center;gap:8px;cursor:pointer;border-bottom:1px solid var(--border2)}
.jcard-hd:hover{background:#fafafa}
.jcard-av{width:32px;height:32px;border-radius:50%;background:#eff6ff;border:1.5px solid rgba(59,130,246,.2);display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0}
.jcard-info{flex:1}
.jcard-name{font-size:11px;font-weight:800;color:black;font-family:var(--font2)}
.jcard-court{font-size:9px;color:gray;font-family:var(--font2)}
.jcard-allow{text-align:right}
.jcard-allow .val{font-size:18px;font-weight:800;color:black}
.jcard-allow .lbl{font-size:8px;color:gray;font-family:var(--font2)}
.jcard-stats{display:grid;grid-template-columns:1fr 1fr 1fr;padding:8px 12px;border-bottom:1px solid var(--border2)}
.jstat{text-align:center}
.jstat-val{font-size:15px;font-weight:800;color:black}
.jstat-val.g{color:#16a34a}.jstat-val.r{color:var(--red)}
.jstat-lbl{font-size:8px;color:gray;text-transform:uppercase;letter-spacing:.05em;font-family:var(--font2)}
.jcard-bars{padding:10px 12px;border-bottom:1px solid var(--border2)}
.jbars-title{font-size:8px;font-weight:800;text-transform:uppercase;letter-spacing:.07em;color:gray;margin-bottom:8px;font-family:var(--font2)}
.brow{display:flex;align-items:center;gap:7px;margin-bottom:5px}
.brow-lbl{font-size:8px;color:#222;width:85px;flex-shrink:0;text-align:right;font-family:var(--font2)}
.brow-track{flex:1;height:7px;background:#f0f0f0;border-radius:99px;overflow:hidden}
.brow-fill{height:100%;border-radius:99px;width:0;transition:width 1.4s cubic-bezier(.16,1,.3,1)}
.bf-g{background:linear-gradient(90deg,#16a34a,var(--green))}.bf-a{background:linear-gradient(90deg,#d97706,var(--amber))}.bf-r{background:linear-gradient(90deg,var(--red2),var(--red))}
.brow-pct{font-size:8px;font-weight:800;color:#222;width:24px;font-family:var(--font2)}
.jcard-insights{padding:8px 12px;display:flex;flex-direction:column;gap:5px}
.insight-row{display:flex;align-items:flex-start;gap:6px;padding:6px 8px;background:#fafafa;border-radius:6px;opacity:0;transform:translateY(4px);transition:all .4s ease}
.insight-row.show{opacity:1;transform:translateY(0)}
.ir-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0;margin-top:4px}
.ir-txt{font-size:9px;color:#222;line-height:1.5;font-family:var(--font2)}
.ir-txt strong{color:black}
.jcard-actions{padding:8px 12px;border-top:1px solid var(--border2);display:flex;gap:6px}
.ja-btn{padding:5px 11px;border-radius:6px;font-size:9px;font-weight:700;font-family:var(--font2);cursor:pointer;border:none;transition:all .15s}
.ja-btn-p{background:#111;color:#fff}
.ja-btn-p:hover{background:var(--red)}
.ja-btn-s{background:#fafafa;color:#222;border:1px solid var(--border)}
.ja-btn-s:hover{color:black;border-color:var(--border)}
.ja-summary-panel{background:#fff;border:1px solid var(--border);border-radius:10px;padding:12px;margin-top:8px;animation:slideU .35s ease;display:none}
.jsp-title{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:gray;margin-bottom:8px;font-family:var(--font2)}
.jsp-text{font-size:10px;color:#222;line-height:1.7;font-family:var(--font2)}
.jsp-text strong{color:black}
.ja-fup-chat{border-top:1px solid var(--border2);padding:8px 12px;display:none}
.jfup-label{font-size:8px;font-weight:800;text-transform:uppercase;letter-spacing:.07em;color:var(--red);margin-bottom:6px;font-family:var(--font2)}
.jfup-msgs{display:flex;flex-direction:column;gap:5px}
.jfup-msg{font-size:9px;line-height:1.6;font-family:var(--font2);padding:5px 8px;border-radius:6px}
.jfup-msg.q{background:rgba(239,68,68,.07);color:var(--red);align-self:flex-end;border-radius:8px 2px 8px 8px}
.jfup-msg.a{background:#fafafa;color:#222;border-radius:2px 8px 8px 8px}

/* MINI GRID */
.mini-grid{max-width:1240px;margin:0 auto;padding:0 48px 80px;display:grid;grid-template-columns:repeat(3,1fr);gap:12px;color:black;}
.mini-c{background:#fafafa;border:1px solid var(--border);border-radius:12px;padding:20px;cursor:pointer;transition:all .2s;opacity:0;transform:translateY(14px)}
.mini-c.vis{opacity:1;transform:translateY(0)}
.mini-c:hover{border-color:rgba(239,68,68,.2);background:rgba(239,68,68,.07);transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.06)}
.mc-icon{width:34px;height:34px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:15px;margin-bottom:10px;border:1px solid var(--border)}
.mc-t{font-size:12px;font-weight:700;color:black;margin-bottom:5px;font-family:var(--font2)}
.mc-d{font-size:11px;color:gray;line-height:1.7;font-family:var(--font2)}
</style>

<section class="features">
<div class="feat-bg"></div>
<div class="feat-hdr">
  <div class="feat-ey">The Platform</div>
  <h2 class="feat-ttl">Everything your firm needs,<br><span>built for East Africa</span></h2>
  <p class="feat-sb">Six complete features in action — every animation shows the exact user flow from start to finish.</p>
</div>

<!-- ROW 0: DOCUMENT DRAFTING AGENT -->
<div class="feat-row" id="fr0">
  <div class="ft">
    <div class="fn">01 — Document Agent</div>
    <h3 class="fh">Draft Any Legal<br>Document Instantly</h3>
    <p class="fp">Tell the Legal Documents Prep Agent what you need. It drafts a beautiful, jurisdiction-correct document in seconds — preview it, switch to HTML code, then save to Google Drive or download as PDF.</p>
    <div class="fbuls">
      <div class="fb"><div class="fbd"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div><span>Supports NDAs, employment contracts, plaints, affidavits, wills, and more</span></div>
      <div class="fb"><div class="fbd"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div><span>Preview rendered document or inspect HTML code with one click</span></div>
      <div class="fb"><div class="fbd"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div><span>Save to Google Drive, download as PDF, or copy to clipboard instantly</span></div>
    </div>
    <span class="fbadge fb-live">Live Now</span>
  </div>
  <div class="fs">
    <div class="sframe" id="sf0">
      <div class="stb"><div class="sd"></div><div class="sd"></div><div class="sd"></div><span class="stitle">Legal Documents Prep Agent</span></div>
      <div class="sc">
        <div class="da-wrap">
          <div class="da-topbar">
            <div class="da-bc">
              <span>Lawlify</span>
              <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
              <span style="font-weight:700;color:black">Legal ai</span>
            </div>
          </div>
          <div class="da-body">
            <div class="da-chat">
              <div class="da-chat-title">
                <span style="font-size:14px">📄</span>
                Legal Documents Prep Agent
              </div>
              <div class="da-msgs" id="da-msgs"></div>
              <div class="da-inp">
                <div class="da-inp-inner">
                  <span id="da-inp-txt">Assign a task to Legal Documents Prep Agent...</span>
                  <div class="sendbtn"><svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></div>
                </div>
              </div>
            </div>
            <div class="da-canvas">
              <div class="da-canvas-hd">
                <span style="font-size:13px">📋</span>
                <span class="da-canvas-title">LEGAL CANVAS</span>
                <span class="da-canvas-words" id="da-words">DOCUMENT · 0 WORDS</span>
                <div class="da-canvas-tabs">
                  <button class="da-tab act" id="da-tab-prev" onclick="window.switchDaTab('prev')">Preview</button>
                  <button class="da-tab" id="da-tab-code" onclick="window.switchDaTab('code')">Code</button>
                  <button class="da-tab" id="da-tab-edit" onclick="window.switchDaTab('edit')">Editor</button>
                </div>
                <button class="da-dl-btn" id="da-save-btn" onclick="window.toggleSaveMenu()">⬇ Download PDF</button>
              </div>
              <div class="da-canvas-body">
                <div class="da-preview" id="da-preview">
                  <div style="font-size:9px;color:gray;font-family:var(--font2);padding:12px">
                    // Legal Documents Prep Agent Workspace initialized.<br>// Describe the document you need in the chat, and the results will load here.
                  </div>
                </div>
                <div class="da-code-view" id="da-code-view"></div>
                <div class="da-save-menu" id="da-save-menu">
                  <div class="da-save-item" onclick="window.doSave('drive')"><span>📁</span> Save to Google Drive</div>
                  <div class="da-save-item" onclick="window.doSave('onedrive')"><span>☁️</span> Save to OneDrive</div>
                  <div class="da-save-item" onclick="window.doSave('pdf')"><span>⬇</span> Download as PDF</div>
                  <div class="da-save-item" onclick="window.doSave('copy')"><span>📋</span> Copy to clipboard</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mc" id="mc0"></div><div class="cr" id="cr0"></div>
      </div>
    </div>
  </div>
</div>

<!-- ROW 1: LEGAL AI with FOLLOW-UP -->
<div class="feat-row rev" id="fr1">
  <div class="fs">
    <div class="sframe" id="sf1">
      <div class="stb"><div class="sd"></div><div class="sd"></div><div class="sd"></div><span class="stitle">Lawlify AI — Legal Counsel</span></div>
      <div class="sc">
        <div class="s1-wrap">
          <div class="s1-sb">
            <div class="s1-logo">Lawlify<span>.</span>AI</div>
            <div class="s1-nb">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New Session
            </div>
            <div class="s1-sr"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>Tactical search...</div>
            <div class="s1-ni act"><div class="s1-nd"></div>Active sessions</div>
            <div class="s1-ni">Persona library</div>
            <div class="s1-ni">Audit history</div>
            <div class="s1-ua">
              <div class="s1-uav">K</div>
              <div><div style="font-size:8px;font-weight:700;color:#ccc">Kelvin G.</div><div style="font-size:7px;color:#444;text-transform:uppercase;letter-spacing:.04em">Workspace Admin</div></div>
            </div>
          </div>
          <div class="s1-main">
            <div class="s1-msgs" id="s1-msgs"></div>
            <div class="s1-inp">
              <div class="s1-inp-inner">
                <span id="s1-inp-txt">Assign a task...</span>
                <div class="sendbtn"><svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></div>
              </div>
            </div>
          </div>
        </div>
        <div class="mc" id="mc1"></div><div class="cr" id="cr1"></div>
      </div>
    </div>
  </div>
  <div class="ft">
    <div class="fn">02 — Legal Counsel</div>
    <h3 class="fh">AI That Asks Before<br>It Answers</h3>
    <p class="fp">When a question is ambiguous, Lawlify AI doesn't guess — it asks clarifying questions in beautiful interactive cards. Once answered, it delivers a statute-cited response with expandable citation cards you can click to read the source.</p>
    <div class="fbuls">
      <div class="fb"><div class="fbd"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div><span>Follow-up question cards for ambiguous queries — never a generic answer</span></div>
      <div class="fb"><div class="fbd"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div><span>Citation cards expand to show full statute text with source link</span></div>
      <div class="fb"><div class="fbd"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div><span>Thoughts panel shows every search query and source the AI consulted</span></div>
    </div>
    <span class="fbadge fb-live">Live Now</span>
  </div>
</div>

<!-- ROW 2: AMANI VIDEO CALL -->
<div class="feat-row" id="fr2">
  <div class="ft">
    <div class="fn">03 — AI Legal Companion</div>
    <h3 class="fh">Amani — Practice Like<br>You're in Court</h3>
    <p class="fp">A real-time AI conversation partner that feels like a video call. The Mock Judge challenges your submissions, the Senior Partner gives career advice, and the Socratic Tutor guides your reasoning — all with instant scoring and feedback.</p>
    <div class="fbuls">
      <div class="fb"><div class="fbd"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div><span>Video-call style interface showing both participants with voice animation</span></div>
      <div class="fb"><div class="fbd"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div><span>Real-time session scoring with specific strengths and improvement notes</span></div>
      <div class="fb"><div class="fbd"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div><span>Follow-up questions after verdict to deepen understanding</span></div>
    </div>
    <span class="fbadge fb-soon">Coming Soon</span>
  </div>
  <div class="fs">
    <div class="sframe" id="sf2">
      <div class="stb" style="background:#0a0a12;border-color:#1a1a1a"><div class="sd"></div><div class="sd"></div><div class="sd"></div><span class="stitle" style="color:#444">Amani — Mock Judge Session</span></div>
      <div class="sc" style="background:#0d0d14">
        <div class="am-call">
          <div class="am-call-body">
            <div class="am-participant" id="am-judge">
              <div class="am-ping"><div class="am-ping-ring"></div><div class="am-ping-dot"></div></div>
              <div class="am-part-av" id="am-judge-av">⚖️</div>
              <div class="am-part-name">Justice Kamau</div>
              <div class="am-part-role">Mock Judge · Amani AI</div>
              <div class="am-wave" id="am-judge-wave">
                <div class="am-wave-bar"></div><div class="am-wave-bar"></div><div class="am-wave-bar"></div><div class="am-wave-bar"></div><div class="am-wave-bar"></div><div class="am-wave-bar"></div><div class="am-wave-bar"></div>
              </div>
              <div class="am-speech-bubble" id="am-judge-bubble"></div>
            </div>
            <div class="am-participant" id="am-user">
              <div class="am-part-av" id="am-user-av" style="background:rgba(239,68,68,.1);border-radius:50%;font-size:22px">👨🏾‍💼</div>
              <div class="am-part-name">Kelvin Gichinga</div>
              <div class="am-part-role">Advocate · Practitioner</div>
              <div class="am-wave" id="am-user-wave">
                <div class="am-wave-bar"></div><div class="am-wave-bar"></div><div class="am-wave-bar"></div><div class="am-wave-bar"></div><div class="am-wave-bar"></div><div class="am-wave-bar"></div><div class="am-wave-bar"></div>
              </div>
              <div class="am-speech-bubble" id="am-user-bubble"></div>
            </div>
          </div>
          <div class="am-transcript">
            <div class="am-tr-label">Live transcript</div>
            <div id="am-tr-lines"></div>
          </div>
          <div class="am-controls">
            <div class="am-ctrl">🎤</div>
            <div class="am-ctrl">📷</div>
            <div class="am-ctrl">💬</div>
            <div class="am-ctrl am-end" id="am-end-btn">End Session</div>
          </div>
          <div class="am-score" id="am-score">
            <div class="am-score-title">Session Complete</div>
            <div class="am-score-val" id="am-score-val">0</div>
            <div class="am-score-label">out of 100 · Mock Judge Assessment</div>
            <div class="am-score-feedback">
              <div class="am-sf-row"><div class="am-sf-dot" style="background:var(--green)"></div>Giella v Cassman Brown correctly cited with all three limbs of the test.</div>
              <div class="am-sf-row"><div class="am-sf-dot" style="background:var(--green)"></div>Strong argument on irreparable harm — insolvency risk clearly articulated.</div>
              <div class="am-sf-row"><div class="am-sf-dot" style="background:var(--amber)"></div>Cite <em>Pacis Credit v Kamau</em> on dissipation of assets — directly on point.</div>
              <div class="am-sf-row"><div class="am-sf-dot" style="background:var(--amber)"></div>Address balance of convenience more explicitly in opening.</div>
            </div>
            <div class="am-followup">
              <div class="am-fq-btn" onclick="window.amFollowup('balance')">Explain balance of convenience</div>
              <div class="am-fq-btn" onclick="window.amFollowup('pacis')">Tell me about Pacis Credit v Kamau</div>
              <div class="am-fq-btn" onclick="window.amFollowup('retry')">Practice this again →</div>
            </div>
          </div>
        </div>
        <div class="mc" id="mc2" style="border-color:#666;background:rgba(255,255,255,.08)"></div>
        <div class="cr" id="cr2" style="background:rgba(255,255,255,.15)"></div>
      </div>
    </div>
  </div>
</div>

<!-- ROW 3: JUDICIAL ANALYTICS -->
<div class="feat-row rev" id="fr3">
  <div class="fs">
    <div class="sframe" id="sf3">
      <div class="stb"><div class="sd"></div><div class="sd"></div><div class="sd"></div><span class="stitle">Judicial Analytics — Know Your Judge</span></div>
      <div class="sc">
        <div class="ja-wrap">
          <div class="ja-hd">
            <div class="ja-hd-icon">📊</div>
            <div class="ja-hd-info"><div class="name">Know Your Judge</div><div class="sub">Behavioral analytics for the EA Bench</div></div>
          </div>
          <div class="ja-filters">
            <div class="ja-filter" id="ja-f1" onclick="window.jaToggleDD('1')">
              All Regions <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
              <div class="ja-dd" id="ja-dd1">
                <div class="ja-dd-item sel">All Regions</div>
                <div class="ja-dd-item" id="ja-kenya" onclick="window.jaSelectRegion('Kenya')">Kenya</div>
                <div class="ja-dd-item">Uganda</div>
                <div class="ja-dd-item">Tanzania</div>
                <div class="ja-dd-item">Rwanda</div>
                <div class="ja-dd-item">Ethiopia</div>
              </div>
            </div>
            <div class="ja-filter" id="ja-f2" onclick="window.jaToggleDD('2')">
              All Courts <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
              <div class="ja-dd" id="ja-dd2">
                <div class="ja-dd-item sel">All Courts</div>
                <div class="ja-dd-item" id="ja-elrc" onclick="window.jaSelectCourt('ELRC')">ELRC</div>
                <div class="ja-dd-item">High Court</div>
                <div class="ja-dd-item">ELC</div>
              </div>
            </div>
            <div class="ja-search-wrap">
              <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input class="ja-search-inp" id="ja-inp" placeholder="Search judge..." readonly>
            </div>
          </div>
          <div class="ja-body" id="ja-body"></div>
        </div>
        <div class="mc" id="mc3"></div><div class="cr" id="cr3"></div>
      </div>
    </div>
  </div>
  <div class="ft">
    <div class="fn">04 — Intelligence</div>
    <h3 class="fh">Know Your Judge<br>Before You Walk In</h3>
    <p class="fp">Filter by region and court, search any judge, and get animated bar charts of their allow rates by case type. Generate a full AI summary or ask follow-up questions directly about the judge's tendencies.</p>
    <div class="fbuls">
      <div class="fb"><div class="fbd"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div><span>Filter by region and court — dropdown menus with live results</span></div>
      <div class="fb"><div class="fbd"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div><span>Generate AI Summary button delivers a full strategic briefing</span></div>
      <div class="fb"><div class="fbd"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div><span>Ask follow-up questions about the judge's tendencies directly in the panel</span></div>
    </div>
    <span class="fbadge fb-ent">Enterprise</span>
  </div>
</div>

<!-- MINI GRID -->
<div class="mini-grid" id="minigrid">
  <div class="mini-c"><div class="mc-icon" style="background:rgba(59,130,246,.06);border-color:rgba(59,130,246,.12)">🔍</div><div class="mc-t">Intelligent Research</div><div class="mc-d">Search thousands of EA statutes and precedents with semantic understanding.</div></div>
  <div class="mini-c"><div class="mc-icon" style="background:var(--redl);border-color:var(--redb)">🔒</div><div class="mc-t">Document Vault</div><div class="mc-d">Secure AI-indexed storage. Every document searchable by matter, party, or clause.</div></div>
  <div class="mini-c"><div class="mc-icon" style="background:rgba(34,197,94,.06);border-color:rgba(34,197,94,.12)">⚡</div><div class="mc-t">Smart Workflows</div><div class="mc-d">Automate deadline tracking. EA court rules built in — zero manual calculation.</div></div>
  <div class="mini-c"><div class="mc-icon" style="background:rgba(168,85,247,.06);border-color:rgba(168,85,247,.12)">🧠</div><div class="mc-t">Knowledge Base</div><div class="mc-d">Centralized firm intelligence — precedents, templates, and institutional knowledge.</div></div>
  <div class="mini-c"><div class="mc-icon" style="background:rgba(245,158,11,.06);border-color:rgba(245,158,11,.12)">🏗️</div><div class="mc-t">Project Workspace</div><div class="mc-d">3-step project initialization for comprehensive matters with full infrastructure setup.</div></div>
  <div class="mini-c"><div class="mc-icon" style="background:rgba(239,68,68,.06);border-color:rgba(239,68,68,.12)">🌍</div><div class="mc-t">Case Management</div><div class="mc-d">Autonomous agent monitors all matters, deadlines, and court listings around the clock.</div></div>
</div>

</section>
`;

export default function LandingFeatures() {
  useEffect(() => {
    const script = document.createElement('script');
    script.innerHTML = SCRIPT_CONTENT;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div style={{width: '100%'}} dangerouslySetInnerHTML={{ __html: HTML_CONTENT }} />;
}
