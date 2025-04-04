"use client";

import React, { use } from 'react'

import { useState } from "react";
import CodeEditor from '@/components/CodeEditor';
import CodeDescription from '@/components/CodeDescription';
import { aceLanguages, aceThemes } from '@/constants';


const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const [theme, setTheme] = useState("monokai");
  const [language, setLanguage] = useState("c");

  const leetcodeFeedback = () => {}
  
  return (
    // <div className="flex h-100% bg-gray-900 text-gray-100">
    <div className="flex h-full bg-gray-900 text-gray-100 rounded-md overflow-hidden shadow-2xl border border-gray-700">
      {/* Left Panel */}
      <div className="w-1/2 border-r border-gray-700 overflow-y-auto p-6 bg-gray-800 ">
        <div className="max-w-3xl mx-auto">
          <CodeDescription id={id} />
        </div>
      </div>

      {/* Right Panel - Editor */}
      <div className="w-1/2 flex flex-col bg-gray-850">
        {/* Editor Header */}
        <div className="p-3 border-b border-gray-700 bg-gray-800 flex items-center justify-between">
          <h2 className="font-mono text-sm font-semibold text-blue-300">
            CODE EDITOR
          </h2>

          {/* Language & Theme Selectors */}
          <div className="flex space-x-3 items-center">
            {/* Language Selector */}
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

            {/* Theme Selector */}
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

        {/* Editor Area */}
        <div className="flex-1 overflow-auto">
          <CodeEditor id={id} language={language} theme={theme} />
        </div>
      </div>
    </div>
  );
};

export default Page