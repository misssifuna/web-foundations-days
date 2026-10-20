
-- Day 6 Assignment: A School Database
-- Compatible with SQLite

-- 1. Create the students table
CREATE TABLE students (
    student_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

-- 2. Create the courses table
CREATE TABLE courses (
    course_id INTEGER PRIMARY KEY,
    course_name TEXT NOT NULL,
    course_code TEXT NOT NULL UNIQUE
);

-- 3. Create the enrolments table
CREATE TABLE enrolments (
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade TEXT,

    PRIMARY KEY (student_id, course_id),

    FOREIGN KEY (student_id)
        REFERENCES students(student_id),

    FOREIGN KEY (course_id)
        REFERENCES courses(course_id)
);

-- 4. Insert sample students
INSERT INTO students (student_id, name, email) VALUES
    (1, 'Alice Wanjiku', 'alice@example.com'),
    (2, 'Brian Kiptoo', 'brian@example.com'),
    (3, 'Carol Achieng', 'carol@example.com'),
    (4, 'David Mwangi', 'david@example.com');

-- 5. Insert sample courses
INSERT INTO courses (course_id, course_name, course_code) VALUES
    (1, 'Web Development', 'WEB101'),
    (2, 'Database Systems', 'DB102'),
    (3, 'Computer Networks', 'NET103');

-- 6. Insert sample enrolments
INSERT INTO enrolments (student_id, course_id, grade) VALUES
    (1, 1, 'A'),
    (1, 2, 'B'),
    (2, 1, 'B'),
    (2, 3, 'A'),
    (3, 2, 'A');

-- QUERY 1: All courses taken by one student, identified by name
SELECT
    s.name AS student_name,
    c.course_name,
    e.grade
FROM students AS s
JOIN enrolments AS e ON s.student_id = e.student_id
JOIN courses AS c ON e.course_id = c.course_id
WHERE s.name = 'Alice Wanjiku';

-- QUERY 2: All students enrolled in one course
SELECT
    c.course_name,
    s.name AS student_name,
    e.grade
FROM courses AS c
JOIN enrolments AS e ON c.course_id = e.course_id
JOIN students AS s ON e.student_id = s.student_id
WHERE c.course_name = 'Database Systems';

-- QUERY 3: Number of students enrolled in each course
-- LEFT JOIN includes courses with zero enrolments.
SELECT
    c.course_name,
    COUNT(e.student_id) AS student_count
FROM courses AS c
LEFT JOIN enrolments AS e ON c.course_id = e.course_id
GROUP BY c.course_id, c.course_name
ORDER BY c.course_id;

-- QUERY 4: Students who have no enrolments
SELECT
    s.student_id,
    s.name,
    s.email
FROM students AS s
LEFT JOIN enrolments AS e ON s.student_id = e.student_id
WHERE e.student_id IS NULL;

-- QUERY 5: Update one enrolment's grade
UPDATE enrolments
SET grade = 'A'
WHERE student_id = 1 AND course_id = 2;
