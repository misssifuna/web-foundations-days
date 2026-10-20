# School Database Design

## 1. Table Descriptions

### Students

The `students` table stores each student's unique ID, name, and email address. The student ID is the primary key, while the email is required and must be unique so that two students cannot register with the same email address.

### Courses

The `courses` table stores each course's unique ID, name, and course code. The course ID is the primary key, and the course code is required and unique.

### Enrolments

The `enrolments` table links students to courses and stores the grade a student receives for a particular course. Its composite primary key consists of `student_id` and `course_id`, preventing the same student from enrolling in the same course twice. Foreign keys reference the students and courses tables to maintain referential integrity.

## 2. Relationships

The relationship between students and enrolments is one-to-many because one student can have several enrolment records, while each enrolment belongs to one student. Similarly, the relationship between courses and enrolments is one-to-many because one course can have many enrolments, while each enrolment refers to one course.

Students and courses have a many-to-many relationship: a student can take multiple courses, and a course can have multiple students. The enrolments table acts as a join table connecting these entities. It is necessary because it represents each student-course combination and stores relationship-specific information, such as the grade.

## 3. Index Recommendation

I would add an index on `enrolments(course_id)` to improve queries that retrieve students enrolled in a particular course and queries that group enrolments by course. This can be useful as the number of students and enrolments grows. The composite primary key begins with `student_id`, so a separate index on `course_id` can help queries that filter by course instead.

## 4. SQL or NoSQL?

I would choose a relational SQL database for this school system. Students, courses, and enrolments have clearly defined relationships, and foreign keys help ensure that every enrolment references a valid student and course. SQL also supports JOINs, grouping, and aggregation, which are useful for class lists and enrolment reports. A relational database is therefore a good fit for the structured data and consistency requirements of this system.
