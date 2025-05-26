"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const chartData = [
  { date: "2024-04-01", blogs: 222, tests: 150 },
  { date: "2024-04-02", blogs: 97, tests: 180 },
  { date: "2024-04-03", blogs: 167, tests: 120 },
  { date: "2024-04-04", blogs: 242, tests: 260 },
  { date: "2024-04-05", blogs: 373, tests: 290 },
  { date: "2024-04-06", blogs: 301, tests: 340 },
  { date: "2024-04-07", blogs: 245, tests: 180 },
  { date: "2024-04-08", blogs: 409, tests: 320 },
  { date: "2024-04-09", blogs: 59, tests: 110 },
  { date: "2024-04-10", blogs: 261, tests: 190 },
  { date: "2024-04-11", blogs: 327, tests: 350 },
  { date: "2024-04-12", blogs: 292, tests: 210 },
  { date: "2024-04-13", blogs: 342, tests: 380 },
  { date: "2024-04-14", blogs: 137, tests: 220 },
  { date: "2024-04-15", blogs: 120, tests: 170 },
  { date: "2024-04-16", blogs: 138, tests: 190 },
  { date: "2024-04-17", blogs: 446, tests: 360 },
  { date: "2024-04-18", blogs: 364, tests: 410 },
  { date: "2024-04-19", blogs: 243, tests: 180 },
  { date: "2024-04-20", blogs: 89, tests: 150 },
  { date: "2024-04-21", blogs: 137, tests: 200 },
  { date: "2024-04-22", blogs: 224, tests: 170 },
  { date: "2024-04-23", blogs: 138, tests: 230 },
  { date: "2024-04-24", blogs: 387, tests: 290 },
  { date: "2024-04-25", blogs: 215, tests: 250 },
  { date: "2024-04-26", blogs: 75, tests: 130 },
  { date: "2024-04-27", blogs: 383, tests: 420 },
  { date: "2024-04-28", blogs: 122, tests: 180 },
  { date: "2024-04-29", blogs: 315, tests: 240 },
  { date: "2024-04-30", blogs: 454, tests: 380 },
];

const chartConfig = {
  views: {
    label: "Page Views",
  },
  blogs: {
    label: "Blogs",
    color: "#5651ad",
  },
  tests: {
    label: "Tests",
    color: "#8739c0",
  },
} satisfies ChartConfig;

const generateDateTicks = (
  data: {
    date: string;
    blogs: number;
    tests: number;
  }[]
) => {
  if (!data || data.length === 0) return [];
  const firstDate = data[0].date;
  const lastDate = data[data.length - 1].date;
  const result = [firstDate];
  const currentDate = new Date(firstDate);
  while (true) {
    currentDate.setDate(currentDate.getDate() + 7);
    const dateString = currentDate.toISOString().split("T")[0];
    if (new Date(dateString) > new Date(lastDate)) break;
    result.push(dateString);
  }
  if (result[result.length - 1] !== lastDate) {
    result.push(lastDate);
  }
  return result;
};

const VisitorsTimeline = () => {
  const [activeChart, setActiveChart] =
    useState<keyof typeof chartConfig>("blogs");
  const dateTicks = generateDateTicks(chartData);

  return (
    <Card>
      <div className="flex items-center justify-between px-6 gap-6">
        <CardHeader className="flex-1 px-0">
          <CardTitle className="text-lg">Recent Visitors</CardTitle>
          <CardDescription>
            Track how many users viewed your blogs and tests over the past
            month.
          </CardDescription>
        </CardHeader>
        <div className="flex">
          {["blogs", "tests"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <Button
                key={chart}
                data-active={activeChart === chart}
                variant="outline"
                className={cn(
                  "capitalize h-10",
                  key === "blogs" && "rounded-e-none border-e-transparent",
                  key === "tests" && "rounded-s-none border-s-transparent",
                  {
                    "bg-indigo-100/40 border-indigo-800 text-indigo-900 hover:bg-indigo-100/40 border-e":
                      activeChart === chart && key === "blogs",
                    "bg-purple-100/40 border-purple-800 text-purple-900 hover:bg-purple-100/40 border-s":
                      activeChart === chart && key === "tests",
                  }
                )}
                onClick={() => setActiveChart(chart)}
              >
                {chartConfig[chart].label}
              </Button>
            );
          })}
        </div>
      </div>

      <CardContent className="px-0">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[200px] w-full px-6"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
            barSize={16}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              ticks={dateTicks}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar
              dataKey={activeChart}
              fill={`var(--color-${activeChart})`}
              radius={[10, 10, 10, 10]}
              barSize={10}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default VisitorsTimeline;
