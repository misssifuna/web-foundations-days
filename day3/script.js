// Starting data
let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

// 1. Search notes by word
function searchNotes(word) {
  const searchWord = word.toLowerCase();
  return notes.filter((note) =>
    note.text.toLowerCase().includes(searchWord)
  );
}

// 2. Find the longest note
function longestNote() {
  if (notes.length === 0) {
    return null;
  }

  return notes.reduce((longest, note) =>
    note.text.length > longest.text.length ? note : longest
  );
}

// 3. Count notes by category
function countByCategory() {
  const counts = {};

  notes.forEach((note) => {
    if (!counts[note.category]) {
      counts[note.category] = 0;
    }

    counts[note.category]++;
  });

  return counts;
}

// 4. Create a summary
function getSummary() {
  const counts = countByCategory();
  const total = notes.length;
  const noteWord = total === 1 ? "note" : "notes";

  return `${total} ${noteWord}: ${counts.personal || 0} personal, ${counts.work || 0} work, ${counts.study || 0} study.`;
}

// 5. Check for duplicate text
function isDuplicate(text) {
  const cleanedText = text.trim().toLowerCase();

  return notes.some(
    (note) => note.text.trim().toLowerCase() === cleanedText
  );
}

// 6. Add a valid note
function addNote(text, category) {
  const cleanedText = text.trim();
  const validCategories = ["personal", "work", "study"];

  if (cleanedText.length < 1 || cleanedText.length > 200) {
    console.log("❌ Note rejected: text must be 1-200 characters.");
    return false;
  }

  if (isDuplicate(cleanedText)) {
    console.log("❌ Note rejected: duplicate note.");
    return false;
  }

  if (!validCategories.includes(category)) {
    console.log("❌ Note rejected: invalid category.");
    return false;
  }

  const newNote = {
    id: Date.now(),
    text: cleanedText,
    category: category,
  };

  notes.push(newNote);

  console.log(`✅ Note added: "${newNote.text}"`);
  return true;
}

// --- Tests ---

// 1. searchNotes()
console.log(
  "searchNotes - normal:",
  JSON.stringify(searchNotes("javascript"))
);
// Expected: [{"id":4,"text":"Revise JavaScript arrays","category":"study"}]

console.log(
  "searchNotes - no results:",
  JSON.stringify(searchNotes("python"))
);
// Expected: []


// 2. longestNote()
console.log("longestNote - normal:", JSON.stringify(longestNote()));
// Expected: {"id":3,"text":"Email the project report to Grace","category":"work"}

const originalNotes = notes;

notes = [];
console.log("longestNote - empty:", longestNote());
// Expected: null

notes = originalNotes;


// 3. countByCategory()
console.log(
  "countByCategory - normal:",
  JSON.stringify(countByCategory())
);
// Expected: {"personal":2,"study":2,"work":1}

notes = [];
console.log(
  "countByCategory - empty:",
  JSON.stringify(countByCategory())
);
// Expected: {}

notes = originalNotes;


// 4. getSummary()
console.log("getSummary - normal:", getSummary());
// Expected: "5 notes: 2 personal, 1 work, 2 study."

notes = [];
console.log("getSummary - empty:", getSummary());
// Expected: "0 notes: 0 personal, 0 work, 0 study."

notes = [{ id: 6, text: "Study", category: "study" }];
console.log("getSummary - singular:", getSummary());
// Expected: "1 note: 0 personal, 0 work, 1 study."

notes = originalNotes;


// 5. isDuplicate()
console.log(
  "isDuplicate - existing text:",
  isDuplicate("  BUY MILK AND BREAD  ")
);
// Expected: true

console.log(
  "isDuplicate - new text:",
  isDuplicate("Learn JavaScript functions")
);
// Expected: false


// 6. addNote()
console.log(
  "addNote - valid note:",
  addNote("Learn JavaScript functions", "study")
);
// Expected: true

console.log(
  "addNote - duplicate:",
  addNote("  Buy milk and bread  ", "personal")
);
// Expected: false

console.log(
  "addNote - invalid category:",
  addNote("Another note", "invalid")
);
// Expected: false

console.log(
  "addNote - empty text:",
  addNote("   ", "personal")
);
// Expected: false

console.log(
  "addNote - text over 200 characters:",
  addNote("a".repeat(201), "personal")
);
// Expected: false

