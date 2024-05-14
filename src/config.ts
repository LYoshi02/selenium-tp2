import dotenv from "dotenv";

// To intialize the environment variables
dotenv.config();

export const envVariables = {
  studentId: process.env.STUDENT_ID || "",
  password: process.env.PASSWORD || "",
};
