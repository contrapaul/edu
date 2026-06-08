I need your help to make a web tool that allows me and others to quickly prepare a visual seating plan for the school auditorium. The way I have it currently laid out is effectively a table, with each seat represented along with the auditorium hallways and other "landmarks" shown (the sound booth, exits, stage, etc). Students come to the auditorium and locate their class position on the screen. What I'd like is the same kind of visual representation, plus the ability to choose a color or effect, click and drag to "paint" through all the seats needed for a class, and have the seats automatically change to that color when clicked on or dragged through. We'll select 'Add group' on the top left. Selecting this presents us with a pop-up Colors and Effects menu . The menu states Colors and Effects at the top in a large and readable Jetbrains Bold Italic font (located in WEB folder in root directory). This menu is presented in a large grid with colors inside circles with names under them. I want a range of vibrant colors and some cool effects, such as RGB glow and the Orange/Pink/Yellow spinning gradient produced earlier. After the first seat is painted a card is added to the page margins in the same color or effect. The cards have the text "Group name" in Jetbrains bold italic. We can click on the card to type in the actual group name. Typed in names are presented in Jetbrains extrabold. Each card also has a small cog/gear indicating settings on the upper right corner. Clicking this provides a pop-up menu that is closed by clicking away. The menu includes the name of the group at the top, inside a box with a line below, indicating visually that we can type a new name or edit the existing name. Under that is a 'Change Color' button. This opens the same colors and effects menu we are shown when first clicking 'Add group'. Finally, we have the option to delete each group, which would clear the color from painted seats. Each group card must also display the number of seats painted, in Jetbrains mono. A simple rounded rectangle can represent each seat. We need 'color schemes' and 'clear all' options next to 'add group'. The color schemes option provides 8 unique color schemes, which set the appearance of the unpainted auditorium and provide colors and effects to complement the theme. These themes include 'Light', 'Dark', 'RGB', 'Phoenix' and 4 others of your choice. Phoenix uses our school colors- primaries are #630d13, #d5d5d7, white, and black. Secondaries for Phoenix are #ff7000, #ffcb00, #1c355e, #00c4df, #d7c834, and #5f6168. Effects can be used to stretch them. Each theme needs at least 16 options for groups. 

Excel map of auditorium
w	w	w	w	w	w	w	w	w	w	w	w	w	w	w	w	w	w	w	w	w	w	w	w	w	w
w	b	b	b	b	b	a	19	b	b	b	b	b	s	s	s	s	s	a	19	s	s	s	s	b	w
w	e	s	s	s	s	a	18	b	b	b	b	s	s	s	s	s	s	a	18	s	s	s	s	s	w
w	e	s	s	s	s	a	17	s	s	s	s	s	s	s	s	s	s	a	17	s	s	s	s	s	w
w	s	s	s	s	s	a	16	s	s	s	s	s	s	s	s	s	s	a	16	s	s	s	s	s	w
w	s	s	s	s	s	a	15	s	s	s	s	s	s	s	s	s	s	a	15	s	s	s	s	s	w
w	s	s	s	s	s	a	14	s	s	s	s	s	s	s	s	s	s	a	14	s	s	s	s	s	w
w	s	s	s	s	s	a	13	s	s	s	s	s	s	s	s	s	s	a	13	s	s	s	s	s	w
w	s	s	s	s	s	a	12	s	s	s	s	s	s	s	s	s	s	a	12	s	s	s	s	s	w
w	s	s	s	s	s	a	11	s	s	s	s	s	s	s	s	s	s	a	11	s	s	s	s	s	w
w	s	s	s	s	s	a	10	s	s	s	s	s	s	s	s	s	s	a	10	s	s	s	s	s	w
w	s	s	s	s	s	a	9	s	s	s	s	s	s	s	s	s	s	a	9	s	s	s	s	s	w
w	s	s	s	s	s	a	8	s	s	s	s	s	s	s	s	s	s	a	8	s	s	s	s	s	w
w	s	s	s	s	s	a	7	s	s	s	s	s	s	s	s	s	s	a	7	s	s	s	s	s	w
w	s	s	s	s	s	a	6	s	s	s	s	s	s	s	s	s	s	a	6	s	s	s	s	s	w
w	s	s	s	s	s	a	5	s	s	s	s	s	s	s	s	s	s	a	5	s	s	s	s	s	w
w	s	s	s	s	s	a	4	s	s	s	s	s	s	s	s	s	s	a	4	s	s	s	s	s	w
w	b	s	s	s	s	a	3	s	s	s	s	s	s	s	s	s	s	a	3	s	s	s	s	b	w
w	b	s	s	s	s	a	2	s	s	s	s	s	s	s	s	s	s	a	2	s	s	s	s	b	w
w	b	b	b	b	s	a	1	s	s	s	s	s	s	s	s	s	s	a	1	s	b	b	b	b	w
x	a	a	a	a	a	a	a	a	a	a	a	a	a	a	a	a	a	a	a	a	a	a	a	a	x
x	a	a	a	a	a	a	a	a	a	a	a	a	a	a	a	a	a	a	a	a	a	a	a	a	x
w	f	f	f	f	f	f	f	f	f	f	f	f	f	f	f	f	f	f	f	f	f	f	f	f	f

Key:
w = wall. Create a border to indicate it's an impassable edge.
b = blank space, left empty, cannot be painted, but required for correct chair layout.
s = seat. the paintable spaces representing real seats in the auditorium.
f = stage. 
a = aisle. the lowest 2 rows of aisle can be left blank, but add a line across the bottom of each other aisle row to represent the fact that, starting at row 4, the auditorium gains elevation- 1 step per row. 
b = sound booth. draw all b spaces together as one contiguous booth. 
the numbers represent each row of seating, and we must add the numbers to each aisle. In effect the number IS an aisle space, just marked as number. 

Important: Incorporate site header/footer from edu.contrapaul.com. 