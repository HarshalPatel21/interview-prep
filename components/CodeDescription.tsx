"use client";

import { getCurrentUser } from "@/lib/actions/auth.action";
import { getLeetcodeQuestionByInterviewId } from "@/lib/actions/general.action";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";

const CodeDescription = ({ id }: { id: string }) => {
  const [leetcodeQuestion, setLeetcodeQuestion] =
    useState<LeetcodeQuestion | null>(null);

  // 2. Ensure client-side only execution
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) throw new Error("User not found");

        const question = await getLeetcodeQuestionByInterviewId({
          interviewId: id,
          userId: user.id,
        });

        setLeetcodeQuestion(question);
      } catch (error) {
        console.error("Data fetch failed:", error);
      }
    };

    fetchData();
  }, []);

   const renderQuestionContent = () => {
     if (!leetcodeQuestion?.content) return null;

     // Sanitize the HTML content
     const cleanHtml = DOMPurify.sanitize(leetcodeQuestion.content);

     return (
       <div
         className="prose max-w-none"
         dangerouslySetInnerHTML={{ __html: cleanHtml }}
       />
     );
   };
 
  return (
    <div className="p-4 overflow-y-auto h-full ">
      <h1 className="text-2xl font-bold mb-2">{leetcodeQuestion?.title}</h1>
      <p className="text-sm mb-4 ">
        Difficulty:{" "}
        <span className="capitalize">
          {leetcodeQuestion?.difficulty.toLowerCase()}
        </span>
      </p>
      {renderQuestionContent()}
    </div>
  );
};

export default CodeDescription;
