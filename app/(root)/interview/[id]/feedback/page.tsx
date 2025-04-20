import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getFeedbackByInterviewId,
  getInterviewById,
  getLeetcodeFeedbackByInterviewId,
} from "@/lib/actions/general.action";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const page = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id,
  });

  const leetcodeFeedback = await getLeetcodeFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id,
  });

  return (
    <section className="section-feedback">
      <div className="flex flex-row justify-center">
        <h1 className="text-4xl font-semibold">
          Feedback on the Interview -{" "}
          <span className="capitalize">{interview.role}</span> Interview
        </h1>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-wrap">
          <div className="flex flex-col md:flex-row gap-4 flex-1 min-w-[250px]">
            <div className="flex items-center gap-3 bg-gray-750 px-4 py-3 rounded-lg flex-1">
              <div className="p-1.5 bg-blue-900/30 rounded-full">
                <Image
                  src="/speech.svg"
                  width={20}
                  height={20}
                  alt="Interview rating"
                />
              </div>
              <div>
                <p className="text-sm text-gray-400">Interview</p>
                <p className="text-lg font-semibold text-primary-200">
                  {feedback?.totalScore ?? "--"}
                  <span className="text-sm font-normal text-gray-400">
                    /100
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-gray-750 px-4 py-3 rounded-lg flex-1">
              <div className="p-1.5 bg-purple-900/30 rounded-full">
                <Image
                  src="/code.svg"
                  width={20}
                  height={20}
                  alt="Coding rating"
                />
              </div>
              <div>
                <p className="text-sm text-gray-400">Coding</p>
                <p className="text-lg font-semibold text-primary-200">
                  {leetcodeFeedback?.totalScore ?? "--"}
                  <span className="text-sm font-normal text-gray-400">
                    /100
                  </span>
                </p>
              </div>
            </div>

            {/* Overall */}
            <div className="flex items-center gap-3 bg-gray-750 px-4 py-3 rounded-lg flex-1">
              <div className="p-1.5 bg-green-900/30 rounded-full">
                <Image
                  src="/star.svg"
                  width={20}
                  height={20}
                  alt="Overall rating"
                />
              </div>
              <div>
                <p className="text-sm text-gray-400">Overall</p>
                <p className="text-lg font-semibold text-primary-200">
                  {feedback && leetcodeFeedback
                    ? Math.round(
                        (feedback.totalScore + leetcodeFeedback.totalScore) / 2
                      )
                    : "--"}
                  <span className="text-sm font-normal text-gray-400">
                    /100
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-gray-750 px-4 py-3 rounded-lg">
            <div className="p-1.5 bg-orange-900/30 rounded-full">
              <Image src="/calendar.svg" width={20} height={20} alt="Date" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Date</p>
              <p className="text-gray-200">
                {feedback?.createdAt
                  ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
                  : "Not submitted"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <hr />

      <p>{feedback?.finalAssessment}</p>

      <div className="flex flex-col gap-4">
        <h2>Breakdown of the Interview:</h2>
        {feedback?.categoryScores?.map((category, index) => (
          <div key={index}>
            <p className="font-bold">
              {index + 1}. {category.name} ({category.score}/100)
            </p>
            <p>{category.comment}</p>
          </div>
        ))}
        {leetcodeFeedback?.categoryScores?.map((category, index) => (
          <div key={index}>
            <p className="font-bold">
              {index + 6}. {category.name} ({category.score}/100)
            </p>
            <p>{category.comment}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <h3>Strengths</h3>
        <ul>
          {feedback?.strengths?.map((strength, index) => (
            <li key={index}>{strength}</li>
          ))}
          {leetcodeFeedback?.strengths?.map((strength, index) => (
            <li key={index}>{strength}</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3">
        <h3>Areas for Improvement</h3>
        <ul>
          {feedback?.areasForImprovement?.map((area, index) => (
            <li key={index}>{area}</li>
          ))}
          {leetcodeFeedback?.areasForImprovement?.map((area, index) => (
            <li key={index}>{area}</li>
          ))}
        </ul>
      </div>

      <div className="buttons">
        <Button className="btn-secondary flex-1">
          <Link href="/" className="flex w-100px justify-center">
            <p className="text-sm font-semibold text-primary-200 text-center">
              Back to dashboard
            </p>
          </Link>
        </Button>

        {/* <Button className="btn-primary flex-1">
          <Link
            href={`/interview/${id}`}
            className="flex w-full justify-center"
          >
            <p className="text-sm font-semibold text-black text-center">
              Retake Interview
            </p>
          </Link>
        </Button> */}
      </div>
    </section>
  );
};

export default page;
