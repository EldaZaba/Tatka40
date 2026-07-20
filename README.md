# VLAK 40 🚂

Narozeninový webový remake DOSové hry **VLAK** (M. Němeček, 1993) — dárek k 40. narozeninám.
Hráč projede šest tratí ve stylu hada, posbírá na každé všechen náklad, vyjede otevřenými
vrátky a na konečné stanici odemkne dárek ke stažení.

Celé je to jedna statická stránka bez buildu a bez závislostí — čistý HTML + CSS + JavaScript
s canvasem, pixelovými sprity a DOS/EGA paletou.

## Spuštění

Stačí otevřít `index.html` v prohlížeči. Pro jistotu (kvůli `fetch` na dárek) je lepší
lokální server:

```bash
python -m http.server 8000
# pak http://localhost:8000
```

## Soubory

| Soubor | Co v něm je |
| --- | --- |
| `index.html` | kostra stránky: uvítací obrazovka, HUD, canvas, d-pad, dialog na heslo |
| `styles.css` | DOS/CRT vzhled — modrá paleta, scanlines, font VT323 (Google Fonts) |
| `script.js` | veškerá logika: levely, sprity, herní smyčka, zvuky, ovládání, hesla |
| `assets/vsenej.mp3` | samotný dárek ke stažení |


## Jak se to hraje

Vlak se pořád pohybuje kupředu, hráč jen mění směr — jako had. Náraz do zdi, do zavřených
vrátek nebo do vlastního vlaku znamená restart levelu (jízdy se počítají v HUD).
Vrátka `G` se otevřou až po sebrání posledního kusu nákladu; pak stačí do nich vjet
lokomotivou.

Ovládání: šipky nebo WASD, mezerník vystřelí ježka (z Wacky Wheels) — sestřelený ježek
se připojí jako další vagón. Na mobilu se jezdí přejetím prstu po obrazovce nebo d-padem,
ťuknutí střílí. Klávesa `H` (mimo jízdu) otevře dialog na tajné heslo.

### Tajná hesla

Jako v původním Vlaku se dá přeskočit na libovolný level. Hesla jsou vypsaná dole na
úvodní obrazovce každého levelu a při zadání se ignoruje diakritika i velikost písmen.

## Levely

Mapa každého levelu je pole dvanácti řetězců po dvaceti znacích v poli `LEVELS`
v `script.js`. Znaky:

| Znak | Význam |
| --- | --- |
| `#` | zeď |
| `T` | start vlaku |
| `G` | vrátka (otevřou se po sebrání všeho) |
| mezera | volné políčko |
| `c` `d` `b` `s` | dort, dárek, pivo, svíčka |
| `f` `h` `v` | fedora (Mafia), ježek (Wacky Wheels), srdce |

U každého levelu se dá kromě mapy nastavit `name`, `pass` (tajné heslo), `msg` (hláška
před levelem) a `speed` — prodleva mezi kroky vlaku v milisekundách, takže **nižší číslo
= rychlejší jízda**. Při načtení stránky proběhne kontrola rozměrů map a přítomnosti
`T` a `G`; případné chyby se vypíšou do konzole prohlížeče.

## Kde měnit texty

Místa určená k přepsání jsou v `script.js` označená komentářem `✏️ TEXTY K ÚPRAVĚ`:

- `TEXTS` — úvodní obrazovka, podpis a výherní hlášky
- `msg` u jednotlivých levelů — hláška před každou tratí
- `BOOT_LINES` — hlášky fake DOS bootu na uvítací obrazovce
- `DENY_MSGS` — odpovědi, když si někdo klikne na „Ještě mi NENÍ 40“

## Grafika a zvuk

Sprity jsou v objektu `SPRITES` napsané ručně jako 12×12 znaková mřížka, kde každý znak
odkazuje na barvu z palety `PAL` a tečka znamená průhlednost. Při startu se předrenderují
na dvojnásobek do offscreen canvasů, takže se pak už jen kreslí hotové obrázky.

Zvuk je čistě WebAudio — čtvercová vlna napodobující PC speaker. Výherní fanfára je první
fráze Happy Birthday.

## Poznámka k dárku

Odkaz na dárek se nespoléhá na atribut `download`; kliknutí odchytí JavaScript, soubor
stáhne a podstrčí prohlížeči jako `application/octet-stream`, aby se místo uložení
nepustil rovnou v přehrávači. Stahovaný soubor se přitom pojmenuje `vsenej.mp3` (viz
`triggerDownload` v `script.js`) — pokud má mít jiné jméno, je potřeba ho změnit tam.
