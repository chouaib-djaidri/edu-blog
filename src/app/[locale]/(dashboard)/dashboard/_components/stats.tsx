import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlarmClock, PencilRuler, Swords, Users } from "lucide-react";
import VisitorsTimeline from "./visitors-timeline";

const data = [
  {
    id: 1,
    title: "Total Blogs Created",
    description:
      "The number of learning blogs you've published for English learners.",
    value: "22",
    // className: "bg-indigo-100/40 border-indigo-300 text-indigo-900",
    Icon: PencilRuler,
  },
  {
    id: 2,
    title: "Total Tests Created",
    description: "Number of tests you've created to challenge your learners",
    value: "12",
    // className: "bg-purple-100/40 border-purple-300 text-purple-900",
    Icon: Swords,
  },
  {
    id: 3,
    title: "Total Learners",
    description: "See how many users have engaged with your learning content.",
    value: "421",
    // className: "bg-orange-100/40 border-orange-300 text-orange-900",
    Icon: Users,
  },
  {
    id: 4,
    title: "Engagement Time",
    description:
      "Measure how long learners typically spend on your blogs and tests.",
    value: "+15H",
    // className: "bg-green-100/40 border-green-300 text-green-900",
    Icon: AlarmClock,
  },
];

const Stats = () => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <VisitorsTimeline />
      <div className="grid grid-cols-2 gap-3">
        {data.map(({ id, title, description, value, Icon }) => (
          <Card key={id} className="shadow-none gap-4">
            <div className="flex gap-4 px-6">
              <CardHeader className="flex-1 px-0 gap-1">
                <CardDescription className="font-medium text-base text-inherit">
                  {title}
                </CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums">
                  {value}
                </CardTitle>
              </CardHeader>
              <div className="size-14 rounded-full shrink-0 flex items-center justify-center">
                <Icon className="size-10" strokeWidth={1.5} />
              </div>
            </div>
            <CardFooter className="flex-col items-start gap-1 text-sm">
              <p className="line-clamp-2">{description}</p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Stats;
