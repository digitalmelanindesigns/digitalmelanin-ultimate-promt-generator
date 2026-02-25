/* =========================
   Viral Glam Doll Builder
   Full rebuild: working pills, custom add inputs, sticky right,
   background bug fixed, 3-style generator included.
========================= */

const $ = (sel) => document.querySelector(sel);

const state = {}; // sectionId -> Set(values) for multi OR string for single
const customPools = {}; // sectionId -> array of custom values

const PRESETS = [
  {
    key: "Ultra Polished 3D",
    badge: "Ultra Polished 3D",
    inject: {
      art_style: "Ultra Polished 3D",
      image_mode: "Full Color (vibrant glossy finish)",
      render_style:
        "glossy fashion-doll look with smooth airbrushed finish, soft studio lighting, dimensional depth, premium campaign polish, toy-box depth"
    }
  },
  {
    key: "Bratz-Inspired",
    badge: "Bratz-Inspired",
    inject: {
      art_style: "Bratz-Inspired Fashion Doll",
      image_mode: "Full Color (vibrant glossy finish)",
      render_style:
        "Bratz-inspired glam doll render, big expressive eyes, glossy pouty lips, high-shine highlights, studio lighting, premium campaign polish"
    }
  },
  {
    key: "Sticker Pack Line Art",
    badge: "Sticker Pack",
    inject: {
      art_style: "Sticker Pack / Clipart Style",
      image_mode: "Black & White Line Art (no shading)",
      render_style:
        "pure black ink line art only on white, thick outer contour lines, crisp outlines, no shading, no gray, no gradients, sticker pack ready"
    }
  }
];

const SECTIONS = [
  // Core identity
  single("subject", "Subject", [
    "Adult Female", "Adult Male",
    "Mature Adult Female", "Mature Adult Male",
    "Young Adult Female", "Young Adult Male",
    "Toddler Girl", "Toddler Boy",
    "Baby Girl", "Baby Boy"
  ], { icon:"👤", hint:"1 choice", default:"Adult Female"}),

  single("ethnicity", "Ethnicity", [
    "African American", "Black", "Black + Mixed", "Afro-Latina", "Latina", "Mixed",
    "Albino"
  ], { icon:"🌍", hint:"1 choice", default:"African American"}),

  single("skin_tone", "Skin Tone", [
    "Golden Honey", "Cocoa Satin", "Mocha Rich", "Toffee Tan",
    "Caramel Bronze", "Almond Beige", "Chestnut", "Deep Ebony",
    "Espresso", "Porcelain", "Ivory", "Warm Beige"
  ], { icon:"🍯", hint:"1 choice", default:"Golden Honey", allowCustom:true}),

  // Art + image
  single("art_style", "Art Style", [
    "exaggerated chibi style",
    "18k digital illustration",
    "gouache mixed with watercolor",
    "cgi caricature",
    "hyper realistic illustration",
    "bratz-inspired",
    "hyper realistic bratz doll",
    "chibi mixed with bratz",
    "semi realism 4k bratz style",
    "hand-drawn cartoon",
    "high gloss chibi",
    "glossy 3d chibi illustration",
    "coloring page image",
    "anime style illustration",
    "pixar 3d render",
    "retro vintage cartoon",
    "comic book style"
  ], { icon:"🎨", hint:"1 choice", default:"Ultra Polished 3D", allowCustom:true }),

  single("image_mode", "Image Mode", [
    "Full Color (vibrant glossy finish)",
    "Toy Packaging / Retail Doll Box (candy gloss finish)",
    "Sticker Pack / Clipart Style",
    "Black & White Line Art (no shading)",
    "Black & White Coloring Page"
  ], { icon:"🖼️", hint:"1 choice", default:"Full Color (vibrant glossy finish)", allowCustom:true }),

  single("color_palette", "Color Palette", [
    "Hot Pink + Gold + Blush Pink + Cream",
    "Cotton Candy (pink + baby blue + lavender)",
    "Blush Pink + Gold",
    "Neutrals + Gold",
    "Rose Gold + Cream",
    "Purple + Gold",
    "Monochrome Neutrals",
    "Pastel Rainbow"
  ], { icon:"🌈", hint:"1 choice", allowCustom:true }),

  // Camera + pose
  single("camera_angle", "Camera Angles", [
    "front view",
    "side profile",
    "three-quarter view",
    "low angle shot",
    "high angle shot",
    "bird's eye view",
    "worm's eye view",
    "over the shoulder",
    "close-up portrait",
    "full body shot",
    "dutch angle",
    "extreme close-up",
    "cinematic crop (poster-style)"
  ], { icon:"📸", hint:"1 choice", allowCustom:true }),

  multi("pose_action", "Pose & Action", [
    "hand on hip",
    "sitting cross-legged",
    "jumping",
    "peace sign",
    "dancing",
    "taking selfie",
    "leaning against wall",
    "arms crossed",
    "blowing a kiss",
    "walking with attitude",
    "pointing at camera",
    "throwing up heart sign",
    "finger snap pose",
    "over-the-shoulder glance"
  ], { icon:"🕺", hint:"multi", allowCustom:true }),

  // Glam details
  multi("expression", "Expression", [
    "confident smirk",
    "side-eye",
    "soft smile",
    "playful smile",
    "pouty lips",
    "wink",
    "unbothered",
    "fierce stare"
  ], { icon:"😏", hint:"multi", allowCustom:true }),

  multi("brows", "Brows", [
    "sharp precision brows",
    "feathered brows",
    "ombre brows",
    "sculpted brows"
  ], { icon:"🖊️", hint:"multi", allowCustom:true }),

  multi("lashes", "Lashes", [
    "dramatic volume lashes",
    "bold strip lashes",
    "fluffy mink lashes",
    "bottom lash detail",
    "double-stacked lashes"
  ], { icon:"👁️", hint:"multi", allowCustom:true }),

  multi("makeup", "Makeup", [
    "full glam beat",
    "glitter cut-crease",
    "graphic liner",
    "soft glam",
    "freckles + blush",
    "candy gloss lips"
  ], { icon:"💄", hint:"multi", allowCustom:true }),

  // Hair
  single("hair_style", "Hair Style", [
    "sleek middle part bone straight",
    "deep wave glam",
    "blunt bob",
    "space buns",
    "high ponytail",
    "locs (bob)",
    "body wave",
    "half-up half-down",
    "pixie cut",
    "braided ponytail"
  ], { icon:"💇🏾‍♀️", hint:"1 choice", allowCustom:true }),

  single("hair_color", "Hair Color", [
    "jet black",
    "honey blonde",
    "black with blonde money piece",
    "caramel highlights",
    "chestnut brown",
    "copper auburn"
  ], { icon:"🎀", hint:"1 choice", allowCustom:true }),

  multi("edges", "Edges / Baby Hairs", [
    "laid & sleek edges",
    "dramatic swirl edges",
    "ultra snatched edges",
    "double swirl edges",
    "soft swoop edges"
  ], { icon:"✨", hint:"multi", allowCustom:true }),

  // Nails
  single("nails", "Nails", [
    "xxl coffin nails",
    "ombré nails",
    "stiletto nails",
    "square short nails (french tip)",
    "pink candy gloss nails",
    "rhinestone accent nails"
  ], { icon:"💅", hint:"1 choice", allowCustom:true }),

  // Outfit sets + split outfit
  single("outfit_set", "Outfit Set", [
    "glam streetwear",
    "hoodie and sweatpants",
    "designer top with denim jeans",
    "sparkly mini dress",
    "tracksuit",
    "business attire",
    "oversized cozy sweater with leggings",
    "leather jacket with ripped jeans",
    "t-shirt with dark jeans",
    "crop top with cargo pants",
    "satin pajama set",
    "bomber jacket with joggers",
    "tuxedo",
    "baseball jersey",
    "basketball jersey",
    "puffer coat with jeans",
    "tank top with baggy jeans",
    "cute onesie",
    "colorful romper",
    "overalls with t-shirt",
    "tutu dress",
    "superhero costume",
    "princess dress",
    "denim jacket with shorts",
    "striped shirt with leggings",
    "dinosaur pajamas",
    "rainbow hoodie",
    "animal print dress",
    "dungarees",
    "sequined cocktail dress",
    "velvet bodycon dress",
    "silk slip dress with blazer",
    "distressed boyfriend jeans with graphic tee",
    "linen button-up with chino shorts",
    "oversized denim jacket with sundress",
    "no outfit set"
  ], { icon:"🧥", hint:"1 choice", default:"no outfit set", allowCustom:true }),

  single("top", "Top", [
    "corset top",
    "crop top",
    "bodysuit",
    "satin blouse",
    "metallic top",
    "tank top",
    "cropped graphic tee (no brand)",
    "graphic tee (no brand)",
    "hoodie",
    "off-shoulder sweater"
  ], { icon:"👚", hint:"1 choice", allowCustom:true }),

  single("bottom", "Bottom", [
    "wide-leg jeans",
    "ripped jeans",
    "metallic pants",
    "skinny jeans",
    "mini skirt",
    "purple metallic mini skirt",
    "shorts",
    "joggers",
    "leggings"
  ], { icon:"👖", hint:"1 choice", allowCustom:true }),

  single("outerwear", "Outerwear", [
    "oversized denim jacket",
    "statement coat",
    "blazer",
    "puffer jacket",
    "leather jacket",
    "bomber jacket",
    "cardigan",
    "no outerwear"
  ], { icon:"🧣", hint:"1 choice", default:"no outerwear", allowCustom:true }),

  // Shoes (big list)
  single("shoes", "Shoes", [
    "nike sneakers (generic no logos)",
    "fuzzy slippers",
    "stiletto heels",
    "timberland boots (generic no logos)",
    "rain boots",
    "lace up sneakers (generic)",
    "high top sneakers (generic)",
    "air max style sneakers (generic no logos)",
    "jordan style sneakers (generic no logos)",
    "dressy shoes",
    "open toe sandals",
    "blinged heels",
    "ugg boots (generic)",
    "just socks",
    "barefoot",
    "light-up sneakers",
    "velcro strap shoes",
    "mary jane shoes",
    "cowboy boots",
    "platform sneakers",
    "combat boots",
    "thigh high boots",
    "strap sandals",
    "block heels",
    "platform heel sandals (open toe)",
    "wedge sandals",
    "mary jane platforms"
  ], { icon:"👟", hint:"1 choice", allowCustom:true }),

  // Props / held items
  multi("props", "Props / Held Items", [
    "magic wand",
    "sword",
    "staff",
    "microphone",
    "guitar",
    "skateboard",
    "basketball",
    "books",
    "laptop",
    "phone",
    "shopping bags",
    "coffee cup",
    "balloon",
    "flowers",
    "gift box",
    "no props"
  ], { icon:"🧸", hint:"multi", allowCustom:true }),

  // Pets
  single("pet", "Companion Animal / Pet", [
    "fluffy puppy",
    "playful kitten",
    "bunny rabbit",
    "hamster",
    "bird on shoulder",
    "tiny dragon",
    "magical unicorn",
    "baby panda",
    "teddy bear",
    "guinea pig",
    "ferret",
    "baby fox",
    "baby raccoon",
    "hedgehog",
    "chinchilla",
    "no pet"
  ], { icon:"🐾", hint:"1 choice", default:"no pet", allowCustom:true }),

  // Theme / cosplay
  single("theme", "Character Theme / Cosplay", [
    "superhero",
    "anime character",
    "video game character",
    "disney princess style",
    "magical girl",
    "ninja warrior",
    "pirate",
    "cowboy/cowgirl",
    "astronaut",
    "mermaid",
    "fairy",
    "vampire",
    "angel",
    "elf",
    "robot",
    "zombie",
    "witch/wizard",
    "knight",
    "samurai",
    "rockstar",
    "no theme"
  ], { icon:"🦸🏾‍♀️", hint:"1 choice", default:"no theme", allowCustom:true }),

  // Fantasy
  multi("fantasy", "Fantasy Elements", [
    "fairy wings",
    "angel wings",
    "phoenix wings",
    "bat wings",
    "dragon wings",
    "magical aura",
    "glowing energy",
    "floating sparkles",
    "mystical symbols",
    "elemental powers",
    "floating hearts",
    "no fantasy elements"
  ], { icon:"🪽", hint:"multi", allowCustom:true }),

  // Baby (when toddler/baby chosen, but still optional)
  multi("baby_items", "Baby", [
    "baby bottle",
    "pacifier",
    "baby blanket",
    "stuffed animal",
    "baby rattle",
    "teething toy",
    "baby bib",
    "onesie",
    "baby booties",
    "diaper",
    "baby hat",
    "stroller"
  ], { icon:"🍼", hint:"multi", allowCustom:true }),

  // Accessories + jewelry
  multi("accessories", "Accessories", [
    "oversized hoop earrings",
    "layered gold necklaces",
    "layered silver necklaces",
    "stacked rings",
    "charm bracelet",
    "luxury watch (no logos)",
    "statement earrings",
    "bangle stack",
    "silk scarf",
    "runway oversized sunglasses"
  ], { icon:"💎", hint:"multi", allowCustom:true }),

  single("bag", "Bag", [
    "crossbody bag (no logos)",
    "clutch bag (no logos)",
    "handbag (no logos)",
    "no bag"
  ], { icon:"👜", hint:"1 choice", default:"no bag", allowCustom:true }),

  // Tattoos + body jewelry
  multi("tattoos", "Tattoos", [
    "forearm script tattoo",
    "small wrist tattoo",
    "hand tattoo",
    "thigh tattoo",
    "no tattoos"
  ], { icon:"🖋️", hint:"multi", allowCustom:true }),

  multi("body_jewelry", "Body Jewelry / Piercings", [
    "nose hoop",
    "nose stud",
    "lip piercing",
    "cute nose chain",
    "no piercings"
  ], { icon:"✨", hint:"multi", allowCustom:true }),

  // Background (bug fix)
  single("background", "Background", [
    "no background",
    "white background only",
    "soft blush gradient",
    "pink studio backdrop",
    "lavender bokeh backdrop",
    "luxury penthouse lounge",
    "yacht weekend",
    "tropical island",
    "leopard splash backdrop"
  ], { icon:"🌅", hint:"1 choice", default:"no background", allowCustom:true }),

  // Rules
  single("rules", "Rules", [
    "no logos, no brand names, no text, no watermarks. High resolution, print-ready.",
    "no logos, no text, no watermarks. High resolution, print-ready.",
    "logo-free clothing and accessories, no real brand marks, no watermark, print-ready."
  ], { icon:"🧾", hint:"1 choice", default:"no logos, no brand names, no text, no watermarks. High resolution, print-ready." }),

  // Render style free text (optional)
  single("render_style", "Render / Finish Notes", [
    "glossy toy-box depth, soft studio lighting, smooth airbrushed finish, premium campaign polish",
    "high-gloss skin highlights, dimensional depth, candy gloss finish",
    "studio-lit, ultra clean, pinterest-worthy, print-ready polish"
  ], { icon:"✨", hint:"1 choice", allowCustom:true })
];

/* ---------- helpers to build section definitions ---------- */
function single(id, label, options, meta={}) {
  return { id, label, type:"single", options, ...meta };
}
function multi(id, label, options, meta={}) {
  return { id, label, type:"multi", options, ...meta };
}

/* ---------- init defaults ---------- */
function initState(){
  SECTIONS.forEach(sec=>{
    customPools[sec.id] = [];
    if(sec.type==="single"){
      state[sec.id] = sec.default ?? "";
      if(!state[sec.id] && sec.options?.length) state[sec.id] = sec.options[0];
    }else{
      state[sec.id] = new Set();
    }
  });
}

/* ---------- UI render ---------- */
function renderControls(){
  const root = $("#controls");
  root.innerHTML = "";

  SECTIONS.forEach(sec=>{
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.section = sec.id;

    const top = document.createElement("div");
    top.className = "cardTop";

    const title = document.createElement("div");
    title.className = "cardTitle";
    title.innerHTML = `<span>${sec.icon ?? "✨"}</span> <span>${sec.label}</span>`;

    const hint = document.createElement("div");
    hint.className = "cardHint";
    hint.textContent = sec.hint ?? (sec.type==="single" ? "1 choice" : "multi");

    top.appendChild(title);
    top.appendChild(hint);

    const pills = document.createElement("div");
    pills.className = "pills";

    const allOptions = [...sec.options, ...customPools[sec.id]];
    allOptions.forEach(opt=>{
      const pill = document.createElement("div");
      pill.className = "pill";
      pill.textContent = opt;
      pill.dataset.value = opt;
      pill.dataset.section = sec.id;

      if(sec.type==="single"){
        if((state[sec.id] || "").toLowerCase() === opt.toLowerCase()) pill.classList.add("active");
      }else{
        if(state[sec.id].has(opt)) pill.classList.add("active");
      }
      pills.appendChild(pill);
    });

    card.appendChild(top);
    card.appendChild(pills);

    if(sec.allowCustom){
      const row = document.createElement("div");
      row.className = "customRow";
      row.innerHTML = `
        <input type="text" data-custom-input="${sec.id}" placeholder="Add your own..." />
        <button class="btn btnPrimary" data-custom-add="${sec.id}">+ Add</button>
      `;
      card.appendChild(row);
    }

    root.appendChild(card);
  });
}

/* ---------- selection logic ---------- */
function setSingle(sectionId, value){
  // Background bug fix: if "no background", store exactly that and builder will omit it
  state[sectionId] = value;
}

function toggleMulti(sectionId, value){
  const set = state[sectionId];
  if(set.has(value)) set.delete(value);
  else set.add(value);

  // If they click "no xyz" options, keep it exclusive
  const lowers = [...set].map(v=>v.toLowerCase());
  const hasNo = lowers.some(v=>v.startsWith("no "));
  if(hasNo){
    // Keep only the "no ..." selection(s)
    [...set].forEach(v=>{
      if(!v.toLowerCase().startsWith("no ")) set.delete(v);
    });
  }
}

/* ---------- prompt building ---------- */
function cleanList(arr){
  return arr.filter(Boolean).map(s=>s.trim()).filter(Boolean);
}

function buildPromptFromState(overrideInject=null){
  const get = (id) => state[id];
  const getMulti = (id) => [...state[id]];

  const subject = get("subject");
  const ethnicity = get("ethnicity");
  const skin = get("skin_tone");

  let art_style = get("art_style");
  let image_mode = get("image_mode");
  let render_style = get("render_style");

  if(overrideInject){
    art_style = overrideInject.art_style ?? art_style;
    image_mode = overrideInject.image_mode ?? image_mode;
    render_style = overrideInject.render_style ?? render_style;
  }

  const palette = get("color_palette");
  const camera = get("camera_angle");

  const hair = cleanList([
    get("hair_style") ? `hair style: ${get("hair_style")}` : "",
    get("hair_color") ? `hair color: ${get("hair_color")}` : "",
    getMulti("edges").length ? `edges/baby hairs: ${getMulti("edges").join(", ")}` : ""
  ]).join(" | ");

  const face = cleanList([
    getMulti("expression").length ? `expression: ${getMulti("expression").join(", ")}` : "",
    getMulti("brows").length ? `eyebrows: ${getMulti("brows").join(", ")}` : "",
    getMulti("lashes").length ? `lashes: ${getMulti("lashes").join(", ")}` : "",
    getMulti("makeup").length ? `makeup: ${getMulti("makeup").join(", ")}` : ""
  ]).join(" | ");

  const outfitSet = get("outfit_set");
  const top = get("top");
  const bottom = get("bottom");
  const outerwear = get("outerwear");
  const shoes = get("shoes");

  const props = getMulti("props");
  const fantasy = getMulti("fantasy");
  const babyItems = getMulti("baby_items");

  const accessories = getMulti("accessories");
  const tattoos = getMulti("tattoos");
  const bodyJewelry = getMulti("body_jewelry");

  const bag = get("bag");
  const nails = get("nails");
  const theme = get("theme");
  const pet = get("pet");

  const background = get("background");
  const rules = get("rules");

  const lines = [];

  // Identity
  lines.push(`Create a ${subject} ${ethnicity} glam doll character with ${skin} skin tone.`);

  // Art + image
  lines.push(`Art style: ${art_style}.`);
  lines.push(`Image mode: ${image_mode}.`);
  if(camera) lines.push(`Camera angle/shot: ${camera}.`);
  if(palette) lines.push(`Color palette: ${palette}.`);

  // Pose
  const poses = getMulti("pose_action");
  if(poses.length) lines.push(`Pose/action: ${poses.join(", ")}.`);

  // Face + glam
  if(face) lines.push(`Face glam: ${face}.`);

  // Nails + hair
  if(nails) lines.push(`Nails: ${nails}.`);
  if(hair) lines.push(`Hair: ${hair}.`);

  // Theme/pet
  if(theme && theme.toLowerCase() !== "no theme") lines.push(`Character theme/cosplay: ${theme}.`);
  if(pet && pet.toLowerCase() !== "no pet") lines.push(`Companion animal/pet: ${pet}.`);

  // Outfit
  const outfitParts = [];
  if(outfitSet && outfitSet.toLowerCase() !== "no outfit set") outfitParts.push(`Set: ${outfitSet}`);
  if(top) outfitParts.push(`Top: ${top}`);
  if(bottom) outfitParts.push(`Bottom: ${bottom}`);
  if(outerwear && outerwear.toLowerCase() !== "no outerwear") outfitParts.push(`Outerwear: ${outerwear}`);
  if(outfitParts.length) lines.push(`Outfit: ${outfitParts.join(" | ")}.`);
  if(shoes) lines.push(`Shoes: ${shoes}.`);

  // Props/fantasy/baby
  if(props.length && !props.some(v=>v.toLowerCase()==="no props")) lines.push(`Props/held items: ${props.join(", ")}.`);
  if(fantasy.length && !fantasy.some(v=>v.toLowerCase()==="no fantasy elements")) lines.push(`Fantasy elements: ${fantasy.join(", ")}.`);
  if(babyItems.length) lines.push(`Baby items: ${babyItems.join(", ")}.`);

  // Accessories/tattoos/piercings/bags
  if(accessories.length) lines.push(`Accessories: ${accessories.join(", ")}.`);
  if(bag && bag.toLowerCase()!=="no bag") lines.push(`Bag: ${bag}.`);
  if(tattoos.length && !tattoos.some(v=>v.toLowerCase()==="no tattoos")) lines.push(`Tattoos: ${tattoos.join(", ")}.`);
  if(bodyJewelry.length && !bodyJewelry.some(v=>v.toLowerCase()==="no piercings")) lines.push(`Body jewelry/piercings: ${bodyJewelry.join(", ")}.`);

  // Background (BUG FIX)
  if(background && background.toLowerCase() !== "no background") lines.push(`Background: ${background}.`);

  // Render + rules
  if(render_style) lines.push(`Render style: ${render_style}.`);
  if(rules) lines.push(`Rules: ${rules}`);

  return lines.join("\n\n");
}

/* ---------- randomize ---------- */
function randPick(arr){
  return arr[Math.floor(Math.random()*arr.length)];
}
function randomizeAll(){
  SECTIONS.forEach(sec=>{
    const options = [...sec.options, ...customPools[sec.id]];
    if(sec.type==="single"){
      // Respect "no background" more: it should appear often, not rare
      if(sec.id === "background"){
        const weighted = [...options, "no background", "no background"];
        setSingle(sec.id, randPick(weighted));
      }else{
        setSingle(sec.id, randPick(options));
      }
    }else{
      state[sec.id].clear();
      // Pick 0-2 random (unless section is multi but needs something)
      const pickCount = Math.floor(Math.random()*3); // 0..2
      for(let i=0;i<pickCount;i++){
        const v = randPick(options);
        toggleMulti(sec.id, v);
      }
      // If any "no ..." chosen, it already self-cleans
    }
  });

  renderControls();
  $("#promptOut").value = buildPromptFromState();
  toast("Randomized from left. ✅");
}

/* ---------- randomize 3 style options ---------- */
function randomize3Styles(){
  // Create 3 prompts using current selections but injecting style presets
  // Optional: we can lightly randomize pose/outfit/shoes each time for variety
  const originalSnapshot = snapshotState();

  const a = makeVariant(PRESETS[0]);
  const b = makeVariant(PRESETS[1]);
  const c = makeVariant(PRESETS[2]);

  // restore
  restoreSnapshot(originalSnapshot);
  renderControls();

  setOption("A", a.prompt, PRESETS[0].badge);
  setOption("B", b.prompt, PRESETS[1].badge);
  setOption("C", c.prompt, PRESETS[2].badge);

  toast("3 style options generated. Pick A/B/C. ✨");
}

function makeVariant(preset){
  // Slight variety knobs
  // randomize some glam/outfit/shoes/pose but keep background rule stable
  const original = snapshotState();

  // Light random for variety
  lightRandom("pose_action", 2);
  lightRandom("expression", 1);
  lightRandomSingle("shoes");
  lightRandomSingle("top");
  lightRandomSingle("bottom");
  // do NOT force background
  // keep background as-is

  const prompt = buildPromptFromState(preset.inject);
  restoreSnapshot(original);
  return { prompt };
}

function lightRandom(sectionId, maxPicks=2){
  const sec = SECTIONS.find(s=>s.id===sectionId);
  if(!sec || sec.type!=="multi") return;
  state[sectionId].clear();
  const options = [...sec.options, ...customPools[sectionId]];
  const n = 1 + Math.floor(Math.random()*maxPicks);
  for(let i=0;i<n;i++) toggleMulti(sectionId, randPick(options));
}
function lightRandomSingle(sectionId){
  const sec = SECTIONS.find(s=>s.id===sectionId);
  if(!sec || sec.type!=="single") return;
  const options = [...sec.options, ...customPools[sectionId]];
  setSingle(sectionId, randPick(options));
}

function setOption(letter, text, badge){
  $(`#prompt${letter}`).value = text;
  const badgeEl = $(`#badge${letter} .badgeText`);
  if(badgeEl) badgeEl.textContent = badge || "—";
}

/* ---------- snapshot helpers ---------- */
function snapshotState(){
  const snap = {};
  Object.keys(state).forEach(k=>{
    if(state[k] instanceof Set) snap[k] = new Set([...state[k]]);
    else snap[k] = state[k];
  });
  return snap;
}
function restoreSnapshot(snap){
  Object.keys(snap).forEach(k=>{
    if(snap[k] instanceof Set) state[k] = new Set([...snap[k]]);
    else state[k] = snap[k];
  });
}

/* ---------- copy / toast ---------- */
async function copyText(txt){
  try{
    await navigator.clipboard.writeText(txt);
    toast("Copied. ✅");
  }catch{
    toast("Copy blocked. Tap and copy manually.");
  }
}
let toastTimer = null;
function toast(msg){
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove("show"), 1800);
}

/* ---------- events ---------- */
function wireEvents(){
  // Pills + add custom
  $("#controls").addEventListener("click", (e)=>{
    const pill = e.target.closest(".pill");
    if(pill){
      const sectionId = pill.dataset.section;
      const value = pill.dataset.value;
      const sec = SECTIONS.find(s=>s.id===sectionId);
      if(!sec) return;

      if(sec.type==="single"){
        setSingle(sectionId, value);
      }else{
        toggleMulti(sectionId, value);
      }
      renderControls();
      $("#promptOut").value = buildPromptFromState();
      return;
    }

    const addBtn = e.target.closest("[data-custom-add]");
    if(addBtn){
      const sectionId = addBtn.dataset.customAdd;
      const input = document.querySelector(`[data-custom-input="${sectionId}"]`);
      if(!input) return;
      const val = (input.value || "").trim();
      if(!val) return;

      // prevent duplicates (case-insensitive)
      const sec = SECTIONS.find(s=>s.id===sectionId);
      const existing = [...sec.options, ...customPools[sectionId]].map(x=>x.toLowerCase());
      if(existing.includes(val.toLowerCase())){
        toast("That option already exists.");
        input.value = "";
        return;
      }

      customPools[sectionId].push(val);
      input.value = "";
      renderControls();
      toast("Added custom option. ✅");
    }
  });

  // Top buttons
  $("#randBtn").addEventListener("click", randomizeAll);
  $("#rand3Btn").addEventListener("click", randomize3Styles);
  $("#clearBtn").addEventListener("click", ()=>{
    initState();
    renderControls();
    $("#promptOut").value = "";
    $("#promptA").value = "";
    $("#promptB").value = "";
    $("#promptC").value = "";
    setOption("A","", "—");
    setOption("B","", "—");
    setOption("C","", "—");
    toast("Cleared. ✅");
  });

  // Generate from left
  $("#genBtn").addEventListener("click", ()=>{
    $("#promptOut").value = buildPromptFromState();
    toast("Generated from left. ✅");
  });

  // Copy prompt output
  $("#copyBtn").addEventListener("click", ()=>{
    copyText($("#promptOut").value || "");
  });

  // Copy/use option A/B/C (event delegation on document)
  document.addEventListener("click", (e)=>{
    const copyBtn = e.target.closest("[data-copy]");
    if(copyBtn){
      const L = copyBtn.dataset.copy;
      const txt = $(`#prompt${L}`).value || "";
      copyText(txt);
      return;
    }
    const useBtn = e.target.closest("[data-use]");
    if(useBtn){
      const L = useBtn.dataset.use;
      const txt = $(`#prompt${L}`).value || "";
      $("#promptOut").value = txt;
      toast(`Option ${L} applied to output. ✅`);
      return;
    }
  });
}

/* ---------- boot ---------- */
initState();
renderControls();
wireEvents();

// Auto-generate initial output so you see it working immediately:
$("#promptOut").value = buildPromptFromState();