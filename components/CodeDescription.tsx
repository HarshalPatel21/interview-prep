"use client";

import { getCurrentUser } from "@/lib/actions/auth.action";
import { getLeetcodeQuestionByInterviewId } from "@/lib/actions/general.action";
import { useEffect } from "react";
import DOMPurify from "dompurify";

const CodeDescription = ({
  id,
  description,
  onDescriptionChange,
}: {
  id: string;
  description: LeetcodeQuestion;
  onDescriptionChange: (newDescription: LeetcodeQuestion) => void;
}) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) throw new Error("User not found");

        const question = await getLeetcodeQuestionByInterviewId({
          interviewId: id,
          userId: user.id,
        });

        onDescriptionChange(question);
      } catch (error) {
        console.error("Data fetch failed:", error);
      }
    };

    fetchData();
  }, []);

  const renderQuestionContent = () => {
    if (!description?.content) return null;

    const cleanHtml = DOMPurify.sanitize(description.content);

    return (
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
      />
    );
  };

  return (
    <div className="p-4 overflow-y-auto h-full ">
      <h1 className="text-2xl font-bold mb-2">{description?.title}</h1>
      <p className="text-sm mb-4 ">
        Difficulty:{" "}
        <span className="capitalize">
          {description?.difficulty.toLowerCase()}
        </span>
      </p>
      {renderQuestionContent()}
    </div>
  );
};

export default CodeDescription;
