"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getLeetcodeQuestionByInterviewId } from "@/lib/actions/general.action";
import { aceLanguages, aceThemes } from "@/constants";

const AceEditor = dynamic(
  async () => {
    const reactAce = await import("react-ace");

    await import("ace-builds/src-noconflict/ace");
    await import("ace-builds/src-noconflict/ext-language_tools");

    await Promise.all(
      Object.values(aceLanguages).map((mode) =>
        import(`ace-builds/src-noconflict/mode-${mode}`).catch((e) =>
          console.error(`Failed to load mode ${mode}:`, e)
        )
      )
    );

    await Promise.all(
      aceThemes.map((theme) =>
        import(`ace-builds/src-noconflict/theme-${theme}`).catch((e) =>
          console.error(`Failed to load theme ${theme}:`, e)
        )
      )
    );

    return reactAce;
  },
  {
    ssr: false,
    loading: () => (
      <div className="h-[500px] w-full bg-gray-100 animate-pulse" />
    ),
  }
);

interface CodeEditorProps {
  id: string;
  language?: keyof typeof aceLanguages;
  theme?: string;
  code: string;
  onCodeChange: (newCode: string) => void;
}

const CodeEditor = ({
  id,
  code,
  onCodeChange,
  language = "javascript",
  theme = "monokai",
}: CodeEditorProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);

    const fetchData = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) throw new Error("User not found");

        const question = await getLeetcodeQuestionByInterviewId({
          interviewId: id,
          userId: user.id,
        });

        const selectedSnippet = question?.codeSnippets.find(
          (snippet) => snippet.langSlug === language
        );

        onCodeChange(selectedSnippet?.code || "");
      } catch (error) {
        console.error("Data fetch failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, language]);

  if (!isMounted || isLoading) {
    return <div className="h-[100%] w-full bg-gray-100 animate-pulse" />;
  }

  return (
    <AceEditor
      mode={aceLanguages[language] || "javascript"}
      theme={theme}
      onChange={onCodeChange}
      value={code}
      width="100%"
      height="100%"
      showPrintMargin={false}
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
      }}
    />
  );
};

export default CodeEditor;
