"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useUserProgress } from "@/context/user-progress";
import { cn, getLevelBadgeClasses } from "@/lib/utils";
import { EnglishLevel } from "@/types/globals";
import Image from "next/image";

const data = [
  {
    id: 1,
    title: "Total Earned Points",
    description:
      "The total number of points you've earned by reading blogs, taking quizzes, and completing achievements.",
    value: "1585",
    icon: "gems.png",
  },
  {
    id: 2,
    title: "Total Quizzes Taken",
    description:
      "The total number of quizzes you've attempted to test your knowledge.",
    value: "2",
    icon: "lightning.png",
  },
  {
    id: 3,
    title: "Total Tests Passed",
    description: "The number of tests where you achieved a passing score.",
    value: "3",
    icon: "fire.png",
  },
  {
    id: 4,
    title: "Total Blogs Read",
    description:
      "The total number of blogs you've read to improve your learning journey.",
    value: "5",
    icon: "graduating-student.png",
  },
];

function getProgressColorClass(rating: EnglishLevel) {
  switch (rating) {
    case EnglishLevel.A1:
      return "bg-red-200 [&>div]:bg-red-600";
    case EnglishLevel.A2:
      return "bg-orange-200 [&>div]:bg-orange-600";
    case EnglishLevel.B1:
      return "bg-yellow-200 [&>div]:bg-yellow-600";
    case EnglishLevel.B2:
      return "bg-green-200 border-green-600 [&>div]:bg-green-600";
    case EnglishLevel.C1:
      return "bg-indigo-200 [&>div]:bg-indigo-600";
    case EnglishLevel.C2:
      return "bg-purple-200 [&>div]:bg-purple-600";
    default:
      return "";
  }
}

const rateCount: Record<EnglishLevel, number> = {
  A1: 0,
  A2: 500,
  B1: 1500,
  B2: 3000,
  C1: 6000,
  C2: 12000,
};

const Stats = () => {
  const { totalPoints, currentLevel } = useUserProgress();

  const rateProgress = Object.fromEntries(
    Object.entries(rateCount).map(([rating, count]) => [
      rating,
      Math.min(count > 0 ? (totalPoints / count) * 100 : 100, 100),
    ])
  );

  return (
    <div className="grid grid-cols-2 gap-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Current Level</CardTitle>
          <CardDescription>
            See your current level and monitor your journey as you advance
            through new challenges.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.keys(rateProgress)
            .sort((a, b) => parseInt(b) - parseInt(a))
            .map((el) => (
              <div
                key={el}
                className={cn(
                  "flex gap-2 items-center",
                  el !== currentLevel && "opacity-40 px-2",
                  el === currentLevel && "py-2"
                )}
              >
                <Badge className={cn("text-xs", getLevelBadgeClasses(el))}>
                  {el} Level
                </Badge>
                <div className="flex-1 flex items-center gap-2">
                  <Progress
                    value={rateProgress[el]}
                    className={`flex-1 h-2.5 ${getProgressColorClass(el as EnglishLevel)}`}
                  />
                  <p className="text-end w-14 shrink-0 text-muted-foreground font-semibold">
                    {rateCount[el as EnglishLevel]}P
                  </p>
                </div>
              </div>
            ))}
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 gap-3">
        {data.map(({ id, title, description, value, icon }) => (
          <Card key={id} className={cn("shadow-none gap-4")}>
            <div className="flex gap-3 px-6">
              <CardHeader className="flex-1 px-0">
                <CardDescription className="font-medium text-base text-inherit">
                  {title}
                </CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums">
                  {value}
                </CardTitle>
              </CardHeader>
              <div className="size-9 rounded-full shrink-0 flex items-center justify-center">
                <Image
                  src={`/icons/${icon}`}
                  alt=""
                  width={512}
                  height={512}
                  className="size-full object-cover"
                />
              </div>
            </div>
            <CardFooter className="flex-col items-start gap-1 text-sm text-muted-foreground">
              <p className="line-clamp-2">{description}</p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Stats;
