import {
  classroom,
  assignment,
  question,
  assignment_submission,
  // student,
  // user,
  question_submission,
  users,
  user_assignment_question_submission_flat,
  question_and_question_submission_flat,
} from '@prisma/client';

export type Classroom = classroom;
export type Assignment = assignment;
export type Question = question;

export type AssignmentSubmission = assignment_submission & {
  student_user_id: number;
  student: {
    user: {
      name: string | null;
    };
  };
  question_submission: question_submission[];
};

export type QuestionSubmission = question_submission;

export type UserAssignmentQuestionSubmission = user_assignment_question_submission_flat;

export type UserAssignmentSubmission = user_assignment_question_submission_flat;

export type QuestionAndQuestionSubmission = question_and_question_submission_flat;
