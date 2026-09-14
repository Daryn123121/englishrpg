'use strict';

/* =========================================================================
   LIFE RPG: ENGLISH EDITION
   Vanilla JS game engine. Systems are separated so new modules
   (Countries / Capitals / World Map / multiplayer / cloud save) can be
   added later without touching existing systems.
========================================================================= */

/* ============================== UTIL ==================================== */
const $ = (sel, root = document) => root.querySelector(sel);
const $all = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const uid = () => Math.random().toString(36).slice(2, 10);
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const dateFromStr = (s) => new Date(s + 'T00:00:00');
const daysBetween = (a, b) => Math.round((dateFromStr(b) - dateFromStr(a)) / 86400000);

/* ============================== LEVEL SCALE ============================= */
// Sub-levels used for adaptive difficulty; base levels used for content selection.
const LEVEL_SCALE = ['A1', 'A1+', 'A2', 'A2+', 'B1', 'B1+', 'B2', 'B2+', 'C1'];
const BASE_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];
function baseLevelOf(subLevel) {
  if (subLevel.startsWith('A1')) return 'A1';
  if (subLevel.startsWith('A2')) return 'A2';
  if (subLevel.startsWith('B1')) return 'B1';
  if (subLevel.startsWith('B2')) return 'B2';
  return 'C1';
}
const ENGLISH_LEVEL_DESC = {
  A1: "You're just starting out. Let's build your foundations.",
  A2: "You're ready for Elementary challenges.",
  B1: "You can handle everyday Intermediate English.",
  B2: "You're comfortable with Upper-Intermediate material.",
  C1: "You're operating at an Advanced level. Impressive!"
};

/* ============================== QUESTION BANK ============================
   category: vocabulary | grammar | reading | everyday
   difficulty: A1 | A2 | B1 | B2 | C1
   options: array of 4 strings, correct: index of correct option
========================================================================= */
const QUESTION_BANK = [];
let qidCounter = 1;
function addQ(category, difficulty, question, options, correct, explanation, word) {
  QUESTION_BANK.push({
    id: 'q' + (qidCounter++),
    category, difficulty, question, options, correct, explanation,
    word: word || null
  });
}

/* ---- VOCABULARY (40) ---- */
addQ('vocabulary', 'A1', "What is the opposite of 'big'?", ['small', 'tall', 'fast', 'happy'], 0, "'Small' is the opposite of 'big' in size.", 'small');
addQ('vocabulary', 'A1', "Choose the correct word: A ___ is a place where you sleep.", ['kitchen', 'bedroom', 'bathroom', 'garden'], 1, "A bedroom is the room where people sleep.", 'bedroom');
addQ('vocabulary', 'A1', "What color is the sky on a clear day?", ['green', 'blue', 'red', 'yellow'], 1, "The clear sky appears blue during the day.", 'blue');
addQ('vocabulary', 'A1', "Which word means 'a young dog'?", ['kitten', 'puppy', 'cub', 'chick'], 1, "A puppy is a baby dog.", 'puppy');
addQ('vocabulary', 'A1', "What do you call the meal you eat in the morning?", ['lunch', 'dinner', 'breakfast', 'snack'], 2, "Breakfast is the first meal of the day.", 'breakfast');
addQ('vocabulary', 'A1', "Choose the correct word: I have two ___.", ['foot', 'feet', 'foots', 'feets'], 1, "'Feet' is the irregular plural of 'foot'.", 'feet');
addQ('vocabulary', 'A1', "Which word means 'not difficult'?", ['hard', 'easy', 'heavy', 'slow'], 1, "'Easy' means something is simple to do.", 'easy');
addQ('vocabulary', 'A1', "What is the opposite of 'hot'?", ['warm', 'cold', 'wet', 'dry'], 1, "'Cold' is the opposite of 'hot' in temperature.", 'cold');

addQ('vocabulary', 'A2', "Which word means 'to look at something for a long time'?", ['glance', 'stare', 'blink', 'wink'], 1, "'Stare' means to look fixedly for a long time.", 'stare');
addQ('vocabulary', 'A2', "Choose the synonym for 'happy'.", ['sad', 'angry', 'glad', 'tired'], 2, "'Glad' is a common synonym for 'happy'.", 'glad');
addQ('vocabulary', 'A2', "What does 'borrow' mean?", ['to give something forever', 'to take something and return it later', 'to buy something', 'to lose something'], 1, "'Borrow' means to take something temporarily and give it back.", 'borrow');
addQ('vocabulary', 'A2', "Which word fits: She felt ___ after running five kilometers.", ['exhausted', 'excited', 'bored', 'curious'], 0, "'Exhausted' means extremely tired, which fits after running.", 'exhausted');
addQ('vocabulary', 'A2', "What is a synonym for 'purchase'?", ['sell', 'buy', 'return', 'lend'], 1, "'Purchase' is a formal word for 'buy'.", 'purchase');
addQ('vocabulary', 'A2', "Which word means 'a person who travels to another country to live'?", ['tourist', 'immigrant', 'pilot', 'driver'], 1, "An 'immigrant' moves to another country to live there.", 'immigrant');
addQ('vocabulary', 'A2', "Choose the correct meaning of 'rarely'.", ['often', 'always', 'not often', 'never'], 2, "'Rarely' means something happens infrequently, not often.", 'rarely');
addQ('vocabulary', 'A2', "What does 'chore' mean?", ['a fun game', 'a household task', 'a type of food', 'a holiday'], 1, "A 'chore' is a routine task, often around the house.", 'chore');

addQ('vocabulary', 'B1', "Which word means 'to make something better'?", ['worsen', 'improve', 'ignore', 'delay'], 1, "'Improve' means to make something better.", 'improve');
addQ('vocabulary', 'B1', "Choose the synonym for 'enormous'.", ['tiny', 'huge', 'average', 'narrow'], 1, "'Enormous' means extremely large, like 'huge'.", 'enormous');
addQ('vocabulary', 'B1', "What does 'reliable' mean?", ['that you can trust', 'that is expensive', 'that is broken', 'that is new'], 0, "'Reliable' describes something or someone you can trust.", 'reliable');
addQ('vocabulary', 'B1', "Which word fits: The company decided to ___ its prices due to rising costs.", ['increase', 'decrease', 'ignore', 'hide'], 0, "Rising costs typically lead a company to increase prices.", 'increase');
addQ('vocabulary', 'B1', "What is the meaning of 'postpone'?", ['to cancel completely', 'to delay to a later time', 'to finish early', 'to repeat'], 1, "'Postpone' means to move an event to a later time.", 'postpone');
addQ('vocabulary', 'B1', "Choose the correct meaning of 'ambitious'.", ['lazy', 'having a strong desire to succeed', 'shy', 'forgetful'], 1, "'Ambitious' describes someone determined to achieve success.", 'ambitious');
addQ('vocabulary', 'B1', "What does 'generous' mean?", ['unwilling to share', 'willing to give freely', 'greedy', 'careless'], 1, "A 'generous' person gives freely to others.", 'generous');
addQ('vocabulary', 'B1', "Which word means 'to discuss something in detail'?", ['elaborate', 'ignore', 'summarize briefly', 'forget'], 0, "'Elaborate' means to explain something with more detail.", 'elaborate');

addQ('vocabulary', 'B2', "What does 'meticulous' mean?", ['careless', 'very careful and precise', 'fast', 'lazy'], 1, "'Meticulous' means showing great attention to detail.", 'meticulous');
addQ('vocabulary', 'B2', "Choose the synonym for 'reluctant'.", ['eager', 'unwilling', 'confident', 'curious'], 1, "'Reluctant' means unwilling or hesitant to do something.", 'reluctant');
addQ('vocabulary', 'B2', "What is the meaning of 'to compromise'?", ['to win completely', 'to reach an agreement by both sides giving up something', 'to refuse any deal', 'to ignore a problem'], 1, "A 'compromise' is a settlement where both sides make concessions.", 'compromise');
addQ('vocabulary', 'B2', "Which word means 'existing or happening at the same time'?", ['simultaneous', 'sequential', 'occasional', 'eventual'], 0, "'Simultaneous' means happening at the same moment.", 'simultaneous');
addQ('vocabulary', 'B2', "What does 'skeptical' mean?", ['believing easily', 'doubtful about something', 'very confident', 'unaware'], 1, "'Skeptical' describes doubt about a claim or idea.", 'skeptical');
addQ('vocabulary', 'B2', "Choose the correct meaning of 'inevitable'.", ['avoidable', 'certain to happen', 'unlikely', 'optional'], 1, "'Inevitable' means something that cannot be avoided.", 'inevitable');
addQ('vocabulary', 'B2', "What does 'resilient' mean?", ['easily broken', 'able to recover quickly from difficulties', 'weak', 'stubborn'], 1, "'Resilient' describes the ability to recover quickly from setbacks.", 'resilient');
addQ('vocabulary', 'B2', "Which word means 'a strong feeling of anger caused by unfair treatment'?", ['indignation', 'admiration', 'excitement', 'sympathy'], 0, "'Indignation' is anger caused by something seen as unfair.", 'indignation');

addQ('vocabulary', 'C1', "What does 'ubiquitous' mean?", ['rare', 'present everywhere', 'hidden', 'ancient'], 1, "'Ubiquitous' means found everywhere.", 'ubiquitous');
addQ('vocabulary', 'C1', "Choose the closest meaning to 'candid'.", ['dishonest', 'secretive', 'frank and honest', 'formal'], 2, "'Candid' means being open and truthful.", 'candid');
addQ('vocabulary', 'C1', "What does 'to alleviate' mean?", ['to make worse', 'to reduce pain or difficulty', 'to ignore', 'to celebrate'], 1, "'Alleviate' means to make suffering or a problem less severe.", 'alleviate');
addQ('vocabulary', 'C1', "Which word means 'impossible to understand or explain clearly'?", ['obscure', 'evident', 'simple', 'transparent'], 0, "'Obscure' means unclear or hard to understand.", 'obscure');
addQ('vocabulary', 'C1', "What is the meaning of 'pragmatic'?", ['idealistic', 'dealing with things sensibly and realistically', 'careless', 'emotional'], 1, "'Pragmatic' means practical and realistic in approach.", 'pragmatic');
addQ('vocabulary', 'C1', "Choose the closest meaning to 'meticulously' in: 'She meticulously checked every detail of the contract.'", ['carelessly', 'extremely carefully', 'quickly', 'randomly'], 1, "'Meticulously' means with extreme care and attention to detail.", 'meticulously');
addQ('vocabulary', 'C1', "What does 'to procrastinate' mean?", ['to finish early', 'to delay doing something', 'to plan carefully', 'to work quickly'], 1, "'Procrastinate' means to put off or delay a task.", 'procrastinate');
addQ('vocabulary', 'C1', "Which word means 'lacking experience or knowledge'?", ['naive', 'sophisticated', 'expert', 'seasoned'], 0, "'Naive' describes a lack of experience or worldly wisdom.", 'naive');

/* ---- GRAMMAR (40) ---- */
addQ('grammar', 'A1', "I ___ a student.", ['am', 'is', 'are', 'be'], 0, "Use 'am' with the subject 'I'.");
addQ('grammar', 'A1', "She ___ to school every day.", ['go', 'goes', 'going', 'gone'], 1, "Third-person singular present tense adds -s: 'goes'.");
addQ('grammar', 'A1', "They ___ from Spain.", ['is', 'am', 'are', 'be'], 2, "Use 'are' with the plural subject 'they'.");
addQ('grammar', 'A1', "___ apple is red.", ['A', 'An', 'The', '—'], 1, "Use 'an' before a word starting with a vowel sound.");
addQ('grammar', 'A1', "He ___ TV every evening.", ['watch', 'watches', 'watching', 'watched'], 1, "Third-person singular present tense: 'watches'.");
addQ('grammar', 'A1', "There ___ two cats in the garden.", ['is', 'are', 'be', 'was'], 1, "Use 'are' with the plural noun 'cats'.");
addQ('grammar', 'A1', "I ___ like coffee.", ["don't", "doesn't", "isn't", 'am not'], 0, "Use 'don't' with the subject 'I' in the negative present simple.");
addQ('grammar', 'A1', "What time ___ it?", ['is', 'are', 'do', 'does'], 0, "Use 'is' to ask about time with the singular 'it'.");

addQ('grammar', 'A2', "Yesterday, I ___ to the cinema.", ['go', 'goes', 'went', 'going'], 2, "'Went' is the past simple form of 'go', used with 'yesterday'.");
addQ('grammar', 'A2', "She ___ watching TV when I called her.", ['was', 'is', 'were', 'has been'], 0, "Past continuous 'was watching' describes an action in progress.");
addQ('grammar', 'A2', "We ___ finished our homework already.", ['have', 'has', 'had', 'having'], 0, "Present perfect with 'we' uses 'have'.");
addQ('grammar', 'A2', "I am looking forward to ___ you.", ['see', 'seeing', 'saw', 'seen'], 1, "'Look forward to' is followed by a gerund: 'seeing'.");
addQ('grammar', 'A2', "There isn't ___ milk in the fridge.", ['some', 'any', 'no', 'a'], 1, "Use 'any' in negative sentences with uncountable nouns.");
addQ('grammar', 'A2', "He is the ___ student in the class.", ['tall', 'taller', 'tallest', 'most tall'], 2, "Superlative form for comparing more than two: 'tallest'.");
addQ('grammar', 'A2', "She ___ to the gym twice a week.", ['go', 'goes', 'going', 'went'], 1, "Present simple habit needs the -s form: 'goes'.");
addQ('grammar', 'A2', "Can you ___ me your pen, please?", ['lend', 'borrow', 'give away', 'take'], 0, "'Lend' means to give something temporarily to someone else.");

addQ('grammar', 'B1', "If I had more time, I ___ learn Spanish.", ['will', 'would', 'can', 'could'], 1, "Second conditional uses 'would' in the main clause.");
addQ('grammar', 'B1', "By the time we arrived, the movie ___.", ['already started', 'had already started', 'has already started', 'already starts'], 1, "Past perfect shows an action completed before another past action.");
addQ('grammar', 'B1', "She has been working here ___ 2015.", ['for', 'since', 'from', 'during'], 1, "'Since' is used with a specific starting point in time.");
addQ('grammar', 'B1', "I wish I ___ more time to study.", ['have', 'had', 'has', 'will have'], 1, "'Wish' + past simple expresses a present regret.");
addQ('grammar', 'B1', "The report ___ by the manager tomorrow.", ['will review', 'will be reviewed', 'is reviewing', 'reviewed'], 1, "Future passive voice: 'will be reviewed'.");
addQ('grammar', 'B1', "He suggested ___ a different approach.", ['to try', 'trying', 'try', 'tried'], 1, "'Suggest' is followed by a gerund: 'trying'.");
addQ('grammar', 'B1', "If it rains tomorrow, we ___ the picnic.", ['cancel', 'will cancel', 'would cancel', 'canceled'], 1, "First conditional uses 'will' in the main clause.");
addQ('grammar', 'B1', "This is the house ___ I grew up.", ['which', 'where', 'who', 'when'], 1, "'Where' introduces a relative clause about a place.");

addQ('grammar', 'B2', "Had I known about the consequences, I ___ differently.", ['would act', 'would have acted', 'will act', 'acted'], 1, "Third conditional (inverted) requires 'would have acted'.");
addQ('grammar', 'B2', "Not only ___ late, but he also forgot his keys.", ['he was', 'was he', 'he is', 'is he'], 1, "Negative inversion after 'Not only' requires subject-verb inversion.");
addQ('grammar', 'B2', "She denied ___ the money.", ['to steal', 'stealing', 'steal', 'stolen'], 1, "'Deny' is followed by a gerund: 'stealing'.");
addQ('grammar', 'B2', "By the time you read this, I ___ already left.", ['will have', 'would have', 'had', 'have'], 0, "Future perfect: 'will have already left'.");
addQ('grammar', 'B2', "It's high time we ___ a decision.", ['make', 'made', 'will make', 'making'], 1, "'It's high time' is followed by the past simple.");
addQ('grammar', 'B2', "The bridge, ___ was built in 1990, is now closed.", ['that', 'which', 'who', 'whose'], 1, "Non-defining relative clauses use 'which', not 'that'.");
addQ('grammar', 'B2', "Rarely ___ such a beautiful sunset.", ['I have seen', 'have I seen', 'I saw', 'did I saw'], 1, "Negative adverbial inversion after 'Rarely' requires 'have I seen'.");
addQ('grammar', 'B2', "He acted as if he ___ everything.", ['knows', 'knew', 'had known', 'know'], 1, "'As if' + past simple describes an unreal present situation.");

addQ('grammar', 'C1', "No sooner ___ the room than the phone rang.", ['he had entered', 'had he entered', 'he entered', 'did he enter'], 1, "'No sooner' requires inversion: 'had he entered'.");
addQ('grammar', 'C1', "___ the heavy traffic, we arrived on time.", ['Despite of', 'In spite', 'Despite', 'Although'], 2, "'Despite' is followed directly by a noun phrase, with no preposition.");
addQ('grammar', 'C1', "She would rather I ___ tomorrow instead of today.", ['come', 'came', 'will come', 'had come'], 1, "'Would rather' + subject uses the past simple for a present/future wish.");
addQ('grammar', 'C1', "It is essential that he ___ present at the meeting.", ['is', 'be', 'was', 'were'], 1, "The subjunctive mood after 'essential that' uses the base form 'be'.");
addQ('grammar', 'C1', "Were it not for your help, I ___ have failed.", ['would', 'will', 'would have', 'had'], 0, "Inverted third conditional: 'Were it not for... I would have failed.'");
addQ('grammar', 'C1', "The committee's decision, ___ many found controversial, was finalized yesterday.", ['that', 'which', 'who', 'what'], 1, "A non-defining relative clause requires 'which'.");
addQ('grammar', 'C1', "Seldom ___ such dedication among new employees.", ['we see', 'do we see', 'we saw', 'did we saw'], 1, "Negative adverbial inversion after 'Seldom' requires 'do we see'.");
addQ('grammar', 'C1', "So exhausted ___ that she fell asleep instantly.", ['was she', 'she was', 'did she', 'she did'], 0, "Fronting 'so + adjective' triggers subject-verb inversion.");

/* ---- READING (20) ---- */
addQ('reading', 'A1', "Tom has a small dog. The dog is brown and white. Tom plays with his dog in the park every day.\n\nWhat color is Tom's dog?", ['black', 'brown and white', 'all white', 'grey'], 1, "The passage says the dog is brown and white.");
addQ('reading', 'A1', "Anna gets up at seven o'clock. She has breakfast and goes to school by bus.\n\nHow does Anna go to school?", ['by car', 'by bus', 'by bike', 'on foot'], 1, "The passage states Anna goes to school by bus.");
addQ('reading', 'A1', "This is Maria's kitchen. It has a table, four chairs, and a big window. Maria likes to cook dinner here.\n\nHow many chairs are in the kitchen?", ['two', 'three', 'four', 'five'], 2, "The passage mentions the kitchen has four chairs.");
addQ('reading', 'A1', "Jake works in a shop. He sells fruit and vegetables. The shop opens at nine in the morning.\n\nWhat does Jake sell?", ['books', 'clothes', 'fruit and vegetables', 'toys'], 2, "The passage says Jake sells fruit and vegetables.");

addQ('reading', 'A2', "Last weekend, Sam and his friends went camping near a lake. They set up their tent, cooked food over a fire, and went swimming in the morning. It rained a little on Saturday night, but they still had a great time.\n\nWhat was the weather like on Saturday night?", ['sunny', 'it rained a little', 'very hot', 'snowy'], 1, "The passage says it rained a little on Saturday night.");
addQ('reading', 'A2', "Emma works as a nurse in a busy hospital. She usually starts her shift at 7 a.m. and finishes at 3 p.m. On her days off, she likes to read novels and go hiking.\n\nWhat does Emma do on her days off?", ['work extra shifts', 'read novels and go hiking', 'sleep all day', 'cook big meals'], 1, "The passage states she reads novels and goes hiking on her days off.");
addQ('reading', 'A2', "The new shopping center opened last month. It has more than fifty stores, a cinema, and several restaurants. Many people visit it on weekends because parking is free.\n\nWhy do many people visit the shopping center on weekends?", ['it has cheap food', 'parking is free', 'it is close to their home', 'it has a swimming pool'], 1, "The passage says parking is free, which attracts visitors.");
addQ('reading', 'A2', "Daniel wants to learn how to cook. He watches online videos and tries new recipes every weekend. Sometimes his dishes don't turn out well, but he keeps practicing.\n\nHow does Daniel learn to cook?", ['from a professional chef', 'by watching online videos', 'by reading cookbooks only', 'from his mother'], 1, "The passage says Daniel watches online videos to learn to cook.");

addQ('reading', 'B1', "Remote work has become increasingly popular over the past few years. Many companies now allow employees to work from home, which can improve work-life balance. However, some workers report feeling isolated because they miss face-to-face contact with colleagues.\n\nWhat is one disadvantage of remote work mentioned in the passage?", ['lower pay', 'feeling isolated', 'longer working hours', 'more meetings'], 1, "The passage mentions that some workers feel isolated.");
addQ('reading', 'B1', "Recycling helps reduce the amount of waste sent to landfills. When materials like paper, glass, and plastic are recycled, fewer natural resources need to be extracted. Despite its benefits, recycling rates remain low in many countries because of confusing rules about what can be recycled.\n\nWhy are recycling rates low in many countries, according to the passage?", ["people don't care about the environment", 'confusing rules about what can be recycled', 'recycling is too expensive', "there aren't enough recycling bins"], 1, "The passage attributes low recycling rates to confusing rules.");
addQ('reading', 'B1', "The city council announced a plan to build more bicycle lanes downtown. Supporters say this will reduce traffic congestion and encourage healthier commuting. Critics argue that removing car lanes will make deliveries more difficult for local businesses.\n\nWhat do critics of the plan say?", ['it will reduce pollution', 'it will make deliveries harder for businesses', 'it will cost too much money', 'it will increase traffic accidents'], 1, "The passage states critics worry about deliveries becoming harder.");
addQ('reading', 'B1', "Many students find it difficult to manage their time during exam periods. Experts recommend creating a study schedule, taking regular breaks, and avoiding last-minute cramming. Getting enough sleep is also important for memory and concentration.\n\nWhat do experts recommend to manage exam stress?", ['studying all night before exams', 'creating a study schedule and taking breaks', 'skipping meals to save time', 'studying only one subject'], 1, "The passage recommends a study schedule and regular breaks.");

addQ('reading', 'B2', "Artificial intelligence is transforming numerous industries, from healthcare to finance. While it offers significant efficiency gains, critics warn that widespread automation could displace millions of jobs. Policymakers are now debating how to balance innovation with workforce protection.\n\nWhat are policymakers debating, according to the passage?", ['how to ban AI completely', 'how to balance innovation with workforce protection', 'how to increase automation faster', 'how to reduce healthcare costs'], 1, "The passage says policymakers debate balancing innovation and worker protection.");
addQ('reading', 'B2', "Despite decades of research, scientists still do not fully understand why humans need to sleep. Some theories suggest sleep helps consolidate memories, while others propose it allows the brain to clear out toxins accumulated during waking hours. Most researchers agree that both explanations likely play a role.\n\nWhat do most researchers agree on, according to the passage?", ['sleep is unnecessary', "both memory consolidation and toxin removal likely explain sleep's purpose", 'only one theory is correct', 'sleep has no effect on the brain'], 1, "The passage states most researchers think both explanations play a role.");
addQ('reading', 'B2', "The rise of streaming services has fundamentally changed how audiences consume television. Viewers no longer need to wait for weekly episodes; entire seasons are often released at once, encouraging 'binge-watching.' This shift has also altered how shows are written, with some writers designing episodes to be consumed in quick succession.\n\nHow has the shift to streaming affected the way some shows are written?", ['episodes are now longer', 'writers design episodes for binge-watching rather than weekly viewing', 'shows now have fewer episodes', 'writers ignore audience habits'], 1, "The passage explains writers now design episodes for binge-watching.");
addQ('reading', 'B2', "Urban farming, the practice of growing food within city limits, has gained popularity as a response to concerns about food security and sustainability. Rooftop gardens and vertical farms allow cities to produce fresh produce with a smaller carbon footprint, though scaling these methods to feed entire populations remains a significant challenge.\n\nWhat remains a significant challenge for urban farming, according to the passage?", ['finding enough sunlight', 'scaling the methods to feed entire populations', 'convincing people to eat vegetables', 'the cost of seeds'], 1, "The passage says scaling urban farming to feed whole populations is a challenge.");

addQ('reading', 'C1', "The notion that economic growth is an unqualified good has come under increasing scrutiny. Proponents of degrowth argue that perpetual expansion is incompatible with planetary boundaries, advocating instead for a deliberate downscaling of production in wealthy nations. Critics counter that such a shift would disproportionately harm the poorest, who rely on growth to escape poverty.\n\nWhat do critics of degrowth argue, according to the passage?", ['growth is always harmful', 'degrowth would disproportionately harm the poorest', "planetary boundaries don't exist", 'wealthy nations should grow faster'], 1, "The passage says critics believe degrowth would harm the poorest most.");
addQ('reading', 'C1', "Behavioral economists have long documented the discrepancy between how people believe they will act and how they actually behave when faced with real decisions. This gap, often attributed to cognitive biases such as present bias, helps explain why individuals frequently fail to save adequately for retirement despite professing an intention to do so.\n\nWhat does 'present bias' help explain, according to the passage?", ['why people save too much money', 'why people fail to save adequately for retirement', 'why economists disagree', 'why retirement ages are rising'], 1, "The passage links present bias to inadequate retirement saving.");
addQ('reading', 'C1', "Contrary to popular belief, multitasking rarely improves productivity; instead, it often degrades performance across all tasks being juggled. Neuroscientific research suggests that what is commonly perceived as multitasking is, in fact, rapid task-switching, which imposes a measurable cognitive cost each time attention shifts.\n\nAccording to the passage, what does neuroscientific research suggest 'multitasking' actually is?", ['doing two things perfectly at once', 'rapid task-switching', 'a myth with no basis in reality', 'a skill that improves with age'], 1, "The passage states multitasking is really rapid task-switching.");
addQ('reading', 'C1', "The proliferation of misinformation online has prompted platforms to deploy fact-checking algorithms, yet these systems face an inherent tension: overly aggressive filtering risks suppressing legitimate speech, while lenient moderation allows harmful falsehoods to spread unchecked.\n\nWhat tension do fact-checking systems face, according to the passage?", ['between speed and accuracy', 'between suppressing legitimate speech and allowing harmful falsehoods to spread', 'between cost and effectiveness', 'between human and AI moderators'], 1, "The passage describes the tension between over-filtering and under-moderating.");

/* ---- EVERYDAY ENGLISH (20) ---- */
addQ('everyday', 'A1', "Someone says 'How are you?' What is a natural reply?", ['I am fine, thank you. And you?', 'Yes please', 'Goodbye', 'I am 25'], 0, "This is the standard polite response to a greeting.");
addQ('everyday', 'A1', "You want to buy bread. What do you say at the bakery?", ['Can I have a loaf of bread, please?', 'Where is the bus stop?', 'What time is it?', "I don't like bread"], 0, "This is a polite way to request an item in a shop.");
addQ('everyday', 'A1', "Someone says 'Nice to meet you.' What do you say?", ['Nice to meet you too', "I'm sorry", 'Goodbye forever', 'No thanks'], 0, "This is the standard reply when meeting someone new.");
addQ('everyday', 'A1', "You want to know the time. What do you ask?", ['What time is it, please?', 'How much is it?', 'Where are you from?', 'What is your name?'], 0, "This directly asks for the current time.");

addQ('everyday', 'A2', "You are in a restaurant and want the bill. What do you say?", ['Can I have the bill, please?', 'Can I have a menu?', 'Is the food good?', 'Where is the kitchen?'], 0, "This is the standard way to ask for the check.");
addQ('everyday', 'A2', "Your friend invites you to a party but you can't go. What is a polite response?", ['No way, I hate parties', "I'd love to, but I already have plans", 'Never invite me again', "I don't care"], 1, "This politely declines while showing appreciation for the invitation.");
addQ('everyday', 'A2', "You need directions to the train station. What do you ask a stranger?", ['Excuse me, could you tell me how to get to the train station?', 'Why is the train late?', 'Do you like trains?', 'I hate this station'], 0, "This is a polite way to ask a stranger for directions.");
addQ('everyday', 'A2', "A shop assistant asks 'Can I help you?' What is a good reply?", ["Yes, I'm just looking, thanks", 'No, go away', "I don't know you", 'Why are you here?'], 0, "This politely declines help while staying friendly.");

addQ('everyday', 'B1', "You want to complain politely about cold food in a restaurant. What do you say?", ['This food is disgusting, throw it away!', "Excuse me, I'm afraid this food is a bit cold. Could you warm it up?", "I'm never coming back here", 'Who cooked this?!'], 1, "This raises the issue politely using a softening phrase.");
addQ('everyday', 'B1', "Your colleague asks for your opinion on their presentation, which needs improvement. What is a diplomatic response?", ['It was terrible, honestly', 'It was great, but I think adding more examples could make it even stronger', "I didn't watch it", "Don't ask me that"], 1, "This gives honest feedback while remaining constructive and kind.");
addQ('everyday', 'B1', "You need to cancel a meeting politely by email. Which phrase fits best?", ["I'm cancelling, deal with it", "I'm afraid something has come up, so I won't be able to make our meeting", "Meeting's off, bye", "I don't want to meet you"], 1, "This is a polite, professional way to cancel a meeting.");
addQ('everyday', 'B1', "You disagree with a friend's plan but want to stay polite. What do you say?", ["That's a terrible idea", 'I see your point, but have you considered doing it this way instead?', 'Whatever, do what you want', "You're always wrong"], 1, "This expresses disagreement respectfully and offers an alternative.");

addQ('everyday', 'B2', "You are negotiating a deadline extension with your manager. What is the most professional phrasing?", ['I need more time, give it to me', 'Would it be possible to extend the deadline by a few days, given the extra requirements?', 'The deadline is impossible, forget it', 'I refuse to finish on time'], 1, "This is a polite, professional way to request an extension.");
addQ('everyday', 'B2', "You want to politely interrupt a meeting to add a point. What do you say?", ["Stop talking, it's my turn", 'Sorry to interrupt, but could I just add something here?', 'Be quiet for a second', 'Excuse me, shut up'], 1, "This softens the interruption with a polite lead-in.");
addQ('everyday', 'B2', "A colleague made a mistake in a report you both worked on. How do you raise it tactfully?", ['You messed everything up', 'I noticed a small discrepancy in the figures — could we double-check them together?', 'This report is wrong, fix it', "I'm not touching this report again"], 1, "This raises the issue tactfully without placing direct blame.");
addQ('everyday', 'B2', "You want to decline a business offer politely but firmly.", ['No way, forget it', "Thank you for the offer, but we've decided to go in a different direction", 'We hate this offer', "I'm too busy to answer"], 1, "This is a polite and professional way to decline an offer.");

addQ('everyday', 'C1', "You need to challenge a colleague's assumption in a meeting without causing offense. What is the most appropriate phrase?", ["You're completely wrong about that", "I'd like to push back slightly on that point, if I may", "That's a ridiculous assumption", 'Nobody agrees with you'], 1, "This challenges the point diplomatically using a softening phrase.");
addQ('everyday', 'C1', "You are mediating a disagreement between two team members. Which phrase best encourages compromise?", ['One of you has to give in', 'Perhaps we could find some middle ground that works for both of you', 'Just stop arguing', "I don't care who's right, this is annoying"], 1, "This invites both sides toward a mutually acceptable compromise.");
addQ('everyday', 'C1', "You want to express polite skepticism about a proposal in a formal setting.", ["That's a stupid plan", 'I have some reservations about how feasible this proposal is in practice', "I don't believe you at all", 'This will never work, obviously'], 1, "This expresses doubt in formal, diplomatic language.");
addQ('everyday', 'C1', "You need to soften bad news to a client about a project delay.", ["The project is late, deal with it", "I'm afraid there's been an unexpected delay, and I want to walk you through how we plan to address it", "We failed, sorry", "It's not our fault, don't blame us"], 1, "This delivers bad news gently while offering a constructive path forward.");

/* ============================== SHOP DATA ================================ */
const SHOP_ITEMS = [
  // CLOTHING (slot: top / shoes)
  { id: 'cl_hoodie', category: 'clothing', slot: 'top', name: 'Hoodie', price: 500, rarity: 'common', icon: '🧥', visual: { shirt: '#5B6EE1', jacket: false } },
  { id: 'cl_jacket', category: 'clothing', slot: 'top', name: 'Sport Jacket', price: 1200, rarity: 'rare', icon: '🧥', visual: { shirt: '#3DDCFF', jacket: true, jacketColor: '#2A6F86' }, requirement: { level: 5 } },
  { id: 'cl_suit', category: 'clothing', slot: 'top', name: 'Business Suit', price: 2500, rarity: 'epic', icon: '🕴️', visual: { shirt: '#F3F4FA', jacket: true, jacketColor: '#1B2140', tie: true }, requirement: { level: 10, englishLevel: 'B1' } },
  { id: 'cl_tshirt', category: 'clothing', slot: 'top', name: 'T-shirt', price: 300, rarity: 'common', icon: '👕', visual: { shirt: '#E8EAF6', jacket: false } },
  { id: 'cl_sneakers', category: 'clothing', slot: 'shoes', name: 'Sneakers', price: 700, rarity: 'common', icon: '👟', visual: { shoes: '#FF5D7A' } },

  // ACCESSORIES (multi-equip)
  { id: 'ac_headphones', category: 'accessories', slot: 'headphones', name: 'Headphones', price: 600, rarity: 'common', icon: '🎧' },
  { id: 'ac_backpack', category: 'accessories', slot: 'backpack', name: 'Backpack', price: 550, rarity: 'common', icon: '🎒' },
  { id: 'ac_watch', category: 'accessories', slot: 'watch', name: 'Watch', price: 900, rarity: 'rare', icon: '⌚', requirement: { level: 4 } },
  { id: 'ac_sunglasses', category: 'accessories', slot: 'sunglasses', name: 'Sunglasses', price: 450, rarity: 'common', icon: '🕶️' },

  // ITEMS (collectibles)
  { id: 'it_laptop', category: 'items', slot: null, name: 'Laptop', price: 1800, rarity: 'rare', icon: '💻', requirement: { level: 6 } },
  { id: 'it_camera', category: 'items', slot: null, name: 'Camera', price: 1400, rarity: 'rare', icon: '📷' },
  { id: 'it_smartphone', category: 'items', slot: null, name: 'Smartphone', price: 2200, rarity: 'epic', icon: '📱', requirement: { level: 8 } },
  { id: 'it_gamingpc', category: 'items', slot: null, name: 'Gaming PC', price: 4500, rarity: 'legendary', icon: '🖥️', requirement: { level: 14, englishLevel: 'B1' } },

  // TRANSPORT (single equip)
  { id: 'tr_bicycle', category: 'transport', slot: 'transport', name: 'Bicycle', price: 400, rarity: 'common', icon: '🚲' },
  { id: 'tr_scooter', category: 'transport', slot: 'transport', name: 'Scooter', price: 1600, rarity: 'rare', icon: '🛵', requirement: { level: 7 } },
  { id: 'tr_car', category: 'transport', slot: 'transport', name: 'Car', price: 5000, rarity: 'epic', icon: '🚗', requirement: { level: 12, englishLevel: 'A2' } },
  { id: 'tr_sportscar', category: 'transport', slot: 'transport', name: 'Sports Car', price: 10000, rarity: 'legendary', icon: '🏎️', requirement: { level: 20, englishLevel: 'B1' } },
];

const FURNITURE_ITEMS = [
  { id: 'fu_sofa', name: 'Sofa', price: 800, rarity: 'common', icon: '🛋️', pos: { left: '6%', bottom: '6%' } },
  { id: 'fu_tv', name: 'TV', price: 1500, rarity: 'rare', icon: '📺', pos: { left: '42%', top: '10%' }, requirement: { level: 3 } },
  { id: 'fu_table', name: 'Table', price: 400, rarity: 'common', icon: '🪑', pos: { left: '52%', bottom: '8%' } },
  { id: 'fu_lamp', name: 'Lamp', price: 250, rarity: 'common', icon: '💡', pos: { left: '84%', top: '10%' } },
  { id: 'fu_plant', name: 'Plant', price: 200, rarity: 'common', icon: '🪴', pos: { left: '84%', bottom: '8%' } },
  { id: 'fu_bed', name: 'Bed', price: 1000, rarity: 'common', icon: '🛏️', pos: { left: '6%', top: '10%' }, requirement: { level: 2 } },
  { id: 'fu_computer', name: 'Computer', price: 2000, rarity: 'rare', icon: '🖥️', pos: { left: '26%', bottom: '10%' }, requirement: { level: 6 } },
  { id: 'fu_bookshelf', name: 'Bookshelf', price: 600, rarity: 'common', icon: '📚', pos: { left: '6%', bottom: '40%' } },
  { id: 'fu_paintings', name: 'Paintings', price: 1800, rarity: 'epic', icon: '🖼️', pos: { left: '60%', top: '8%' }, requirement: { level: 9 } },
  { id: 'fu_carpet', name: 'Carpet', price: 350, rarity: 'common', icon: '🟪', pos: { left: '38%', bottom: '4%' } },
];

const APARTMENT_LEVELS = [
  { level: 1, name: 'Small Room', cost: 0, requirement: 0 },
  { level: 2, name: 'Apartment', cost: 1000, requirement: 3 },
  { level: 3, name: 'Modern Apartment', cost: 3000, requirement: 8 },
  { level: 4, name: 'Luxury Apartment', cost: 6000, requirement: 15 },
  { level: 5, name: 'Penthouse', cost: 12000, requirement: 22 },
];

const ACHIEVEMENTS = [
  { id: 'first_step', icon: '🏆', title: 'First Step', desc: 'Complete your first lesson.', coins: 50, check: s => s.stats.totalLessons >= 1 },
  { id: 'week_warrior', icon: '🔥', title: 'Week Warrior', desc: '7 day streak.', coins: 200, check: s => s.streak.count >= 7 },
  { id: 'bookworm', icon: '📚', title: 'Bookworm', desc: 'Complete 50 lessons.', coins: 500, check: s => s.stats.totalLessons >= 50 },
  { id: 'word_master', icon: '🧠', title: 'Word Master', desc: 'Master 100 words.', coins: 500, check: s => Object.values(s.words).filter(w => w.stage >= 4).length >= 100 },
  { id: 'english_beginner', icon: '🇬🇧', title: 'English Beginner', desc: 'Reach A1.', coins: 50, check: s => BASE_LEVELS.indexOf(baseLevelOf(s.englishLevel)) >= 0 },
  { id: 'english_explorer', icon: '🇬🇧', title: 'English Explorer', desc: 'Reach A2.', coins: 100, check: s => BASE_LEVELS.indexOf(baseLevelOf(s.englishLevel)) >= 1 },
  { id: 'english_speaker', icon: '🇬🇧', title: 'English Speaker', desc: 'Reach B1.', coins: 250, check: s => BASE_LEVELS.indexOf(baseLevelOf(s.englishLevel)) >= 2 },
  { id: 'english_master', icon: '👑', title: 'English Master', desc: 'Reach C1.', coins: 1000, check: s => BASE_LEVELS.indexOf(baseLevelOf(s.englishLevel)) >= 4 },
];

/* ============================== XP TABLE ================================= */
const XP_THRESHOLDS = [0, 0, 100, 250, 450];
(function buildXpTable() {
  for (let n = 5; n <= 60; n++) {
    const diff = 100 + (n - 2) * 50;
    XP_THRESHOLDS.push(XP_THRESHOLDS[n - 1] + diff);
  }
})();
function levelForXp(xp) {
  let lvl = 1;
  for (let n = 1; n < XP_THRESHOLDS.length; n++) {
    if (xp >= XP_THRESHOLDS[n]) lvl = n; else break;
  }
  return lvl;
}

/* ============================== STORAGE =================================== */
const SAVE_KEY = 'liferpg_english_save_v1';
const Storage = {
  load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) { return null; }
  },
  save(state) {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable */ }
  },
  reset() { try { localStorage.removeItem(SAVE_KEY); } catch (e) {} }
};

function defaultState() {
  return {
    playerName: 'Player',
    xp: 0,
    coins: 500,
    englishLevel: null,          // set after test, e.g. 'A2+'
    testTaken: false,
    recentAnswers: [],           // last up to 10 booleans, for adaptive difficulty
    words: {},                   // word -> {stage:0-4, correct:0, wrong:0, due:timestamp}
    stats: {
      totalLessons: 0,           // completed quiz sessions
      correctAnswers: 0,
      totalAnswers: 0,
      grammar: { correct: 0, total: 0 },
      reading: { correct: 0, total: 0 },
      listening: { correct: 0, total: 0 },
      everyday: { correct: 0, total: 0 }
    },
    lessonsCompletedByCategory: { vocabulary: 0, grammar: 0, reading: 0, everyday: 0 },
    inventory: [],                // owned shop item ids
    equipped: { top: null, shoes: null, headphones: false, backpack: false, watch: false, sunglasses: false, transport: null },
    apartment: { level: 1, furniture: [] },
    achievements: [],             // unlocked achievement ids
    streak: { count: 0, lastDate: null, history: [] }, // history: array of YYYY-MM-DD completed days
    dailyQuest: { date: null, progress: 0, target: 10, claimed: false },
    soundOn: true
  };
}

let State = null;

/* ============================== AUDIO SYSTEM =============================== */
const AudioSystem = (() => {
  let ctx = null;
  function getCtx() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) ctx = new AC();
    }
    return ctx;
  }
  function tone(freq, duration, type = 'sine', delay = 0, vol = 0.18) {
    if (!State.soundOn) return;
    const c = getCtx();
    if (!c) return;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = vol;
    osc.connect(gain);
    gain.connect(c.destination);
    const t0 = c.currentTime + delay;
    gain.gain.setValueAtTime(vol, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  }
  return {
    click() { tone(440, 0.06, 'square'); },
    correct() { tone(660, 0.12); tone(880, 0.16, 'sine', 0.1); },
    wrong() { tone(180, 0.22, 'sawtooth'); },
    levelUp() { tone(523, 0.12); tone(659, 0.12, 'sine', 0.12); tone(784, 0.22, 'sine', 0.24); },
    purchase() { tone(392, 0.08); tone(523, 0.14, 'sine', 0.09); },
    achievement() { tone(587, 0.1); tone(784, 0.12, 'sine', 0.1); tone(988, 0.2, 'sine', 0.22); }
  };
})();

/* ============================== UI HELPERS ================================ */
function toast(message, emoji = '✨') {
  const layer = $('#toastLayer');
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<span class="toast-emoji">${emoji}</span><span>${message}</span>`;
  layer.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}
function floatNear(el, text, cls) {
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const f = document.createElement('div');
  f.className = 'floater ' + cls;
  f.style.left = (rect.left + rect.width / 2) + 'px';
  f.style.top = (rect.top) + 'px';
  f.textContent = text;
  $('#floaterLayer').appendChild(f);
  setTimeout(() => f.remove(), 1150);
}

/* ============================== XP SYSTEM =================================== */
const XPSystem = {
  add(amount, sourceEl) {
    const beforeLevel = levelForXp(State.xp);
    State.xp += amount;
    const afterLevel = levelForXp(State.xp);
    if (sourceEl) floatNear(sourceEl, '+' + amount + ' XP', 'xp');
    if (afterLevel > beforeLevel) {
      const coinsReward = 100 * (afterLevel - beforeLevel);
      CoinSystem.add(coinsReward);
      UI.showLevelUp(afterLevel, coinsReward);
    }
    Persist.save();
  },
  progress() {
    const lvl = levelForXp(State.xp);
    const cur = XP_THRESHOLDS[lvl] ?? 0;
    const next = XP_THRESHOLDS[lvl + 1] ?? (cur + 1000);
    const span = next - cur;
    const into = State.xp - cur;
    return { level: lvl, into, span, next, pct: span > 0 ? clamp((into / span) * 100, 0, 100) : 100 };
  }
};

/* ============================== COIN SYSTEM ================================= */
const CoinSystem = {
  add(amount, sourceEl) {
    State.coins += amount;
    if (sourceEl) floatNear(sourceEl, '+' + amount, 'coin');
    Persist.save();
  },
  spend(amount) {
    if (State.coins < amount) return false;
    State.coins -= amount;
    Persist.save();
    return true;
  }
};

/* ============================== ENGLISH LEVEL / ADAPTIVE ==================== */
const EnglishLevelSystem = {
  recordAnswer(correct) {
    State.recentAnswers.push(correct);
    if (State.recentAnswers.length > 10) State.recentAnswers.shift();
    this.maybeAdjust();
  },
  maybeAdjust() {
    if (State.recentAnswers.length < 10) return;
    const correctCount = State.recentAnswers.filter(Boolean).length;
    const idx = LEVEL_SCALE.indexOf(State.englishLevel);
    if (idx === -1) return;
    if (correctCount >= 8 && idx < LEVEL_SCALE.length - 1) {
      State.englishLevel = LEVEL_SCALE[idx + 1];
      State.recentAnswers = [];
      toast(`Your English level is now ${State.englishLevel}!`, '📈');
    } else if (correctCount <= 5 && idx > 0) {
      State.englishLevel = LEVEL_SCALE[idx - 1];
      State.recentAnswers = [];
      toast(`Difficulty adjusted to ${State.englishLevel}.`, '📉');
    }
  },
  currentBase() { return baseLevelOf(State.englishLevel || 'A1'); },
  setFromTestScore(correctCount, totalCount) {
    const ratio = correctCount / totalCount;
    let base;
    if (ratio < 0.25) base = 'A1';
    else if (ratio < 0.45) base = 'A2';
    else if (ratio < 0.65) base = 'B1';
    else if (ratio < 0.85) base = 'B2';
    else base = 'C1';
    State.englishLevel = base;
    State.testTaken = true;
    Persist.save();
    return base;
  }
};

/* ============================== MASTERY SYSTEM ================================ */
const MASTERY_LABELS = ['NEW', 'LEARNING', 'FAMILIAR', 'STRONG', 'MASTERED'];
const MasterySystem = {
  ensureWord(word) {
    if (!word) return null;
    if (!State.words[word]) {
      State.words[word] = { stage: 0, correct: 0, wrong: 0, due: Date.now() };
    }
    return State.words[word];
  },
  onAnswer(word, correct) {
    if (!word) return;
    const w = this.ensureWord(word);
    if (correct) {
      w.correct++;
      w.stage = clamp(w.stage + 1, 0, 4);
      w.due = Date.now() + [0, 3, 8, 20, 60][w.stage] * 60000; // simple spaced-repetition intervals
    } else {
      w.wrong++;
      w.stage = clamp(w.stage - 1, 0, 4);
      w.due = Date.now(); // due again soon
    }
  },
  learnedCount() { return Object.values(State.words).filter(w => w.stage >= 1).length; },
  masteredCount() { return Object.values(State.words).filter(w => w.stage >= 4).length; },
  stageLabel(word) {
    const w = State.words[word];
    if (!w) return MASTERY_LABELS[0];
    return MASTERY_LABELS[w.stage];
  }
};

/* ============================== QUIZ SYSTEM ================================== */
const QuizSystem = {
  session: null, // {mode, questions[], index, correctCount, xpEarned, coinsEarned, isTest}

  poolFor(category, baseLevel) {
    return QUESTION_BANK.filter(q => q.category === category && q.difficulty === baseLevel);
  },

  pickWeightedVocab(baseLevel, count) {
    const pool = this.poolFor('vocabulary', baseLevel);
    const now = Date.now();
    const scored = pool.map(q => {
      const w = q.word ? State.words[q.word] : null;
      let weight = 1;
      if (w) {
        if (w.due <= now) weight += 3;
        weight += (4 - w.stage);
      } else {
        weight += 2; // unseen words prioritized
      }
      return { q, weight };
    });
    const chosen = [];
    const bag = scored.slice();
    while (chosen.length < count && bag.length) {
      const totalWeight = bag.reduce((s, x) => s + x.weight, 0);
      let r = Math.random() * totalWeight;
      let pickIdx = 0;
      for (let i = 0; i < bag.length; i++) { r -= bag[i].weight; if (r <= 0) { pickIdx = i; break; } }
      chosen.push(bag[pickIdx].q);
      bag.splice(pickIdx, 1);
    }
    return chosen;
  },

  buildSession(mode, count) {
    const baseLevel = EnglishLevelSystem.currentBase();
    let questions = [];
    if (mode === 'vocabulary') {
      questions = this.pickWeightedVocab(baseLevel, count);
    } else if (mode === 'listening') {
      const pool = [...this.poolFor('vocabulary', baseLevel), ...this.poolFor('grammar', baseLevel)];
      questions = shuffle(pool).slice(0, count);
    } else if (mode === 'daily') {
      const pool = [
        ...this.poolFor('vocabulary', baseLevel),
        ...this.poolFor('grammar', baseLevel),
        ...this.poolFor('reading', baseLevel),
        ...this.poolFor('everyday', baseLevel)
      ];
      questions = shuffle(pool).slice(0, count);
    } else {
      const pool = this.poolFor(mode, baseLevel);
      questions = shuffle(pool).slice(0, count);
    }
    // fallback: if not enough questions at this level, pad with nearby levels
    if (questions.length < count) {
      const others = QUESTION_BANK.filter(q => (mode === 'daily' || mode === 'listening') ? true : q.category === mode);
      const extra = shuffle(others).filter(q => !questions.includes(q)).slice(0, count - questions.length);
      questions = questions.concat(extra);
    }
    return questions.slice(0, count);
  },

  start(mode, count = 10) {
    const questions = this.buildSession(mode, count);
    this.session = { mode, questions, index: 0, correctCount: 0, xpEarned: 0, coinsEarned: 0 };
    UI.openQuiz();
    this.renderCurrent();
  },

  renderCurrent() {
    const s = this.session;
    const q = s.questions[s.index];
    $('#quizCounter').textContent = `${s.index + 1}/${s.questions.length}`;
    $('#quizProgressFill').style.width = `${((s.index) / s.questions.length) * 100}%`;
    $('#quizCategoryPill').textContent = capitalize(s.mode === 'daily' ? q.category : s.mode) + (s.mode === 'listening' ? ' 🔊' : '');
    $('#quizQuestionText').textContent = q.question;
    const optWrap = $('#quizOptions');
    optWrap.innerHTML = '';
    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = opt;
      btn.dataset.index = i;
      btn.addEventListener('click', () => QuizSystem.answer(i, btn));
      optWrap.appendChild(btn);
    });
    $('#quizFeedback').classList.add('hidden');
    $('#quizOptions').classList.remove('hidden');
    if (s.mode === 'listening') this.speak(q.question);
  },

  speak(text) {
    try {
      if (!window.speechSynthesis) return;
      const clean = text.replace(/\n/g, '. ');
      const utter = new SpeechSynthesisUtterance(clean);
      utter.lang = 'en-US';
      utter.rate = 0.95;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    } catch (e) { /* speech not available */ }
  },

  answer(index, btnEl) {
    const s = this.session;
    const q = s.questions[s.index];
    const correct = index === q.correct;
    $all('.option-btn').forEach(b => b.classList.add('disabled'));
    btnEl.classList.add('selected');
    $all('.option-btn')[q.correct].classList.add('correct');
    if (!correct) btnEl.classList.add('incorrect');

    let xp = correct ? (['B2', 'C1'].includes(q.difficulty) ? 30 : 20) : 0;
    let coins = correct ? 10 : 0;

    if (correct) { s.correctCount++; State.stats.correctAnswers++; }
    State.stats.totalAnswers++;
    s.xpEarned += xp; s.coinsEarned += coins;

    if (q.category === 'grammar') bump(State.stats.grammar, correct);
    if (q.category === 'reading') bump(State.stats.reading, correct);
    if (q.category === 'everyday') bump(State.stats.everyday, correct);
    if (s.mode === 'listening') bump(State.stats.listening, correct);
    if (q.category === 'vocabulary') MasterySystem.onAnswer(q.word, correct);

    EnglishLevelSystem.recordAnswer(correct);
    StreakSystem.registerActivity();
    DailyQuestSystem.registerAnswer();

    if (correct) AudioSystem.correct(); else AudioSystem.wrong();

    $('#quizFeedbackIcon').textContent = correct ? '✅' : '❌';
    $('#quizFeedbackIcon').parentElement.style.color = '';
    $('#quizFeedbackTitle').textContent = correct ? 'Correct!' : 'Not quite.';
    $('#quizFeedbackExplain').innerHTML = `<strong>${q.options[q.correct]}</strong> — ${q.explanation}`;
    $('#quizFeedbackReward').textContent = correct ? `+${xp} XP · +${coins} 🪙` : '';
    $('#quizOptions').classList.add('hidden');
    $('#quizFeedback').classList.remove('hidden');

    if (xp) XPSystem.add(xp);
    if (coins) CoinSystem.add(coins);
    Persist.save();
    AchievementSystem.checkAll();
  },

  next() {
    const s = this.session;
    s.index++;
    if (s.index >= s.questions.length) {
      this.finishSession();
    } else {
      this.renderCurrent();
    }
  },

  finishSession() {
    const s = this.session;
    State.stats.totalLessons++;
    if (s.mode !== 'daily' && s.mode !== 'listening' && QUESTION_BANK.some(q => q.category === s.mode)) {
      State.lessonsCompletedByCategory[s.mode] = (State.lessonsCompletedByCategory[s.mode] || 0) + 1;
    }
    Persist.save();
    AchievementSystem.checkAll();
    UI.closeQuiz();
    UI.showSummary(s.correctCount, s.xpEarned, s.coinsEarned);
    UI.renderAll();
  }
};

function bump(obj, correct) { obj.total++; if (correct) obj.correct++; }
function pct(obj) { return obj.total === 0 ? 0 : Math.round((obj.correct / obj.total) * 100); }
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

/* ============================== DAILY QUEST =================================== */
const DailyQuestSystem = {
  ensureToday() {
    if (State.dailyQuest.date !== todayStr()) {
      State.dailyQuest = { date: todayStr(), progress: 0, target: 10, claimed: false };
    }
  },
  registerAnswer() {
    this.ensureToday();
    if (State.dailyQuest.claimed) return;
    State.dailyQuest.progress = clamp(State.dailyQuest.progress + 1, 0, State.dailyQuest.target);
    if (State.dailyQuest.progress >= State.dailyQuest.target && !State.dailyQuest.claimed) {
      State.dailyQuest.claimed = true;
      XPSystem.add(100);
      CoinSystem.add(50);
      toast('Daily quest complete! +100 XP · +50 🪙', '🎯');
    }
    Persist.save();
  }
};

/* ============================== STREAK SYSTEM =================================== */
const StreakSystem = {
  registerActivity() {
    const today = todayStr();
    if (!State.streak.history.includes(today)) {
      State.streak.history.push(today);
      if (State.streak.history.length > 60) State.streak.history.shift();
      if (State.streak.lastDate) {
        const diff = daysBetween(State.streak.lastDate, today);
        if (diff === 1) State.streak.count += 1;
        else if (diff > 1) State.streak.count = 1;
        // diff === 0 shouldn't happen since we check includes()
      } else {
        State.streak.count = 1;
      }
      State.streak.lastDate = today;
      Persist.save();
      AchievementSystem.checkAll();
    }
  },
  weekView() {
    // Monday-first last 7 days ending today
    const days = [];
    const now = new Date();
    const dow = (now.getDay() + 6) % 7; // 0 = Monday
    const monday = new Date(now); monday.setDate(now.getDate() - dow);
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday); d.setDate(monday.getDate() + i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      days.push({ label: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i], done: State.streak.history.includes(key) });
    }
    return days;
  }
};

/* ============================== SHOP SYSTEM =================================== */
const ShopSystem = {
  isOwned(id) { return State.inventory.includes(id); },
  meetsRequirement(item) {
    if (!item.requirement) return true;
    const lvl = XPSystem.progress().level;
    if (item.requirement.level && lvl < item.requirement.level) return false;
    if (item.requirement.englishLevel) {
      const order = BASE_LEVELS;
      if (order.indexOf(EnglishLevelSystem.currentBase()) < order.indexOf(item.requirement.englishLevel)) return false;
    }
    return true;
  },
  requirementLabel(item) {
    if (!item.requirement) return '';
    const parts = [];
    if (item.requirement.level) parts.push(`Requires Level ${item.requirement.level}`);
    if (item.requirement.englishLevel) parts.push(`Requires English ${item.requirement.englishLevel}`);
    return parts.join(' · ');
  },
  buy(item, sourceEl) {
    if (this.isOwned(item.id)) return false;
    if (!this.meetsRequirement(item)) { toast("You don't meet the requirements yet.", '🔒'); return false; }
    if (!CoinSystem.spend(item.price)) { toast('Not enough coins.', '🪙'); return false; }
    State.inventory.push(item.id);
    AudioSystem.purchase();
    if (sourceEl) floatNear(sourceEl, '-' + item.price, 'coin');
    Persist.save();
    AchievementSystem.checkAll();
    return true;
  },
  equip(item) {
    if (!this.isOwned(item.id)) return;
    if (item.slot === 'top' || item.slot === 'shoes' || item.slot === 'transport') {
      State.equipped[item.slot] = item.id;
    } else if (['headphones', 'backpack', 'watch', 'sunglasses'].includes(item.slot)) {
      State.equipped[item.slot] = State.equipped[item.slot] === item.id ? false : item.id;
    }
    Persist.save();
    CharacterSystem.render();
  }
};

const FurnitureSystem = {
  isOwned(id) { return State.apartment.furniture.includes(id); },
  meetsRequirement(item) {
    if (!item.requirement) return true;
    return XPSystem.progress().level >= item.requirement.level;
  },
  buy(item) {
    if (this.isOwned(item.id)) return false;
    if (!this.meetsRequirement(item)) { toast("You don't meet the requirements yet.", '🔒'); return false; }
    if (!CoinSystem.spend(item.price)) { toast('Not enough coins.', '🪙'); return false; }
    State.apartment.furniture.push(item.id);
    AudioSystem.purchase();
    Persist.save();
    AchievementSystem.checkAll();
    return true;
  }
};

const ApartmentSystem = {
  currentLevelInfo() { return APARTMENT_LEVELS.find(l => l.level === State.apartment.level); },
  nextLevelInfo() { return APARTMENT_LEVELS.find(l => l.level === State.apartment.level + 1); },
  upgrade() {
    const next = this.nextLevelInfo();
    if (!next) return false;
    if (XPSystem.progress().level < next.requirement) { toast(`Requires player level ${next.requirement}.`, '🔒'); return false; }
    if (!CoinSystem.spend(next.cost)) { toast('Not enough coins.', '🪙'); return false; }
    State.apartment.level = next.level;
    AudioSystem.levelUp();
    toast(`Apartment upgraded to ${next.name}!`, '🏠');
    Persist.save();
    return true;
  }
};

/* ============================== ACHIEVEMENT SYSTEM =========================== */
const AchievementSystem = {
  checkAll() {
    let changed = false;
    ACHIEVEMENTS.forEach(a => {
      if (!State.achievements.includes(a.id) && a.check(State)) {
        State.achievements.push(a.id);
        CoinSystem.add(a.coins);
        AudioSystem.achievement();
        toast(`Achievement unlocked: ${a.title} (+${a.coins} 🪙)`, a.icon);
        changed = true;
      }
    });
    if (changed) { Persist.save(); UI.renderProfile(); }
  }
};

/* ============================== CHARACTER SYSTEM =============================== */
const CharacterSystem = {
  equippedItem(slot) {
    const id = State.equipped[slot];
    return id ? SHOP_ITEMS.find(i => i.id === id) : null;
  },
  render() {
    const top = this.equippedItem('top');
    const shoes = this.equippedItem('shoes');
    const shirtColor = top?.visual?.shirt || '#8892C8';
    const shoesColor = shoes?.visual?.shoes || '#3A4066';
    const hasJacket = !!top?.visual?.jacket;
    const jacketColor = top?.visual?.jacketColor || '#2A3466';
    const hasTie = !!top?.visual?.tie;
    const hasHeadphones = !!State.equipped.headphones;
    const hasBackpack = !!State.equipped.backpack;
    const hasWatch = !!State.equipped.watch;
    const hasSunglasses = !!State.equipped.sunglasses;

    const svg = `
    <svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg">
      ${hasBackpack ? `<rect x="34" y="120" width="26" height="60" rx="10" fill="#4B5480"/>` : ''}
      <!-- legs -->
      <rect x="76" y="180" width="20" height="55" rx="8" fill="#2B3050"/>
      <rect x="104" y="180" width="20" height="55" rx="8" fill="#2B3050"/>
      <!-- shoes -->
      <rect x="72" y="228" width="28" height="14" rx="6" fill="${shoesColor}"/>
      <rect x="100" y="228" width="28" height="14" rx="6" fill="${shoesColor}"/>
      <!-- torso / shirt -->
      <rect x="62" y="110" width="76" height="76" rx="24" fill="${shirtColor}"/>
      ${hasJacket ? `<path d="M62 118 Q70 110 100 112 Q130 110 138 118 L138 186 L118 186 L118 130 L82 130 L82 186 L62 186 Z" fill="${jacketColor}"/>` : ''}
      ${hasTie ? `<rect x="96" y="118" width="8" height="40" fill="#C0304A"/>` : ''}
      <!-- arms -->
      <rect x="42" y="118" width="20" height="58" rx="10" fill="${shirtColor}"/>
      <rect x="138" y="118" width="20" height="58" rx="10" fill="${shirtColor}"/>
      <!-- neck -->
      <rect x="90" y="94" width="20" height="20" fill="#F0C29B"/>
      <!-- head -->
      <circle cx="100" cy="70" r="34" fill="#F6D0A8"/>
      <!-- hair -->
      <path d="M66 66 Q60 30 100 28 Q140 30 134 66 Q130 44 100 42 Q70 44 66 66 Z" fill="#2E2440"/>
      <!-- eyes -->
      ${hasSunglasses
        ? `<rect x="80" y="66" width="20" height="10" rx="4" fill="#111"/><rect x="102" y="66" width="20" height="10" rx="4" fill="#111"/><rect x="98" y="70" width="6" height="3" fill="#111"/>`
        : `<circle cx="90" cy="70" r="3.2" fill="#241C33"/><circle cx="112" cy="70" r="3.2" fill="#241C33"/>`}
      <!-- mouth -->
      <path d="M90 85 Q100 92 112 85" stroke="#B96A4A" stroke-width="3" fill="none" stroke-linecap="round"/>
      ${hasHeadphones ? `<path d="M68 62 Q100 18 132 62" stroke="#7C5CFF" stroke-width="6" fill="none" stroke-linecap="round"/><rect x="60" y="58" width="12" height="20" rx="6" fill="#7C5CFF"/><rect x="128" y="58" width="12" height="20" rx="6" fill="#7C5CFF"/>` : ''}
      ${hasWatch ? `<rect x="45" y="150" width="14" height="10" rx="3" fill="#FFC94A"/>` : ''}
    </svg>`;
    const canvas = $('#characterCanvas');
    canvas.innerHTML = svg;
    canvas.classList.remove('equip-pop'); void canvas.offsetWidth; canvas.classList.add('equip-pop');

    const avatarBox = $('#profileAvatar');
    if (avatarBox) avatarBox.textContent = '🧑';
  }
};

/* ============================== TEST (ONBOARDING) SYSTEM ======================= */
const TestSystem = {
  questions: [],
  index: 0,
  correct: 0,

  build() {
    const chosen = [];
    BASE_LEVELS.forEach(level => {
      const pool = shuffle(QUESTION_BANK.filter(q => q.difficulty === level));
      chosen.push(...pool.slice(0, 4));
    });
    this.questions = chosen; // already ordered easy -> hard by level groups
    this.index = 0;
    this.correct = 0;
  },

  start() {
    this.build();
    $('#onboardingScreen').classList.add('hidden');
    $('#testScreen').classList.remove('hidden');
    this.renderCurrent();
  },

  renderCurrent() {
    const q = this.questions[this.index];
    $('#testProgressLabel').textContent = `Question ${this.index + 1} / ${this.questions.length}`;
    $('#testProgressFill').style.width = `${(this.index / this.questions.length) * 100}%`;
    $('#testQuestionLevel').textContent = q.difficulty;
    $('#testQuestionText').textContent = q.question;
    const wrap = $('#testOptions');
    wrap.innerHTML = '';
    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = opt;
      btn.addEventListener('click', () => TestSystem.answer(i, btn));
      wrap.appendChild(btn);
    });
  },

  answer(i, btnEl) {
    const q = this.questions[this.index];
    $all('#testOptions .option-btn').forEach(b => b.classList.add('disabled'));
    if (i === q.correct) { btnEl.classList.add('correct'); this.correct++; }
    else { btnEl.classList.add('incorrect'); $all('#testOptions .option-btn')[q.correct].classList.add('correct'); }
    setTimeout(() => {
      this.index++;
      if (this.index >= this.questions.length) this.finish();
      else this.renderCurrent();
    }, 550);
  },

  finish() {
    const base = EnglishLevelSystem.setFromTestScore(this.correct, this.questions.length);
    $('#testScreen').classList.add('hidden');
    $('#resultScreen').classList.remove('hidden');
    $('#resultLevel').textContent = base;
    $('#resultDesc').textContent = ENGLISH_LEVEL_DESC[base];
  }
};

/* ============================== PERSIST WRAPPER ================================ */
const Persist = {
  save() { Storage.save(State); },
};

/* ============================== UI / NAVIGATION ================================= */
const UI = {
  currentScreen: 'home',

  init() {
    this.bindNav();
    this.bindHome();
    this.bindShop();
    this.bindApartment();
    this.bindProfile();
    this.bindModals();
    this.renderAll();
  },

  bindNav() {
    $all('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        AudioSystem.click();
        this.switchScreen(btn.dataset.screen);
      });
    });
  },

  switchScreen(name) {
    this.currentScreen = name;
    $all('.screen').forEach(s => s.classList.remove('active-screen'));
    $('#screen-' + name).classList.add('active-screen');
    $all('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.screen === name));
    if (name === 'learn') this.renderLearn();
    if (name === 'shop') this.renderShop();
    if (name === 'apartment') this.renderApartment();
    if (name === 'profile') this.renderProfile();
    window.scrollTo(0, 0);
  },

  bindHome() {
    $('#questStartBtn').addEventListener('click', () => { AudioSystem.click(); QuizSystem.start('daily', 10); });
    $all('.quickplay-card').forEach(card => {
      card.addEventListener('click', () => { AudioSystem.click(); QuizSystem.start(card.dataset.category, 8); });
    });
    $('#settingsBtn').addEventListener('click', () => { AudioSystem.click(); UI.openSettings(); });
  },

  bindShop() {
    $all('.shop-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        AudioSystem.click();
        $all('.shop-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.renderShop(tab.dataset.shopcat);
      });
    });
  },

  bindApartment() {
    $('#aptUpgradeBtn').addEventListener('click', () => { AudioSystem.click(); if (ApartmentSystem.upgrade()) this.renderApartment(); });
  },

  bindProfile() {
    $('#retakeTestBtn').addEventListener('click', () => {
      AudioSystem.click();
      $('#appShell').classList.add('hidden');
      $('#resultScreen').classList.add('hidden');
      $('#onboardingScreen').classList.remove('hidden');
    });
  },

  bindModals() {
    $('#quizCloseBtn').addEventListener('click', () => { AudioSystem.click(); UI.closeQuiz(); });
    $('#quizNextBtn').addEventListener('click', () => { AudioSystem.click(); QuizSystem.next(); });
    $('#summaryCloseBtn').addEventListener('click', () => { AudioSystem.click(); $('#summaryModal').classList.add('hidden'); });
    $('#levelUpCloseBtn').addEventListener('click', () => { AudioSystem.click(); $('#levelUpModal').classList.add('hidden'); });
    $('#settingsCloseBtn').addEventListener('click', () => { AudioSystem.click(); $('#settingsModal').classList.add('hidden'); Persist.save(); UI.renderAll(); });
    $('#soundToggleBtn').addEventListener('click', () => {
      State.soundOn = !State.soundOn;
      $('#soundToggleBtn').textContent = State.soundOn ? '🔊 ON' : '🔈 OFF';
      Persist.save();
    });
    $('#playerNameInput').addEventListener('change', (e) => {
      State.playerName = (e.target.value || 'Player').slice(0, 16);
      Persist.save();
    });
    $('#resetProgressBtn').addEventListener('click', () => {
      if (confirm('Reset all progress? This cannot be undone.')) {
        Storage.reset();
        location.reload();
      }
    });
    $('#itemModalCloseBtn').addEventListener('click', () => { AudioSystem.click(); $('#itemModal').classList.add('hidden'); });
  },

  openSettings() {
    $('#playerNameInput').value = State.playerName;
    $('#soundToggleBtn').textContent = State.soundOn ? '🔊 ON' : '🔈 OFF';
    $('#settingsModal').classList.remove('hidden');
  },

  openQuiz() { $('#quizModal').classList.remove('hidden'); },
  closeQuiz() { $('#quizModal').classList.add('hidden'); if (window.speechSynthesis) window.speechSynthesis.cancel(); this.renderAll(); },

  showSummary(correct, xp, coins) {
    $('#summaryCorrect').textContent = correct;
    $('#summaryXp').textContent = xp;
    $('#summaryCoins').textContent = coins;
    $('#summaryModal').classList.remove('hidden');
  },

  showLevelUp(level, coins) {
    $('#levelUpNewLevel').textContent = level;
    $('#levelUpReward').textContent = `+${coins} coins`;
    AudioSystem.levelUp();
    $('#levelUpModal').classList.remove('hidden');
  },

  renderAll() {
    this.renderHome();
    if (this.currentScreen === 'learn') this.renderLearn();
    if (this.currentScreen === 'shop') this.renderShop();
    if (this.currentScreen === 'apartment') this.renderApartment();
    if (this.currentScreen === 'profile') this.renderProfile();
    CharacterSystem.render();
  },

  renderHome() {
    const prog = XPSystem.progress();
    $('#homeLevelText').textContent = `LEVEL ${prog.level}`;
    $('#homeXpFill').style.width = prog.pct + '%';
    $('#homeXpLabel').textContent = `${prog.into} / ${prog.span} XP`;
    $('#homeCoins').textContent = State.coins;
    $('#shopCoins').textContent = State.coins;
    $('#homeEnglishLevel').textContent = `English Level: ${State.englishLevel || 'A1'}`;

    $('#statVocab').textContent = `${MasterySystem.learnedCount()} words`;
    $('#statGrammar').textContent = `${pct(State.stats.grammar)}%`;
    $('#statReading').textContent = `${pct(State.stats.reading)}%`;
    $('#statListening').textContent = `${pct(State.stats.listening)}%`;

    DailyQuestSystem.ensureToday();
    $('#questFill').style.width = `${(State.dailyQuest.progress / State.dailyQuest.target) * 100}%`;
    $('#questProgressLabel').textContent = `${State.dailyQuest.progress} / ${State.dailyQuest.target}`;
    $('#questStartBtn').textContent = State.dailyQuest.claimed ? 'COMPLETED' : 'START';
    $('#questStartBtn').disabled = State.dailyQuest.claimed;
    $('#streakCount').textContent = State.streak.count;
  },

  renderLearn() {
    $('#learnLevelBadge').textContent = State.englishLevel || 'A1';
    const cats = [
      { key: 'vocabulary', icon: '🇬🇧', title: 'Vocabulary', desc: 'Learn new words.' },
      { key: 'grammar', icon: '📖', title: 'Grammar', desc: 'Practice grammar.' },
      { key: 'reading', icon: '📕', title: 'Reading', desc: 'Read and understand texts.' },
      { key: 'listening', icon: '🎧', title: 'Listening', desc: 'Listen and answer.' },
      { key: 'everyday', icon: '💬', title: 'Everyday English', desc: 'Real-life conversations.' },
    ];
    const wrap = $('#learnCategoryList');
    wrap.innerHTML = '';
    cats.forEach(c => {
      const total = c.key === 'listening' ? 20 : QUESTION_BANK.filter(q => q.category === c.key).length;
      const done = State.lessonsCompletedByCategory[c.key] || 0;
      const p = clamp(Math.round((done / 6) * 100), 0, 100);
      const el = document.createElement('div');
      el.className = 'learn-item';
      el.innerHTML = `
        <div class="learn-item-head">
          <div class="learn-item-icon">${c.icon}</div>
          <div>
            <div class="learn-item-title">${c.title}</div>
            <div class="learn-item-desc">${c.desc}</div>
          </div>
        </div>
        <div class="learn-item-meta"><span>${total} questions available</span><span>${p}%</span></div>
        <div class="learn-item-foot">
          <div class="xp-track"><div class="xp-fill" style="width:${p}%"></div></div>
          <button class="btn btn-primary btn-small" data-cat="${c.key}">START</button>
        </div>`;
      el.querySelector('button').addEventListener('click', () => { AudioSystem.click(); QuizSystem.start(c.key, 8); });
      wrap.appendChild(el);
    });
  },

  renderShop(cat) {
    cat = cat || $('.shop-tab.active')?.dataset.shopcat || 'clothing';
    $('#shopCoins').textContent = State.coins;
    const wrap = $('#shopGrid');
    wrap.innerHTML = '';
    SHOP_ITEMS.filter(i => i.category === cat).forEach(item => {
      wrap.appendChild(this.buildShopCard(item));
    });
  },

  buildShopCard(item) {
    const owned = ShopSystem.isOwned(item.id);
    const meets = ShopSystem.meetsRequirement(item);
    const equippedSlots = ['top', 'shoes', 'transport'];
    const isMultiSlot = ['headphones', 'backpack', 'watch', 'sunglasses'].includes(item.slot);
    const isEquipped = equippedSlots.includes(item.slot) ? State.equipped[item.slot] === item.id : (isMultiSlot ? State.equipped[item.slot] === item.id : false);

    const el = document.createElement('div');
    el.className = `shop-item ${item.rarity} ${!meets && !owned ? 'locked' : ''}`;
    let btnLabel, btnClass;
    if (!owned && !meets) { btnLabel = 'LOCKED'; btnClass = 'locked-btn'; }
    else if (!owned) { btnLabel = `BUY — ${item.price} 🪙`; btnClass = ''; }
    else if (item.slot && isEquipped) { btnLabel = 'EQUIPPED'; btnClass = 'equipped'; }
    else if (item.slot) { btnLabel = 'EQUIP'; btnClass = 'owned'; }
    else { btnLabel = 'OWNED'; btnClass = 'owned'; }

    el.innerHTML = `
      <div class="shop-item-preview">${item.icon}</div>
      <div class="pill pill-rarity ${item.rarity}">${capitalize(item.rarity)}</div>
      <div class="shop-item-name">${item.name}</div>
      <div class="shop-item-price">${item.price} 🪙</div>
      ${!meets && !owned ? `<div class="shop-item-lock">${ShopSystem.requirementLabel(item)}</div>` : ''}
      <div class="shop-item-btn ${btnClass}">${btnLabel}</div>
    `;
    el.addEventListener('click', (e) => {
      AudioSystem.click();
      if (!owned) {
        if (ShopSystem.buy(item, el)) { toast(`${item.name} purchased!`, '🛍️'); this.renderShop(); this.renderHome(); }
      } else if (item.slot) {
        ShopSystem.equip(item);
        this.renderShop();
      }
    });
    return el;
  },

  renderApartment() {
    const lvlInfo = ApartmentSystem.currentLevelInfo();
    const nextInfo = ApartmentSystem.nextLevelInfo();
    $('#apartmentLevelName').textContent = lvlInfo.name;
    $('#aptLevelNum').textContent = lvlInfo.level;
    if (nextInfo) {
      $('#aptNextInfo').textContent = `Next: ${nextInfo.name} (Lvl ${nextInfo.requirement}+)`;
      $('#aptUpgradeCost').textContent = `${nextInfo.cost.toLocaleString()} 🪙`;
      $('#aptUpgradeBtn').disabled = false;
    } else {
      $('#aptNextInfo').textContent = 'Maximum level reached!';
      $('#aptUpgradeBtn').disabled = true;
      $('#aptUpgradeCost').textContent = 'MAXED';
    }

    const room = $('#apartmentRoom');
    room.innerHTML = '';
    State.apartment.furniture.forEach(fid => {
      const item = FURNITURE_ITEMS.find(f => f.id === fid);
      if (!item) return;
      const el = document.createElement('div');
      el.className = 'apt-furniture';
      Object.assign(el.style, item.pos);
      el.textContent = item.icon;
      room.appendChild(el);
    });

    const grid = $('#furnitureGrid');
    grid.innerHTML = '';
    FURNITURE_ITEMS.forEach(item => {
      const owned = FurnitureSystem.isOwned(item.id);
      const meets = FurnitureSystem.meetsRequirement(item);
      const el = document.createElement('div');
      el.className = `shop-item ${item.rarity} ${!meets && !owned ? 'locked' : ''}`;
      let btnLabel = owned ? 'OWNED' : (!meets ? 'LOCKED' : `BUY — ${item.price} 🪙`);
      el.innerHTML = `
        <div class="shop-item-preview">${item.icon}</div>
        <div class="pill pill-rarity ${item.rarity}">${capitalize(item.rarity)}</div>
        <div class="shop-item-name">${item.name}</div>
        <div class="shop-item-price">${item.price} 🪙</div>
        ${!meets && !owned ? `<div class="shop-item-lock">Requires Level ${item.requirement.level}</div>` : ''}
        <div class="shop-item-btn ${owned ? 'owned' : ''}">${btnLabel}</div>
      `;
      el.addEventListener('click', () => {
        AudioSystem.click();
        if (!owned && FurnitureSystem.buy(item)) { toast(`${item.name} added to your apartment!`, '🏠'); this.renderApartment(); this.renderHome(); }
      });
      grid.appendChild(el);
    });

    const transportOrder = ['tr_bicycle', 'tr_scooter', 'tr_car', 'tr_sportscar'];
    const owned = transportOrder.filter(id => State.inventory.includes(id));
    const currentId = State.equipped.transport || owned[owned.length - 1] || null;
    const currentItem = currentId ? SHOP_ITEMS.find(i => i.id === currentId) : null;
    $('#garageIcon').textContent = currentItem ? currentItem.icon : '🚲';
    $('#garageName').textContent = currentItem ? currentItem.name : 'None yet — visit the Shop';
  },

  renderProfile() {
    const prog = XPSystem.progress();
    $('#profileName').textContent = State.playerName;
    $('#profileLevel').textContent = `Level ${prog.level}`;
    $('#profileXpFill').style.width = prog.pct + '%';
    $('#profileXpLabel').textContent = `${prog.into} / ${prog.span} XP`;
    $('#profileEnglishLevel').textContent = State.englishLevel || 'A1';

    $('#pStatVocab').textContent = MasterySystem.learnedCount();
    $('#pStatGrammar').textContent = pct(State.stats.grammar) + '%';
    $('#pStatReading').textContent = pct(State.stats.reading) + '%';
    $('#pStatListening').textContent = pct(State.stats.listening) + '%';

    $('#pTotalLessons').textContent = State.stats.totalLessons;
    $('#pCorrectAnswers').textContent = State.stats.correctAnswers;
    $('#pWordsMastered').textContent = MasterySystem.masteredCount();
    $('#pStreak').textContent = `${State.streak.count} days`;

    const cal = $('#streakCalendar');
    cal.innerHTML = '';
    StreakSystem.weekView().forEach(d => {
      const el = document.createElement('div');
      el.className = 'streak-day' + (d.done ? ' done' : '');
      el.innerHTML = `<span>${d.label}</span><span class="sd-dot"></span>`;
      cal.appendChild(el);
    });

    const grid = $('#achievementsGrid');
    grid.innerHTML = '';
    ACHIEVEMENTS.forEach(a => {
      const unlocked = State.achievements.includes(a.id);
      const el = document.createElement('div');
      el.className = 'achievement-card' + (unlocked ? ' unlocked' : '');
      el.innerHTML = `<div class="ach-icon">${a.icon}</div><div class="ach-title">${a.title}</div><div class="ach-desc">${a.desc}</div>`;
      grid.appendChild(el);
    });
  }
};

/* ============================== BOOTSTRAP ======================================= */
function initGame() {
  const loaded = Storage.load();
  State = loaded ? Object.assign(defaultState(), loaded) : defaultState();
  // Deep-merge nested defaults in case save is from an older version
  const def = defaultState();
  State.stats = Object.assign(def.stats, State.stats);
  State.stats.grammar = Object.assign(def.stats.grammar, State.stats.grammar);
  State.stats.reading = Object.assign(def.stats.reading, State.stats.reading);
  State.stats.listening = Object.assign(def.stats.listening, State.stats.listening);
  State.stats.everyday = Object.assign(def.stats.everyday, State.stats.everyday);
  State.equipped = Object.assign(def.equipped, State.equipped);
  State.apartment = Object.assign(def.apartment, State.apartment);
  State.streak = Object.assign(def.streak, State.streak);
  State.dailyQuest = Object.assign(def.dailyQuest, State.dailyQuest);
  State.lessonsCompletedByCategory = Object.assign(def.lessonsCompletedByCategory, State.lessonsCompletedByCategory);

  $('#startTestBtn').addEventListener('click', () => { AudioSystem.click(); TestSystem.start(); });
  $('#enterGameBtn').addEventListener('click', () => {
    AudioSystem.click();
    $('#resultScreen').classList.add('hidden');
    $('#appShell').classList.remove('hidden');
    Persist.save();
    UI.init();
  });

  if (State.testTaken) {
    $('#onboardingScreen').classList.add('hidden');
    $('#appShell').classList.remove('hidden');
    UI.init();
  }
}

document.addEventListener('DOMContentLoaded', initGame);
