const tools = {
  web: ["Claude Web Research", "https://claude.ai/new"],
  seo: ["Site Audit Data", "data/site-audit.json"],
  design: ["Design Dashboard", "dashboards/design-dashboard.html"],
  redesign: ["Roofing Redesign", "dashboards/roofing-redesign.html"],
  ops: ["Workflow Launcher", "dashboards/workflow-launcher.html"],
  marketing: ["Marketing 360 Dashboard", "dashboards/marketing360.html"],
  roadmap: ["AI OS State of Play", "dashboards/state-of-play.html"],
  tokens: ["Token Optimization", "dashboards/token-optimization.html"],
  knowledge: ["Knowledge Book", "dashboards/knowledge-book.html"],
  qbo: ["QuickBooks Online", "https://app.qbo.intuit.com"],
  leap: ["Leap CRM", "https://leaptodigital.com"],
  ads: ["Google Ads", "https://ads.google.com"],
  gbp: ["Google Business Profile", "https://business.google.com"],
  sheets: ["Microsoft Excel", "https://www.office.com/launch/excel"]
};

const groups = [
  ["Web Intelligence","blue","🌐",[
    ["Watch competitors","Monitor competitor pricing, services, and offers.","web",["competitors","target geography","monitoring frequency"],["change log","source links","recommended response"]],
    ["SEO audit","Identify who outranks Topside and why.","seo",["target keyword","target location","site URL"],["ranking comparison","gap analysis","prioritized fixes"]],
    ["Pricing intel","Research local roofing and gutter pricing.","web",["materials/services","target geography","pricing unit"],["price range table","source evidence","pricing recommendations"]],
    ["Contractor directory","Build a usable local competitive directory.","web",["target geography","directory sources","required fields"],["competitor table","ratings and services","opportunity notes"]],
    ["Storm signals","Find recent storm damage demand signals.","web",["counties","date range","event types"],["event timeline","high-demand areas","campaign targets"]],
    ["Lead harvesting","Assess lead marketplaces and optimize profiles.","web",["service area","job types","target CPL"],["lead source comparison","profile fixes","activation plan"]]
  ]],
  ["Website & Design","purple","🎨",[
    ["Topside Bellingham redesign","Run the active Bellingham redesign workflow.","redesign",["current URL","business goals","brand assets"],["design plan","page structure","CTA and mobile review"]],
    ["New client redesign","Create a full redesign plan for a new client.","design",["client URL","industry","desired outcome"],["site analysis","mockup plan","implementation checklist"]],
    ["Clone a design system","Extract a reusable design system from a site.","design",["reference URL","target platform","scope"],["colors and type","spacing and components","DESIGN.md specification"]],
    ["Roofing landing page","Build a high-converting roofing landing page.","redesign",["offer","service area","proof and badges"],["page mockup","conversion copy","mobile checklist"]],
    ["Client site SEO audit","Run an exact on-page SEO fix list.","seo",["client URL","target keywords","service area"],["metadata fixes","heading/content gaps","priority list"]]
  ]],
  ["Operations","teal","⚙️",[
    ["Process job document","Extract and route a scanned job document.","ops",["uploaded document","customer/job identifiers","routing targets"],["normalized job record","Leap fields","QBO estimate and PO row"]],
    ["New QB estimate","Prepare a roofing estimate for QuickBooks.","qbo",["customer and address","line items","tax and notes"],["QBO-ready estimate","totals validation","entry checklist"]],
    ["New Leap job record","Prepare a complete Leap CRM job record.","leap",["customer contact","job details","lead source/value"],["Leap-ready fields","missing-data flags","entry checklist"]],
    ["Assign PO number","Create the next PO and tracker row.","sheets",["vendor","job/customer","amount and date"],["next PO number","paste-ready row","validation notes"]],
    ["Automate triple entry","Design the Leap-QBO-Excel automation.","ops",["current process","field samples","system constraints"],["field map","automation architecture","implementation plan"]]
  ]],
  ["Marketing","amber","📣",[
    ["Monthly marketing report","Generate the monthly channel performance report.","marketing",["channel exports","reporting period","targets"],["executive summary","channel scorecard","next actions"]],
    ["Write GBP post","Create a local SEO Google Business post.","gbp",["topic/project","service/location","CTA"],["publish-ready post","image suggestion","tracking recommendation"]],
    ["Respond to review","Draft a professional review response.","gbp",["review text","reviewer sentiment","job context"],["publish-ready response","escalation flag","keyword note"]],
    ["Ads performance check","Audit Google Ads and LSA performance.","ads",["campaign export","date range","lead quality notes"],["waste flags","CPL table","pause/adjust/scale plan"]],
    ["Review request SMS","Create post-job review request messages.","gbp",["customer first name","review URL","tone"],["3 SMS variants","character counts","send timing"]],
    ["Marketing 360 health check","Score every active marketing channel.","marketing",["dashboard data/screenshots","date range","business goals"],["traffic-light scorecard","top issues","30-day fix plan"]],
    ["M360 accountability brief","Build a structured evidence and compliance brief.","marketing",["contract/deliverables","performance evidence","timeline"],["evidence matrix","findings summary","questions and remedies"]]
  ]],
  ["Research & Intel","coral","🔎",[
    ["Pre-call intel","Research a company before a call.","web",["company name","call purpose","known context"],["company brief","pain points","conversation openers"]],
    ["Deep research report","Produce a sourced analytical report.","web",["topic","decision purpose","depth"],["executive summary","cited findings","recommendations"]],
    ["Material pricing check","Check current WA roofing material conditions.","web",["material categories","region","comparison date"],["price table","supply risks","buying recommendations"]],
    ["AI OS roadmap check","Prioritize the next AI OS build.","roadmap",["current capabilities","business priorities","constraints"],["gap analysis","ranked roadmap","next build specification"]]
  ]]
];

const skillFor = category => `skills/${category.toLowerCase().replaceAll(" & ","-").replaceAll(" ","-")}/SKILL.md`;
let active;
const $ = s => document.querySelector(s);

function promptFor(action, context="") {
  return `You are running the Topside AI OS "${action.name}" action.\n\nObjective: ${action.desc}\nRequired inputs: ${action.inputs.join("; ")}\nRequired outputs: ${action.outputs.join("; ")}\nExecution rules: verify facts, identify missing inputs, show assumptions, and produce a clearly prioritized call-to-action.\n\nJob context:\n${context || "[Ask me for the missing required inputs before executing.]"}`;
}

function init() {
  const nav=$("#nav"), sections=$("#sections"), toolList=$("#tools");
  let count=0;
  groups.forEach(([category,color,icon,items],gi)=>{
    const id=`group-${gi}`;
    nav.insertAdjacentHTML("beforeend",`<button class="nav-button" data-target="${id}">${icon} ${category}</button>`);
    const cards=items.map(([name,desc,tool,inputs,outputs])=>{
      count++; const action={name,desc,tool,inputs,outputs,category};
      return `<button class="card" style="--accent:var(--${color})" data-action='${encodeURIComponent(JSON.stringify(action))}'><span class="icon">${icon}</span><h3>${name}</h3><p>${desc}</p><small>Open action →</small></button>`;
    }).join("");
    sections.insertAdjacentHTML("beforeend",`<section class="workspace" id="${id}"><div class="workspace-head"><span>${icon}</span><h2>${category}</h2><span class="count">${items.length} actions</span></div><div class="cards">${cards}</div></section>`);
  });
  Object.entries(tools).forEach(([key,[name,url]])=>toolList.insertAdjacentHTML("beforeend",`<button class="tool" data-url="${url}">${name} ↗</button>`));
  $("#actionCount").textContent=count;
  bind();
}

function bind(){
  document.addEventListener("click",e=>{
    const card=e.target.closest(".card"); if(card) openAction(JSON.parse(decodeURIComponent(card.dataset.action)));
    const url=e.target.closest("[data-url]")?.dataset.url; if(url) window.open(url,"_blank");
    const target=e.target.closest("[data-target]")?.dataset.target; if(target) document.getElementById(target).scrollIntoView({behavior:"smooth"});
  });
  $("#search").addEventListener("input",e=>document.querySelectorAll(".card").forEach(c=>c.hidden=!c.innerText.toLowerCase().includes(e.target.value.toLowerCase())));
  $("#copyTask").onclick=()=>copy(promptFor(active,$("#context").value));
  $("#launchClaude").onclick=async()=>{await copy(promptFor(active,$("#context").value)); window.open("https://claude.ai/new","_blank");};
  $("#downloadTask").onclick=download;
  $("#openTool").onclick=()=>window.open(tools[active.tool][1],"_blank");
}

function openAction(action){
  active=action; $("#dialogCategory").textContent=action.category; $("#dialogTitle").textContent=action.name; $("#dialogDescription").textContent=action.desc;
  $("#dialogInputs").innerHTML=action.inputs.map(x=>`<li>${x}</li>`).join(""); $("#dialogOutputs").innerHTML=action.outputs.map(x=>`<li>${x}</li>`).join("");
  $("#dialogSkill").textContent=`Skill contract: ${skillFor(action.category)} | Tool: ${tools[action.tool][0]}`; $("#openTool").textContent=`Open ${tools[action.tool][0]}`;
  $("#context").value=""; $("#actionDialog").showModal();
}
async function copy(text){
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const box=document.createElement("textarea");
    box.value=text; box.style.position="fixed"; box.style.opacity="0"; document.body.appendChild(box);
    box.select(); document.execCommand("copy"); box.remove();
  }
  toast("Task copied and ready to run");
}
function download(){const text=promptFor(active,$("#context").value),a=document.createElement("a");a.href=URL.createObjectURL(new Blob([text],{type:"text/plain"}));a.download=`${active.name.toLowerCase().replaceAll(" ","-")}-task.txt`;a.click();URL.revokeObjectURL(a.href);toast("Task file downloaded");}
function toast(text){$("#toast").textContent=text;$("#toast").classList.add("show");setTimeout(()=>$("#toast").classList.remove("show"),2200)}
setInterval(()=>$("#clock").textContent=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),1000);
init();
