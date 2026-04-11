/* ═══════════════════════════════════════════════════════════════════════
   THE CHOMSKY HIERARCHY — APPLICATION LOGIC
   ═══════════════════════════════════════════════════════════════════════
   Architecture:
     DATA_CONFIG  — Theoretical data for each grammar class (Type 0-3)
     EXAMPLES     — 14 canonical language examples with evaluators
     State        — Single source of truth
     ThemeManager — Light/dark theme toggle with localStorage persistence
     DiagramRenderer — Canvas concentric-ring diagram
     UIController — DOM updates, events, decidability grid rendering
   ═══════════════════════════════════════════════════════════════════════ */

"use strict";

/* ─────────────────────────────────────────────────────────────────────
   1.  DATA_CONFIG
   ───────────────────────────────────────────────────────────────────── */
const DATA_CONFIG = [
  {
    type: 3,
    name: "Type 3 — Regular Languages",
    shortName: "Regular",
    automaton: "Finite State Automaton (DFA / NFA)",
    automatonProps: "Finite set of states Q, input alphabet Σ, transition function δ: Q×Σ→Q. No auxiliary memory. Reads input left-to-right in O(n) time.",
    production: "A → aB  or  A → a  (right-linear)\nA → Ba  or  A → a  (left-linear)",
    formalGrammar: "G = ({S, A}, Σ, P, S)\nA → aB | a  (right-linear)\nA → Ba | a  (left-linear)",
    description:
      "Languages definable by regular expressions. Recognised by finite automata with no auxiliary memory beyond a fixed number of states. Closed under union, intersection, complement, concatenation, and Kleene star. Cannot maintain unbounded counting.",
    exampleLabel: "L = a*b*",
    exampleDescription: "Any number of a's followed by any number of b's",
    note: "Every regular language is also context-free, context-sensitive, and recursively enumerable. Equivalent representations: regex, DFA, NFA, right-linear grammar.",
    color: "var(--t3)",
    decidability: {
      membership:   { answer: "Yes", detail: "O(n)" },
      emptiness:    { answer: "Yes", detail: "" },
      equivalence:  { answer: "Yes", detail: "" },
      complement:   { answer: "Yes", detail: "closed" },
      intersection: { answer: "Yes", detail: "closed" },
      infiniteness: { answer: "Yes", detail: "" },
    },
  },
  {
    type: 2,
    name: "Type 2 — Context-Free Languages",
    shortName: "Context-Free",
    automaton: "Pushdown Automaton (PDA)",
    automatonProps: "Finite automaton augmented with an unbounded stack Γ. Transitions may push/pop stack symbols. Handles nested structures.",
    production: "A → γ   (left side is exactly one non-terminal)\nwhere A ∈ V, γ ∈ (V∪Σ)*",
    formalGrammar: "G = ({S}, Σ, P, S)\nA → γ\nwhere A ∈ V, γ ∈ (V∪Σ)*",
    description:
      "Every production rewrites a single non-terminal regardless of surrounding context. Form the backbone of programming-language syntax (LL/LR parsers). Specified in BNF or EBNF notation.",
    exampleLabel: "L = { aⁿbⁿ | n ≥ 1 }",
    exampleDescription: "Equal a's then b's (≥ 1 each)",
    note: "The CFL pumping lemma proves { aⁿbⁿcⁿ } is NOT context-free. CFLs are parsable by CYK in O(n³) or Earley parsers.",
    color: "var(--t2)",
    decidability: {
      membership:   { answer: "Yes", detail: "O(n³) CYK" },
      emptiness:    { answer: "Yes", detail: "" },
      equivalence:  { answer: "No", detail: "undecidable" },
      complement:   { answer: "No", detail: "not closed" },
      intersection: { answer: "No", detail: "not closed" },
      infiniteness: { answer: "Yes", detail: "" },
    },
  },
  {
    type: 1,
    name: "Type 1 — Context-Sensitive Languages",
    shortName: "Context-Sensitive",
    automaton: "Linear Bounded Automaton (LBA)",
    automatonProps: "Turing Machine restricted to tape proportional to input: O(n) space. Decidable membership.",
    production: "αAβ → αγβ   (|LHS| ≤ |RHS|)\nwhere A ∈ V, α,β ∈ (V∪Σ)*, γ ∈ (V∪Σ)⁺",
    formalGrammar: "G = ({S, B, C}, Σ, P, S)\nαAβ → αγβ\nwhere A ∈ V, α,β ∈ (V∪Σ)*, γ ∈ (V∪Σ)⁺",
    description:
      "Productions whose application depends on surrounding symbols. The right-hand side is at least as long as the left, so the working string never shrinks during derivation.",
    exampleLabel: "L = { aⁿbⁿcⁿ | n ≥ 1 }",
    exampleDescription: "Equal a's, b's, c's in order (≥ 1 each)",
    note: "Three-way counting cannot be done with a single stack. CSL membership is decidable but PSPACE-complete.",
    color: "var(--t1)",
    decidability: {
      membership:   { answer: "Yes", detail: "PSPACE" },
      emptiness:    { answer: "No", detail: "undecidable" },
      equivalence:  { answer: "No", detail: "undecidable" },
      complement:   { answer: "Yes", detail: "closed" },
      intersection: { answer: "Yes", detail: "closed" },
      infiniteness: { answer: "No", detail: "undecidable" },
    },
  },
  {
    type: 0,
    name: "Type 0 — Recursively Enumerable Languages",
    shortName: "Rec. Enumerable",
    automaton: "Turing Machine (TM)",
    automatonProps: "Infinite read/write tape, full transitions. Most powerful computational model. Some languages undecidable (halting problem).",
    production: "α → β   (α contains ≥ 1 non-terminal)\nNo restriction on |α| vs |β|",
    formalGrammar: "G = (V, Σ, P, S)\nα → β\nwhere |α| ≥ 1, α contains ≥ 1 non-terminal",
    description:
      "The most general class — any grammar with at least one non-terminal on the left. A TM halts and accepts if input ∈ L, but may loop forever otherwise. Membership is semi-decidable.",
    exampleLabel: "L = Σ* (all strings)",
    exampleDescription: "All strings over the alphabet",
    note: "RE languages are closed under union and intersection but NOT under complement. The complement of RE is co-RE.",
    color: "var(--t0)",
    decidability: {
      membership:   { answer: "Semi", detail: "semi-decidable" },
      emptiness:    { answer: "No", detail: "undecidable" },
      equivalence:  { answer: "No", detail: "undecidable" },
      complement:   { answer: "No", detail: "not closed" },
      intersection: { answer: "Yes", detail: "closed" },
      infiniteness: { answer: "No", detail: "undecidable" },
    },
  },
];


/* ─────────────────────────────────────────────────────────────────────
   2.  EXAMPLES — 14 canonical language examples with evaluators
   ───────────────────────────────────────────────────────────────────── */
const EXAMPLES = [
  // TYPE 3
  {
    id:"t3_astarbstar", type:3,
    name:"L = a*b*",
    desc:"Any number of a's followed by b's.",
    grammar:["G = ({S}, {a,b}, P, S)","P: S → aS | bA | ε","   A → bA | ε"],
    notation:"L = a*b* = { ε, a, b, aa, ab, bb, … }",
    inStrings:["","aaa","bbb","aaabbb","ab"],
    outStrings:["ba","abab","bab"],
    proof:"Right-linear grammar. Regex: /^a*b*$/. DFA: 2 states.",
    evaluate(s){ const ok=/^a*b*$/.test(s); return{accepted:ok, explanation:ok?`"${s||"ε"}" matches a*b*.`:`"${s}" does NOT match a*b*.`}; }
  },
  {
    id:"t3_astar", type:3,
    name:"L = a*",
    desc:"Zero or more a's — simplest non-trivial regular language.",
    grammar:["G = ({S}, {a}, P, S)","P: S → aS | ε"],
    notation:"L = { ε, a, aa, aaa, … }",
    inStrings:["","a","aa","aaa"],
    outStrings:["b","ab","ba"],
    proof:"DFA: one accepting start state with δ(q₀,a)=q₀.",
    evaluate(s){ const ok=/^a*$/.test(s); return{accepted:ok, explanation:ok?`"${s||"ε"}" ∈ a*.`:`"${s}" ∉ a*.`}; }
  },
  {
    id:"t3_abstar", type:3,
    name:"L = (ab)*",
    desc:"Concatenations of 'ab' pairs. Includes ε.",
    grammar:["G = ({S, A}, {a,b}, P, S)","P: S → aA | ε","   A → bS"],
    notation:"L = { ε, ab, abab, … }",
    inStrings:["","ab","abab","ababab"],
    outStrings:["a","b","aba","ba"],
    proof:"DFA: 3 states — q₀(start/accept), q₁(saw a), q₂(dead).",
    evaluate(s){ const ok=/^(ab)*$/.test(s); return{accepted:ok, explanation:ok?`"${s||"ε"}" ∈ (ab)*.`:`"${s}" ∉ (ab)*.`}; }
  },
  {
    id:"t3_endsa", type:3,
    name:"Strings ending in 'a' over {a,b}",
    desc:"All strings over {a,b} ending with 'a'.",
    grammar:["G = ({S}, {a,b}, P, S)","P: S → aS | bS | a"],
    notation:"L = (a|b)*a",
    inStrings:["a","ba","bba","abba"],
    outStrings:["","b","ab","bb"],
    proof:"DFA: 2 states — q₀(non-final), q₁(final, last was a).",
    evaluate(s){ const ok=s.length>0&&/^[ab]*a$/.test(s); return{accepted:ok, explanation:ok?`"${s}" ends in 'a'.`:`"${s||"ε"}" does not end in 'a'.`}; }
  },
  {
    id:"t3_evena", type:3,
    name:"Even number of a's over {a,b}",
    desc:"Strings with even count of a's (0,2,4…). Tracks parity via finite state.",
    grammar:["G = ({S, A}, {a,b}, P, S)","P: S → bS | aA | ε","   A → bA | aS"],
    notation:"L counts a's mod 2 = 0",
    inStrings:["","aa","bb","babb","aabb"],
    outStrings:["a","aab","ba"],
    proof:"2-state DFA: q₀=even (accept), q₁=odd. δ(qᵢ,a)=q₁₋ᵢ, δ(qᵢ,b)=qᵢ.",
    evaluate(s){
      if(!/^[ab]*$/.test(s)) return{accepted:false, explanation:`"${s}" — invalid alphabet.`};
      const c=(s.match(/a/g)||[]).length, ok=c%2===0;
      return{accepted:ok, explanation:ok?`"${s||"ε"}" has ${c} a's (even).`:`"${s}" has ${c} a's (odd).`};
    }
  },
  {
    id:"t3_binary3", type:3,
    name:"Binary strings divisible by 3",
    desc:"Binary numbers over {0,1} whose value mod 3 = 0.",
    grammar:["DFA: 3 states (remainders 0,1,2)","δ(q,0)=2q mod 3, δ(q,1)=(2q+1) mod 3"],
    notation:"L = { ε, 0, 11, 110, 1001, … }",
    inStrings:["","0","11","110","1001"],
    outStrings:["1","10","100","111"],
    proof:"States = value mod 3. q₀ is start and sole accept state.",
    evaluate(s){
      if(s===""||s==="ε") return{accepted:true, explanation:"ε represents 0, divisible by 3."};
      if(!/^[01]+$/.test(s)) return{accepted:false, explanation:`"${s}" — alphabet must be {0,1}.`};
      const v=parseInt(s,2), ok=v%3===0;
      return{accepted:ok, explanation:ok?`${s}₂ = ${v}₁₀, divisible by 3.`:`${s}₂ = ${v}₁₀, ${v} mod 3 = ${v%3}.`};
    }
  },

  // TYPE 2
  {
    id:"t2_anbn", type:2,
    name:"L = { aⁿbⁿ | n ≥ 1 }",
    desc:"Equal a's then b's. Canonical CFL — NOT regular (pumping lemma).",
    grammar:["G = ({S}, {a,b}, P, S)","P: S → aSb | ab"],
    notation:"L = { ab, aabb, aaabbb, … }",
    inStrings:["ab","aabb","aaabbb"],
    outStrings:["a","b","abb","aab","ba"],
    proof:"PDA pushes a's, pops on b's. Pumping lemma: pump aⁿbⁿ → unequal counts.",
    evaluate(s){
      if(!s) return{accepted:false, explanation:"ε ∉ L — n ≥ 1."};
      let st=0,sb=false;
      for(const c of s){
        if(c==="a"){if(sb)return{accepted:false,explanation:"'a' after 'b'."};st++;}
        else if(c==="b"){sb=true;if(!st)return{accepted:false,explanation:"More b's than a's."};st--;}
        else return{accepted:false,explanation:`'${c}' not in {a,b}.`};
      }
      if(st)return{accepted:false,explanation:`${st} unmatched a's.`};
      return{accepted:true,explanation:`PDA: ${s.length/2} a's matched ${s.length/2} b's.`};
    }
  },
  {
    id:"t2_balanced", type:2,
    name:"Balanced parentheses",
    desc:"All balanced () sequences — Dyck language D₁.",
    grammar:["G = ({S}, {(,)}, P, S)","P: S → SS | (S) | ε"],
    notation:"Dyck language D₁",
    inStrings:["","()","(())","()()","((()))"],
    outStrings:["(",")",")(","(()"],
    proof:"PDA: push (, pop ). Non-regular by pumping lemma.",
    evaluate(s){
      let c=0;
      for(let i=0;i<s.length;i++){
        if(s[i]==="(")c++;
        else if(s[i]===")"){c--;if(c<0)return{accepted:false,explanation:`Unmatched ')' at ${i}.`};}
        else return{accepted:false,explanation:`'${s[i]}' not in {(,)}.`};
      }
      return c?{accepted:false,explanation:`${c} unmatched '('.`}:{accepted:true,explanation:"All parentheses balanced."};
    }
  },
  {
    id:"t2_palindrome", type:2,
    name:"Palindromes over {a,b}",
    desc:"Strings equal to their reversal (w = wᴿ).",
    grammar:["G = ({S}, {a,b}, P, S)","P: S → aSa | bSb | a | b | ε"],
    notation:"L = { w ∈ {a,b}* | w = wᴿ }",
    inStrings:["","a","b","aba","baab","aabaa"],
    outStrings:["ab","ba","aab","bba"],
    proof:"PDA pushes first half, pops/matches second. Not regular.",
    evaluate(s){
      if(!/^[ab]*$/.test(s))return{accepted:false,explanation:`"${s}" — invalid alphabet.`};
      const r=s.split("").reverse().join(""), ok=s===r;
      return{accepted:ok, explanation:ok?`"${s||"ε"}" is a palindrome.`:`"${s}" ≠ "${r}".`};
    }
  },
  {
    id:"t2_anbbm", type:2,
    name:"L = { aⁿbᵐ | n,m ≥ 1 }",
    desc:"a⁺b⁺ — also regular! Shown as CFG for comparison.",
    grammar:["G = ({S,A,B}, {a,b}, P, S)","P: S → AB","   A → aA | a","   B → bB | b"],
    notation:"a⁺b⁺ (also regular)",
    inStrings:["ab","aab","abb","aaabbb"],
    outStrings:["a","b","ba",""],
    proof:"Also regular: regex a⁺b⁺.",
    evaluate(s){ const ok=/^a+b+$/.test(s); return{accepted:ok, explanation:ok?`"${s}" ∈ a⁺b⁺.`:`"${s||"ε"}" ∉ a⁺b⁺.`}; }
  },

  // TYPE 1
  {
    id:"t1_anbncn", type:1,
    name:"L = { aⁿbⁿcⁿ | n ≥ 1 }",
    desc:"Equal a's, b's, c's in order. Canonical CSL — non-context-free.",
    grammar:["G = ({S,B,C}, {a,b,c}, P, S)","P: S → aSBC | aBC","   CB → BC","   aB → ab, bB → bb","   bC → bc, cC → cc"],
    notation:"L = { abc, aabbcc, aaabbbccc, … }",
    inStrings:["abc","aabbcc","aaabbbccc"],
    outStrings:["ab","bc","abbc","aabbc","abcc"],
    proof:"Pump w=aⁿbⁿcⁿ: any split |vxy|≤n misses ≥1 symbol type. CSG: CB→BC.",
    evaluate(s){
      if(!s)return{accepted:false,explanation:"ε ∉ L."};
      let i=0,a=0,b=0,c=0;
      while(i<s.length&&s[i]==="a"){a++;i++;}
      while(i<s.length&&s[i]==="b"){b++;i++;}
      while(i<s.length&&s[i]==="c"){c++;i++;}
      if(i!==s.length)return{accepted:false,explanation:`Unexpected '${s[i]}' at ${i}.`};
      if(!a||!b||!c)return{accepted:false,explanation:`Need ≥1 each: a×${a}, b×${b}, c×${c}.`};
      return a===b&&b===c?{accepted:true,explanation:`${a}a, ${b}b, ${c}c — all equal.`}:{accepted:false,explanation:`Unequal: a×${a}, b×${b}, c×${c}.`};
    }
  },
  {
    id:"t1_ww", type:1,
    name:"L = { ww | w ∈ {a,b}⁺ }",
    desc:"Exact self-concatenation. Requires LBA to remember first half.",
    grammar:["(Complex CSG / LBA simulation)","Copy & compare with markers"],
    notation:"L = { aa, bb, abab, aabbaabb, … }",
    inStrings:["aa","bb","abab","aabbaabb"],
    outStrings:["a","ab","aba","abba"],
    proof:"Pump (ab)ⁿ(ab)ⁿ → breaks copy structure. LBA marks midpoint.",
    evaluate(s){
      if(!s)return{accepted:false,explanation:"ε ∉ L."};
      if(!/^[ab]+$/.test(s))return{accepted:false,explanation:"Invalid alphabet."};
      if(s.length%2)return{accepted:false,explanation:`Odd length ${s.length}.`};
      const h=s.length/2;
      return s.slice(0,h)===s.slice(h)?{accepted:true,explanation:`"${s.slice(0,h)}"+"${s.slice(h)}" match.`}:{accepted:false,explanation:`"${s.slice(0,h)}" ≠ "${s.slice(h)}".`};
    }
  },
  {
    id:"t1_anbmcndm", type:1,
    name:"L = { aⁿbᵐcⁿdᵐ | n,m ≥ 1 }",
    desc:"Two interleaved counting constraints. Beyond a single stack.",
    grammar:["(CSG)","Key rule: Bc → cB","a's↔c's, b's↔d's"],
    notation:"L = { abcd, aabbccdd, … }",
    inStrings:["abcd","aabbccdd","aabccd"],
    outStrings:["abccd","aabcdd","abdc"],
    proof:"Two counters needed. Not CFL: pumping destroys ≥1 counter.",
    evaluate(s){
      const m=s.match(/^(a+)(b+)(c+)(d+)$/);
      if(!m)return{accepted:false,explanation:`Not of form a⁺b⁺c⁺d⁺.`};
      const[,A,B,C,D]=m;
      return A.length===C.length&&B.length===D.length?{accepted:true,explanation:`a×${A.length}=c×${C.length}, b×${B.length}=d×${D.length}.`}:{accepted:false,explanation:`a×${A.length}≠c×${C.length} or b×${B.length}≠d×${D.length}.`};
    }
  },

  // TYPE 0
  {
    id:"t0_all", type:0,
    name:"Σ* over {a,b}",
    desc:"All strings — trivially RE and also regular.",
    grammar:["G = ({S}, {a,b}, P, S)","P: S → aS | bS | ε"],
    notation:"Σ* = { ε, a, b, aa, ab, … }",
    inStrings:["","a","b","ab","aabb"],
    outStrings:[],
    proof:"TM accepts everything. Also Type-3.",
    evaluate(s){ const ok=/^[ab]*$/.test(s)||!s; return{accepted:ok,explanation:ok?`"${s||"ε"}" ∈ Σ*.`:`"${s}" — invalid alphabet.`}; }
  },
  {
    id:"t0_primelen", type:0,
    name:"Strings of prime length over {a}",
    desc:"L = {aᵖ | p prime}. Decidable TM, not regular or CFL.",
    grammar:["(TM: trial division)","Accept iff |w| is prime"],
    notation:"L = { aa, aaa, aaaaa, aaaaaaa, … }",
    inStrings:["aa","aaa","aaaaa","aaaaaaa"],
    outStrings:["","a","aaaa","aaaaaa"],
    proof:"Pump aᵖ → aᵖ⁺ⁿᵏ, for k=p: p|p+np. TM: O(n²).",
    evaluate(s){
      if(!/^a*$/.test(s))return{accepted:false,explanation:"Alphabet must be {a}."};
      const n=s.length;
      if(n<2)return{accepted:false,explanation:`|w|=${n} < 2.`};
      let p=true;
      for(let i=2;i<=Math.sqrt(n);i++)if(n%i===0){p=false;break;}
      return{accepted:p,explanation:p?`|w|=${n} is prime.`:`|w|=${n} is not prime.`};
    }
  },
];


/* ─────────────────────────────────────────────────────────────────────
   3.  STATE
   ───────────────────────────────────────────────────────────────────── */
const State = {
  selectedType: null,
  hoveredType: null,
  playgroundType: 3,
  selectedExampleId: null,
  testString: "",
};


/* ─────────────────────────────────────────────────────────────────────
   4.  THEME MANAGER
   ───────────────────────────────────────────────────────────────────── */
const ThemeManager = (() => {
  const KEY = "chomsky-theme";
  const root = document.documentElement;

  function init() {
    const saved = localStorage.getItem(KEY);
    const theme = saved || "dark";
    root.setAttribute("data-theme", theme);
    _updateIcon(theme);

    document.getElementById("theme-toggle").addEventListener("click", toggle);
  }

  function toggle() {
    const cur = root.getAttribute("data-theme");
    const next = cur === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem(KEY, next);
    _updateIcon(next);
    // Redraw diagram for theme-aware colours
    if (window.__diagram) window.__diagram.draw();
  }

  function _updateIcon(theme) {
    document.getElementById("theme-icon").textContent = theme === "dark" ? "☀" : "◐";
  }

  return { init };
})();


/* ─────────────────────────────────────────────────────────────────────
   5.  GRAMMAR EVALUATOR
   ───────────────────────────────────────────────────────────────────── */
class GrammarEvaluator {
  static evaluate(exampleId, str) {
    const ex = EXAMPLES.find(e => e.id === exampleId);
    if (!ex) return { accepted: false, explanation: "Unknown language." };
    return ex.evaluate(str);
  }
}


/* ─────────────────────────────────────────────────────────────────────
   6.  DIAGRAM RENDERER
   ───────────────────────────────────────────────────────────────────── */
class DiagramRenderer {
  constructor(canvas, labelsEl) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.labelsEl = labelsEl;

    this.rings = [
      { type:0, label:"Type 0 · RE",       ratio:0.92 },
      { type:1, label:"Type 1 · CSL",      ratio:0.72 },
      { type:2, label:"Type 2 · CFL",      ratio:0.52 },
      { type:3, label:"Type 3 · Regular",   ratio:0.34 },
    ];

    this._resize();
    this._createLabels();
    window.addEventListener("resize", () => { this._resize(); this.draw(); });
    this.canvas.addEventListener("mousemove", e => this._onMouseMove(e));
    this.canvas.addEventListener("mouseleave", () => { State.hoveredType=null; this.draw(); });
    this.canvas.addEventListener("click", e => this._onClick(e));
  }

  /** Get themed ring colour */
  _ringColor(type) {
    const cs = getComputedStyle(document.documentElement);
    return cs.getPropertyValue(`--ring${type}`).trim() || "#888";
  }

  _resize() {
    const r = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = r.width * dpr;
    this.canvas.height = r.height * dpr;
    this.ctx.setTransform(dpr,0,0,dpr,0,0);
    this.w = r.width; this.h = r.height;
    this.cx = this.w/2; this.cy = this.h/2;
    this.maxR = Math.min(this.w, this.h)/2 - 12;
  }

  _createLabels() {
    this.labelsEl.innerHTML = "";
    this.rings.forEach(ring => {
      const el = document.createElement("div");
      el.className = "canvas-label";
      el.textContent = ring.label;
      el.dataset.type = ring.type;
      this.labelsEl.appendChild(el);
    });
  }

  _positionLabels() {
    this.labelsEl.querySelectorAll(".canvas-label").forEach(el => {
      const type = +el.dataset.type;
      const ring = this.rings.find(r=>r.type===type);
      if(!ring) return;
      const rad = ring.ratio * this.maxR;
      el.style.left = `${this.cx}px`;
      el.style.top  = `${this.cy - rad + 14}px`;
      el.style.transform = "translateX(-50%)";
      el.style.color = this._ringColor(type);
      el.classList.toggle("active", State.selectedType===type || State.hoveredType===type);
    });
  }

  draw() {
    const {ctx, cx, cy, maxR, w, h} = this;
    ctx.clearRect(0, 0, w, h);

    this.rings.forEach(ring => {
      const r = ring.ratio * maxR;
      const col = this._ringColor(ring.type);
      const active = State.selectedType === ring.type;
      const hovered = State.hoveredType === ring.type;

      ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2);
      ctx.fillStyle = this._rgba(col, active?0.18:hovered?0.12:0.05);
      ctx.fill();

      ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2);
      ctx.strokeStyle = this._rgba(col, active?0.85:hovered?0.55:0.25);
      ctx.lineWidth = active?2.5:hovered?1.8:1;
      ctx.stroke();

      if(active) {
        ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2);
        ctx.strokeStyle = this._rgba(col, 0.18);
        ctx.lineWidth = 7;
        ctx.stroke();
      }
    });

    // Centre dot
    ctx.beginPath(); ctx.arc(cx,cy,3,0,Math.PI*2);
    ctx.fillStyle = this._ringColor(3);
    ctx.fill();

    // Subset symbols
    ctx.font = "500 11px 'IBM Plex Sans','sans-serif'";
    ctx.textAlign="center"; ctx.textBaseline="middle";
    const isDark = document.documentElement.getAttribute("data-theme")==="dark";
    ctx.fillStyle = isDark ? "rgba(200,200,220,0.3)" : "rgba(80,80,80,0.3)";
    for(let i=0;i<this.rings.length-1;i++){
      const midR = ((this.rings[i].ratio+this.rings[i+1].ratio)/2)*maxR;
      ctx.fillText("⊂", cx+midR, cy);
    }

    this._positionLabels();
  }

  _hitTest(e) {
    const rect = this.canvas.getBoundingClientRect();
    const d = Math.sqrt((e.clientX-rect.left-this.cx)**2 + (e.clientY-rect.top-this.cy)**2);
    for(let i=this.rings.length-1;i>=0;i--) if(d<=this.rings[i].ratio*this.maxR) return this.rings[i].type;
    return null;
  }

  _onMouseMove(e) {
    const hit = this._hitTest(e);
    if(hit!==State.hoveredType){ State.hoveredType=hit; this.canvas.style.cursor=hit!==null?"pointer":"default"; this.draw(); }
  }

  _onClick(e) {
    const hit = this._hitTest(e);
    if(hit!==null){ State.selectedType=hit; UIController.updateInspector(); this.draw(); }
  }

  _rgba(hex, a) {
    if(!hex || hex.startsWith("var")) hex="#888";
    const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
    return `rgba(${r},${g},${b},${a})`;
  }
}


/* ─────────────────────────────────────────────────────────────────────
   7.  UI CONTROLLER
   ───────────────────────────────────────────────────────────────────── */
const UIController = (() => {
  let diagram;
  const $ = s => document.querySelector(s);

  function init() {
    diagram = new DiagramRenderer($("#hierarchy-canvas"), $("#canvas-labels"));
    window.__diagram = diagram;
    diagram.draw();

    // Decidability grid
    _renderDecideGrid();

    // Tabs
    document.querySelectorAll(".tab").forEach(t => {
      t.addEventListener("click", () => _selectTab(+t.dataset.type));
    });

    // Language dropdown
    $("#language-select").addEventListener("change", _onSelectChange);

    // Evaluate
    $("#evaluate-btn").addEventListener("click", _evaluate);
    $("#test-string-input").addEventListener("keydown", e => { if(e.key==="Enter") _evaluate(); });

    _selectTab(State.playgroundType);
  }

  /* Inspector */
  function updateInspector() {
    const type = State.selectedType;
    if(type===null) return;
    const d = DATA_CONFIG.find(x=>x.type===type);
    if(!d) return;

    $("#inspector-placeholder").classList.add("hidden");
    $("#inspector-details").classList.remove("hidden");

    const badge = $("#inspector-type-badge");
    badge.textContent = `Type ${type}`;

    const cs = getComputedStyle(document.documentElement);
    const typeColor = cs.getPropertyValue(`--t${type}`).trim();
    badge.style.background = `color-mix(in srgb, ${typeColor} 15%, transparent)`;
    badge.style.color = typeColor;

    $("#detail-name-value").textContent = d.name;
    $("#detail-name-value").style.color = typeColor;
    $("#detail-name").style.borderLeft = `3px solid ${typeColor}`;
    $("#detail-name").style.paddingLeft = "0.8rem";
    $("#detail-automaton-value").textContent = d.automaton;
    $("#detail-automaton-props").textContent = d.automatonProps;
    $("#detail-production-value").textContent = d.production;
    $("#detail-description-value").textContent = d.description;
    $("#detail-grammar-value").textContent = d.formalGrammar;
    $("#detail-example-value").textContent = `${d.exampleLabel}  —  ${d.exampleDescription}`;
    $("#detail-note-value").textContent = d.note;
  }

  /* Decidability Grid (§4) */
  function _renderDecideGrid() {
    const questions = [
      { key:"membership",   label:"Membership: w ∈ L(G)?" },
      { key:"emptiness",    label:"Emptiness: L(G) = ∅?" },
      { key:"equivalence",  label:"Equivalence: L(G₁) = L(G₂)?" },
      { key:"complement",   label:"Complement closed?" },
      { key:"intersection", label:"Intersection closed?" },
      { key:"infiniteness", label:"Infiniteness: |L(G)| = ∞?" },
    ];
    const types = [3,2,1,0];
    const typeLabels = {3:"Type-3", 2:"Type-2", 1:"Type-1", 0:"Type-0"};

    const grid = $("#decide-grid");
    grid.innerHTML = "";

    questions.forEach(q => {
      const card = document.createElement("div");
      card.className = "decide-card";
      let html = `<div class="decide-q">${q.label}</div>`;
      types.forEach(t => {
        const d = DATA_CONFIG.find(x=>x.type===t);
        const v = d.decidability[q.key];
        const cls = v.answer==="Yes"?"yes":v.answer==="No"?"no":"semi";
        const text = v.detail ? `${v.answer} — ${v.detail}` : v.answer;
        html += `<div class="decide-row"><span class="decide-type">${typeLabels[t]}</span><span class="decide-ans ${cls}">${text}</span></div>`;
      });
      card.innerHTML = html;
      grid.appendChild(card);
    });
  }

  /* Playground */
  function _selectTab(type) {
    State.playgroundType = type;
    document.querySelectorAll(".tab").forEach(t => {
      t.classList.toggle("active", +t.dataset.type===type);
    });

    const exs = EXAMPLES.filter(e=>e.type===type);
    const sel = $("#language-select");
    sel.innerHTML = "";
    exs.forEach(ex => {
      const o = document.createElement("option");
      o.value = ex.id; o.textContent = ex.name;
      sel.appendChild(o);
    });

    if(exs.length){ State.selectedExampleId=exs[0].id; sel.value=exs[0].id; _loadExample(exs[0]); }
    _hideResult();

    State.selectedType = type;
    updateInspector();
    diagram.draw();
  }

  function _onSelectChange() {
    const id = $("#language-select").value;
    State.selectedExampleId = id;
    const ex = EXAMPLES.find(e=>e.id===id);
    if(ex) _loadExample(ex);
    _hideResult();
  }

  function _loadExample(ex) {
    $("#playground-lang-label").textContent = ex.name;
    $("#playground-lang-desc").textContent = ex.notation;

    const gi = $("#playground-grammar-info");
    gi.classList.remove("hidden");
    $("#playground-grammar-text").textContent = "Grammar:\n" + ex.grammar.join("\n");
    $("#playground-proof-text").textContent = "Proof sketch: " + ex.proof;

    const qe = $("#quick-examples");
    qe.innerHTML = "";
    ex.inStrings.forEach(s => {
      const b = document.createElement("button");
      b.className = "qex in";
      b.textContent = s===""?"ε":`"${s}"`;
      b.title = "In language ✓";
      b.addEventListener("click", () => { $("#test-string-input").value=s; _evaluate(); });
      qe.appendChild(b);
    });
    ex.outStrings.forEach(s => {
      const b = document.createElement("button");
      b.className = "qex out";
      b.textContent = s===""?"ε":`"${s}"`;
      b.title = "Not in language ✗";
      b.addEventListener("click", () => { $("#test-string-input").value=s; _evaluate(); });
      qe.appendChild(b);
    });
  }

  function _evaluate() {
    const str = $("#test-string-input").value;
    State.testString = str;
    if(!State.selectedExampleId) return;
    _showResult(GrammarEvaluator.evaluate(State.selectedExampleId, str));
  }

  function _showResult({accepted, explanation}) {
    const area = $("#result-area");
    area.classList.remove("hidden","accepted","rejected");
    area.classList.add(accepted?"accepted":"rejected");
    $("#result-icon").textContent = accepted?"✓":"✗";
    $("#result-verdict").textContent = accepted?"Accepted":"Rejected";
    $("#result-explanation").textContent = explanation;
  }

  function _hideResult() {
    const area = $("#result-area");
    area.classList.add("hidden");
    area.classList.remove("accepted","rejected");
  }

  return { init, updateInspector };
})();


/* ─────────────────────────────────────────────────────────────────────
   8.  BOOTSTRAP
   ───────────────────────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  ThemeManager.init();
  UIController.init();
});
