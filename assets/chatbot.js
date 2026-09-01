/* =========================================================
   SortLab — rule-based project chatbot
   100% client-side (no API key, works on GitHub Pages).
   Answers questions about the algorithms / project, and
   redirects to a page when the user names it.
   ========================================================= */

(function(){
  "use strict";

  const ALGO_ALIASES = {
    bubble:    ["bubble sort", "bubble", "bubblesort"],
    selection: ["selection sort", "selection", "selectionsort"],
    insertion: ["insertion sort", "insertion", "insertionsort"],
    merge:     ["merge sort", "merge", "mergesort"],
    quick:     ["quick sort", "quicksort", "quick"],
    heap:      ["heap sort", "heap", "heapsort"]
  };

  const PAGE_ALIASES = {
    "index.html":      ["home", "home page", "homepage", "landing page", "cover page"],
    "algorithms.html": ["algorithms", "algorithms page", "algorithm list", "all algorithms", "list of algorithms"]
  };

  function norm(s){
    return s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function findAlgoInText(text){
    const t = norm(text);
    let best = null, bestLen = 0;
    for (const slug of ALGO_LIST){
      for (const alias of ALGO_ALIASES[slug]){
        if (t.includes(alias) && alias.length > bestLen){
          best = slug; bestLen = alias.length;
        }
      }
    }
    return best;
  }

  function findPageInText(text){
    const t = norm(text);
    for (const page in PAGE_ALIASES){
      for (const alias of PAGE_ALIASES[page]){
        if (t === alias || t.includes(alias)) return page;
      }
    }
    return null;
  }

  function exactAlgoOrPageMatch(raw){
    const t = norm(raw);
    // exact / near-exact typed name → treat as navigation, not a question
    for (const slug of ALGO_LIST){
      if (ALGO_ALIASES[slug].includes(t)) return { kind:'algo', slug };
    }
    for (const page in PAGE_ALIASES){
      if (PAGE_ALIASES[page].includes(t)) return { kind:'page', page };
    }
    return null;
  }

  function algoName(slug){ return ALGO_DATA[slug].name; }

  function complexityLine(slug){
    const c = ALGO_DATA[slug].complexity;
    return `${algoName(slug)} — Best: O(${c.best}), Average: O(${c.avg}), Worst: O(${c.worst}), Space: O(${c.space})`;
  }

  function boolWord(b){ return b ? "Yes" : "No"; }

  function buildReply(raw){
    const t = norm(raw);

    // ---- greetings / small talk ----
    if (/^(hi|hello|hey|hii|helo)\b/.test(t)){
      return { text: "Hey! Ask me anything about SortLab — e.g. \"time complexity of quick sort\", \"how does merge sort work\", or just type an algorithm name to jump straight to it." };
    }
    if (/^(thanks|thank you|thx|ty)\b/.test(t)){
      return { text: "You're welcome! Anything else you'd like to know about the project?" };
    }
    if (/^(bye|goodbye|see ya)\b/.test(t)){
      return { text: "Bye! Come back anytime you have a question about the algorithms." };
    }

    // ---- exact page / algorithm name typed → navigate ----
    const exact = exactAlgoOrPageMatch(raw);
    if (exact){
      if (exact.kind === 'algo'){
        return { text: `Taking you to ${algoName(exact.slug)} →`, navigate: `algorithm.html?algo=${exact.slug}` };
      }
      return { text: `Opening the ${exact.page === 'index.html' ? 'home' : 'algorithms'} page →`, navigate: exact.page };
    }

    // ---- explicit "open/go to/take me to <page/algo>" ----
    const wantsNav = /\b(open|go to|goto|take me to|navigate to|show me|visualize|visualise)\b/.test(t);
    if (wantsNav){
      const algo = findAlgoInText(t);
      if (algo){
        if (/visuali[sz]e/.test(t)) return { text: `Opening the ${algoName(algo)} visualizer →`, navigate: `visualizer.html?algo=${algo}` };
        return { text: `Opening ${algoName(algo)} →`, navigate: `algorithm.html?algo=${algo}` };
      }
      const page = findPageInText(t);
      if (page) return { text: `Opening that page →`, navigate: page };
    }

    // ---- comparisons: "difference between X and Y" ----
    if (/\b(difference|compare|vs|versus)\b/.test(t)){
      const found = ALGO_LIST.filter(slug => ALGO_ALIASES[slug].some(a => t.includes(a)));
      if (found.length >= 2){
        const [a, b] = found;
        return { text:
`${algoName(a)} vs ${algoName(b)}:
• ${complexityLine(a)}
• ${complexityLine(b)}
• Stable — ${algoName(a)}: ${boolWord(ALGO_DATA[a].stable)}, ${algoName(b)}: ${boolWord(ALGO_DATA[b].stable)}
• In-place — ${algoName(a)}: ${boolWord(ALGO_DATA[a].inPlace)}, ${algoName(b)}: ${boolWord(ALGO_DATA[b].inPlace)}` };
      }
    }

    // ---- complexity questions ----
    if (/\b(time complexity|space complexity|complexity|big o|big-o)\b/.test(t)){
      const algo = findAlgoInText(t);
      if (algo){
        if (/best case/.test(t)) return { text: `${algoName(algo)} best case: O(${ALGO_DATA[algo].complexity.best}).` };
        if (/worst case/.test(t)) return { text: `${algoName(algo)} worst case: O(${ALGO_DATA[algo].complexity.worst}).` };
        if (/average case|avg/.test(t)) return { text: `${algoName(algo)} average case: O(${ALGO_DATA[algo].complexity.avg}).` };
        if (/space/.test(t)) return { text: `${algoName(algo)} space complexity: O(${ALGO_DATA[algo].complexity.space}).` };
        return {
          text: complexityLine(algo) + `\nWant the full step-by-step derivation for all three cases?`,
          goLink: { label: `Open ${algoName(algo)} page`, href: `algorithm.html?algo=${algo}` }
        };
      }
      return { text: "Which algorithm's complexity would you like — Bubble, Selection, Insertion, Merge, Quick, or Heap Sort?" };
    }

    // ---- "how does X work" / logic ----
    if (/\b(how does|how do|logic|explain|steps|works|working)\b/.test(t)){
      const algo = findAlgoInText(t);
      if (algo){
        const steps = ALGO_DATA[algo].howItWorks.map((s,i) => `${i+1}. ${s}`).join('\n');
        return { text: `${algoName(algo)} — how it works:\n${steps}`,
          goLink: { label: `Watch it animate`, href: `visualizer.html?algo=${algo}` } };
      }
    }

    // ---- stability ----
    if (/\bstable|stability\b/.test(t)){
      const algo = findAlgoInText(t);
      if (algo) return { text: `${algoName(algo)} is ${ALGO_DATA[algo].stable ? "a stable" : "not a stable (unstable)"} sorting algorithm.` };
      return { text: "Stable algorithms here: Bubble, Insertion, Merge Sort. Not stable: Selection, Quick, Heap Sort." };
    }

    // ---- in-place ----
    if (/in[\s-]?place/.test(t)){
      const algo = findAlgoInText(t);
      if (algo) return { text: `${algoName(algo)} is ${ALGO_DATA[algo].inPlace ? "an in-place" : "not an in-place"} algorithm${ALGO_DATA[algo].inPlace ? "" : " (it needs extra O(n) auxiliary space)"}.` };
    }

    // ---- comparison-based ----
    if (/comparison[\s-]?based/.test(t)){
      const algo = findAlgoInText(t);
      if (algo) return { text: `Yes — ${algoName(algo)} is a comparison-based sorting algorithm.` };
      return { text: "All six algorithms in SortLab (Bubble, Selection, Insertion, Merge, Quick, Heap) are comparison-based." };
    }

    // ---- project info ----
    if (/\b(who made|who created|presented by|student|author)\b/.test(t)){
      return { text: `This project was presented by ${PROJECT_INFO.studentName}.` };
    }
    if (/\b(guided by|faculty|professor|mentor|guide)\b/.test(t)){
      return { text: `Guided by ${PROJECT_INFO.facultyName}.` };
    }
    if (/\b(subject|course)\b/.test(t)){
      return { text: `Subject: ${PROJECT_INFO.subject}.` };
    }
    if (/\b(institution|university|college|department)\b/.test(t)){
      return { text: `Institution: ${PROJECT_INFO.institution}.` };
    }
    if (/\b(problem statement|aim|objective|about this project|what is this project)\b/.test(t)){
      return { text: PROJECT_INFO.problemStatement };
    }

    // ---- list algorithms ----
    if (/\b(which algorithms|list algorithms|algorithms available|all algorithms|how many algorithms)\b/.test(t)){
      return { text: `SortLab covers ${ALGO_LIST.length} algorithms: ${ALGO_LIST.map(algoName).join(', ')}.`,
        goLink: { label: "Browse them", href: "algorithms.html" } };
    }

    // ---- how to use the site ----
    if (/\b(how (do i|to) use|how does this work|help|usage|instructions)\b/.test(t)){
      return { text: "Pick an algorithm from the Algorithms page to read how it works, then hit \"Visualize\" to watch it sort step-by-step. On the visualizer you can generate a random array, type your own numbers, control speed/size, and step forward/backward through the C++ code as it runs." };
    }

    // ---- last resort: any algorithm name present anywhere ----
    const algoAnywhere = findAlgoInText(t);
    if (algoAnywhere){
      return { text: `Here's what I know about ${algoName(algoAnywhere)}:\n${complexityLine(algoAnywhere)}`,
        goLink: { label: `Open ${algoName(algoAnywhere)} page`, href: `algorithm.html?algo=${algoAnywhere}` } };
    }

    return {
      text: "I couldn't quite match that. Try asking about an algorithm's time complexity, how it works, whether it's stable/in-place, or just type an algorithm's name (e.g. \"quick sort\") to jump to it.",
      unmatched: true
    };
  }

  /* ---------------- UI wiring ---------------- */
  window.addEventListener('DOMContentLoaded', () => {
    const fab = document.getElementById('chatFab');
    const win = document.getElementById('chatWindow');
    const closeBtn = document.getElementById('chatClose');
    const messages = document.getElementById('chatMessages');
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSend');
    const suggestions = document.getElementById('chatSuggestions');
    if (!fab || !win) return;

    const starterChips = [
      "Time complexity of quick sort",
      "How does merge sort work?",
      "Compare bubble vs insertion sort",
      "Who guided this project?"
    ];
    suggestions.innerHTML = starterChips.map(s => `<span class="chat-chip">${s}</span>`).join('');

    function addMessage(text, who, goLink){
      const div = document.createElement('div');
      div.className = 'chat-msg ' + who;
      div.textContent = text;
      if (goLink){
        const a = document.createElement('span');
        a.className = 'go-link';
        a.textContent = goLink.label + ' →';
        a.addEventListener('click', () => { window.location.href = goLink.href; });
        div.appendChild(document.createElement('br'));
        div.appendChild(a);
      }
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    }

    function handleSend(text){
      const raw = (text !== undefined ? text : input.value).trim();
      if (!raw) return;
      addMessage(raw, 'user');
      input.value = '';
      const reply = buildReply(raw);
      addMessage(reply.text, 'bot', reply.goLink);
      if (reply.navigate){
        setTimeout(() => { window.location.href = reply.navigate; }, 650);
      }
    }

    fab.addEventListener('click', () => {
      win.classList.toggle('open');
      if (win.classList.contains('open')) input.focus();
    });
    closeBtn.addEventListener('click', () => win.classList.remove('open'));
    sendBtn.addEventListener('click', () => handleSend());
    input.addEventListener('keydown', e => { if (e.key === 'Enter') handleSend(); });
    suggestions.addEventListener('click', e => {
      if (e.target.classList.contains('chat-chip')) handleSend(e.target.textContent);
    });

    if (messages.children.length === 0){
      addMessage("Hi! I'm the SortLab assistant. Ask me about any algorithm's complexity, how it works, or type its name to jump straight to it.", 'bot');
    }
  });

})();
