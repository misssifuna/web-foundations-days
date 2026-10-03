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

// searchNotes
console.log(searchNotes("javascript"));
// Expected: [{ id: 4, text: "Revise JavaScript arrays", category: "study" }]

console.log(searchNotes("python"));
// Expected: []

// longestNote
console.log(longestNote());
// Expected: { id: 3, text: "Email the project report to Grace", category: "work" }

const savedNotes = notes;
notes = [];
console.log(longestNote());
// Expected: null
notes = savedNotes;

console.log([]);
// Expected edge case: [] is an empty array example; longestNote() would return null if notes were empty.

// countByCategory
console.log(countByCategory());
// Expected: { personal: 2, study: 2, work: 1 }

console.log(notes.filter((note) => note.category === "work"));
// Expected: [{ id: 3, text: "Email the project report to Grace", category: "work" }]

// getSummary
console.log(getSummary());
// Expected: "5 notes: 2 personal, 1 work, 2 study."

console.log(notes.length === 0 ? "0 notes: 0 personal, 0 work, 0 study." : getSummary());
// Expected: "5 notes: 2 personal, 1 work, 2 study."

// isDuplicate
console.log(isDuplicate("  BUY MILK AND BREAD  "));
// Expected: true

console.log(isDuplicate("Learn JavaScript functions"));
// Expected: false

// addNote
console.log(addNote("Learn JavaScript functions", "study"));
// Expected: true

console.log(addNote("  Buy milk and bread  ", "personal"));
// Expected: false because it is a duplicate

console.log(addNote("A new note", "invalid"));
// Expected: false because the category is invalid
