// Microprocessor timeline data focused on technical mechanisms
const eras = [
  {
    year: "1958–1964",
    name: "Integrated Circuits",
    transistors: "~2,300 (by 1971)",
    clock: "N/A",
    keyConcept: "Miniaturization",
    inside: "Transistors are etched onto silicon wafers. Binary signals switch them on/off to form logic gates (AND, OR, NOT). Data moves through fixed copper traces.",
    impact: "Circuits shrink, heat drops, and complex digital systems become physically possible outside climate-controlled rooms."
  },
  {
    year: "1971",
    name: "Intel 4004",
    transistors: "~2,300",
    clock: "740 kHz",
    keyConcept: "Single-Chip CPU",
    inside: "Fetches instructions from memory, decodes them into control signals, and executes arithmetic on 4-bit numbers. Uses a simple fetch-decode-execute cycle with no cache.",
    impact: "Calculators become affordable and reliable. Proves a complete processor can fit on one chip."
  },
  {
    year: "1974–1980",
    name: "8-bit & 16-bit Era",
    transistors: "~35k–75k",
    clock: "1–2 MHz",
    keyConcept: "Wider Data Buses",
    inside: "8 or 16 bits processed per cycle. Memory addressing expands to megabytes. Interrupt handling allows external devices to request CPU attention without constant polling.",
    impact: "Early personal computers, operating systems, and basic graphics interfaces become practical."
  },
  {
    year: "1985–1995",
    name: "Architecture Evolution",
    transistors: "~3M+",
    clock: "20–100+ MHz",
    keyConcept: "Pipelining & Cache",
    inside: "Instructions overlap in stages (fetch, decode, execute). L1/L2 cache stores frequently used data near cores. Superscalar designs process multiple instructions per cycle.",
    impact: "Graphical interfaces, multimedia playback, and desktop publishing run smoothly."
  },
  {
    year: "2005–2010",
    name: "Multi-Core Shift",
    transistors: "~100M+",
    clock: "3–4 GHz (plateau)",
    keyConcept: "Parallel Execution",
    inside: "Multiple independent cores share a die. OS schedules threads across cores. Memory controllers and cache hierarchies prevent bottlenecks during simultaneous access.",
    impact: "Better multitasking, video editing, gaming, and background services without slowing user apps."
  },
  {
    year: "2010–2020",
    name: "Mobile & Specialization",
    transistors: "~5B+",
    clock: "2–3 GHz (efficient)",
    keyConcept: "Heterogeneous Computing",
    inside: "CPU cores paired with GPUs, DSPs, and early NPUs. Dynamic voltage/frequency scaling adjusts power per core. LPDDR memory reduces CPU-RAM latency.",
    impact: "Real-time camera processing, local voice assistants, high-res streaming, all-day battery life."
  },
  {
    year: "2020–Present",
    name: "Chiplets & AI Acceleration",
    transistors: "~50B+",
    clock: "Variable (performance/efficiency cores)",
    keyConcept: "Modular Design & Tensor Math",
    inside: "Multiple dies connected via high-speed interconnects. Matrix math units accelerate AI inference. Hardware security verifies software before execution.",
    impact: "Local machine learning, advanced computer vision, efficient cloud AI, higher performance per watt."
  }
];

// Quiz data based on timeline concepts
const quizQuestions = [
  {
    question: "Why did clock speeds stop increasing around 2005?",
    options: ["Transistors became too expensive to manufacture", "Heat dissipation limits made higher frequencies impractical", "Software stopped requiring faster processors", "Memory bandwidth could no longer keep up"],
    correct: 1,
    explanation: "As transistors shrank, switching them faster generated more heat than cooling systems could remove. Engineers shifted focus to parallelism and efficiency instead."
  },
  {
    question: "What does 'pipelining' actually do inside a CPU?",
    options: ["Stores frequently used data in cache", "Overlaps instruction processing stages so multiple instructions are handled simultaneously", "Connects multiple chips on one package", "Adjusts voltage based on workload"],
    correct: 1,
    explanation: "Pipelining breaks instruction execution into steps (fetch, decode, execute). While one instruction is executing, the next is being decoded, and another is being fetched."
  },
  {
    question: "How do modern smartphones process camera images so quickly?",
    options: ["They rely entirely on cloud servers", "They use dedicated hardware accelerators like GPUs and NPUs alongside CPU cores", "They increase clock speed to maximum at all times", "They store raw sensor data in L3 cache"],
    correct: 1,
    explanation: "Heterogeneous computing pairs general-purpose cores with specialized units. Image processing, audio filtering, and AI tasks run on accelerators designed for parallel math."
  },
  {
    question: "What is the main advantage of chiplet architecture?",
    options: ["It allows mixing different manufacturing processes on one package", "It eliminates the need for cache memory", "It runs software at higher clock speeds than monolithic chips", "It removes the need for an operating system"],
    correct: 0,
    explanation: "Chiplets connect smaller dies using high-speed interconnects. This improves yield, reduces cost, and lets manufacturers combine CPU, GPU, and I/O components made on different nodes."
  }
];

// DOM Elements
const timelineNav = document.getElementById('timelineNav');
const detailPanel = document.getElementById('detailPanel');
const quizContainer = document.getElementById('quizContainer');
const resetQuizBtn = document.getElementById('resetQuiz');

// Render Timeline Buttons
function renderTimeline() {
  eras.forEach((era, index) => {
    const btn = document.createElement('button');
    btn.className = 'era-btn';
    btn.textContent = `${era.year} – ${era.name}`;
    btn.dataset.index = index;
    btn.addEventListener('click', () => selectEra(index));
    timelineNav.appendChild(btn);
  });
}

// Update Detail Panel
function selectEra(index) {
  const era = eras[index];
  
  // Highlight active button
  document.querySelectorAll('.era-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.era-btn[data-index="${index}"]`).classList.add('active');

  detailPanel.innerHTML = `
    <h2>${era.name}</h2>
    <div class="meta">
      <span>📅 ${era.year}</span>
      <span>⚡ ${era.clock}</span>
      <span>🔲 ${era.transistors}</span>
      <span>💡 ${era.keyConcept}</span>
    </div>
    <h3>What Happens Inside</h3>
    <p>${era.inside}</p>
    <h3>Real-World Impact</h3>
    <p>${era.impact}</p>
  `;

  // Scroll to detail on mobile
  if (window.innerWidth < 768) {
    detailPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Render Quiz
function renderQuiz() {
  quizContainer.innerHTML = '';
  quizQuestions.forEach((q, qIndex) => {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'quiz-question';
    
    let optionsHTML = '';
    q.options.forEach((opt, oIndex) => {
      optionsHTML += `<button class="option-btn" data-q="${qIndex}" data-o="${oIndex}">${opt}</button>`;
    });

    questionDiv.innerHTML = `
      <p><strong>${q.question}</strong></p>
      <div class="quiz-options">${optionsHTML}</div>
      <div class="feedback" id="feedback-${qIndex}"></div>
    `;
    quizContainer.appendChild(questionDiv);
  });

  // Attach click handlers to options
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', handleOptionClick);
  });
}

function handleOptionClick(e) {
  const qIndex = parseInt(e.target.dataset.q);
  const oIndex = parseInt(e.target.dataset.o);
  const question = quizQuestions[qIndex];
  const feedbackEl = document.getElementById(`feedback-${qIndex}`);
  
  // Disable all options for this question after selection
  const parentOptions = e.target.parentElement.querySelectorAll('.option-btn');
  parentOptions.forEach(btn => btn.disabled = true);

  if (oIndex === question.correct) {
    e.target.classList.add('correct');
    feedbackEl.textContent = `✅ Correct. ${question.explanation}`;
    feedbackEl.style.color = 'var(--success)';
  } else {
    e.target.classList.add('incorrect');
    // Highlight correct answer
    parentOptions[question.correct].classList.add('correct');
    feedbackEl.textContent = `❌ Not quite. ${question.explanation}`;
    feedbackEl.style.color = 'var(--error)';
  }

  checkQuizCompletion();
}

function checkQuizCompletion() {
  const allAnswered = quizQuestions.every((_, i) => {
    return document.getElementById(`feedback-${i}`).textContent !== '';
  });
  
  if (allAnswered) {
    resetQuizBtn.style.display = 'inline-block';
  }
}

resetQuizBtn.addEventListener('click', () => {
  renderQuiz();
  resetQuizBtn.style.display = 'none';
});

// Initialize
renderTimeline();
renderQuiz();
