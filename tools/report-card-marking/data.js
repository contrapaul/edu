// PRONOUNS: sub=subject, obj=object, pos=possessive, ref=reflexive
const PRONOUNS = {
  she:  { sub: 'she',  obj: 'her',  pos: 'her',   ref: 'herself'    },
  he:   { sub: 'he',   obj: 'him',  pos: 'his',   ref: 'himself'    },
  they: { sub: 'they', obj: 'them', pos: 'their', ref: 'themselves' },
};

// Each phrase: id, label, section, grades[], text(n,p)
// SubjectContent phrases also have: subGroup ('lego'|'mechanisms'|'studio'|'dp')
// Criteria phrases also have: criterionGroup ('A'|'B'|'C'|'D')
const PHRASES = [

  // ─── OPENING ───────────────────────────────────────────────────────────────

  { id: 'open-consistent-growth', label: 'Consistent Growth',
    section: 'Opening', grades: [6, 7, 10, 11],
    text: (n, p) => `${n} has consistently demonstrated growth throughout this semester and approached ${p.pos} work with increasing confidence and skill.` },

  { id: 'open-strong-achievement', label: 'Strong Achievement',
    section: 'Opening', grades: [6, 7, 10, 11],
    text: (n, p) => `${n} has had an outstanding semester in Design, consistently producing work of a high standard and demonstrating a thorough understanding of the design process.` },

  { id: 'open-steady-progress', label: 'Steady Progress',
    section: 'Opening', grades: [6, 7, 10, 11],
    text: (n, p) => `${n} has made steady progress in Design this semester and demonstrated a developing understanding of the design cycle.` },

  { id: 'open-encouraging', label: 'Encouraging Start',
    section: 'Opening', grades: [6, 7],
    text: (n, p) => `${n} has made an encouraging start to ${p.pos} Design studies this semester, showing a willingness to engage with the design process.` },

  { id: 'open-developing', label: 'Developing Understanding',
    section: 'Opening', grades: [6, 7, 10, 11],
    text: (n, p) => `${n} is developing ${p.pos} understanding of Design and has shown willingness to engage with the design process this semester.` },

  { id: 'open-positive-attitude', label: 'Positive Attitude',
    section: 'Opening', grades: [6, 7, 10, 11],
    text: (n, p) => `${n} has approached Design this semester with a positive attitude, showing a genuine interest in the subject and contributing well to class discussions.` },

  { id: 'open-dp-strong', label: 'DP Strong Engagement',
    section: 'Opening', grades: [11],
    text: (n, p) => `${n} has engaged productively with the Diploma Programme Design Technology course this year, demonstrating both technical competence and strong conceptual understanding.` },

  { id: 'open-dp-steady', label: 'DP Steady Engagement',
    section: 'Opening', grades: [11],
    text: (n, p) => `${n} has engaged with the Diploma Programme Design Technology course this year and is developing ${p.pos} understanding of key concepts and design practice.` },

  { id: 'open-dp-variable', label: 'DP Variable Performance',
    section: 'Opening', grades: [11],
    text: (n, p) => `${n} has shown variable engagement with the Diploma Programme Design Technology course this year, demonstrating capability in some areas while requiring further development in others.` },

  // ─── GRADE LEVEL — MYP (G6, G7, G10) ──────────────────────────────────────

  { id: 'gl-myp-1', label: '1', section: 'GradeLevel', grades: [6, 7, 10],
    text: (n, p) => `${n} is currently working at level one across the criteria, indicating that assessed work does not yet meet the standard for the course.` },

  { id: 'gl-myp-2', label: '2', section: 'GradeLevel', grades: [6, 7, 10],
    text: (n, p) => `${n} is currently achieving at level two, demonstrating a limited understanding of the design cycle and course requirements.` },

  { id: 'gl-myp-3', label: '3', section: 'GradeLevel', grades: [6, 7, 10],
    text: (n, p) => `${n} is achieving at level three, showing some understanding but requiring significant development across most criteria.` },

  { id: 'gl-myp-4', label: '4', section: 'GradeLevel', grades: [6, 7, 10],
    text: (n, p) => `${n} is achieving at level four overall, meeting some expectations and demonstrating a basic command of the design process.` },

  { id: 'gl-myp-5', label: '5', section: 'GradeLevel', grades: [6, 7, 10],
    text: (n, p) => `${n} is achieving at level five, demonstrating a good understanding of the design cycle and the ability to apply skills across most criteria.` },

  { id: 'gl-myp-6', label: '6', section: 'GradeLevel', grades: [6, 7, 10],
    text: (n, p) => `${n} is currently achieving at level six, producing work that demonstrates strong understanding and consistent application of design skills.` },

  { id: 'gl-myp-7', label: '7', section: 'GradeLevel', grades: [6, 7, 10],
    text: (n, p) => `${n} is achieving at the highest levels, producing work of exceptional quality that reflects a thorough command of the design cycle.` },

  { id: 'gl-myp-8', label: '8', section: 'GradeLevel', grades: [6, 7, 10],
    text: (n, p) => `${n} is achieving at the highest level, producing work of outstanding quality and demonstrating a comprehensive command of the design cycle.` },

  // ─── GRADE LEVEL — IB (G11) ────────────────────────────────────────────────

  { id: 'gl-ib-1', label: '1', section: 'GradeLevel', grades: [11],
    text: (n, p) => `${n} is currently achieving at level one, and significant improvement is required across all assessed components.` },

  { id: 'gl-ib-2', label: '2', section: 'GradeLevel', grades: [11],
    text: (n, p) => `${n} is currently achieving at level two, requiring targeted support and significant improvement across assessed tasks.` },

  { id: 'gl-ib-3', label: '3', section: 'GradeLevel', grades: [11],
    text: (n, p) => `${n} is currently achieving at level three, demonstrating a partial understanding of course content and requiring targeted support.` },

  { id: 'gl-ib-4', label: '4', section: 'GradeLevel', grades: [11],
    text: (n, p) => `${n} is achieving at level four, meeting the standard for the course and demonstrating a competent understanding of core topics.` },

  { id: 'gl-ib-5', label: '5', section: 'GradeLevel', grades: [11],
    text: (n, p) => `${n} is achieving at level five, demonstrating a solid understanding of course content and the ability to apply knowledge effectively.` },

  { id: 'gl-ib-6', label: '6', section: 'GradeLevel', grades: [11],
    text: (n, p) => `${n} is achieving at level six, producing work that demonstrates strong understanding and consistent performance across assessments.` },

  { id: 'gl-ib-7', label: '7', section: 'GradeLevel', grades: [11],
    text: (n, p) => `${n} is achieving at the highest level, demonstrating exceptional understanding and consistently producing work of outstanding quality.` },

  // ─── SUBJECT CONTENT — G6 Lego Design Project ──────────────────────────────

  { id: 'sc-lego-1', label: '1', section: 'SubjectContent', grades: [6], subGroup: 'lego',
    text: (n, p) => `${n} found aspects of the Lego set design project challenging, and ${p.pos} final set concept required further development to fully meet the requirements of the design cycle.` },

  { id: 'sc-lego-2', label: '2', section: 'SubjectContent', grades: [6], subGroup: 'lego',
    text: (n, p) => `${n} completed the Lego set design project, working through the design cycle to produce a final rendered set concept with original box design and building instructions.` },

  { id: 'sc-lego-3', label: '3', section: 'SubjectContent', grades: [6], subGroup: 'lego',
    text: (n, p) => `${n} excelled in the Lego set design project, producing an outstanding set concept that demonstrated impressive creativity and strong design thinking throughout the design cycle.` },

  // ─── SUBJECT CONTENT — G7 Mechanisms Project ───────────────────────────────

  { id: 'sc-mech-1', label: '1', section: 'SubjectContent', grades: [7], subGroup: 'mechanisms',
    text: (n, p) => `${n} found the mechanisms and machines project challenging, particularly when designing and constructing a machine with functional moving parts using Lego Technic.` },

  { id: 'sc-mech-2', label: '2', section: 'SubjectContent', grades: [7], subGroup: 'mechanisms',
    text: (n, p) => `${n} completed the mechanisms and machines project, designing and building a machine with moving parts using Lego Technic and working through the key stages of the design cycle.` },

  { id: 'sc-mech-3', label: '3', section: 'SubjectContent', grades: [7], subGroup: 'mechanisms',
    text: (n, p) => `${n} excelled in the mechanisms and machines project, designing and building an impressive machine with several well-functioning moving parts that demonstrated strong technical skill and creative problem-solving.` },

  // ─── SUBJECT CONTENT — G10 Studio Project ──────────────────────────────────

  { id: 'sc-studio-1', label: '1', section: 'SubjectContent', grades: [10], subGroup: 'studio',
    text: (n, p) => `${n} found aspects of the studio product design project challenging, particularly in completing all stages of the MYP design cycle to the required standard.` },

  { id: 'sc-studio-2', label: '2', section: 'SubjectContent', grades: [10], subGroup: 'studio',
    text: (n, p) => `${n} completed the studio product design project, working through the MYP design cycle to produce a functional prototype and formal evaluation.` },

  { id: 'sc-studio-3', label: '3', section: 'SubjectContent', grades: [10], subGroup: 'studio',
    text: (n, p) => `${n} excelled in the studio product design project, producing an exceptional product that demonstrated outstanding design thinking and technical skill throughout the design cycle.` },

  // ─── SUBJECT CONTENT — G11 DP / IA Progress ────────────────────────────────

  { id: 'sc-dp-1', label: '1', section: 'SubjectContent', grades: [11], subGroup: 'dp',
    text: (n, p) => `${n} found the demands of the Diploma Programme Design Technology course challenging this year, requiring significant support in keeping pace with Standard Level content and assessment requirements.` },

  { id: 'sc-dp-2', label: '2', section: 'SubjectContent', grades: [11], subGroup: 'dp',
    text: (n, p) => `${n} made satisfactory progress through the Diploma Programme Design Technology course this year, engaging with Standard Level content across a range of topics and assessments.` },

  { id: 'sc-dp-3', label: '3', section: 'SubjectContent', grades: [11], subGroup: 'dp',
    text: (n, p) => `${n} had an outstanding year in Diploma Programme Design Technology, demonstrating exceptional engagement with Standard Level content and producing high-quality work across assessments.` },

  { id: 'sc-ia-begun', label: 'IA Begun',
    section: 'SubjectContent', grades: [11], subGroup: 'dp-ia',
    text: (n, p) => `${n} has begun developing ${p.pos} Individual Assessment (IA), identifying a design context and working towards a focused research question.` },

  { id: 'sc-ia-progressing', label: 'IA Progressing',
    section: 'SubjectContent', grades: [11], subGroup: 'dp-ia',
    text: (n, p) => `${n} has made strong progress on ${p.pos} Individual Assessment (IA) and is developing a clear research question with an appropriate supporting evidence base.` },

  // ─── CRITERIA — MYP Criterion A (Inquiring and Analysing) — G6, G7, G10 ───

  { id: 'crit-a-1', label: '1', section: 'Criteria', grades: [6, 7, 10], criterionGroup: 'A',
    text: (n, p) => `${n} struggled to identify a clear design problem or gather relevant research, and did not produce a meaningful design brief for their project.` },

  { id: 'crit-a-2', label: '2', section: 'Criteria', grades: [6, 7, 10], criterionGroup: 'A',
    text: (n, p) => `${n} made a limited start to the research phase and produced a design brief that did not yet reflect the needs of the design problem.` },

  { id: 'crit-a-3', label: '3', section: 'Criteria', grades: [6, 7, 10], criterionGroup: 'A',
    text: (n, p) => `${n} gathered some research relevant to their design problem but found it challenging to develop a complete and well-focused design brief.` },

  { id: 'crit-a-4', label: '4', section: 'Criteria', grades: [6, 7, 10], criterionGroup: 'A',
    text: (n, p) => `${n} completed relevant research and produced a design brief that identified the key requirements for their project.` },

  { id: 'crit-a-5', label: '5', section: 'Criteria', grades: [6, 7, 10], criterionGroup: 'A',
    text: (n, p) => `${n} conducted relevant research, analysed ${p.pos} findings effectively, and developed a well-structured design brief that clearly informed ${p.pos} design decisions.` },

  { id: 'crit-a-6', label: '6', section: 'Criteria', grades: [6, 7, 10], criterionGroup: 'A',
    text: (n, p) => `${n} produced thorough and well-organised research, developing a comprehensive design brief that demonstrated strong analytical thinking and a clear understanding of the design problem.` },

  { id: 'crit-a-7', label: '7', section: 'Criteria', grades: [6, 7, 10], criterionGroup: 'A',
    text: (n, p) => `${n} conducted exceptional research, producing an outstanding design brief that reflected sophisticated understanding of the problem and fully grounded ${p.pos} subsequent design decisions.` },

  // ─── CRITERIA — MYP Criterion B (Developing Ideas) — G6, G10 ───────────────

  { id: 'crit-b-1', label: '1', section: 'Criteria', grades: [6, 10], criterionGroup: 'B',
    text: (n, p) => `${n} found it challenging to generate design ideas or develop a workable design specification for their project.` },

  { id: 'crit-b-2', label: '2', section: 'Criteria', grades: [6, 10], criterionGroup: 'B',
    text: (n, p) => `${n} generated a limited range of ideas and produced a design specification that required significant further development.` },

  { id: 'crit-b-3', label: '3', section: 'Criteria', grades: [6, 10], criterionGroup: 'B',
    text: (n, p) => `${n} generated some design ideas but found it challenging to develop them in sufficient detail or produce a complete design specification.` },

  { id: 'crit-b-4', label: '4', section: 'Criteria', grades: [6, 10], criterionGroup: 'B',
    text: (n, p) => `${n} developed a range of design ideas and selected a final design supported by a basic specification.` },

  { id: 'crit-b-5', label: '5', section: 'Criteria', grades: [6, 10], criterionGroup: 'B',
    text: (n, p) => `${n} developed a range of creative ideas, selecting and justifying ${p.pos} final design with clear reference to the design specification.` },

  { id: 'crit-b-6', label: '6', section: 'Criteria', grades: [6, 10], criterionGroup: 'B',
    text: (n, p) => `${n} presented a strong range of well-developed ideas, thoroughly justifying ${p.pos} final design in relation to a detailed and accurate specification.` },

  { id: 'crit-b-7', label: '7', section: 'Criteria', grades: [6, 10], criterionGroup: 'B',
    text: (n, p) => `${n} generated an exceptional range of innovative ideas and presented a highly creative, thoroughly justified final design backed by a comprehensive specification.` },

  // ─── CRITERIA — MYP Criterion B (Developing Ideas) — G7 (experimental/testing) ──

  { id: 'crit-b-g7-1', label: '1', section: 'Criteria', grades: [7], criterionGroup: 'B',
    text: (n, p) => `${n} found it challenging to generate and test ideas for their machine design, making limited progress in exploring different configurations or justifying a chosen direction.` },

  { id: 'crit-b-g7-2', label: '2', section: 'Criteria', grades: [7], criterionGroup: 'B',
    text: (n, p) => `${n} explored a limited range of design ideas through building and made limited progress in using their experiments to justify a chosen design approach.` },

  { id: 'crit-b-g7-3', label: '3', section: 'Criteria', grades: [7], criterionGroup: 'B',
    text: (n, p) => `${n} tested some ideas through hands-on building but found it challenging to use ${p.pos} experiments to develop and justify a clear final design direction.` },

  { id: 'crit-b-g7-4', label: '4', section: 'Criteria', grades: [7], criterionGroup: 'B',
    text: (n, p) => `${n} explored a range of ideas through hands-on building and testing, selecting a final design approach with some justification drawn from ${p.pos} experiments.` },

  { id: 'crit-b-g7-5', label: '5', section: 'Criteria', grades: [7], criterionGroup: 'B',
    text: (n, p) => `${n} tested a range of design ideas through building and experimentation in class, using ${p.pos} findings to justify and refine ${p.pos} chosen machine design.` },

  { id: 'crit-b-g7-6', label: '6', section: 'Criteria', grades: [7], criterionGroup: 'B',
    text: (n, p) => `${n} explored a strong range of ideas through systematic hands-on testing and building, developing and justifying ${p.pos} final design with clear reference to ${p.pos} experimental findings.` },

  { id: 'crit-b-g7-7', label: '7', section: 'Criteria', grades: [7], criterionGroup: 'B',
    text: (n, p) => `${n} conducted exceptional hands-on experimentation, exploring a broad range of configurations and using ${p.pos} findings to develop and justify an outstanding final design with great depth and precision.` },

  // ─── CRITERIA — MYP Criterion C (Creating the Solution) — G6, G10 ──────────

  { id: 'crit-c-1', label: '1', section: 'Criteria', grades: [6, 10], criterionGroup: 'C',
    text: (n, p) => `${n} had difficulty following ${p.pos} plan and completing key tasks when creating ${p.pos} product, producing limited evidence of technical skill.` },

  { id: 'crit-c-2', label: '2', section: 'Criteria', grades: [6, 10], criterionGroup: 'C',
    text: (n, p) => `${n} made limited progress in creating ${p.pos} product and found it challenging to follow ${p.pos} plan or demonstrate consistent technical skill.` },

  { id: 'crit-c-3', label: '3', section: 'Criteria', grades: [6, 10], criterionGroup: 'C',
    text: (n, p) => `${n} made progress in creating ${p.pos} product but found some stages of construction challenging, with the final outcome only partially reflecting ${p.pos} intended design.` },

  { id: 'crit-c-4', label: '4', section: 'Criteria', grades: [6, 10], criterionGroup: 'C',
    text: (n, p) => `${n} created a functional product, following ${p.pos} plan and demonstrating adequate technical skill throughout the construction process.` },

  { id: 'crit-c-5', label: '5', section: 'Criteria', grades: [6, 10], criterionGroup: 'C',
    text: (n, p) => `${n} created a high-quality product, following a logical plan and demonstrating strong technical skill throughout.` },

  { id: 'crit-c-6', label: '6', section: 'Criteria', grades: [6, 10], criterionGroup: 'C',
    text: (n, p) => `${n} produced an excellent product that closely reflected ${p.pos} intended design, demonstrating impressive technical skill and careful, consistent planning.` },

  { id: 'crit-c-7', label: '7', section: 'Criteria', grades: [6, 10], criterionGroup: 'C',
    text: (n, p) => `${n} produced an outstanding product of exceptional quality, demonstrating exemplary technical skill and meticulous attention to planning and execution throughout.` },

  // ─── CRITERIA — MYP Criterion C (Creating the Solution) — G7 (machines) ────

  { id: 'crit-c-g7-1', label: '1', section: 'Criteria', grades: [7], criterionGroup: 'C',
    text: (n, p) => `${n} had difficulty finishing tasks when creating ${p.pos} machine, finding it challenging to construct moving parts that functioned as intended.` },

  { id: 'crit-c-g7-2', label: '2', section: 'Criteria', grades: [7], criterionGroup: 'C',
    text: (n, p) => `${n} made limited progress in constructing ${p.pos} machine, with most moving parts requiring further development to function correctly.` },

  { id: 'crit-c-g7-3', label: '3', section: 'Criteria', grades: [7], criterionGroup: 'C',
    text: (n, p) => `${n} made progress in building ${p.pos} machine but found some mechanisms challenging to assemble, with the final product only partially functioning as intended.` },

  { id: 'crit-c-g7-4', label: '4', section: 'Criteria', grades: [7], criterionGroup: 'C',
    text: (n, p) => `${n} constructed a machine with moving parts that demonstrated adequate technical skill, though some mechanisms required further refinement to function reliably.` },

  { id: 'crit-c-g7-5', label: '5', section: 'Criteria', grades: [7], criterionGroup: 'C',
    text: (n, p) => `${n} constructed a well-functioning machine with several moving parts, demonstrating strong technical skill in assembling and connecting mechanisms using Lego Technic.` },

  { id: 'crit-c-g7-6', label: '6', section: 'Criteria', grades: [7], criterionGroup: 'C',
    text: (n, p) => `${n} produced an excellent machine that functioned as intended, demonstrating impressive technical skill in assembling complex mechanisms with multiple well-connected moving parts.` },

  { id: 'crit-c-g7-7', label: '7', section: 'Criteria', grades: [7], criterionGroup: 'C',
    text: (n, p) => `${n} produced an outstanding machine with exceptional precision, demonstrating exemplary technical skill and creative problem-solving in the construction of complex, well-functioning mechanisms.` },

  // ─── CRITERIA — MYP Criterion D (Evaluating) — G6, G7, G10 ────────────────

  { id: 'crit-d-1', label: '1', section: 'Criteria', grades: [6, 7, 10], criterionGroup: 'D',
    text: (n, p) => `${n} found it challenging to evaluate ${p.pos} product or identify meaningful testing methods, producing limited evidence of reflection or critical thinking.` },

  { id: 'crit-d-2', label: '2', section: 'Criteria', grades: [6, 7, 10], criterionGroup: 'D',
    text: (n, p) => `${n} made a limited start to the evaluation process, with testing and reflection requiring significant further development.` },

  { id: 'crit-d-3', label: '3', section: 'Criteria', grades: [6, 7, 10], criterionGroup: 'D',
    text: (n, p) => `${n} completed some evaluation of ${p.pos} product but found it challenging to use specific evidence or test data to support ${p.pos} conclusions.` },

  { id: 'crit-d-4', label: '4', section: 'Criteria', grades: [6, 7, 10], criterionGroup: 'D',
    text: (n, p) => `${n} evaluated ${p.pos} product and identified some areas for improvement, with some reference to testing and the design specification.` },

  { id: 'crit-d-5', label: '5', section: 'Criteria', grades: [6, 7, 10], criterionGroup: 'D',
    text: (n, p) => `${n} conducted meaningful testing and produced a clear evaluation, linking ${p.pos} conclusions to the design specification and identifying relevant improvements.` },

  { id: 'crit-d-6', label: '6', section: 'Criteria', grades: [6, 7, 10], criterionGroup: 'D',
    text: (n, p) => `${n} excelled at developing testing methods and evaluating ${p.pos} work, producing a detailed and well-supported evaluation with insightful suggestions for improvement.` },

  { id: 'crit-d-7', label: '7', section: 'Criteria', grades: [6, 7, 10], criterionGroup: 'D',
    text: (n, p) => `${n} produced an exceptional evaluation, using comprehensive testing data to critically assess ${p.pos} product against the design specification and identify sophisticated, well-reasoned improvements.` },

  // ─── CRITERIA — DP G11 (criterionGroup A = Design Process) ─────────────────

  { id: 'crit-dp-a-1', label: '1', section: 'Criteria', grades: [11], criterionGroup: 'A',
    text: (n, p) => `${n} found it challenging to engage with the design process across assessed tasks, producing limited evidence of analytical thinking or structured design reasoning.` },

  { id: 'crit-dp-a-2', label: '2', section: 'Criteria', grades: [11], criterionGroup: 'A',
    text: (n, p) => `${n} made limited progress in applying the design process and would benefit from significant development in structuring analytical and evaluative thinking across tasks.` },

  { id: 'crit-dp-a-3', label: '3', section: 'Criteria', grades: [11], criterionGroup: 'A',
    text: (n, p) => `${n} demonstrated some understanding of the design process but found it challenging to apply it consistently across all stages of assessed tasks.` },

  { id: 'crit-dp-a-4', label: '4', section: 'Criteria', grades: [11], criterionGroup: 'A',
    text: (n, p) => `${n} demonstrated a competent understanding of the design process, engaging adequately with analysis, ideation, and evaluation in assessed work.` },

  { id: 'crit-dp-a-5', label: '5', section: 'Criteria', grades: [11], criterionGroup: 'A',
    text: (n, p) => `${n} demonstrated a solid command of the design process across assessed tasks, effectively engaging with analysis, development, and evaluation.` },

  { id: 'crit-dp-a-6', label: '6', section: 'Criteria', grades: [11], criterionGroup: 'A',
    text: (n, p) => `${n} demonstrated a strong and consistent command of the design process, moving confidently between analysis, ideation, development, and evaluation across all assessed tasks.` },

  { id: 'crit-dp-a-7', label: '7', section: 'Criteria', grades: [11], criterionGroup: 'A',
    text: (n, p) => `${n} demonstrated an exceptional command of the design process, producing outstanding work that reflected sophisticated analytical thinking and seamless integration of all design stages.` },

  // ─── CRITERIA — DP G11 (criterionGroup B = Paper Performance) ──────────────

  { id: 'crit-dp-b-1', label: '1', section: 'Criteria', grades: [11], criterionGroup: 'B',
    text: (n, p) => `${n} found assessments very challenging this year, requiring significant support in understanding and applying Standard Level course content.` },

  { id: 'crit-dp-b-2', label: '2', section: 'Criteria', grades: [11], criterionGroup: 'B',
    text: (n, p) => `${n} found assessments challenging throughout the year and would benefit from targeted review of key Standard Level topics and structured response practice.` },

  { id: 'crit-dp-b-3', label: '3', section: 'Criteria', grades: [11], criterionGroup: 'B',
    text: (n, p) => `${n} demonstrated a partial understanding of course content in assessments and should focus on building confidence in applying knowledge to unfamiliar questions.` },

  { id: 'crit-dp-b-4', label: '4', section: 'Criteria', grades: [11], criterionGroup: 'B',
    text: (n, p) => `${n} performed competently in tests and in-class assessments, demonstrating a reasonable understanding of Standard Level topics.` },

  { id: 'crit-dp-b-5', label: '5', section: 'Criteria', grades: [11], criterionGroup: 'B',
    text: (n, p) => `${n} performed well in tests and in-class assessments throughout the year, demonstrating a solid and growing understanding of Standard Level content.` },

  { id: 'crit-dp-b-6', label: '6', section: 'Criteria', grades: [11], criterionGroup: 'B',
    text: (n, p) => `${n} performed strongly in tests and in-class assessments throughout the year, demonstrating consistent and confident understanding of Standard Level topics.` },

  { id: 'crit-dp-b-7', label: '7', section: 'Criteria', grades: [11], criterionGroup: 'B',
    text: (n, p) => `${n} performed exceptionally in assessments, demonstrating outstanding knowledge and application of Standard Level content across all topics assessed.` },

  // ─── CRITERIA — DP G11 (criterionGroup C = IA Work) ────────────────────────

  { id: 'crit-dp-c-1', label: '1', section: 'Criteria', grades: [11], criterionGroup: 'C',
    text: (n, p) => `${n} made very limited progress on the Individual Assessment (IA) and should prioritise establishing a clear design context and research question as a matter of urgency.` },

  { id: 'crit-dp-c-2', label: '2', section: 'Criteria', grades: [11], criterionGroup: 'C',
    text: (n, p) => `${n} made limited progress on the Individual Assessment (IA) and should focus on identifying a specific design problem and developing a focused research direction.` },

  { id: 'crit-dp-c-3', label: '3', section: 'Criteria', grades: [11], criterionGroup: 'C',
    text: (n, p) => `${n} is in the early stages of the Individual Assessment (IA) and should focus on narrowing ${p.pos} research question and establishing a clearer, more specific design context.` },

  { id: 'crit-dp-c-4', label: '4', section: 'Criteria', grades: [11], criterionGroup: 'C',
    text: (n, p) => `${n} has made a reasonable start to the Individual Assessment (IA), identifying a design context and beginning to develop a research question.` },

  { id: 'crit-dp-c-5', label: '5', section: 'Criteria', grades: [11], criterionGroup: 'C',
    text: (n, p) => `${n} has made good progress on the Individual Assessment (IA), developing a focused research question and identifying relevant design sources and context.` },

  { id: 'crit-dp-c-6', label: '6', section: 'Criteria', grades: [11], criterionGroup: 'C',
    text: (n, p) => `${n} has made strong progress on the Individual Assessment (IA), developing a well-defined research question with a clear and well-supported design context.` },

  { id: 'crit-dp-c-7', label: '7', section: 'Criteria', grades: [11], criterionGroup: 'C',
    text: (n, p) => `${n} has made exceptional progress on the Individual Assessment (IA), producing a sophisticated and well-grounded research question supported by extensive design context and source engagement.` },

  // ─── ATL SKILLS ────────────────────────────────────────────────────────────

  { id: 'atl-comm-strong', label: 'Communication: Strong',
    section: 'ATL', grades: [6, 7, 10, 11],
    text: (n, p) => `${n} has demonstrated strong communication skills (approaches to learning) throughout this semester, presenting and documenting ${p.pos} design work clearly and effectively.` },

  { id: 'atl-comm-developing', label: 'Communication: Developing',
    section: 'ATL', grades: [6, 7, 10, 11],
    text: (n, p) => `${n} is developing ${p.pos} communication skills (approaches to learning) and should focus on presenting and explaining design decisions with greater clarity and precision.` },

  { id: 'atl-research-strong', label: 'Research: Strong',
    section: 'ATL', grades: [6, 7, 10, 11],
    text: (n, p) => `${n} demonstrated effective research skills (approaches to learning), gathering and evaluating relevant information to inform ${p.pos} design decisions throughout the process.` },

  { id: 'atl-research-developing', label: 'Research: Developing',
    section: 'ATL', grades: [6, 7, 10, 11],
    text: (n, p) => `${n} is developing ${p.pos} research skills (approaches to learning) and should focus on selecting and evaluating sources more critically to strengthen ${p.pos} design decisions.` },

  { id: 'atl-selfmgmt-strong', label: 'Self-Management: Strong',
    section: 'ATL', grades: [6, 7, 10, 11],
    text: (n, p) => `${n} consistently submitted work on time and managed ${p.pos} workload independently, demonstrating strong self-management skills (approaches to learning).` },

  { id: 'atl-selfmgmt-developing', label: 'Self-Management: Developing',
    section: 'ATL', grades: [6, 7, 10, 11],
    text: (n, p) => `${n} is developing ${p.pos} self-management skills (approaches to learning) and would benefit from managing deadlines and materials more consistently throughout the design process.` },

  { id: 'atl-thinking-strong', label: 'Critical Thinking: Strong',
    section: 'ATL', grades: [6, 7, 10, 11],
    text: (n, p) => `${n} applied strong critical thinking skills (approaches to learning), particularly when evaluating design decisions and identifying areas for improvement.` },

  { id: 'atl-thinking-developing', label: 'Critical Thinking: Developing',
    section: 'ATL', grades: [6, 7, 10, 11],
    text: (n, p) => `${n} is developing ${p.pos} critical thinking skills (approaches to learning) and should focus on evaluating ${p.pos} design decisions with greater analytical depth and specificity.` },

  { id: 'atl-collab', label: 'Collaboration',
    section: 'ATL', grades: [6, 7, 10, 11],
    text: (n, p) => `${n} worked effectively with peers during collaborative activities, contributing positively to group discussions and peer feedback throughout the semester.` },

  { id: 'atl-info-literacy', label: 'Information Literacy',
    section: 'ATL', grades: [6, 7, 10, 11],
    text: (n, p) => `${n} demonstrated developing information literacy skills (approaches to learning), locating and using relevant sources to support ${p.pos} design research.` },

  // ─── IMPROVEMENT ───────────────────────────────────────────────────────────

  { id: 'imp-class-time', label: 'Using Class Time',
    section: 'Improvement', grades: [6, 7, 10],
    text: (n, p) => `${n} would benefit from making better use of class time, staying focused on design tasks and using the available time to complete and refine ${p.pos} work to the highest possible standard.` },

  { id: 'imp-ask-questions', label: 'Asking Questions',
    section: 'Improvement', grades: [6, 7],
    text: (n, p) => `${n} should feel encouraged to ask questions when unsure what to do, as seeking clarification early will help ${p.obj} make better progress and avoid misunderstandings about task requirements.` },

  { id: 'imp-attention-detail', label: 'Attention to Detail',
    section: 'Improvement', grades: [6, 7, 10],
    text: (n, p) => `${n} should focus on paying closer attention to task instructions and details, as careful reading of requirements will help ${p.obj} produce work that more fully addresses what is being asked.` },

  { id: 'imp-following-instructions', label: 'Following Instructions',
    section: 'Improvement', grades: [6, 7],
    text: (n, p) => `${n} would benefit from listening more carefully when instructions are given in class, as this will help ${p.obj} begin tasks promptly and with a clear understanding of the expectations.` },

  { id: 'imp-research-depth', label: 'Research Depth',
    section: 'Improvement', grades: [6, 7, 10, 11],
    text: (n, p) => `${n} would benefit from developing more thorough research, particularly in justifying design decisions with specific and varied evidence.` },

  { id: 'imp-design-justification', label: 'Design Justification',
    section: 'Improvement', grades: [6, 7, 10, 11],
    text: (n, p) => `${n} should focus on providing more detailed justification for ${p.pos} design choices, clearly linking decisions back to the design specification throughout the process.` },

  { id: 'imp-evaluation-depth', label: 'Evaluation Depth',
    section: 'Improvement', grades: [6, 7, 10, 11],
    text: (n, p) => `${n} should aim to develop more detailed evaluations, using specific test results and evidence to assess ${p.pos} product against the original design specification.` },

  { id: 'imp-time-management', label: 'Time Management',
    section: 'Improvement', grades: [6, 7, 10, 11],
    text: (n, p) => `${n} would benefit from managing ${p.pos} time more effectively to ensure all stages of the design cycle are completed to the highest possible standard.` },

  { id: 'imp-deadline', label: 'Meeting Deadlines',
    section: 'Improvement', grades: [6, 7, 10, 11],
    text: (n, p) => `${n} should focus on meeting submission deadlines consistently, as late or incomplete work has impacted ${p.pos} overall achievement this semester.` },

  { id: 'imp-presentation', label: 'Presentation Quality',
    section: 'Improvement', grades: [6, 7, 10, 11],
    text: (n, p) => `${n} should focus on presenting ${p.pos} work more clearly and professionally, ensuring that drawings, annotations, and written responses are organised and detailed.` },

  { id: 'imp-spec-adherence', label: 'Specification Adherence',
    section: 'Improvement', grades: [6, 7, 10],
    text: (n, p) => `${n} should ensure that ${p.pos} design decisions are consistently evaluated against the design specification throughout all stages of the process.` },

  { id: 'imp-mechanism-understanding', label: 'Mechanism Understanding',
    section: 'Improvement', grades: [7],
    text: (n, p) => `${n} would benefit from developing a stronger understanding of how mechanisms translate and transform motion, as this will support more effective design and construction decisions.` },

  { id: 'imp-build-testing', label: 'More Build Testing',
    section: 'Improvement', grades: [7],
    text: (n, p) => `${n} should focus on testing a greater range of configurations during the design process, using hands-on experimentation to identify what works before committing to a final build.` },

  { id: 'imp-moving-parts', label: 'Moving Parts Precision',
    section: 'Improvement', grades: [7],
    text: (n, p) => `${n} should focus on ensuring all moving parts in ${p.pos} machine function correctly and reliably, paying careful attention to how components connect and interact.` },

  { id: 'imp-ia-refinement', label: 'IA: Refine Question',
    section: 'Improvement', grades: [11],
    text: (n, p) => `${n} should now focus on refining ${p.pos} Individual Assessment (IA) research question to ensure it is specific, testable, and well-supported by relevant design theory.` },

  { id: 'imp-ia-sources', label: 'IA: Strengthen Sources',
    section: 'Improvement', grades: [11],
    text: (n, p) => `${n} should prioritise identifying and engaging with a broader range of academic and industry sources to strengthen the theoretical foundation of ${p.pos} Individual Assessment (IA).` },

  { id: 'imp-exam-technique', label: 'Exam Technique',
    section: 'Improvement', grades: [11],
    text: (n, p) => `${n} would benefit from developing ${p.pos} exam technique, particularly when structuring extended responses to design analysis and evaluation questions.` },

  { id: 'imp-fusion', label: 'Fusion 360 Development',
    section: 'Improvement', grades: [11],
    text: (n, p) => `${n} should continue to develop ${p.pos} technical proficiency in Fusion 360, particularly in relation to parametric design and accurate modelling in preparation for the Individual Assessment (IA).` },

  { id: 'imp-class-participation', label: 'Class Participation',
    section: 'Improvement', grades: [6, 7, 10, 11],
    text: (n, p) => `${n} would benefit from participating more actively in class discussions, as verbal engagement with design concepts supports deeper understanding and stronger written responses.` },

  // ─── SUGGESTIONS ───────────────────────────────────────────────────────────

  { id: 'sug-explore-design', label: 'Explore Design',
    section: 'Suggestions', grades: [6, 7, 10, 11],
    text: (n, p) => `Over the break, ${n} is encouraged to explore design in everyday contexts and consider how products are developed to meet the needs of specific users.` },

  { id: 'sug-review-content', label: 'Review Course Content',
    section: 'Suggestions', grades: [6, 7, 10, 11],
    text: (n, p) => `Over the break, ${n} is encouraged to review key course concepts and reflect on the feedback received throughout this semester.` },

  { id: 'sug-study-guide', label: 'Study Guide Review',
    section: 'Suggestions', grades: [6, 7, 10, 11],
    text: (n, p) => `Over the break, ${n} is encouraged to review ${p.pos} notes and feedback from this semester to consolidate ${p.pos} understanding ahead of the next reporting period.` },

  { id: 'sug-exhibitions', label: 'Visit Exhibitions',
    section: 'Suggestions', grades: [10, 11],
    text: (n, p) => `${n} is encouraged to visit design exhibitions or explore design publications over the break to broaden ${p.pos} awareness of contemporary design practice and innovation.` },

  { id: 'sug-ia-summer', label: 'IA Summer Prep',
    section: 'Suggestions', grades: [11],
    text: (n, p) => `Over the summer, ${n} should refine ${p.pos} Individual Assessment (IA) research question and begin identifying and reviewing relevant academic and design sources.` },

  { id: 'sug-fusion-practice', label: 'Fusion 360 Practice',
    section: 'Suggestions', grades: [11],
    text: (n, p) => `Over the summer, ${n} is encouraged to continue practicing with Fusion 360 to strengthen ${p.pos} technical design skills in preparation for the Individual Assessment (IA) modelling stages.` },

  { id: 'sug-portfolio', label: 'Portfolio Building',
    section: 'Suggestions', grades: [10, 11],
    text: (n, p) => `${n} is encouraged to begin compiling a personal design portfolio, documenting key projects and reflecting on ${p.pos} development as a designer.` },

  { id: 'sug-catch-up', label: 'Catch Up on Work',
    section: 'Suggestions', grades: [6, 7, 10, 11],
    text: (n, p) => `Over the break, ${n} is encouraged to use the time to complete or revisit any outstanding work to ensure ${p.pos} portfolio is complete before the next reporting period.` },

  // ─── CLOSING ───────────────────────────────────────────────────────────────

  { id: 'close-keep-going', label: 'Keep Going',
    section: 'Closing', grades: [6, 7, 10, 11],
    text: (n, p) => `Keep going, ${n} — you are making steady progress.` },

  { id: 'close-great-work', label: 'Great Work',
    section: 'Closing', grades: [6, 7, 10, 11],
    text: (n, p) => `Keep up the excellent work, ${n}!` },

  { id: 'close-wonderful-break', label: 'Wonderful Break',
    section: 'Closing', grades: [6, 7, 10, 11],
    text: (n, p) => `Have a wonderful break, ${n}!` },

  { id: 'close-summer-break', label: 'Summer Break',
    section: 'Closing', grades: [6, 7, 10, 11],
    text: (n, p) => `Have a wonderful summer break, ${n}!` },

  { id: 'close-proud', label: 'Feel Proud',
    section: 'Closing', grades: [6, 7, 10, 11],
    text: (n, p) => `${n} should feel proud of the progress made this semester.` },

  { id: 'close-looking-forward', label: 'Looking Forward',
    section: 'Closing', grades: [6, 7, 10, 11],
    text: (n, p) => `${n} should feel encouraged by the progress made this semester and approach the coming term with continued focus and commitment.` },

  { id: 'close-challenge-next', label: 'Challenge Ahead',
    section: 'Closing', grades: [6, 7, 10, 11],
    text: (n, p) => `${n} is well-positioned to meet the challenges ahead and should approach next semester with confidence and ambition.` },
];

// Sub-group metadata for SubjectContent rendering
const SUBJECT_SUBGROUPS = {
  lego:       { label: 'Lego Design Project',       grades: [6]  },
  mechanisms: { label: 'Mechanisms Project',         grades: [7]  },
  studio:     { label: 'Studio Project',             grades: [10] },
  dp:         { label: 'DP — Overall Performance',   grades: [11] },
  'dp-ia':    { label: 'IA Progress',               grades: [11] },
};
