# Statement audit: topic pages against the IB guide

Generated 9 October 2026 by comparing every understanding (the `<h3>` in each `obj-section`) and every "Students must be able to" line on the 24 topic pages with `officialdocs/design-technology-guide-en.pdf`, pages 29 to 56. All 161 understandings are present on the pages, with no extras.

On the pages, the label "Students must be able to" is fixed text and the statement follows it with a capital letter. The comparison ignores that capital and the label itself.

## Outcome

- 77 statements differed in wording. 75 were restored to the guide wording on 9 October; the other two (A3.3.8, B3.1.3) differ only because the guide itself drops a word.
- 19 statements differ only in typography. These are left as they are (see below).
- After the restoration, a fresh comparison finds no differences between the guide and the pages other than punctuation and -ise spelling.
- Where a restored statement now asks for something the notes underneath do not cover, its status line says so. Most of these are on A3.4.

## Conventions applied

- British spelling is kept: the restored statements use -ise (utilise, specialised, categorised, mechanisation, customisation, dematerialisation, anodising, galvanising, prioritise).
- Straight apostrophes and quotation marks are kept, as on the rest of the site. Other punctuation follows the guide where a statement was restored.
- Where the guide does not begin a statement with "be able to" (A4.1.2 "must be aware of", C1.1.1 "must outline"), that objective's label reads "Students must" instead.
- Where the guide puts a second "Students must be able to…" sentence inside one statement (A3.4.4, A3.4.5, B4.1.4), it is kept as written.

## Notes to update (for review)

Restoring the statements changed what some objectives ask for. The notes under these objectives do not yet cover everything the restored statements require. Nothing below has been changed yet.

### a3.4-electronic-systems.html

| Objective | What the statement now asks for | What the notes cover now | Proposed change |
| --- | --- | --- | --- |
| 3.4.7 | The purpose of basic analogue and digital input components, including switches and sensors for light, temperature, humidity and sound | A sensor table with LDR, thermistor, microphone, PIR, ultrasonic, push switch and potentiometer | Add a humidity sensor row. Add a short paragraph on switches as digital inputs (on or off) against sensors as analogue inputs (a continuous range), since the statement asks for both kinds. |
| 3.4.8 | Compare analogue and digital process components: signal conditioning (analogue) against program control (digital) | Logic ICs, microcontrollers, single-board computers and FPGAs | Add signal conditioning (amplifying, filtering and comparing a sensor signal in hardware) and program control (a microcontroller running a program), with a side-by-side comparison. The FPGA and single-board computer material goes beyond the statement and could be cut or marked as extension. |
| 3.4.9 | The microcontroller as a programmable integrated circuit (PIC) into which software can be loaded to carry out a range of processing tasks | Control circuits in everyday products (thermostat, street light, washing machine, battery management) | Move the microcontroller explanation from 3.4.8 to here, and add how a program is written, loaded and changed. The control-circuit examples can stay as applications. |
| 3.4.10 | Analogue and digital output components, restricted to motors, haptic devices, buzzers, speakers, headphones, printers, lights, plotters, relays, braille display, LED and LCD | An output table with LEDs, LCD/OLED, DC, servo and stepper motors, loudspeaker or buzzer, solenoid and heating element | Add haptic devices, headphones, printers, plotters, relays and braille displays. Solenoids and heating elements are outside the guide's restricted list; remove them or label them as extension. |
| 3.4.11 | Compare open- and closed-loop systems, identify where each is used, and explain the purpose of feedback in a closed-loop system | Negative and positive feedback, with cruise control, op-amps, audio howl and Schmitt triggers as examples | Add open- against closed-loop systems with paired examples (a toaster on a timer against a thermostat-controlled oven). The cruise control example already fits closed loop. Positive feedback is beyond the statement and could become an extension box. |
| 3.4.12 | Common applications of op-amps, such as amplifying signals from sensors in IoT home appliances | Ideal op-amp characteristics; comparator, inverting, non-inverting and voltage follower configurations with gain formulas | Add op-amps amplifying weak sensor signals (a microphone in a smart speaker, a temperature sensor in a smart thermostat) before they reach a microcontroller. The gain formulas go beyond the statement. |
| 3.4.13 | Define an embedded system and its role in augmenting everyday products' functionality, efficiency and automation | A definition, key characteristics and examples, then I²C, SPI, UART and CAN bus | Add a short paragraph organised around functionality, efficiency and automation, using the existing examples. The communication protocols go beyond this statement (B3.4.11 covers Wi-Fi, Bluetooth and 5G). |
| 3.4.14 | Identify circuit symbols for fixed and variable resistors, capacitors, switches, relays, diodes, transistors, op-amps, and input and output devices | Symbols for a battery, resistor, capacitor, switch, LED, NPN transistor, op-amp and ground; series and parallel circuits | Add variable resistor, relay, diode, and input and output device symbols (LDR, thermistor, microphone, lamp, buzzer, motor, speaker). Series and parallel resistance is taught again in B3.4.4 and could move there. |

### a4.1-manufacturing-techniques.html

| Objective | What the statement now asks for | What the notes cover now | Proposed change |
| --- | --- | --- | --- |
| 4.1.10 | Natural and human-made finishes, including sealants (oils, wax, silicone), and how finishes enhance natural and human-made materials | Anodising, electroplating, galvanising, powder coating, ceramic coating and polishing, all on metals, polymers or glass | Add rows for oils and wax (timber: penetrating or surface protection, easy to renew) and silicone sealant (sealing joints against water). Every current row is a finish for a human-made material, so the natural-material side of the statement is uncovered. |
| 4.1.5 (understanding) | Stimuli such as pH, temperature, water and light | Heat, body heat, moisture, humidity and pH | Add light as a trigger, with one example of a light-activated 4D-printed material. |

### Smaller cases

| Page | Objective | Gap | Proposed change |
| --- | --- | --- | --- |
| a2.2 | 2.2.2 | The restored statement adds "understand how these techniques are used at different stages of design development". The notes say sketches are for early thinking and engineering drawings for manufacture, but go no further. | Add a column to the drawing table saying at which stage each type is used. |
| a2.2 | 2.2.6 | The restored statement adds "respond to emerging technologies". The notes describe SLA, FDM and SLS only. | Add a short paragraph on one or two emerging rapid prototyping technologies, or point forward to 4D and 5D printing in A4.1. |
| c2.1 | 2.1.2 | The guide spells the author "Datchefski" and dates the principles 1999. The understanding now uses the correct spelling, Datschefski, with the guide's date. The notes underneath cite 2001. | Decide whether the notes should cite 1999 (the guide's date for the principles) or keep 2001 (his book) and say why the dates differ. |

## Wording differences

### a1.1-ergonomics.html

**A1.1.1 Understanding**

- Guide: Ergonomics is the relationship and interaction between people (aspects of the human body) and the products, systems and environments they use.
- Page before: Ergonomics is the relationship and interaction between people and the products, systems and environments they use.
- Status: fixed 9 October, guide wording restored.

**A1.1.2 Understanding**

- Guide: Anthropometrics involves the measurement of human physical dimensions expressed in the percentile range. This method specifically focuses on determining and presenting the range of individuals’ physical characteristics.
- Page before: Anthropometrics involves the measurement of human physical dimensions expressed in the percentile range.
- Status: fixed 9 October, guide wording restored.

**A1.1.2 Students must**

- Guide: Students must be able to explain and use static and dynamic anthropometric data to design for different people and be able to discuss how factors such as age, gender, ethnicity and disability affect the anthropometric data.
- Page before: Students must be able to explain and use static and dynamic anthropometric data to design for different people and discuss how factors such as age, gender, ethnicity and disability affect the anthropometric data.
- Status: fixed 9 October, guide wording restored.

**A1.1.4 Understanding**

- Guide: To ensure products are appropriate to a range of percentiles, designers can choose to design products to be adjustable and/or to be produced in a range of sizes.
- Page before: To ensure products are appropriate to a range of percentiles, designers can choose to design products to be adjustable and/or produced in a range of sizes.
- Status: fixed 9 October, guide wording restored.

### a2.1-user-centred-research.html

**A2.1.1 Students must**

- Guide: Students must be able to explain how developing empathy with users through an understanding of their needs and carrying out (behaviours) tasks in a specified environment leads to better design.
- Page before: Students must be able to explain how developing empathy with users through an understanding of their needs and carrying out tasks in a specified environment leads to better design.
- Status: fixed 9 October, guide wording restored.

**A2.1.2 Understanding**

- Guide: UCD is a design process that pays particular attention to the needs of potential users of a product through involvement of users at all stages of the design process.
- Page before: UCD is a design process that pays particular attention to the needs of potential users through involvement of users at all stages of the design process.
- Status: fixed 9 October, guide wording restored.

**A2.1.4 Understanding**

- Guide: User-centred research methods can be used to understand a user population(s).
- Page before: User-centred research methods can be used to understand a user population.
- Status: fixed 9 October, guide wording restored.

### a2.2-prototyping-techniques.html

**A2.2.2 Understanding**

- Guide: Drawings, either manual or prepared using computer-aided design (CAD) software, are used to explore, refine and communicate ideas.
- Page before: Drawings, either manual or prepared using CAD software, are used to explore, refine and communicate ideas.
- Status: fixed 9 October, guide wording restored.

**A2.2.2 Students must**

- Guide: Students must be able to outline why designers use drawings to explore, refine and communicate ideas (including informal drawing techniques such as free-hand sketching and formal drawing techniques such as assembled drawing (isometric), orthographic projection and exploded drawings), the advantages and disadvantages of using informal and formal drawing processes, and understand how these techniques are used at different stages of design development.
- Page before: Students must be able to outline why designers use drawings to explore, refine and communicate ideas (including free-hand sketching, isometric, orthographic projection and exploded drawings) and the advantages and disadvantages of informal and formal drawing processes.
- Status: fixed 9 October, guide wording restored. The notes compare formal and informal drawings but only touch on when each is used during design development. Worth a short addition.

**A2.2.4 Students must**

- Guide: Students must be able to explain how and why designers use physical prototypes (including scale, aesthetics, materials, function and performance) to enhance the development towards a final product.
- Page before: Students must be able to explain how and why designers use physical prototypes (including scale, aesthetics, materials, function and performance) to enhance development towards a final product.
- Status: fixed 9 October, guide wording restored.

**A2.2.5 Understanding**

- Guide: CAD is used to create virtual prototypes to test ideas and gather insights that inform the development of a product.
- Page before: CAD is used to create virtual prototypes to test ideas and gather insights that inform product development.
- Status: fixed 9 October, guide wording restored.

**A2.2.5 Students must**

- Guide: Students must be able to explain how and why designers use virtual prototypes, including the use of surface and solid models, generative design, digital humans, motion capture, haptic technology, virtual reality (VR) or augmented reality (AR), and finite element analysis (FEA).
- Page before: Students must be able to explain how and why designers use virtual prototypes, including surface and solid models, generative design, digital humans, motion capture, haptic technology, VR/AR, and finite element analysis (FEA).
- Status: fixed 9 October, guide wording restored.

**A2.2.6 Understanding**

- Guide: Rapid prototyping is used to create physical prototypes quickly for potential users and design teams to interact with them and provide feedback to drive design development forward.
- Page before: Rapid prototyping is used to create physical prototypes quickly for potential users and design teams to interact with and provide feedback.
- Status: fixed 9 October, guide wording restored.

**A2.2.6 Students must**

- Guide: Students must be able to respond to emerging technologies and describe the advantages and disadvantages of why designers use rapid prototyping techniques, such as: stereolithography (SLA), fused deposition modelling (FDM) and selective laser sintering (SLS).
- Page before: Students must be able to describe the advantages and disadvantages of rapid prototyping techniques, including stereolithography (SLA), fused deposition modelling (FDM) and selective laser sintering (SLS).
- Status: fixed 9 October, guide wording restored. The restored phrase "respond to emerging technologies" is not addressed directly in the notes.

### a3.1-material-classification.html

**A3.1.2 Understanding**

- Guide: Materials are classified according to their source or origin.
- Page before: Materials are classified according to their source or origin: natural and human-made, including timbers, polymers, metals, glass, textiles, composites, smart materials and biomaterials.
- Status: fixed 9 October, guide wording restored.

**A3.1.2 Students must**

- Guide: Students must be able to discuss frame, shell, solid and combination (for example, frame and shell) structures, and how they are used in the design of products. They need to understand that materials are classified into natural and human-made, including for example timbers, polymers, metals, glass, textiles, composites, smart materials and biomaterials.
- Page before: Students must be able to discuss frame, shell, solid and combination structures, and how they are used in the design of products. Understand that materials are classified into natural and human-made categories.
- Status: fixed 9 October, guide wording restored.

**A3.1.3 Understanding**

- Guide: Identifying the most suitable material for a product is a complex and challenging task, involving the consideration of physical, chemical and mechanical properties and aesthetic characteristics.
- Page before: Identifying the most suitable material for a product is a complex task, involving physical, chemical and mechanical properties and aesthetic characteristics.
- Status: fixed 9 October, guide wording restored.

**A3.1.3 Students must**

- Guide: Students must be able to evaluate the physical, chemical and mechanical properties to ensure the selection of the most appropriate material for a specific purpose.
- Page before: Students must be able to evaluate physical, chemical and mechanical properties to ensure selection of the most appropriate material for a specific purpose.
- Status: fixed 9 October, guide wording restored.

**A3.1.7 Students must**

- Guide: Students must be able to explain why combining materials can create composite materials more suitable for a specific purpose or context using an example.
- Page before: Students must be able to explain why combining materials can create composite materials more suitable for a specific purpose or context, using an example.
- Status: fixed 9 October, guide wording restored.

### a3.2-structural-systems.html

**A3.2.3 Students must**

- Guide: Students must be able to identify simply supported beams, fixed beams, cantilever beams, continuously supported beams, and columns, and explain their function.
- Page before: Students must be able to identify simply supported beams, fixed beams, cantilever beams, continuously supported beams and columns, and explain their function.
- Status: fixed 9 October, guide wording restored.

**A3.2.5 Students must**

- Guide: Students must be able to describe the relationship between stress and strain on a material under stress, and be able to outline Young’s Modulus, yield strength, ultimate strength and fracture in the context of a stress-strain graph.
- Page before: Students must be able to describe the relationship between stress and strain on a material under stress, and outline Young's Modulus, yield strength, ultimate strength and fracture in the context of a stress-strain graph.
- Status: fixed 9 October, guide wording restored.

**A3.2.6 Students must**

- Guide: Students must be able to compare materials with a high Young’s Modulus and those with a low Young’s Modulus in terms of how they react when placed under stress, and explain why this is important when designing structures.
- Page before: Students must be able to compare materials with a high Young's Modulus and those with a low Young's Modulus in terms of how they react under stress, and explain why this is important when designing structures.
- Status: fixed 9 October, guide wording restored.

**A3.2.7 Students must**

- Guide: Students must be able to describe when a structure is in equilibrium and identify the conditions where a structure will fail (not in equilibrium).
- Page before: Students must be able to describe when a structure is in equilibrium and identify the conditions where a structure will fail.
- Status: fixed 9 October, guide wording restored.

**A3.2.9 Students must**

- Guide: Students must be able to define an SF as a ratio of a structure’s absolute strength to the allowable load, and explain why structures are designed to include an SF.
- Page before: Students must be able to define a safety factor as a ratio of a structure's absolute strength to the allowable load, and explain why structures are designed to include a safety factor.
- Status: fixed 9 October, guide wording restored.

**A3.2.10 Students must**

- Guide: Students must be able to outline what an SF of 1 means for a structure, and explain why most structures have an SF above 1.
- Page before: Students must be able to outline what a safety factor of 1 means for a structure, and explain why most structures have a safety factor above 1.
- Status: fixed 9 October, guide wording restored.

### a3.3-mechanical-systems.html

**A3.3.8 Students must**

- Guide: Students must be able identify different shaped cams (pear, circular, triangular, eccentric, oval and snail) and outline how they are used providing examples.
- Page before: Students must be able to identify different shaped cams (pear, circular, triangular, eccentric, oval and snail) and outline how they are used providing examples.
- Status: no change. The guide reads "must be able identify"; the page reads correctly after its label.

### a3.4-electronic-systems.html

**A3.4.2 Understanding**

- Guide: Electronics are ubiquitous and designers need to consider how they can be created so that they may be used responsibly in homes, industry and society as well as improving aspects of modern-day life.
- Page before: Electronics are ubiquitous and designers need to consider how they can be created so that they may be used responsibly.
- Status: fixed 9 October, guide wording restored.

**A3.4.4 Students must**

- Guide: Students must be able to describe analogue systems in terms of voltage, current, resistance, frequency and power using the International System of Units (SI): ampere (A), second (s), hertz (Hz), watt (W), volt (V), ohm (Ω). Students must be able to use the following SI multipliers: p, n, μ, m, k, M, G, T.
- Page before: Students must be able to describe analogue systems in terms of voltage, current, resistance, frequency and power using SI units: ampere (A), second (s), hertz (Hz), watt (W), volt (V), ohm (Ω). Use SI multipliers: p, n, μ, m, k, M, G, T.
- Status: fixed 9 October, guide wording restored.

**A3.4.5 Students must**

- Guide: Students must be able to describe digital systems in terms of using discrete values such as binary digits and on and off signals. Students must be able to define logic gates.
- Page before: Students must be able to describe digital systems in terms of using discrete values such as binary digits and on and off signals. Define logic gates.
- Status: fixed 9 October, guide wording restored.

**A3.4.6 Students must**

- Guide: Students must be able to explain the purpose of passive electronic components, including fixed and variable resistors, capacitors, switches, relays and active components such as diodes and transistors.
- Page before: Students must be able to explain the purpose of passive electronic components, including fixed and variable resistors, capacitors, switches, relays; and active components such as diodes and transistors.
- Status: fixed 9 October, guide wording restored.

**A3.4.7 Students must**

- Guide: Students must be able to explain the purpose of basic analogue and digital input electronic components, including switches and sensors (including light, temperature, humidity and sound).
- Page before: Students must be able to identify appropriate input devices for a given electronic system, including light, sound, temperature, motion, and touch sensors.
- Status: fixed 9 October, guide wording restored. Notes gap: the input table has no humidity sensor, and switches are not discussed as input components.

**A3.4.8 Students must**

- Guide: Students must be able to compare and differentiate basic analogue and digital electronic process components, including signal conditioning (analogue) and program control (digital).
- Page before: Students must be able to describe the role of processing devices in an electronic system, including logic ICs, microcontrollers, and single-board computers.
- Status: fixed 9 October, guide wording restored. Notes gap: signal conditioning (analogue) against program control (digital) is not covered. The current notes describe logic ICs, microcontrollers, single-board computers and FPGAs instead.

**A3.4.9 Students must**

- Guide: Students must be able to describe the use of a microcontroller as a programmable integrated circuit (PIC) into which software can be loaded to carry out a range of processing tasks.
- Page before: Students must be able to describe the function of control circuits in everyday products, and explain how they monitor and respond to changing conditions.
- Status: fixed 9 October, guide wording restored. Notes gap: the microcontroller-as-PIC material sits under 3.4.8; the 3.4.9 notes describe control circuits in general. Moving or repeating the microcontroller explanation here would match the statement.

**A3.4.10 Students must**

- Guide: Students must be able to outline basic analogue and digital electronic output components. Electronic output components are restricted to motors, haptic devices, buzzers, speakers, headphones, printers, lights, plotters, relays, braille display, light-emitting diode (LED) and liquid crystal display (LCD).
- Page before: Students must be able to identify appropriate output devices for a given electronic system, including lights, displays, motors, speakers, and solenoids.
- Status: fixed 9 October, guide wording restored. Notes gap: the output table is missing haptic devices, headphones, printers, plotters and braille displays (relays are covered in 3.4.6). It includes solenoids and heating elements, which are outside the guide's restricted list.

**A3.4.11 Students must**

- Guide: Students must be able to compare open- and closed-loop electronic systems, identify where open- and closed-loop systems are used, and explain the purpose of feedback in a closed-loop system.
- Page before: Students must be able to explain the role of negative and positive feedback in electronic systems, and identify how feedback creates self-regulating systems.
- Status: fixed 9 October, guide wording restored. Notes gap: open- and closed-loop systems are never compared. The notes cover negative and positive feedback.

**A3.4.12 Understanding**

- Guide: An operational amplifier (op-amp) is a high-gain voltage amplifier with differential inputs and a single output. It is one of the basic building blocks of analogue circuits.
- Page before: An operational amplifier (op-amp) is a high-gain voltage amplifier with differential inputs and a single output.
- Status: fixed 9 October, guide wording restored.

**A3.4.12 Students must**

- Guide: Students must be able to describe the common applications of op-amps, such as analogue or digital signal amplifiers used to amplify signals from sensors in internet of things (IoT) home appliances.
- Page before: Students must be able to describe the characteristics of an ideal op-amp and explain the operation of inverting and non-inverting amplifier configurations.
- Status: fixed 9 October, guide wording restored. Notes gap: op-amps amplifying sensor signals in IoT home appliances is not covered. The notes teach ideal characteristics and gain formulas, which the guide does not ask for.

**A3.4.13 Students must**

- Guide: Students must be able to define an embedded system, encompassing its role in augmenting everyday products’ functionality, efficiency and automation.
- Page before: Students must be able to describe what an embedded system is and explain how embedded systems communicate with each other using standard protocols.
- Status: fixed 9 October, guide wording restored. Notes partly cover this (dedicated function, examples). The I²C, SPI, UART and CAN bus material goes beyond the statement.

**A3.4.14 Students must**

- Guide: Students must be able to identify the symbols used in a circuit diagram for fixed and variable resistors, capacitors, switches, relays, diodes, transistors, operational amplifiers and input and output devices.
- Page before: Students must be able to draw and interpret simple electronic circuit diagrams using standard IEC symbols, and distinguish between series and parallel circuits.
- Status: fixed 9 October, guide wording restored. Notes gap: the symbol list is missing variable resistors, relays, plain diodes, and input and output devices. Series and parallel circuits are covered in B3.4.4.

### a4.1-manufacturing-techniques.html

**A4.1.2 Understanding**

- Guide: An additive technique is the process of creating an object by constructing it one layer at a time and typically refers to 3D printing.
- Page before: Additive manufacturing builds objects layer by layer and typically refers to 3D printing.
- Status: fixed 9 October, guide wording restored.

**A4.1.2 Students must**

- Guide: Students must be aware of current and emerging 3D printing techniques to explain how components are produced using additive manufacturing techniques, including laminated object manufacture (LOM), fused deposition modelling (FDM) and stereolithography (SLA).
- Page before: Students must be able to explain how components are produced using additive manufacturing techniques, including laminated object manufacture (LOM), fused deposition modelling (FDM) and stereolithography (SLA).
- Status: fixed 9 October. The guide statement does not begin "be able to", so this objective's label now reads "Students must".

**A4.1.3 Understanding**

- Guide: Rapid prototyping is the creation of an object based on a computer model developed in a 3D modelling (CAD) program.
- Page before: Rapid prototyping creates objects from a 3D CAD model quickly to test and validate designs.
- Status: fixed 9 October, guide wording restored.

**A4.1.3 Students must**

- Guide: Students must be able to distinguish between rapid prototyping techniques used for creating initial base models, which serve as a foundation for testing and validation, as opposed to techniques used in the production of the refined products.
- Page before: Students must be able to distinguish between rapid prototyping techniques used for creating initial base models (which serve as a foundation for testing and validation) as opposed to techniques used in the production of refined products.
- Status: fixed 9 October, guide wording restored.

**A4.1.5 Understanding**

- Guide: 4D printing is an extension of 3D printing, where the physical and chemical state of a 3D printed object changes over time due to external stimuli such as pH, temperature, water and light.
- Page before: 4D printing extends 3D printing by using smart materials that change shape in response to external stimuli.
- Status: fixed 9 October, guide wording restored. The notes cover heat, water and pH as stimuli (hydrogels, SMPs). Light is not mentioned.

**A4.1.6 Understanding**

- Guide: 5D dimensional additive manufacturing involves the rotation of the extruder head and the print bed in order to print in five different axes.
- Page before: 5D additive manufacturing rotates both the extruder and print bed to print across five axes.
- Status: fixed 9 October, guide wording restored.

**A4.1.7 Understanding**

- Guide: Subtractive techniques involve removing material from an initial 3D mass to achieve a desired shape and can also be applied to 2D or flat materials to modify or change the shape.
- Page before: Subtractive techniques remove material from a solid block to achieve the desired shape.
- Status: fixed 9 October, guide wording restored.

**A4.1.8 Understanding**

- Guide: Forming techniques modify the shape of a material without adding or removing any materials.
- Page before: Forming techniques reshape material without adding or removing any of it.
- Status: fixed 9 October, guide wording restored.

**A4.1.9 Understanding**

- Guide: Joining techniques can temporarily or permanently join two or more similar or dissimilar materials together.
- Page before: Joining techniques can permanently or temporarily join similar or dissimilar materials.
- Status: fixed 9 October, guide wording restored.

**A4.1.10 Understanding**

- Guide: Finishing techniques are used to protect and enhance the surface of a component, contributing to its longevity and an overall increase in product life.
- Page before: Finishing techniques protect and enhance the surface of a component to increase its longevity.
- Status: fixed 9 October, guide wording restored.

**A4.1.10 Students must**

- Guide: Students must be able to suggest how natural and human-made finishing techniques (such as anodizing, electro-plating, galvanizing), coatings (such as powder-coating), polishing, sealants (such as oils, wax, silicone) enhance a product’s aesthetics, level of protection, durability, longevity and the ease of maintenance of natural and human-made materials.
- Page before: Students must be able to suggest how natural and human-made finishing techniques (anodising, electroplating, galvanising), coatings (powder coating), polishing, and sealants enhance a product's aesthetics, protection, durability, longevity and ease of maintenance.
- Status: fixed 9 October, guide wording restored. Notes gap: sealants (oils, wax, silicone) are missing from the finishing table.

**A4.1.11 Understanding**

- Guide: A combination of additive, subtractive, forming, joining and finishing techniques are needed to create components and products.
- Page before: A combination of techniques from all five categories is needed to create finished products.
- Status: fixed 9 October, guide wording restored.

### b1.1-user-centred-design.html

**B1.1.1 Understanding**

- Guide: User-centred design (UCD) requires a plan to structure an inquiry using user-centred research methods.
- Page before: User-Centred design (UCD) requires a plan to structure an inquiry using user-Centred research methods.
- Status: fixed 9 October, guide wording restored.

**B1.1.1 Students must**

- Guide: Students must be able to construct a plan for a UCD process based on research questions that engage with user-centred research methods.
- Page before: Students must be able to construct a plan for a UCD process based on research questions that engage with user-Centred research methods.
- Status: fixed 9 October, guide wording restored.

### b2.1-design-process.html

**B2.1.5 Students must**

- Guide: Students must be able to identify issues, problems and challenges using user-centred research methods and techniques, and to identify user needs for specific user groups to understand their experience, motivations and interactions with products and environments.
- Page before: Students must be able to identify issues, problems and challenges using user-centred research methods and techniques, and identify user needs for specific user groups to understand their experience, motivations and interactions with products and environments.
- Status: fixed 9 October, guide wording restored.

**B2.1.6 Understanding**

- Guide: Designers engage in user observation, mapping the user’s journey as they carry out a task. They use a storyboard to identify the steps in the design process and design opportunities.
- Page before: Designers engage in user observation, mapping the user's journey as they carry out a task.
- Status: fixed 9 October, guide wording restored.

### b3.1-material-selection.html

**B3.1.3 Students must**

- Guide: Students must be able identify appropriate materials based on cost, availability and sustainability.
- Page before: Students must be able to identify appropriate materials based on cost, availability and sustainability.
- Status: no change. The guide reads "must be able identify"; the page reads correctly after its label.

### b3.2-structural-systems-application.html

**B3.2.2 Students must**

- Guide: Students must be able to calculate Young’s Modulus using the formula: Young’s Modulus (E) = Tensile Stress (σ)/Tensile Strain (ε), and interpret stress-strain graphs for a given material, identifying the Young’s Modulus, yield strength, ultimate strength and fracture.
- Page before: Students must be able to calculate Young's Modulus using the formula E = σ / ε, and interpret stress-strain graphs identifying Young's Modulus, yield strength, ultimate strength and fracture.
- Status: fixed 9 October, guide wording restored.

**B3.2.5 Students must**

- Guide: Students must be able to calculate SFs using the formula: SF = Ultimate Load (Stress)/Allowable Load (Stress); calculate maximum intended loads for given structures; and design structures with an SF.
- Page before: Students must be able to calculate SFs using the formula SF = Ultimate Load (Stress) / Allowable Load (Stress); calculate maximum intended loads for given structures; and design structures with an SF.
- Status: fixed 9 October, guide wording restored.

### b3.3-mechanical-systems-application.html

**B3.3.4 Students must**

- Guide: Students must be able to calculate gear ratios and belt-driven system ratios considering the use of drive and driven gears, calculate the speed of rotation of a gear system at several points, including initial input and final output speed, and construct systems that use gears to increase or decrease speed and motion.
- Page before: Students must be able to calculate gear ratios and belt-driven system ratios, calculate the speed of rotation of a gear system at several points including initial input and final output speed, and construct systems that use gears to increase or decrease speed and motion.
- Status: fixed 9 October, guide wording restored.

### b3.4-electronic-systems-application.html

**B3.4.2 Students must**

- Guide: Students must be able to describe how to use basic electronic measuring apparatus, including multi-meters, on voltage, current and resistance ranges, and oscilloscopes to observe waveforms.
- Page before: Students must be able to describe how to use basic electronic measuring apparatus, including multi-meters on voltage, current and resistance ranges, and oscilloscopes to observe waveforms.
- Status: fixed 9 October, guide wording restored.

**B3.4.9 Students must**

- Guide: Students must be able to describe digital systems in terms of the binary number system, Boolean algebra, logic gates such as AND, OR and NOT, combinational logic circuits and sequential logic circuits, and be able to construct truth tables for a digital circuit.
- Page before: Students must be able to describe digital systems in terms of the binary number system, Boolean algebra, logic gates (AND, OR and NOT), combinational logic circuits and sequential logic circuits, and construct truth tables for a digital circuit.
- Status: fixed 9 October, guide wording restored.

**B3.4.10 Students must**

- Guide: Students must be able to determine appropriate output devices to communicate information or physically control an environment, including motors (including servos and pumps), LCD display (communication and light), buzzer (sound) and relay (mechanical).
- Page before: Students must be able to determine appropriate output devices to communicate information or physically control an environment, including motors (including servos and pumps), LCD display, buzzer and relay.
- Status: fixed 9 October, guide wording restored.

### b4.1-production-systems.html

**B4.1.4 Students must**

- Guide: Students must be able to discuss factors that influence choices of manufacturing techniques, including type of product (part) being manufactured, type of material(s) used in production, scale of production, production system, cost constraints and environmental considerations. Students must be able to justify the selection of appropriate manufacturing techniques for the production of a product.
- Page before: Students must be able to discuss factors that influence choices of manufacturing techniques, including type of product, material(s) used, scale of production, production system, cost constraints and environmental considerations; and justify the selection of appropriate manufacturing techniques for a product.
- Status: fixed 9 October, guide wording restored.

**B4.1.5 Understanding**

- Guide: The design of a production system requires an understanding of a product, its component parts and the manufacturing techniques used.
- Page before: The design of a production system requires an understanding of a product's components and the manufacturing techniques used.
- Status: fixed 9 October, guide wording restored.

### c1.1-responsibility-of-designer.html

**C1.1.1 Students must**

- Guide: Students must outline how design decisions have resulted in products that have had significant positive or negative impacts on a community or on the environment’s sustainability.
- Page before: Students must be able to outline how design decisions have resulted in products that have had significant positive or negative impacts on a community or on the environment's sustainability.
- Status: fixed 9 October. The guide statement does not begin "be able to", so this objective's label now reads "Students must".

### c2.1-design-for-sustainability.html

**C2.1.2 Understanding**

- Guide: The five principles of sustainable design are that a product must be cyclic (create no waste), solar (use clean energy), safe (cause no harm), efficient (use the least amount of energy and materials as possible) and social (support basic human rights) (Datchefski, 1999).
- Page before: The five principles of sustainable design are that a product must be cyclic, solar, safe, efficient and social (Datschefski, 2001).
- Status: fixed 9 October, guide wording restored. The guide spells the author "Datchefski". The page uses the correct spelling, Datschefski, with the guide's date (1999). The notes underneath cite the book as 2001, so the two dates now differ on the page.

**C2.1.2 Students must**

- Guide: Students must be able to analyse sustainable products to demonstrate how they meet Datchefski’s principles.
- Page before: Students must be able to analyse sustainable products to demonstrate how they meet Datschefski's principles.
- Status: fixed 9 October, guide wording restored.

**C2.1.3 Understanding**

- Guide: The triple bottom line (TBL) measures levels of success of a product in relation to social (people), economic (profit) and environmental (planet), which are key responsibilities of a designer.
- Page before: The triple bottom line (TBL) measures levels of success of a product in relation to social (people), economic (profit) and environmental (planet).
- Status: fixed 9 October, guide wording restored.

### c3.1-product-analysis.html

**C3.1.1 Understanding**

- Guide: Product analysis and evaluation is a process that involves examining a product performance to determine its strengths and weaknesses, and identify opportunities for improvement.
- Page before: Product analysis and evaluation examines product performance to determine strengths and weaknesses and identify improvement opportunities.
- Status: fixed 9 October, guide wording restored.

**C3.1.2 Understanding**

- Guide: As part of the product analysis process, a product should be tested and information gathered from a range of stakeholders.
- Page before: Product analysis should gather information from a diverse range of stakeholders.
- Status: fixed 9 October, guide wording restored.

**C3.1.3 Understanding**

- Guide: A SWOT analysis is a standard product analysis tool that is used to identify a product’s strengths, weaknesses, opportunities and threats.
- Page before: A SWOT analysis identifies a product's strengths, weaknesses, opportunities and threats.
- Status: fixed 9 October, guide wording restored.

**C3.1.5 Understanding**

- Guide: Weaknesses identified in a product or range of products can lead to opportunities for product improvement.
- Page before: Weaknesses identified in a product or range of products can lead to opportunities for improvement.
- Status: fixed 9 October, guide wording restored.

**C3.1.6 Understanding**

- Guide: Constructive discontent can be used to identify areas where the product is not meeting the needs of its users and to determine how it can be improved to meet those needs.
- Page before: Constructive discontent identifies where a product fails user needs and drives improvement.
- Status: fixed 9 October, guide wording restored.

**C3.1.7 Understanding**

- Guide: Product analysis enables designers to understand a product better.
- Page before: Product analysis enables designers to understand a product better and drive iterative improvement.
- Status: fixed 9 October, guide wording restored.

### c3.2-life-cycle-analysis.html

**C3.2.1 Understanding**

- Guide: A life-cycle analysis (also known as the five stages of life-cycle analysis) helps designers factually analyse a product’s entire life cycle in terms of sustainability.
- Page before: Life-cycle analysis helps designers factually analyse a product's entire life cycle in terms of sustainability.
- Status: fixed 9 October, guide wording restored.

**C3.2.2 Understanding**

- Guide: Designers evaluate the environmental impacts of a product or service. In the case of a product, the environmental impact is assessed from raw material extraction and processing (cradle), through the manufacture, distribution and use, to the recycling or final disposal of the materials (grave).
- Page before: Designers evaluate environmental impacts from raw material extraction (cradle) through manufacture, distribution, use, and disposal (grave).
- Status: fixed 9 October, guide wording restored.

### c4.1-design-for-manufacture.html

**C4.1.1 Understanding**

- Guide: Design for manufacture (DfM) comprises of three strategies.
- Page before: Design for manufacture (DfM) comprises three strategies.
- Status: fixed 9 October, guide wording restored.

## Typography only

No change made. These differ from the guide only in apostrophes, quotation marks or -ise spelling.

- A1.1.6 students must (a1.1-ergonomics.html)
- A3.2.6 understanding (a3.2-structural-systems.html)
- A3.4.2 students must (a3.4-electronic-systems.html)
- A3.4.7 understanding (a3.4-electronic-systems.html)
- A3.4.10 understanding (a3.4-electronic-systems.html)
- A3.4.11 understanding (a3.4-electronic-systems.html)
- B1.1.2 understanding (b1.1-user-centred-design.html)
- B1.1.2 students must (b1.1-user-centred-design.html)
- B2.1.6 students must (b2.1-design-process.html)
- B3.2.2 understanding (b3.2-structural-systems-application.html)
- B3.4.2 understanding (b3.4-electronic-systems-application.html)
- B4.1.1 students must (b4.1-production-systems.html)
- B4.1.2 understanding (b4.1-production-systems.html)
- B4.1.2 students must (b4.1-production-systems.html)
- B4.1.3 students must (b4.1-production-systems.html)
- C1.1.2 understanding (c1.1-responsibility-of-designer.html)
- C1.2.3 understanding (c1.2-inclusive-design.html)
- C2.2.2 understanding (c2.2-circular-economy.html)
- C2.2.2 students must (c2.2-circular-economy.html)
