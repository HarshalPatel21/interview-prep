"use client";

import React, { use } from "react";

import { useState } from "react";
import CodeEditor from "@/components/CodeEditor";
import CodeDescription from "@/components/CodeDescription";
import { aceLanguages, aceThemes } from "@/constants";
import { createLeetcodeFeedback } from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { useRouter } from "next/navigation";

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const { id } = use(params);
  const [theme, setTheme] = useState("monokai");
  const [language, setLanguage] = useState("c");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState<LeetcodeQuestion | null>(null);

  const handleSubmit = async () => {
    const title = description?.title;
    const content = description?.content.replace(/<[^>]*>/g, "");
    const user = await getCurrentUser();

    const { success, feedbackId } = await createLeetcodeFeedback({
      interviewId: id,
      userId: user?.id,
      code: code,
      description: content,
      title: title,
    });
    if (success && feedbackId) {
      router.push(`/interview/${id}/feedback`);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-gray-100 rounded-md overflow-hidden shadow-2xl border border-gray-700">
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 border-r border-gray-700 overflow-y-auto p-6 bg-gray-800">
          <div className="max-w-3xl mx-auto">
            <CodeDescription
              id={id}
              description={description}
              onDescriptionChange={setDescription}
            />
          </div>
        </div>

        <div className="w-1/2 flex flex-col bg-gray-850">
          <div className="p-3 border-b border-gray-700 bg-gray-800 flex items-center justify-between">
            <h2 className="font-mono text-sm font-semibold text-blue-300">
              CODE EDITOR
            </h2>
            <div className="flex space-x-3 items-center">
              <div className="relative">
                <select
                  className="appearance-none bg-gray-750 border border-blue-500 text-blue-100 text-xs rounded pl-2 pr-6 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400 cursor-pointer"
                  value={language}
                  onChange={(e) => {
                    const newLanguage = e.target
                      .value as keyof typeof aceLanguages;
                    setLanguage(newLanguage);
                    localStorage.setItem("editor-language", newLanguage);
                  }}
                >
                  {Object.keys(aceLanguages).map((lang) => (
                    <option
                      key={lang}
                      value={lang}
                      className="bg-gray-800 text-blue-100"
                    >
                      {lang.replace(/\b\w/g, (char) => char.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <select
                  className="appearance-none bg-gray-750 border border-blue-500 text-blue-100 text-xs rounded pl-2 pr-6 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400 cursor-pointer"
                  value={theme}
                  onChange={(e) => {
                    const newTheme = e.target.value;
                    setTheme(newTheme);
                  }}
                >
                  {aceThemes.map((theme) => (
                    <option
                      key={theme}
                      value={theme.toLowerCase()}
                      className="bg-gray-800 text-blue-100"
                    >
                      {theme
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (char) => char.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <CodeEditor
              id={id}
              language={language}
              theme={theme}
              code={code}
              onCodeChange={setCode}
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-800 border-t border-gray-700 p-2 flex justify-end">
        <button
          onClick={handleSubmit}
          className="w-100px bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-colors"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Page;
