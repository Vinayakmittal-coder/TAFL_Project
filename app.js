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
   8.  SIMULATOR CONFIGURATIONS
   ───────────────────────────────────────────────────────────────────── */
const SIMULATOR_CONFIGS = [
  /* ── Type 3: DFA for a*b* ── */
  {
    type: 3,
    name: "DFA — a*b*",
    label: "DFA · Finite Automaton",
    hint: "No auxiliary memory. Accept in q₀ (empty or only a's) or q₁ (finished reading b's). q₂ = dead state (a found after b).",
    hasStack: false,
    writableTape: false,
    tryValid: ["", "aaa", "bbb", "aabb"],
    tryInvalid: ["ba", "abab"],
    simulate(input) {
      const steps = [];
      const tape = input ? input.split("") : [];
      let state = "q₀";
      steps.push({ state, pos: 0, tape: [...tape], stack: null, workTape: null,
        label: "Initial configuration", desc: "State q₀, tape head at position 0",
        isFinal: false, accepted: null });
      for (let i = 0; i < tape.length; i++) {
        const ch = tape[i];
        const prev = state;
        let desc;
        if (state === "q₀" && ch === "a") { state = "q₀"; desc = "Stay — reading a's"; }
        else if (state === "q₀" && ch === "b") { state = "q₁"; desc = "Transition — start reading b's"; }
        else if (state === "q₁" && ch === "b") { state = "q₁"; desc = "Stay — reading b's"; }
        else if (state === "q₁" && ch === "a") { state = "q₂"; desc = "Dead — a after b not allowed"; }
        else { state = "q₂"; desc = "Dead state"; }
        steps.push({ state, pos: i + 1, tape: [...tape], stack: null, workTape: null,
          label: `δ(${prev}, ${ch}) = ${state}`, desc,
          isFinal: false, accepted: null });
      }
      const accepted = state === "q₀" || state === "q₁";
      steps.push({ state, pos: tape.length, tape: [...tape], stack: null, workTape: null,
        label: accepted ? `${state} ∈ F — ACCEPT` : `${state} ∉ F — REJECT`,
        desc: accepted ? "String accepted ✓" : "String rejected ✗",
        isFinal: true, accepted });
      return steps;
    }
  },

  /* ── Type 2: PDA for aⁿbⁿ ── */
  {
    type: 2,
    name: "PDA — aⁿbⁿ",
    label: "PDA · Pushdown Automaton",
    hint: "Push 'X' for each 'a' read. Pop 'X' for each 'b'. Accept when stack has only bottom marker 'Z' and all input consumed.",
    hasStack: true,
    writableTape: false,
    tryValid: ["ab", "aabb", "aaabbb"],
    tryInvalid: ["a", "abb", "ba"],
    simulate(input) {
      const steps = [];
      const tape = input ? input.split("") : [];
      let state = "q₀";
      let stack = ["Z"];
      let pos = 0;
      let error = false;
      steps.push({ state, pos, tape: [...tape], stack: [...stack], workTape: null,
        label: "Initial configuration", desc: "State q₀, stack = [Z]",
        isFinal: false, accepted: null });
      if (tape.length === 0) {
        steps.push({ state, pos, tape: [...tape], stack: [...stack], workTape: null,
          label: "ε ∉ L — n ≥ 1 required", desc: "Empty string not in language — reject ✗",
          isFinal: true, accepted: false });
        return steps;
      }
      while (pos < tape.length && !error) {
        const ch = tape[pos];
        const stackTop = stack[stack.length - 1];
        if (state === "q₀" && ch === "a") {
          stack.push("X");
          pos++;
          steps.push({ state: "q₀", pos, tape: [...tape], stack: [...stack], workTape: null,
            label: `δ(q₀, ${ch}, ${stackTop}) = (q₀, X${stackTop})`, desc: "Push X — counting a's",
            isFinal: false, accepted: null });
        } else if (state === "q₀" && ch === "b" && stackTop === "X") {
          state = "q₁";
          stack.pop();
          pos++;
          steps.push({ state: "q₁", pos, tape: [...tape], stack: [...stack], workTape: null,
            label: "δ(q₀, b, X) = (q₁, ε)", desc: "Pop X — first b, transition to q₁",
            isFinal: false, accepted: null });
        } else if (state === "q₁" && ch === "b" && stackTop === "X") {
          stack.pop();
          pos++;
          steps.push({ state: "q₁", pos, tape: [...tape], stack: [...stack], workTape: null,
            label: "δ(q₁, b, X) = (q₁, ε)", desc: "Pop X — matching b with a",
            isFinal: false, accepted: null });
        } else {
          error = true;
          let errDesc;
          if (ch === "b" && stackTop === "Z") errDesc = "More b's than a's — stack has only Z";
          else if (state === "q₁" && ch === "a") errDesc = "'a' after 'b' — invalid order";
          else errDesc = `No transition for (${state}, ${ch}, ${stackTop})`;
          steps.push({ state, pos, tape: [...tape], stack: [...stack], workTape: null,
            label: "No valid transition", desc: errDesc + " — reject ✗",
            isFinal: true, accepted: false });
        }
      }
      if (!error) {
        const stackTop = stack[stack.length - 1];
        if (state === "q₁" && stackTop === "Z" && stack.length === 1) {
          steps.push({ state: "q₂", pos, tape: [...tape], stack: [...stack], workTape: null,
            label: "δ(q₁, ε, Z) = (q₂, Z) — ACCEPT", desc: "Stack empty (only Z) — accepted ✓",
            isFinal: true, accepted: true });
        } else if (state === "q₀") {
          steps.push({ state, pos, tape: [...tape], stack: [...stack], workTape: null,
            label: "End of input — no b's read",
            desc: `${stack.length - 1} unmatched a's — reject ✗`,
            isFinal: true, accepted: false });
        } else {
          steps.push({ state, pos, tape: [...tape], stack: [...stack], workTape: null,
            label: "End of input — stack not empty",
            desc: `${stack.length - 1} unmatched a's on stack — reject ✗`,
            isFinal: true, accepted: false });
        }
      }
      return steps;
    }
  },

  /* ── Type 1: LBA for aⁿbⁿcⁿ ── */
  {
    type: 1,
    name: "LBA — aⁿbⁿcⁿ",
    label: "LBA · Linear Bounded Automaton",
    hint: "Works on the bounded input tape. Marks one 'a', one 'b', one 'c' per pass. Repeats until all marked (accept) or mismatch detected (reject).",
    hasStack: false,
    writableTape: true,
    tryValid: ["abc", "aabbcc"],
    tryInvalid: ["ab", "abbc", "aabbc"],
    simulate(input) {
      const steps = [];
      const tape = input ? input.split("") : [];
      if (tape.length === 0 || !/^a+b+c+$/.test(input)) {
        steps.push({ state: "q₀", pos: 0, tape: [...tape], stack: null, workTape: [...tape],
          label: "Initial configuration",
          desc: tape.length === 0 ? "Empty string" : "Input not in form a⁺b⁺c⁺",
          isFinal: false, accepted: null });
        steps.push({ state: "qᵣ", pos: 0, tape: [...tape], stack: null, workTape: [...tape],
          label: tape.length === 0 ? "ε ∉ L — n ≥ 1 required" : "Format violation — REJECT",
          desc: "reject ✗",
          isFinal: true, accepted: false });
        return steps;
      }
      let workTape = [...tape];
      steps.push({ state: "q₀", pos: 0, tape: [...tape], stack: null, workTape: [...workTape],
        label: "Initial configuration", desc: "Tape loaded, head at position 0",
        isFinal: false, accepted: null });
      let safety = 0;
      while (safety++ < 50) {
        let aPos = -1;
        for (let j = 0; j < workTape.length; j++) { if (workTape[j] === "a") { aPos = j; break; } }
        if (aPos === -1) {
          const hasUnmarked = workTape.some(c => c === "b" || c === "c");
          if (hasUnmarked) {
            steps.push({ state: "qᵣ", pos: 0, tape: [...tape], stack: null, workTape: [...workTape],
              label: "No unmarked a's but unmarked b/c remain",
              desc: "Counts don't match — reject ✗",
              isFinal: true, accepted: false });
          } else {
            steps.push({ state: "qₐ", pos: 0, tape: [...tape], stack: null, workTape: [...workTape],
              label: "All symbols marked — ACCEPT",
              desc: "Equal counts verified ✓",
              isFinal: true, accepted: true });
          }
          break;
        }
        workTape[aPos] = "A";
        steps.push({ state: "q₁", pos: aPos, tape: [...tape], stack: null, workTape: [...workTape],
          label: `Mark a → A at position ${aPos}`,
          desc: "Mark one 'a', scan right for 'b'",
          isFinal: false, accepted: null });
        let bPos = -1;
        for (let j = aPos + 1; j < workTape.length; j++) { if (workTape[j] === "b") { bPos = j; break; } }
        if (bPos === -1) {
          steps.push({ state: "qᵣ", pos: aPos, tape: [...tape], stack: null, workTape: [...workTape],
            label: "No matching unmarked 'b' found",
            desc: "Fewer b's than a's — reject ✗",
            isFinal: true, accepted: false });
          break;
        }
        workTape[bPos] = "B";
        steps.push({ state: "q₂", pos: bPos, tape: [...tape], stack: null, workTape: [...workTape],
          label: `Mark b → B at position ${bPos}`,
          desc: "Mark one 'b', scan right for 'c'",
          isFinal: false, accepted: null });
        let cPos = -1;
        for (let j = bPos + 1; j < workTape.length; j++) { if (workTape[j] === "c") { cPos = j; break; } }
        if (cPos === -1) {
          steps.push({ state: "qᵣ", pos: bPos, tape: [...tape], stack: null, workTape: [...workTape],
            label: "No matching unmarked 'c' found",
            desc: "Fewer c's than a's/b's — reject ✗",
            isFinal: true, accepted: false });
          break;
        }
        workTape[cPos] = "C";
        steps.push({ state: "q₃", pos: cPos, tape: [...tape], stack: null, workTape: [...workTape],
          label: `Mark c → C at position ${cPos}`,
          desc: "Mark one 'c', return to start",
          isFinal: false, accepted: null });
        steps.push({ state: "q₀", pos: 0, tape: [...tape], stack: null, workTape: [...workTape],
          label: "Return to leftmost position",
          desc: "Start next marking pass",
          isFinal: false, accepted: null });
      }
      return steps;
    }
  },

  /* ── Type 0: TM for Σ* ── */
  {
    type: 0,
    name: "TM — Σ*",
    label: "TM · Turing Machine",
    hint: "Accepts all strings over {a, b}. Reads each symbol, moves right, and accepts when end of input (blank □) is reached.",
    hasStack: false,
    writableTape: false,
    tryValid: ["", "a", "ab", "aabb", "bba"],
    tryInvalid: [],
    simulate(input) {
      const steps = [];
      const tape = input ? input.split("") : [];
      steps.push({ state: "q₀", pos: 0, tape: [...tape], stack: null, workTape: null,
        label: "Initial configuration", desc: "TM starts in state q₀",
        isFinal: false, accepted: null });
      for (let i = 0; i < tape.length; i++) {
        const ch = tape[i];
        if (!/[ab]/.test(ch)) {
          steps.push({ state: "qᵣ", pos: i, tape: [...tape], stack: null, workTape: null,
            label: `Symbol '${ch}' ∉ Σ = {a, b}`,
            desc: "Alphabet mismatch — reject ✗",
            isFinal: true, accepted: false });
          return steps;
        }
        steps.push({ state: "q₀", pos: i + 1, tape: [...tape], stack: null, workTape: null,
          label: `δ(q₀, ${ch}) = (q₀, ${ch}, R)`,
          desc: `Read '${ch}', write '${ch}', move right`,
          isFinal: false, accepted: null });
      }
      steps.push({ state: "qₐ", pos: tape.length, tape: [...tape], stack: null, workTape: null,
        label: "δ(q₀, □) = (qₐ, □, S) — ACCEPT",
        desc: "Blank symbol reached — accept ✓",
        isFinal: true, accepted: true });
      return steps;
    }
  }
];


/* ─────────────────────────────────────────────────────────────────────
   9.  SIMULATOR UI
   ───────────────────────────────────────────────────────────────────── */
const SimulatorUI = (() => {
  const $ = s => document.querySelector(s);
  let currentConfig = null;
  let steps = [];
  let currentStep = 0;
  let autoTimer = null;
  let isPlaying = false;

  function init() {
    document.querySelectorAll(".sim-tab").forEach(t => {
      t.addEventListener("click", () => _selectType(+t.dataset.simType));
    });
    $("#sim-run-btn").addEventListener("click", _run);
    $("#sim-string-input").addEventListener("keydown", e => { if (e.key === "Enter") _run(); });
    $("#sim-auto-btn").addEventListener("click", _toggleAuto);
    $("#sim-step-btn").addEventListener("click", _stepForward);
    $("#sim-reset-btn").addEventListener("click", _reset);
    _selectType(3);
  }

  function _selectType(type) {
    document.querySelectorAll(".sim-tab").forEach(t => {
      t.classList.toggle("active", +t.dataset.simType === type);
    });
    currentConfig = SIMULATOR_CONFIGS.find(c => c.type === type);
    if (!currentConfig) return;
    $("#sim-auto-label").textContent = currentConfig.label;
    $("#sim-auto-hint").textContent = currentConfig.hint;
    $("#sim-tape-label").textContent = currentConfig.writableTape ? "WORK TAPE" : "INPUT TAPE";
    _loadExamples();
    _stopAuto();
    steps = [];
    currentStep = 0;
    $("#sim-viz").classList.add("hidden");
  }

  function _loadExamples() {
    const c = $("#sim-examples");
    c.innerHTML = "";
    const lbl = document.createElement("span");
    lbl.textContent = "Try:";
    lbl.style.cssText = "font-family:var(--mono);font-size:0.6rem;color:var(--ink3);margin-right:3px;line-height:2;";
    c.appendChild(lbl);
    currentConfig.tryValid.forEach(s => {
      const b = document.createElement("button");
      b.className = "sim-ex valid";
      b.textContent = s === "" ? "ε" : s;
      b.addEventListener("click", () => { $("#sim-string-input").value = s; _run(); });
      c.appendChild(b);
    });
    currentConfig.tryInvalid.forEach(s => {
      const b = document.createElement("button");
      b.className = "sim-ex invalid";
      b.textContent = s;
      b.addEventListener("click", () => { $("#sim-string-input").value = s; _run(); });
      c.appendChild(b);
    });
  }

  function _run() {
    const input = $("#sim-string-input").value;
    steps = currentConfig.simulate(input);
    currentStep = 0;
    _stopAuto();
    const hasStack = currentConfig.hasStack;
    $("#sim-memory-col").classList.toggle("hidden", !hasStack);
    $("#sim-config-stack-top").classList.toggle("hidden", !hasStack);
    $("#sim-viz-layout").classList.toggle("has-stack", hasStack);
    $("#sim-viz").classList.remove("hidden");
    _buildTrace();
    _renderStep();
  }

  function _buildTrace() {
    const trace = $("#sim-trace");
    trace.innerHTML = "";
    steps.forEach((step, i) => {
      const item = document.createElement("div");
      item.className = "sim-trace-item future";
      item.dataset.step = i;
      item.innerHTML = `<span class="sim-trace-num">${i}.</span><span class="sim-trace-text">${step.label}</span><span class="sim-trace-icon"></span>`;
      trace.appendChild(item);
    });
  }

  function _renderStep() {
    if (currentStep >= steps.length) return;
    const step = steps[currentStep];

    /* Tape */
    _renderTape(step);

    /* Stack (PDA only) */
    if (currentConfig.hasStack && step.stack) {
      _renderStack(step.stack);
    }

    /* Config card */
    $("#sim-step-title").textContent = `Step ${currentStep}`;
    $("#sim-val-state").textContent = step.state;
    const tapeData = step.workTape || step.tape;
    let readSym = (tapeData && step.pos < tapeData.length) ? tapeData[step.pos] : "□";
    if (!tapeData || tapeData.length === 0) readSym = "ε";
    $("#sim-val-read").textContent = readSym;
    if (currentConfig.hasStack && step.stack) {
      $("#sim-val-stack-top").textContent = step.stack.length > 0 ? step.stack[step.stack.length - 1] : "∅";
    }
    $("#sim-transition-desc").textContent = step.desc;

    /* Trace highlighting */
    document.querySelectorAll(".sim-trace-item").forEach((item, i) => {
      item.classList.remove("done", "current", "future");
      const icon = item.querySelector(".sim-trace-icon");
      if (i < currentStep) { item.classList.add("done"); icon.textContent = "✓"; }
      else if (i === currentStep) { item.classList.add("current"); icon.textContent = "►"; }
      else { item.classList.add("future"); icon.textContent = ""; }
    });
    const cur = document.querySelector(`.sim-trace-item[data-step="${currentStep}"]`);
    if (cur) cur.scrollIntoView({ behavior: "smooth", block: "nearest" });

    /* Counter */
    $("#sim-counter").textContent = `${currentStep} / ${steps.length - 1}`;

    /* Final result */
    _removeResult();
    if (step.isFinal) { _showResult(step.accepted); _stopAuto(); }
  }

  function _renderTape(step) {
    const c = $("#sim-tape");
    c.innerHTML = "";
    const tapeData = step.workTape || step.tape;
    const origTape = step.tape;
    if (!tapeData || tapeData.length === 0) {
      const cell = document.createElement("div");
      cell.className = "sim-tape-cell active";
      cell.textContent = "ε";
      c.appendChild(cell);
      return;
    }
    tapeData.forEach((ch, i) => {
      const cell = document.createElement("div");
      cell.className = "sim-tape-cell";
      if (i === step.pos) cell.classList.add("active");
      if (i < step.pos && !currentConfig.writableTape) cell.classList.add("consumed");
      if (currentConfig.writableTape && origTape[i] && ch !== origTape[i]) cell.classList.add("modified");
      cell.textContent = ch;
      c.appendChild(cell);
    });
    if (step.pos >= tapeData.length && !currentConfig.writableTape) {
      const cell = document.createElement("div");
      cell.className = "sim-tape-cell active";
      cell.textContent = "□";
      c.appendChild(cell);
    }
  }

  function _renderStack(stack) {
    const c = $("#sim-stack");
    c.innerHTML = "";
    for (let i = stack.length - 1; i >= 0; i--) {
      const cell = document.createElement("div");
      cell.className = "sim-stack-cell";
      if (i === stack.length - 1) cell.classList.add("highlight");
      cell.textContent = stack[i];
      c.appendChild(cell);
    }
  }

  function _stepForward() {
    if (currentStep < steps.length - 1) { currentStep++; _renderStep(); }
  }

  function _toggleAuto() {
    if (isPlaying) _stopAuto(); else _startAuto();
  }

  function _startAuto() {
    if (steps.length === 0) return;
    if (currentStep >= steps.length - 1) {
      currentStep = 0;
      _removeResult();
      _renderStep();
    }
    isPlaying = true;
    $("#sim-auto-btn").textContent = "⏸ Pause";
    $("#sim-auto-btn").classList.add("playing");
    autoTimer = setInterval(() => {
      if (currentStep < steps.length - 1) { currentStep++; _renderStep(); }
      else _stopAuto();
    }, 800);
  }

  function _stopAuto() {
    isPlaying = false;
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
    $("#sim-auto-btn").textContent = "▶ Auto";
    $("#sim-auto-btn").classList.remove("playing");
  }

  function _reset() {
    _stopAuto();
    currentStep = 0;
    _removeResult();
    if (steps.length > 0) _renderStep();
  }

  function _showResult(accepted) {
    _removeResult();
    const d = document.createElement("div");
    d.className = `sim-result ${accepted ? "accepted" : "rejected"}`;
    d.innerHTML = `<span class="sim-result-icon">${accepted ? "✓" : "✗"}</span><span class="sim-result-text">${accepted ? "String Accepted" : "String Rejected"}</span>`;
    $("#sim-viz").appendChild(d);
  }

  function _removeResult() {
    document.querySelectorAll(".sim-result").forEach(el => el.remove());
  }

  return { init };
})();


/* ─────────────────────────────────────────────────────────────────────
   10.  BOOTSTRAP
   ───────────────────────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  ThemeManager.init();
  UIController.init();
  SimulatorUI.init();
});
