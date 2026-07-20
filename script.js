/* =====================================================================
   VLAK 40 — narozeninový remake hry VLAK (M. Němeček, 1993)
   Posbírej všechen náklad, dojeď do otevřených vrátek, odemkni dárek.
   ===================================================================== */

"use strict";

/* ---------------------------------------------------------------------
   ✏️ TEXTY K ÚPRAVĚ — hlášky mezi levely (klidně přepiš po svém)
   --------------------------------------------------------------------- */
const TEXTS = {
    titleLines: [
        "Nastup si, strojvedoucí!",
        "Čeká tě 6 tratí a na konečné",
        "stanici dárek k narozeninám.",
    ],
    // ✏️ podpis na úvodní obrazovce:
    credit: "© 2026 · s láskou od tvé rodiny",
    winTitle: "VŠECHNO NEJLEPŠÍ K 40!",
    winLines: [
        "Dojel jsi na konečnou, tati!",
        "40 let jízdy a pořád v plné páře.",
    ],
};

/* ---------------------------------------------------------------------
   LEVELY — mapa 20×12 znaků:
   #  zeď          G  vrátka (otevřou se po sběru všeho)
   T  start vlaku  mezera  volno
   náklad: c dort · d dárek · b pivo · s svíčka
           f fedora (Mafia) · h ježek (Wacky Wheels) · v srdce
   --------------------------------------------------------------------- */
const LEVELS = [
    {
        name: "1. NÁSTUPIŠTĚ 40",
        pass: "STANDARTNÍ KAŽDODENNÍ PRD",
        // ✏️ hláška před levelem:
        msg: ["Vítej ve svém narozeninovém", "vlaku! Posbírej všechen náklad", "a vyjeď otevřenými vrátky."],
        speed: 300,
        map: [
            "####################",
            "#                  #",
            "#  c    d     s    #",
            "#                  #",
            "#      T           #",
            "#  d           c   G",
            "#                  #",
            "#     s      d     #",
            "#                  #",
            "#  c     d      c  #",
            "#                  #",
            "####################",
        ],
    },
    {
        name: "2. SVÍČKÁRNA",
        pass: "HOLČIČÍ PRD",
        // ✏️ hláška před levelem:
        msg: ["40 svíček se samo", "neposbírá. Hlavně je", "cestou nesfouknout!"],
        speed: 280,
        map: [
            "####################",
            "#T       #         #",
            "#  s     #    s    #",
            "#        #         #",
            "#  ###       ###   #",
            "#    #        #    #",
            "#  s #    c   # s  G",
            "#    #        #    #",
            "#  ###       ###   #",
            "#        #         #",
            "#   s    #    s    #",
            "####################",
        ],
    },
    {
        name: "3. WACKY DEPO",
        pass: "PRD CHLUPATÉHO ŘIDIČE NÁKLAĎÁKU",
        // ✏️ hláška před levelem:
        msg: ["Ježci z Wacky Wheels obsadili", "trať! Sestřel je mezerníkem,", "nebo je klidně přejeď."],
        speed: 260,
        map: [
            "####################",
            "#T                 #",
            "#   ####  #####    #",
            "#   #         #    #",
            "# h #  h   h  # h  #",
            "#   #         #    G",
            "#   #    h    #    #",
            "#   ##  #######    #",
            "#        h         #",
            "#  h            h  #",
            "#                  #",
            "####################",
        ],
    },
    {
        name: "4. LOST HEAVEN EXPRESS",
        pass: "ČVACHTAVÝ PRD",
        // ✏️ hláška před levelem:
        msg: ["Tome, Don Salieri potřebuje", "posbírat fedory po celém", "Lost Heaven. Paulie a Sam čekají!"],
        speed: 240,
        map: [
            "####################",
            "#T   f        f    #",
            "#  ##   ##   ##    #",
            "#  ##   ##   ##  f #",
            "#      f           #",
            "# f           f    G",
            "#   ##   ##   ##   #",
            "# f ##   ##   ##   #",
            "#                  #",
            "#   f    f     f   #",
            "#                  #",
            "####################",
        ],
    },
    {
        name: "5. RODINNÁ TRAŤ",
        pass: "PRD RÁNA DO PRÁZDNA",
        // ✏️ hláška před levelem (sem se hodí něco osobního):
        msg: ["Největší poklad se neveze", "ve vagónech. Ale tyhle", "srdcovky posbírej stejně."],
        speed: 220,
        map: [
            "####################",
            "#T       #    v    #",
            "#  v     #         #",
            "#     ####    ###  #",
            "#             #    #",
            "#  ###   v    # v  G",
            "#    #        #    #",
            "#  v #   ######    #",
            "#    #        v    #",
            "#        v         #",
            "# v                #",
            "####################",
        ],
    },
    {
        name: "6. KONEČNÁ: ČTYŘICÍTKA",
        pass: "PRD KRÁLOVSKÝ ROZPAROVAČ",
        // ✏️ hláška před levelem:
        msg: ["Poslední úsek trati.", "Za těmihle vrátky už", "čeká tvůj dárek!"],
        speed: 200,
        map: [
            "####################",
            "#T                 #",
            "#  #  #   ####   s #",
            "#  #  #  #    #    #",
            "#  ####  #    #  d #",
            "#  b  #  #    #    G",
            "#     #  #    #  c #",
            "#  s  #   ####     #",
            "#      c f    h    #",
            "#   c    d    s    #",
            "#  d          b    #",
            "####################",
        ],
    },
];

/* ---------------------------------------------------------------------
   Konstanty a paleta (DOS/EGA)
   --------------------------------------------------------------------- */
const COLS = 20, ROWS = 12;
const CELL = 24;          // velikost políčka na plátně (2× sprite 12 px)
const SPR = 12;           // rozměr spritu v pixelech

const PAL = {
    K: "#000000", B: "#0000aa", G: "#00aa00", C: "#00aaaa",
    R: "#aa0000", M: "#aa00aa", W: "#aa5500", L: "#aaaaaa",
    D: "#555555", b: "#5555ff", g: "#55ff55", c: "#55ffff",
    r: "#ff5555", m: "#ff55ff", y: "#ffff55", w: "#ffffff",
};

/* ---------------------------------------------------------------------
   Sprity (12×12, "." = průhledná)
   --------------------------------------------------------------------- */
const SPRITES = {
    loco: [
        "............",
        "KKKK.....KK.",
        "KccK.....KK.",
        "KccKKKKKKKK.",
        "KKKKKKKKKKK.",
        "KrrrrrrrrrK.",
        "KryrrrrryrK.",
        "KKKKKKKKKKK.",
        ".DD.....DD..",
        "DDDD...DDDD.",
        ".DD.....DD..",
        "............",
    ],
    wagon: [
        "............",
        "............",
        "............",
        ".KKKKKKKKK..",
        ".KWWWWWWWK..",
        ".KWWWWWWWK..",
        ".KWWWWWWWK..",
        ".KKKKKKKKK..",
        "..DD...DD...",
        ".DDDD.DDDD..",
        "..DD...DD...",
        "............",
    ],
    c: [ // dort
        "............",
        ".....r......",
        ".....y......",
        "..wwwwwww...",
        "..wmwmwmw...",
        "..wwwwwww...",
        ".KKKKKKKKK..",
        ".KwwwwwwwK..",
        ".KwwwwwwwK..",
        ".KKKKKKKKK..",
        "............",
        "............",
    ],
    d: [ // dárek
        "............",
        "............",
        ".....yy.....",
        "..RRRyyRRR..",
        "..RRRyyRRR..",
        "..yyyyyyyy..",
        "..RRRyyRRR..",
        "..RRRyyRRR..",
        "..RRRyyRRR..",
        "..RRRyyRRR..",
        "............",
        "............",
    ],
    b: [ // pivo
        "............",
        "...wwwww....",
        "..wwwwwww...",
        "..yyyyyy....",
        "..yyyyyyLL..",
        "..yyyyyyL.L.",
        "..yyyyyyL.L.",
        "..yyyyyyLL..",
        "..yyyyyy....",
        "..KKKKKK....",
        "............",
        "............",
    ],
    s: [ // svíčka
        "............",
        ".....r......",
        ".....y......",
        "............",
        "....www.....",
        "....www.....",
        "....www.....",
        "....www.....",
        "....www.....",
        "...KKKKK....",
        "............",
        "............",
    ],
    f: [ // fedora
        "............",
        "............",
        "....DDDD....",
        "...DDDDDD...",
        "...DDDDDD...",
        "...KKKKKK...",
        "...DDDDDD...",
        ".DDDDDDDDDD.",
        ".DDDDDDDDDD.",
        "............",
        "............",
        "............",
    ],
    h: [ // ježek
        "............",
        "............",
        "..K.K.K.....",
        ".KWKWKWK....",
        ".KWWWWWWK...",
        ".KWWWWWWWw..",
        ".KWWWWWWwww.",
        ".KWWWWWWwKw.",
        "..KWWWWwww..",
        "...KK..KK...",
        "............",
        "............",
    ],
    shot: [ // vystřelený ježek stočený v klubíčku (jako ve Wacky Wheels)
        "............",
        "...K.KK.K...",
        "..KWKWWKWK..",
        ".KWWWWWWWWK.",
        "KWDWWWDWWWDK",
        "KWWWWWWWWWWK",
        "KWWwwWWwwWWK",
        "KWWKwWWKwWWK",
        ".KWWWrrWWWK.",
        "..KWKWWKWK..",
        "...K.KK.K...",
        "............",
    ],
    v: [ // srdce
        "............",
        "..rr...rr...",
        ".rrrr.rrrr..",
        ".rrrrrrrrr..",
        ".rrrrrrrrr..",
        ".rrrrrrrrr..",
        "..rrrrrrr...",
        "...rrrrr....",
        "....rrr.....",
        ".....r......",
        "............",
        "............",
    ],
};

const ITEM_NAMES = {
    c: "dort", d: "dárek", b: "pivo", s: "svíčka",
    f: "fedora", h: "ježek", v: "srdce",
};

/* Předrenderování spritů do 24×24 (2× zvětšení, ostré pixely) */
const sprCache = {};
for (const [key, rows] of Object.entries(SPRITES)) {
    const cv = document.createElement("canvas");
    cv.width = cv.height = CELL;
    const c2 = cv.getContext("2d");
    rows.forEach((row, y) => {
        for (let x = 0; x < SPR; x++) {
            const ch = row[x];
            if (ch === ".") continue;
            c2.fillStyle = PAL[ch];
            c2.fillRect(x * 2, y * 2, 2, 2);
        }
    });
    sprCache[key] = cv;
}

/* Zeď — modré cihly */
const wallTile = (() => {
    const cv = document.createElement("canvas");
    cv.width = cv.height = CELL;
    const c2 = cv.getContext("2d");
    c2.fillStyle = PAL.B;
    c2.fillRect(0, 0, CELL, CELL);
    c2.fillStyle = PAL.b;
    for (let row = 0; row < 4; row++) {
        const y = row * 6;
        c2.fillRect(0, y, CELL, 1);
        const off = row % 2 ? 4 : 12;
        c2.fillRect(off, y, 1, 6);
        c2.fillRect((off + 12) % CELL, y, 1, 6);
    }
    c2.fillStyle = "rgba(0,0,0,0.35)";
    c2.fillRect(0, CELL - 1, CELL, 1);
    return cv;
})();

/* Vrátka — zavřená (mříž) / otevřená (zelená šipka) */
function gateTile(open, blinkOn) {
    const cv = document.createElement("canvas");
    cv.width = cv.height = CELL;
    const c2 = cv.getContext("2d");
    if (!open) {
        c2.drawImage(wallTile, 0, 0);
        c2.fillStyle = PAL.K;
        c2.fillRect(3, 2, CELL - 6, CELL - 4);
        c2.fillStyle = PAL.W;
        for (let i = 0; i < 3; i++) c2.fillRect(6 + i * 6, 2, 2, CELL - 4);
        c2.fillRect(3, 10, CELL - 6, 2);
    } else {
        c2.fillStyle = PAL.K;
        c2.fillRect(0, 0, CELL, CELL);
        c2.strokeStyle = PAL.g;
        c2.strokeRect(0.5, 0.5, CELL - 1, CELL - 1);
        if (blinkOn) {
            c2.fillStyle = PAL.g;
            c2.fillRect(4, 10, 10, 4);
            c2.beginPath();
            c2.moveTo(14, 5);
            c2.lineTo(21, 12);
            c2.lineTo(14, 19);
            c2.closePath();
            c2.fill();
        }
    }
    return cv;
}
const gateClosedTile = gateTile(false, false);
const gateOpenA = gateTile(true, true);
const gateOpenB = gateTile(true, false);

/* ---------------------------------------------------------------------
   Zvuky (WebAudio pípání jako PC speaker)
   --------------------------------------------------------------------- */
let audioCtx = null;
function ensureAudio() {
    if (!audioCtx) {
        try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
        catch { /* bez zvuku */ }
    }
    if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
}
function beep(freq, dur = 0.08, delay = 0, type = "square", vol = 0.12) {
    if (!audioCtx) return;
    const t = audioCtx.currentTime + delay;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(t);
    osc.stop(t + dur);
}
const sfx = {
    collect() { beep(660, 0.06); beep(990, 0.08, 0.05); },
    gate() { [523, 659, 784, 1047].forEach((f, i) => beep(f, 0.1, i * 0.09)); },
    crash() { beep(160, 0.3, 0, "sawtooth", 0.18); beep(90, 0.4, 0.1, "sawtooth", 0.18); },
    step() { beep(220, 0.02, 0, "square", 0.03); },
    win() {
        // Happy Birthday (první fráze)
        const notes = [[392, .25], [392, .25], [440, .5], [392, .5], [523, .5], [494, .9]];
        let t = 0;
        notes.forEach(([f, d]) => { beep(f, d * 0.9, t, "square", 0.15); t += d * 0.55; });
    },
};

/* ---------------------------------------------------------------------
   Stav hry
   --------------------------------------------------------------------- */
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const hudLevel = document.getElementById("hud-level");
const hudCargo = document.getElementById("hud-cargo");
const hudTries = document.getElementById("hud-tries");

const DIRS = {
    up: { x: 0, y: -1 }, down: { x: 0, y: 1 },
    left: { x: -1, y: 0 }, right: { x: 1, y: 0 },
};
const OPPOSITE = { up: "down", down: "up", left: "right", right: "left" };

const state = {
    mode: "title",        // title | intro | ready | play | crash | win
    levelIndex: 0,
    tries: 1,
    walls: new Set(),     // "x,y"
    items: new Map(),     // "x,y" -> druh nákladu
    totalItems: 0,
    gate: null,           // {x,y}
    gateOpen: false,
    body: [],             // pozice článků vlaku, [0] = lokomotiva
    cargo: [],            // druhy nákladu v pořadí sběru
    dir: "right",
    pendingDir: null,
    pendingGrowth: 0,     // vagóny čekající na připojení (sestřelení ježci)
    bullet: null,         // letící ježek {x, y, dir}
    bulletLast: 0,
    lastStep: 0,
    crashAt: 0,
    confetti: [],
};


function key(x, y) { return x + "," + y; }

let giftTimer = null;

function loadLevel(index) {
    // schovat okno s dárkem (a zrušit jeho naplánované zobrazení),
    // když se z výherní obrazovky odchází heslem do levelu
    clearTimeout(giftTimer);
    document.getElementById("win-gift").hidden = true;

    const lvl = LEVELS[index];
    state.levelIndex = index;
    state.walls.clear();
    state.items.clear();
    state.gate = null;
    state.gateOpen = false;
    state.body = [];
    state.cargo = [];
    state.dir = "right";
    state.pendingDir = null;
    state.pendingGrowth = 0;
    state.bullet = null;

    lvl.map.forEach((row, y) => {
        for (let x = 0; x < COLS; x++) {
            const ch = row[x];
            if (ch === "#") state.walls.add(key(x, y));
            else if (ch === "G") state.gate = { x, y };
            else if (ch === "T") state.body = [{ x, y }];
            else if (SPRITES[ch]) state.items.set(key(x, y), ch);
        }
    });
    state.totalItems = state.items.size;
    updateHud();
}

function updateHud() {
    hudLevel.textContent = `LEVEL ${state.levelIndex + 1}/${LEVELS.length}`;
    hudCargo.textContent = `NÁKLAD ${state.cargo.length}/${state.totalItems}`;
    hudTries.textContent = `JÍZDA Č. ${state.tries}`;
}

/* ---------------------------------------------------------------------
   Herní logika
   --------------------------------------------------------------------- */
function setDirection(dir) {
    if (state.mode === "ready") {
        if (dir !== OPPOSITE[state.dir]) {
            state.dir = dir;
            state.mode = "play";
            state.lastStep = performance.now();
        }
        return;
    }
    if (state.mode === "play") state.pendingDir = dir;
}

function step() {
    if (state.pendingDir && state.pendingDir !== OPPOSITE[state.dir]) {
        state.dir = state.pendingDir;
    }
    state.pendingDir = null;

    const head = state.body[0];
    const d = DIRS[state.dir];
    const nx = head.x + d.x, ny = head.y + d.y;
    const nk = key(nx, ny);

    // otevřená vrátka? Stačí vjet lokomotivou — level hotov
    if (state.gateOpen && nx === state.gate.x && ny === state.gate.y) {
        sfx.gate();
        return levelComplete();
    }

    // náraz do zdi / zavřených vrátek?
    if (state.walls.has(nk) || (!state.gateOpen && nx === state.gate.x && ny === state.gate.y)) {
        return crash();
    }

    const grows = state.items.has(nk) || state.pendingGrowth > 0;

    // náraz do vlastního vlaku? (ocásek se hne, pokud vlak neroste)
    for (let i = 0; i < state.body.length - (grows ? 0 : 1); i++) {
        if (state.body[i].x === nx && state.body[i].y === ny) return crash();
    }

    state.body.unshift({ x: nx, y: ny });
    if (state.items.has(nk)) {
        state.cargo.push(state.items.get(nk));
        state.items.delete(nk);
        sfx.collect();
        updateHud();
        checkGate();
    } else if (state.pendingGrowth > 0) {
        state.pendingGrowth--;
    } else {
        state.body.pop();
    }
}

function checkGate() {
    if (state.items.size === 0 && !state.gateOpen) {
        state.gateOpen = true;
        sfx.gate();
    }
}

/* výstřel ježkem (mezerník) — jako ve Wacky Wheels */
function shoot() {
    if (state.mode !== "play" || state.bullet) return;
    const head = state.body[0];
    state.bullet = { x: head.x, y: head.y, dir: state.dir };
    state.bulletLast = 0;
    beep(880, 0.05); beep(440, 0.07, 0.04);
}

function stepBullet() {
    const b = state.bullet;
    if (!b) return;
    const d = DIRS[b.dir];
    b.x += d.x;
    b.y += d.y;
    const k = key(b.x, b.y);
    if (state.walls.has(k) || (b.x === state.gate.x && b.y === state.gate.y)
        || b.x < 0 || b.y < 0 || b.x >= COLS || b.y >= ROWS) {
        state.bullet = null;
        return;
    }
    // sestřelený ježek naskočí jako nový vagón
    if (state.items.get(k) === "h") {
        state.items.delete(k);
        state.cargo.push("h");
        state.pendingGrowth++;
        state.bullet = null;
        sfx.collect();
        updateHud();
        checkGate();
    }
}

function crash() {
    state.mode = "crash";
    state.crashAt = performance.now();
    sfx.crash();
}

function restartLevel() {
    state.tries++;
    loadLevel(state.levelIndex);
    state.mode = "ready";
}

function levelComplete() {
    if (state.levelIndex + 1 < LEVELS.length) {
        loadLevel(state.levelIndex + 1); // ať HUD hned ukazuje nový level
        state.mode = "intro";
    } else {
        winGame();
    }
}

function winGame() {
    state.mode = "win";
    sfx.win();
    spawnConfetti();
    // dárek se objeví na obrazovce až po chvíli oslavování
    giftTimer = setTimeout(() => {
        document.getElementById("win-gift").hidden = false;
    }, 3000);
}

/* ---------------------------------------------------------------------
   Vykreslování
   --------------------------------------------------------------------- */
function drawSprite(spr, x, y, yOffset = 0) {
    ctx.drawImage(sprCache[spr], x * CELL, y * CELL + yOffset);
}

function drawRotatedSprite(spr, x, y, dir) {
    const angles = { right: 0, down: Math.PI / 2, left: Math.PI, up: -Math.PI / 2 };
    ctx.save();
    ctx.translate(x * CELL + CELL / 2, y * CELL + CELL / 2);
    ctx.rotate(angles[dir]);
    if (dir === "left") ctx.scale(1, -1); // ať lokomotiva nejede vzhůru nohama
    ctx.drawImage(sprCache[spr], -CELL / 2, -CELL / 2);
    ctx.restore();
}

function drawLevel(now) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // zdi
    for (const k of state.walls) {
        const [x, y] = k.split(",").map(Number);
        ctx.drawImage(wallTile, x * CELL, y * CELL);
    }

    // vrátka
    const blink = Math.floor(now / 250) % 2 === 0;
    const gTile = state.gateOpen ? (blink ? gateOpenA : gateOpenB) : gateClosedTile;
    ctx.drawImage(gTile, state.gate.x * CELL, state.gate.y * CELL);

    // náklad (jemné poblikávání)
    for (const [k, kind] of state.items) {
        const [x, y] = k.split(",").map(Number);
        const bob = Math.floor(now / 400 + x + y) % 2 === 0 ? 0 : -1;
        drawSprite(kind, x, y, bob);
    }

    // vlak — lokomotiva + vagóny s nákladem
    state.body.forEach((seg, i) => {
        if (i === 0) {
            drawRotatedSprite("loco", seg.x, seg.y, state.dir);
        } else {
            drawSprite("wagon", seg.x, seg.y);
            const kind = state.cargo[i - 1];
            if (kind) drawSprite(kind, seg.x, seg.y, -4);
        }
    });

    // letící ježek
    if (state.bullet) drawSprite("shot", state.bullet.x, state.bullet.y);

    // blikání při nárazu
    if (state.mode === "crash" && Math.floor(now / 120) % 2 === 0) {
        ctx.fillStyle = "rgba(255,85,85,0.35)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        dosText("BUM!", canvas.width / 2, canvas.height / 2, 44, PAL.y, true);
    }

    if (state.mode === "ready" && blink) {
        dosText("STISKNI ŠIPKU A VYJEĎ!", canvas.width / 2, canvas.height - 10, 18, PAL.c, true);
    }
}

function dosText(text, x, y, size, color, outline = false) {
    ctx.font = `${size}px 'VT323', monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    if (outline) {
        ctx.fillStyle = "#000";
        ctx.fillText(text, x + 2, y + 2);
    }
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
}

function drawTitle(now) {
    ctx.fillStyle = PAL.B;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = PAL.c;
    ctx.strokeRect(6.5, 6.5, canvas.width - 13, canvas.height - 13);

    dosText("V L A K", canvas.width / 2, 52, 64, PAL.w, true);
    dosText("4 0", canvas.width / 2, 104, 52, PAL.y, true);

    TEXTS.titleLines.forEach((line, i) => {
        dosText(line, canvas.width / 2, 150 + i * 22, 19, PAL.c);
    });
    dosText(TEXTS.credit, canvas.width / 2, 218, 16, PAL.L);

    // lokomotiva jezdí po spodku obrazovky
    const tx = ((now / 18) % (canvas.width + 60)) - 30;
    ctx.drawImage(sprCache.loco, tx, canvas.height - 42);
    ctx.drawImage(sprCache.wagon, tx - 26, canvas.height - 42);
    ctx.drawImage(sprCache.d, tx - 26, canvas.height - 46);

    if (Math.floor(now / 500) % 2 === 0) {
        dosText("— STISKNI ENTER NEBO ŤUKNI —", canvas.width / 2, 244, 19, PAL.w);
    }
    dosText("H = TAJNÉ HESLO", canvas.width / 2, 268, 16, PAL.c);
}

function drawIntro(now) {
    const lvl = LEVELS[state.levelIndex];
    ctx.fillStyle = PAL.B;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = PAL.c;
    ctx.strokeRect(6.5, 6.5, canvas.width - 13, canvas.height - 13);

    dosText(lvl.name, canvas.width / 2, 56, 34, PAL.y, true);
    lvl.msg.forEach((line, i) => {
        dosText(line, canvas.width / 2, 110 + i * 26, 21, PAL.w);
    });
    if (Math.floor(now / 500) % 2 === 0) {
        dosText("— POKRAČUJ ENTEREM NEBO ŤUKNUTÍM —", canvas.width / 2, 226, 18, PAL.c);
    }
    dosText(`TAJNÉ HESLO: ${lvl.pass}`, canvas.width / 2, 262, 17, PAL.L);
}

function drawWin(now) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // konfety
    for (const p of state.confetti) {
        p.y += p.vy;
        p.x += p.vx;
        if (p.y > canvas.height) { p.y = -6; p.x = Math.random() * canvas.width; }
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 4, 4);
    }

    dosText(TEXTS.winTitle, canvas.width / 2, 46, 34, PAL.y, true);
    TEXTS.winLines.forEach((line, i) => {
        dosText(line, canvas.width / 2, 90 + i * 24, 20, i % 2 ? PAL.c : PAL.w);
    });

    // vláček s dortem projíždí
    const tx = ((now / 15) % (canvas.width + 140)) - 70;
    ctx.drawImage(sprCache.loco, tx, canvas.height - 34);
    for (let i = 0; i < 3; i++) {
        ctx.drawImage(sprCache.wagon, tx - 26 * (i + 1), canvas.height - 34);
        ctx.drawImage(sprCache[["c", "d", "b"][i]], tx - 26 * (i + 1), canvas.height - 38);
    }
}

function spawnConfetti() {
    state.confetti = Array.from({ length: 80 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: 0.5 + Math.random() * 1.4,
        color: [PAL.y, PAL.c, PAL.r, PAL.g, PAL.m, PAL.w][Math.floor(Math.random() * 6)],
    }));
}

/* ---------------------------------------------------------------------
   Hlavní smyčka
   --------------------------------------------------------------------- */
function frame(now) {
    const lvl = LEVELS[state.levelIndex];

    switch (state.mode) {
        case "title": drawTitle(now); break;
        case "intro": drawIntro(now); break;
        case "ready": drawLevel(now); break;
        case "play":
            if (!passDialog.hidden) {
                // při otevřeném dialogu s heslem hra stojí
                state.lastStep = now;
                drawLevel(now);
                break;
            }
            if (now - state.lastStep >= lvl.speed) {
                state.lastStep = now;
                step();
            }
            if (state.bullet && now - state.bulletLast >= 70) {
                state.bulletLast = now;
                stepBullet();
            }
            drawLevel(now);
            break;
        case "crash":
            drawLevel(now);
            if (now - state.crashAt > 1200) restartLevel();
            break;
        case "win": drawWin(now); break;
    }
    requestAnimationFrame(frame);
}

/* ---------------------------------------------------------------------
   Ovládání
   --------------------------------------------------------------------- */
function confirmAction() {
    ensureAudio();
    if (state.mode === "title") {
        state.mode = "intro";
        loadLevel(0);
    } else if (state.mode === "intro") {
        loadLevel(state.levelIndex);
        state.mode = "ready";
    }
}

const KEY_DIRS = {
    ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
    w: "up", s: "down", a: "left", d: "right",
    W: "up", S: "down", A: "left", D: "right",
};

document.addEventListener("keydown", (e) => {
    // při psaní hesla nechat klávesy na pokoji
    if (!passDialog.hidden) return;

    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
    }
    ensureAudio();

    // dokud je vidět uvítací obrazovka, klávesy jen přeskakují boot
    if (!welcomeEl.classList.contains("hide")) {
        bootSkipped = true;
        return;
    }

    if (e.key === " ") {
        if (state.mode === "play") return shoot();
        return confirmAction();
    }
    if (e.key === "Enter") return confirmAction();

    // H = zadání tajného hesla (jako v původním Vlaku)
    if ((e.key === "h" || e.key === "H") && state.mode !== "play") {
        e.preventDefault(); // ať se "h" nevepíše do právě otevřeného inputu
        return openPassDialog();
    }

    const dir = KEY_DIRS[e.key];
    if (dir) {
        if (state.mode === "title" || state.mode === "intro") return confirmAction();
        setDirection(dir);
    }
});

/* dotyk: ťuknutí = potvrzení, přejetí = směr */
let touchStart = null;
canvas.addEventListener("touchstart", (e) => {
    ensureAudio();
    const t = e.changedTouches[0];
    touchStart = { x: t.clientX, y: t.clientY };
    e.preventDefault();
}, { passive: false });

canvas.addEventListener("touchend", (e) => {
    if (!touchStart) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.x;
    const dy = t.clientY - touchStart.y;
    touchStart = null;
    e.preventDefault();

    if (Math.abs(dx) < 24 && Math.abs(dy) < 24) {
        if (state.mode === "play") return shoot();
        return confirmAction();
    }
    const dir = Math.abs(dx) > Math.abs(dy)
        ? (dx > 0 ? "right" : "left")
        : (dy > 0 ? "down" : "up");
    if (state.mode === "title" || state.mode === "intro") return confirmAction();
    setDirection(dir);
}, { passive: false });

canvas.addEventListener("click", () => {
    ensureAudio();
    if (state.mode === "play") return shoot();
    confirmAction();
});

/* d-pad tlačítka na mobilu */
document.querySelectorAll("#dpad button").forEach((btn) => {
    const handler = (e) => {
        e.preventDefault();
        ensureAudio();
        if (btn.dataset.action === "shoot") return shoot();
        if (state.mode === "title" || state.mode === "intro") return confirmAction();
        setDirection(btn.dataset.dir);
    };
    btn.addEventListener("touchstart", handler, { passive: false });
    btn.addEventListener("mousedown", handler);
});

/* ---------------------------------------------------------------------
   Kontrola map (jen do konzole, pro vývoj)
   --------------------------------------------------------------------- */
LEVELS.forEach((lvl, i) => {
    if (lvl.map.length !== ROWS) console.error(`Level ${i + 1}: špatný počet řádků`);
    lvl.map.forEach((row, y) => {
        if (row.length !== COLS) console.error(`Level ${i + 1}, řádek ${y}: délka ${row.length}, má být ${COLS}`);
    });
    if (!lvl.map.some(r => r.includes("T"))) console.error(`Level ${i + 1}: chybí start T`);
    if (!lvl.map.some(r => r.includes("G"))) console.error(`Level ${i + 1}: chybí vrátka G`);
});

/* ---------------------------------------------------------------------
   Stažení dárku — vynucené uložení souboru (žádné přehrání v prohlížeči)
   --------------------------------------------------------------------- */
function triggerDownload(href) {
    const a = document.createElement("a");
    a.href = href;
    a.download = "vsenej.mp3";
    document.body.appendChild(a);
    a.click();
    a.remove();
}

document.getElementById("gift-link").addEventListener("click", async (e) => {
    e.preventDefault();
    const url = e.currentTarget.href;

    // 1) dárek přibalený v assets/darek-data.js — funguje i při otevření ze souboru
    if (window.DAREK_B64) {
        const bytes = Uint8Array.from(atob(window.DAREK_B64), (c) => c.charCodeAt(0));
        const objUrl = URL.createObjectURL(new Blob([bytes], { type: "application/octet-stream" }));
        triggerDownload(objUrl);
        setTimeout(() => URL.revokeObjectURL(objUrl), 10000);
        return;
    }

    // 2) hostovaný web: stáhnout přes fetch jako soubor, ne přehrát
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("soubor nenalezen");
        const blob = await res.blob();
        // application/octet-stream = prohlížeč soubor uloží, nepustí ho v přehrávači
        const objUrl = URL.createObjectURL(new Blob([blob], { type: "application/octet-stream" }));
        triggerDownload(objUrl);
        setTimeout(() => URL.revokeObjectURL(objUrl), 10000);
    } catch {
        // nouzová cesta: klasický odkaz se stažením
        triggerDownload(url);
    }
});

/* ---------------------------------------------------------------------
   Tajná hesla — přepínání levelů jako v původním Vlaku
   --------------------------------------------------------------------- */
const passDialog = document.getElementById("pass-dialog");
const passInput = document.getElementById("pass-input");
const passError = document.getElementById("pass-error");

function normalizePass(s) {
    // bez diakritiky, velikosti písmen a přebytečných mezer
    return s.normalize("NFD").replace(/[̀-ͯ]/g, "")
        .toUpperCase().replace(/\s+/g, " ").trim();
}

function openPassDialog() {
    ensureAudio();
    passDialog.hidden = false;
    passError.textContent = "";
    passInput.value = "";
    passInput.focus();
}

function closePassDialog() {
    passDialog.hidden = true;
    passInput.blur();
}

function submitPass() {
    const idx = LEVELS.findIndex((l) => normalizePass(l.pass) === normalizePass(passInput.value));
    if (idx === -1) {
        passError.textContent = "ŠPATNÉ HESLO! Takový prd systém nezná.";
        sfx.crash();
        passInput.select();
        return;
    }
    closePassDialog();
    sfx.gate();
    loadLevel(idx);
    state.mode = "intro";
}

document.getElementById("pass-ok").addEventListener("click", submitPass);
document.getElementById("pass-cancel").addEventListener("click", closePassDialog);
document.getElementById("btn-pass").addEventListener("click", openPassDialog);
passInput.addEventListener("keydown", (e) => {
    e.stopPropagation();
    if (e.key === "Enter") submitPass();
    if (e.key === "Escape") closePassDialog();
});

/* ---------------------------------------------------------------------
   Uvítací obrazovka — fake DOS boot + kontrola věku
   --------------------------------------------------------------------- */
// ✏️ TEXTY K ÚPRAVĚ — bootovací hlášky:
const BOOT_LINES = [
    "VLAK40.EXE — narozeninový systém v4.0",
    "─────────────────────────────────────",
    "Kontrola paměti .......... 40 LET OK",
    "Kontrola kolen ........... VRŽOU (ignoruji)",
    "Počet šedin .............. PŘEPOČÍTÁVÁM...",
    "Tatínkovské vtipy ........ KRITICKÁ ÚROVEŇ",
    "Řidičské umění ........... JAKO TOMMY ANGELO",
    "Nálada k oslavě .......... 100 %",
    "",
    "Systém připraven.",
];

// ✏️ TEXTY K ÚPRAVĚ — hlášky, když zapírá věk:
const DENY_MSGS = [
    "CHYBA 40: Rodný list tvrdí něco jiného.",
    "Detekován zvuk vrzajících kolen. Zkus to znovu.",
    "I ježci z Wacky Wheels vědí, že ti je 40.",
    "Don Salieri ti vzkazuje, ať mluvíš pravdu.",
    "No tak. 39 + 1 = ?",
];

const welcomeEl = document.getElementById("welcome");
const bootEl = document.getElementById("boot-lines");
const questionEl = document.getElementById("welcome-question");
const bootSkipEl = document.getElementById("boot-skip");
let bootSkipped = false;
let denyCount = 0;

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function runBoot() {
    for (const line of BOOT_LINES) {
        if (bootSkipped) break;
        for (const ch of line) {
            if (bootSkipped) break;
            bootEl.textContent += ch;
            if (ch !== " " && ch !== ".") beep(1200, 0.008, 0, "square", 0.02);
            await wait(14);
        }
        bootEl.textContent += "\n";
        await wait(120);
    }
    if (bootSkipped) bootEl.textContent = BOOT_LINES.join("\n") + "\n";
    bootSkipEl.hidden = true;
    questionEl.hidden = false;
}

welcomeEl.addEventListener("click", (e) => {
    ensureAudio();
    if (!questionEl.hidden || e.target.closest("button")) return;
    bootSkipped = true;
});

document.getElementById("btn-deny").addEventListener("click", (e) => {
    ensureAudio();
    beep(150, 0.2, 0, "sawtooth", 0.15);
    document.getElementById("deny-msg").textContent = DENY_MSGS[denyCount % DENY_MSGS.length];
    denyCount++;
    // tlačítko se s každým zapřením zmenšuje, až zmizí úplně
    const scale = Math.max(0, 1 - denyCount * 0.2);
    e.target.style.transform = `scale(${scale})`;
    if (scale === 0) e.target.style.display = "none";
});

document.getElementById("btn-accept").addEventListener("click", () => {
    ensureAudio();
    sfx.gate();
    welcomeEl.classList.add("hide");
});

/* ---------------------------------------------------------------------
   Start
   --------------------------------------------------------------------- */
runBoot();
requestAnimationFrame(frame);
