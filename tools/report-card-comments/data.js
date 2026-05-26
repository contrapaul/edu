// PRONOUNS: sub=subject, obj=object, pos=possessive, ref=reflexive
const PRONOUNS = {
  she:  { sub: 'she',  obj: 'her',  pos: 'her',   ref: 'herself'    },
  he:   { sub: 'he',   obj: 'him',  pos: 'his',   ref: 'himself'    },
  they: { sub: 'they', obj: 'them', pos: 'their', ref: 'themselves' },
};

// Each phrase: id, label, section, grades[], criterionGroup (Criteria only), text(n,p)
// Grades: 6=MYP G6, 7=MYP G7, 10=MYP G10, 11=DP G11
// Criteria criterionGroup: 'A','B','C','D' — for G11 these map to DP categories (see comments)
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

  { id: 'gl-myp-1', label: '1',
    section: 'GradeLevel', grades: [6, 7, 10],
    text: (n, p) => `${n} is currently working at level one across the criteria, indicating that assessed work does not yet meet the standard for the course.` },

  { id: 'gl-myp-2', label: '2',
    section: 'GradeLevel', grades: [6, 7, 10],
    text: (n, p) => `${n} is currently achieving at level two, demonstrating a limited understanding of the design cycle and course requirements.` },

  { id: 'gl-myp-3', label: '3',
    section: 'GradeLevel', grades: [6, 7, 10],
    text: (n, p) => `${n} is achieving at level three, showing some understanding but requiring significant development across most criteria.` },

  { id: 'gl-myp-4', label: '4',
    section: 'GradeLevel', grades: [6, 7, 10],
    text: (n, p) => `${n} is achieving at level four overall, meeting some expectations and demonstrating a basic command of the design process.` },

  { id: 'gl-myp-5', label: '5',
    section: 'GradeLevel', grades: [6, 7, 10],
    text: (n, p) => `${n} is achieving at level five, demonstrating a good understanding of the design cycle and the ability to apply skills across most criteria.` },

  { id: 'gl-myp-6', label: '6',
    section: 'GradeLevel', grades: [6, 7, 10],
    text: (n, p) => `${n} is currently achieving at level six, producing work that demonstrates strong understanding and consistent application of design skills.` },

  { id: 'gl-myp-7', label: '7',
    section: 'GradeLevel', grades: [6, 7, 10],
    text: (n, p) => `${n} is achieving at the highest levels, producing work of exceptional quality that reflects a thorough command of the design cycle.` },

  { id: 'gl-myp-8', label: '8',
    section: 'GradeLevel', grades: [6, 7, 10],
    text: (n, p) => `${n} is achieving at the highest level, producing work of outstanding quality and demonstrating a comprehensive command of the design cycle.` },

  // ─── GRADE LEVEL — IB (G11) ────────────────────────────────────────────────

  { id: 'gl-ib-1', label: '1',
    section: 'GradeLevel', grades: [11],
    text: (n, p) => `${n} is currently achieving at level one, and significant improvement is required across all assessed components.` },

  { id: 'gl-ib-2', label: '2',
    section: 'GradeLevel', grades: [11],
    text: (n, p) => `${n} is currently achieving at level two, requiring targeted support and significant improvement across assessed tasks.` },

  { id: 'gl-ib-3', label: '3',
    section: 'GradeLevel', grades: [11],
    text: (n, p) => `${n} is currently achieving at level three, demonstrating a partial understanding of course content and requiring targeted support.` },

  { id: 'gl-ib-4', label: '4',
    section: 'GradeLevel', grades: [11],
    text: (n, p) => `${n} is achieving at level four, meeting the standard for the course and demonstrating a competent understanding of core topics.` },

  { id: 'gl-ib-5', label: '5',
    section: 'GradeLevel', grades: [11],
    text: (n, p) => `${n} is achieving at level five, demonstrating a solid understanding of course content and the ability to apply knowledge effectively.` },

  { id: 'gl-ib-6', label: '6',
    section: 'GradeLevel', grades: [11],
    text: (n, p) => `${n} is achieving at level six, producing work that demonstrates strong understanding and consistent performance across assessments.` },

  { id: 'gl-ib-7', label: '7',
    section: 'GradeLevel', grades: [11],
    text: (n, p) => `${n} is achieving at the highest level, demonstrating exceptional understanding and consistently producing work of outstanding quality.` },

  // ─── SUBJECT CONTENT ───────────────────────────────────────────────────────

  { id: 'sc-lego', label: 'Lego Project',
    section: 'SubjectContent', grades: [6],
    text: (n, p) => `This semester, the class completed a Lego set design project using Bricklink Studio, working through the full design cycle from research to a final rendered set concept, complete with original box design and building instructions.` },

  { id: 'sc-lego-personal', label: 'Lego — Personal Reference',
    section: 'SubjectContent', grades: [6],
    text: (n, p) => `${n} worked through the Lego set design project using Bricklink Studio, developing ${p.pos} own original set concept and carrying it through the full design cycle.` },

  { id: 'sc-g7-mechanisms', label: 'G7 Mechanisms Unit',
    section: 'SubjectContent', grades: [7],
    text: (n, p) => `This semester, the class explored mechanisms and machines using Lego Technic, working through the design cycle to design, build, and evaluate a machine with several moving parts.` },

  { id: 'sc-g7-machine-personal', label: 'G7 Machine — Personal',
    section: 'SubjectContent', grades: [7],
    text: (n, p) => `${n} designed and built a machine with moving parts using Lego Technic, working through the design cycle from initial experimentation to a functioning mechanism.` },

  { id: 'sc-studio', label: 'Studio Project',
    section: 'SubjectContent', grades: [10],
    text: (n, p) => `This semester, the class worked through the complete MYP design cycle, producing a studio product from initial research and ideation through to a functional prototype and formal evaluation.` },

  { id: 'sc-studio-personal', label: 'Studio — Personal Reference',
    section: 'SubjectContent', grades: [10],
    text: (n, p) => `${n} developed a studio product through the complete MYP design cycle, from initial research and ideation through to prototype construction and formal evaluation.` },

  { id: 'sc-sl-topics', label: 'SL Topics Complete',
    section: 'SubjectContent', grades: [11],
    text: (n, p) => `Over the course of the year, the class has covered all Standard Level topics in Design Technology, engaging with design theory, product analysis, and innovation across a range of contexts.` },

  { id: 'sc-tests-quizzes', label: 'Tests and Quizzes',
    section: 'SubjectContent', grades: [11],
    text: (n, p) => `Throughout the year, ${n} has completed a range of tests and in-class assessments covering Standard Level content, demonstrating ${p.pos} developing command of course material.` },

  { id: 'sc-ia-begun', label: 'IA Begun',
    section: 'SubjectContent', grades: [11],
    text: (n, p) => `${n} has begun developing ${p.pos} Individual Assessment (IA), identifying a design context and working towards a focused research question.` },

  { id: 'sc-ia-progressing', label: 'IA Progressing Well',
    section: 'SubjectContent', grades: [11],
    text: (n, p) => `${n} has made strong progress on ${p.pos} Individual Assessment (IA) and is developing a clear research question with an appropriate supporting evidence base.` },

  { id: 'sc-ia-early', label: 'IA Early Stages',
    section: 'SubjectContent', grades: [11],
    text: (n, p) => `${n} is in the early stages of developing ${p.pos} Individual Assessment (IA) and has begun to identify a potential design context.` },

  // ─── CRITERIA — MYP Criterion A (Inquiring and Analysing) ──────────────────

  { id: 'crit-a-strong', label: 'A: Strong',
    section: 'Criteria', grades: [6, 7, 10], criterionGroup: 'A',
    text: (n, p) => `In Criterion A, ${n} produced thorough research, effectively justified the need for ${p.pos} design, and developed a well-structured design brief supported by meaningful product analysis.` },

  { id: 'crit-a-developing', label: 'A: Developing',
    section: 'Criteria', grades: [6, 7, 10], criterionGroup: 'A',
    text: (n, p) => `In Criterion A, ${n} demonstrated a developing ability to justify ${p.pos} design context and conduct relevant research, though ${p.pos} design brief and product analysis would benefit from greater depth and specificity.` },

  { id: 'crit-a-support', label: 'A: Needs Support',
    section: 'Criteria', grades: [6, 7, 10], criterionGroup: 'A',
    text: (n, p) => `Criterion A remains an area requiring significant development; ${n} should focus on producing more thorough research, clearly justifying the design problem, and developing a detailed design brief.` },

  // ─── CRITERIA — MYP Criterion B (Developing Ideas) ─────────────────────────

  { id: 'crit-b-strong', label: 'B: Strong',
    section: 'Criteria', grades: [6, 7, 10], criterionGroup: 'B',
    text: (n, p) => `In Criterion B, ${n} presented a range of creative and well-developed design ideas, selecting and justifying ${p.pos} final design with clear reference to the design specification.` },

  { id: 'crit-b-developing', label: 'B: Developing',
    section: 'Criteria', grades: [6, 7, 10], criterionGroup: 'B',
    text: (n, p) => `In Criterion B, ${n} generated design ideas and selected a final concept, though the justification of ${p.pos} design decisions and the detail of ${p.pos} specifications could be further developed.` },

  { id: 'crit-b-support', label: 'B: Needs Support',
    section: 'Criteria', grades: [6, 7, 10], criterionGroup: 'B',
    text: (n, p) => `Criterion B requires attention; ${n} should focus on producing a wider range of developed ideas and providing clearer justification for ${p.pos} chosen design in relation to the specification.` },

  // ─── CRITERIA — MYP Criterion B, G7-specific (testing/experimenting) ────────

  { id: 'crit-b-g7-iterative-strong', label: 'B: Strong Testing',
    section: 'Criteria', grades: [7], criterionGroup: 'B',
    text: (n, p) => `In Criterion B, ${n} explored a strong range of ideas through hands-on building and testing in class, using ${p.pos} experiments to refine and justify ${p.pos} chosen design.` },

  { id: 'crit-b-g7-some-testing', label: 'B: Some Testing',
    section: 'Criteria', grades: [7], criterionGroup: 'B',
    text: (n, p) => `In Criterion B, ${n} tested some design ideas through hands-on building, though ${p.sub} would benefit from exploring a wider range of configurations before committing to a final design.` },

  { id: 'crit-b-g7-limited-testing', label: 'B: Limited Testing',
    section: 'Criteria', grades: [7], criterionGroup: 'B',
    text: (n, p) => `In Criterion B, ${n} should focus on testing a greater range of ideas through building and experimentation, rather than committing to an initial design without exploring alternatives.` },

  // ─── CRITERIA — MYP Criterion C (Creating the Solution) ────────────────────

  { id: 'crit-c-strong', label: 'C: Strong',
    section: 'Criteria', grades: [6, 7, 10], criterionGroup: 'C',
    text: (n, p) => `In Criterion C, ${n} demonstrated strong technical skill, followed a logical plan, and produced a high-quality outcome that closely reflected ${p.pos} intended design.` },

  { id: 'crit-c-developing', label: 'C: Developing',
    section: 'Criteria', grades: [6, 7, 10], criterionGroup: 'C',
    text: (n, p) => `In Criterion C, ${n} demonstrated developing technical skills and produced a functional outcome, though ${p.pos} planning and technical execution could be more precise and detailed.` },

  { id: 'crit-c-support', label: 'C: Needs Support',
    section: 'Criteria', grades: [6, 7, 10], criterionGroup: 'C',
    text: (n, p) => `Criterion C is an area requiring development; ${n} should focus on constructing a more detailed plan, improving technical precision, and ensuring ${p.pos} final product more accurately reflects ${p.pos} design.` },

  // ─── CRITERIA — MYP Criterion C, G7-specific (machine building) ────────────

  { id: 'crit-c-g7-machine-strong', label: 'C: Machine Strong',
    section: 'Criteria', grades: [7], criterionGroup: 'C',
    text: (n, p) => `In Criterion C, ${n} constructed a well-functioning machine with several moving parts, demonstrating strong technical skill in assembling and connecting mechanisms using Lego Technic.` },

  { id: 'crit-c-g7-machine-developing', label: 'C: Machine Developing',
    section: 'Criteria', grades: [7], criterionGroup: 'C',
    text: (n, p) => `In Criterion C, ${n} constructed a machine with moving parts, though some mechanisms did not function as intended and would benefit from further refinement and testing.` },

  { id: 'crit-c-g7-machine-support', label: 'C: Machine Needs Support',
    section: 'Criteria', grades: [7], criterionGroup: 'C',
    text: (n, p) => `In Criterion C, ${n} found the construction of a functioning machine challenging; ${p.sub} should focus on understanding how individual mechanisms connect and interact to produce controlled movement.` },

  // ─── CRITERIA — MYP Criterion D (Evaluating) ───────────────────────────────

  { id: 'crit-d-strong', label: 'D: Strong',
    section: 'Criteria', grades: [6, 7, 10], criterionGroup: 'D',
    text: (n, p) => `In Criterion D, ${n} conducted meaningful testing and produced a detailed evaluation, clearly identifying ${p.pos} product's strengths and limitations in relation to the design specification.` },

  { id: 'crit-d-developing', label: 'D: Developing',
    section: 'Criteria', grades: [6, 7, 10], criterionGroup: 'D',
    text: (n, p) => `In Criterion D, ${n} evaluated ${p.pos} product and identified some areas for improvement, though ${p.sub} should aim to use more specific evidence and test data to support ${p.pos} conclusions.` },

  { id: 'crit-d-support', label: 'D: Needs Support',
    section: 'Criteria', grades: [6, 7, 10], criterionGroup: 'D',
    text: (n, p) => `Criterion D requires further development; ${n} should focus on designing and conducting more systematic testing, and using specific results to evaluate ${p.pos} product against the design specification.` },

  // ─── CRITERIA — DP G11 (criterionGroup A = Design Process) ─────────────────

  { id: 'crit-dp-process-strong', label: 'Design Process: Strong',
    section: 'Criteria', grades: [11], criterionGroup: 'A',
    text: (n, p) => `${n} demonstrated a strong command of the design process across assessed tasks, effectively moving between analysis, ideation, development, and evaluation.` },

  { id: 'crit-dp-process-developing', label: 'Design Process: Developing',
    section: 'Criteria', grades: [11], criterionGroup: 'A',
    text: (n, p) => `${n} is developing ${p.pos} application of the design process and would benefit from ensuring all stages are addressed with equal attention and depth across assessed tasks.` },

  { id: 'crit-dp-process-limited', label: 'Design Process: Limited',
    section: 'Criteria', grades: [11], criterionGroup: 'A',
    text: (n, p) => `${n} should focus on developing a more structured approach to the design process, ensuring that analytical thinking and design justification are consistently demonstrated across tasks.` },

  // ─── CRITERIA — DP G11 (criterionGroup B = Paper Performance) ──────────────

  { id: 'crit-dp-paper-strong', label: 'Paper Performance: Strong',
    section: 'Criteria', grades: [11], criterionGroup: 'B',
    text: (n, p) => `${n} performed well on tests and in-class assessments throughout the year, demonstrating a confident and thorough understanding of Standard Level topics.` },

  { id: 'crit-dp-paper-developing', label: 'Paper Performance: Developing',
    section: 'Criteria', grades: [11], criterionGroup: 'B',
    text: (n, p) => `${n} is developing ${p.pos} ability to respond to paper-style questions and would benefit from regular practice applying course knowledge to unseen and unfamiliar contexts.` },

  { id: 'crit-dp-paper-limited', label: 'Paper Performance: Limited',
    section: 'Criteria', grades: [11], criterionGroup: 'B',
    text: (n, p) => `${n} has found assessments challenging this year and should prioritise reviewing Standard Level content, focusing particularly on structured written responses.` },

  // ─── CRITERIA — DP G11 (criterionGroup C = IA Progress) ────────────────────

  { id: 'crit-dp-ia-strong', label: 'IA Work: Strong',
    section: 'Criteria', grades: [11], criterionGroup: 'C',
    text: (n, p) => `${n} has approached ${p.pos} Individual Assessment (IA) work with focus and clarity, developing a well-defined design context and a relevant, specific research direction.` },

  { id: 'crit-dp-ia-developing', label: 'IA Work: Developing',
    section: 'Criteria', grades: [11], criterionGroup: 'C',
    text: (n, p) => `${n} is developing ${p.pos} Individual Assessment (IA) and should focus on narrowing ${p.pos} research question and establishing a clearer and more specific design context.` },

  { id: 'crit-dp-ia-early', label: 'IA Work: Early Stage',
    section: 'Criteria', grades: [11], criterionGroup: 'C',
    text: (n, p) => `${n} is in the early stages of ${p.pos} Individual Assessment (IA) and should now prioritise identifying a focused design problem and a well-defined research question.` },

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

  { id: 'imp-mechanism-understanding', label: 'Mechanism Understanding',
    section: 'Improvement', grades: [7],
    text: (n, p) => `${n} would benefit from developing a stronger understanding of how mechanisms translate and transform motion, as this will support more effective design and construction decisions.` },

  { id: 'imp-build-testing', label: 'More Build Testing',
    section: 'Improvement', grades: [7],
    text: (n, p) => `${n} should focus on testing a greater range of configurations during the design process, using hands-on experimentation to identify what works before committing to a final build.` },

  { id: 'imp-moving-parts', label: 'Moving Parts Precision',
    section: 'Improvement', grades: [7],
    text: (n, p) => `${n} should focus on ensuring all moving parts in ${p.pos} machine function correctly and reliably, paying careful attention to how components connect and interact.` },

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
