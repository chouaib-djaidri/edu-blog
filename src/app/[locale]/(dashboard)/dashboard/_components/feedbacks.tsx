"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";
import { useMemo } from "react";
import { Cell, Label, Pie, PieChart } from "recharts";

function getRatingColor(rating: string) {
  switch (rating) {
    case "5":
      return "#7dd06c";
    case "4":
      return "#6dd8a2";
    case "3":
      return "#facc15";
    case "2":
      return "#fb923c";
    case "1":
      return "#f87171";
    default:
      return "#cbd5e1";
  }
}

const chartConfig = {
  count: {
    label: "Reviews",
  },
  "5": {
    label: "5 Stars",
  },
  "4": {
    label: "4 Stars",
  },
  "3": {
    label: "3 Stars",
  },
  "2": {
    label: "2 Stars",
  },
  "1": {
    label: "1 Star",
  },
} satisfies ChartConfig;

const Feedbacks = () => {
  const rateCount: Record<string, number> = useMemo(
    () => ({
      "5": 4000,
      "4": 2100,
      "3": 800,
      "2": 631,
      "1": 344,
    }),
    []
  );

  const totalReviews = Object.values(rateCount).reduce((a, b) => a + b, 0);

  const rateProgress = Object.fromEntries(
    Object.entries(rateCount).map(([rating, count]) => [
      rating,
      (count / totalReviews) * 100,
    ])
  );

  const chartData = useMemo(() => {
    return Object.entries(rateCount)
      .map(([rating, count]) => ({
        rating,
        count,
        name: `${rating} Stars`,
        fill: getRatingColor(rating),
      }))
      .sort((a, b) => parseInt(b.rating) - parseInt(a.rating));
  }, [rateCount]);

  function getProgressColorClass(rating: string) {
    switch (rating) {
      case "5":
        return "bg-[#7dd06c]/15 [&>div]:bg-[#7dd06c]";
      case "4":
        return "bg-[#6dd8a2]/15 [&>div]:bg-[#6dd8a2]";
      case "3":
        return "bg-[#facc15]/15 [&>div]:bg-[#facc15]";
      case "2":
        return "bg-[#fb923c]/15 [&>div]:bg-[#fb923c]";
      case "1":
        return "bg-[#f87171]/15 [&>div]:bg-[#f87171]";
      default:
        return "";
    }
  }

  const time = new Date().toDateString();

  return (
    <Card className="gap-1">
      <CardHeader>
        <CardTitle className="text-lg">Learners Reviews</CardTitle>
        <CardDescription>
          Read what {totalReviews} learners have shared about their learning
          experience, feedback, and engagement with your content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-[200px]">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[200px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="count"
                  nameKey="name"
                  innerRadius={50}
                  strokeWidth={4}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.rating} fill={entry.fill} />
                  ))}
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-xl font-bold"
                            >
                              {totalReviews.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 16}
                              className="fill-muted-foreground"
                            >
                              Reviews
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>
          <div className="space-y-2 flex-1">
            {Object.keys(rateProgress)
              .sort((a, b) => parseInt(b) - parseInt(a))
              .map((el) => (
                <div key={el} className="flex gap-2 items-center">
                  <div className="flex items-center gap-1 w-8 shrink-0">
                    <p className="font-medium w-3 flex items-center justify-center">
                      {el}
                    </p>
                    <Star className="fill-amber-300 stroke-amber-400 size-4" />
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <Progress
                      value={rateProgress[el]}
                      className={`flex-1 h-2.5 [&>div]:rounded-e-full ${getProgressColorClass(el)}`}
                    />
                    <p className="text-end w-10 shrink-0 text-muted-foreground">
                      {rateProgress[el] % 1 === 0
                        ? Math.trunc(rateProgress[el])
                        : rateProgress[el].toFixed(1)}
                      %
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="p-4 border rounded-xl bg-accent text-xs space-y-3 text-muted-foreground">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((key) => (
                <Star
                  key={key}
                  className="fill-amber-300 stroke-amber-400 size-4.5"
                />
              ))}
            </div>
            <time dateTime={time}>{time}</time>
          </div>
          <p className="text-sm">
            {
              "I really enjoyed the learning experience! The content was clear, well-structured, and easy to follow. I especially liked the interactive parts and quizzes — they made everything more engaging. Looking forward to exploring more topics soon!"
            }
          </p>
          <div className="flex items-center gap-2">
            <p className="font-medium">Chouaib Dj.</p>
            <Badge>B2 Level</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Feedbacks;
