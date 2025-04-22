"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { useRouter } from "next/navigation";
import { interviewer } from "@/constants";
import {
  createFeedback,
  getLeetcodeQuestion,
} from "@/lib/actions/general.action";
import WebcamStreamer from "./WebcamStreamer";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({
  userName,
  userId,
  type,
  interviewId,
  questions,
  technical
}: AgentProps) => {
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const webcamStreamerRef = useRef<any>(null);


  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };

        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.log("Error:", error);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  // const handleGenerateLeetcode = async () => {
  //   const { success, leetcodeQuestionId } = await getLeetcodeQuestion({
  //     interviewId: interviewId!,
  //     userId: userId!,
  //   });

  //   const { success: feedbackSuccess, feedbackId: id } = await createFeedback({
  //     interviewId: interviewId!,
  //     userId: userId!,
  //     transcript: messages,
  //   });

  //   if (success && leetcodeQuestionId && feedbackSuccess && id) {
  //     router.push(`/interview/${interviewId}/code`);
  //   } else {
  //     router.push("/");
  //   }
  // };

  const handleGenerateLeetcode = async () => {
    const { success, leetcodeQuestionId } = await getLeetcodeQuestion({
      interviewId: interviewId!,
      userId: userId!,
    });

    const { success: feedbackSuccess, feedbackId: id } = await createFeedback({
      interviewId: interviewId!,
      userId: userId!,
      transcript: messages,
    });

    if (success && feedbackSuccess && id) {
      // Check if interview type is behavioral
      if (!technical) {
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        // Only proceed with code route if we have leetcodeQuestionId and it's not behavioral
        if (leetcodeQuestionId) {
          router.push(`/interview/${interviewId}/code`);
        } else {
          router.push("/");
        }
      }
    } else {
      router.push("/");
    }
  };
  
  useEffect(() => {
    if (callStatus === CallStatus.FINISHED) {
      webcamStreamerRef.current?.stopStreaming();
      if (type === "generate") {
        router.push("/");
      } else {
        handleGenerateLeetcode();
      }
    }
  }, [messages, callStatus, router, type, userId]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    if (type === "generate") {
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
        variableValues: {
          username: userName,
          userid: userId,
        },
      });
    } else {
      let formattedQuestions = "";

      if (questions) {
        formattedQuestions = questions
          .map((question) => `- ${question}`)
          .join("\n");
      }

      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
        },
      });
    }
    webcamStreamerRef.current?.startStreaming();
  };
  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  const latestMessage = messages[messages.length - 1]?.content;
  const isCallInactiveOrFinished =
    callStatus === CallStatus.INACTIVE || callStatus === "FINISHED";
  return (
    <>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="vapi"
              width={30}
              height={15}
              className="object-cover"
            ></Image>
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>
        <div className="card-interviewer">
          <WebcamStreamer ref={webcamStreamerRef} />
        </div>
      </div>
      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={latestMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {latestMessage}
            </p>
          </div>
        </div>
      )}
      <div className="w-full flex justify-center">
        {callStatus !== "ACTIVE" ? (
          <button className="relative btn-call" onClick={handleCall}>
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden"
              )}
            />

            <span className="relative">
              {isCallInactiveOrFinished ? "Call" : ". . ."}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={handleDisconnect}>
            End
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
