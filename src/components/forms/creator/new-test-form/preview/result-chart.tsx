"use client";

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
import { TestAnswerState, TestResultProps } from "@/types/globals";
import { useTranslations } from "next-intl";
import { Pie, PieChart } from "recharts";

interface ResultChartProps {
  height?: number;
  result: TestResultProps;
}

const ResultChart = ({ height = 200, result }: ResultChartProps) => {
  const t = useTranslations("Test");

  const chartConfig = {
    correct: {
      label: t("correctAnswers"),
      color: "var(--chart-2)",
    },
    wrong: {
      label: t("wrongAnswers"),
      color: "var(--chart-1)",
    },
    points: {
      label: t("totalPoints"),
      color: "var(--chart-4)",
    },
  } satisfies ChartConfig;

  const chartData = [
    {
      answer: "correct",
      total: result.correct,
      fill: "var(--color-correct)",
    },
    { answer: "wrong", total: result.wrong, fill: "var(--color-wrong)" },
  ];

  const headerPadding = Math.max(4, Math.round(height * 0.08));
  const contentPadding = Math.max(3, Math.round(height * 0.05));
  const chartHeight = Math.round(
    height - headerPadding * 2 - contentPadding * 2 - 30
  );
  const outerRadius = Math.round(chartHeight * 0.45);
  const innerRadius = Math.round(outerRadius * 0.6);
  const strokeWidth = Math.max(1, Math.round(height * 0.02));

  return (
    <Card className="gap-5 rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg">{t("result.title")}</CardTitle>
        <CardDescription>{t("result.description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center w-full">
        <div className="font-semibold text-xs flex flex-col gap-3 items-center flex-1">
          {chartData.map(({ answer, total }) => (
            <div className="flex items-center gap-2 w-full" key={answer}>
              <div
                className="h-9 w-1 flex-shrink-0 rounded-md"
                style={{
                  backgroundColor:
                    chartConfig?.[answer as TestAnswerState]?.color ||
                    "transparent",
                }}
              />
              <div>
                <p className="text-sm">{total}</p>
                <p className="capitalize text-muted-foreground font-medium">{`${answer} ${t("answers")}`}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center flex-1 max-w-40">
          <ChartContainer
            config={chartConfig}
            className="w-full"
            style={{ height: `${chartHeight}px` }}
          >
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Pie
                data={chartData}
                dataKey="total"
                nameKey="answer"
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                strokeWidth={strokeWidth}
              />
            </PieChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultChart;
