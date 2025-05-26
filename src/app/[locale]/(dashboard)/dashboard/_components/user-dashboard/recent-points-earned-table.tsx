import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";

export const items = [
  {
    pointsEarned: 15,
    sourceType: "blog_quiz",
    createdAt: "2025-05-24T21:50:00+00:00",
  },
  {
    pointsEarned: 30,
    sourceType: "test",
    createdAt: "2025-05-23T21:25:00+00:00",
  },
  {
    pointsEarned: 10,
    sourceType: "test",
    createdAt: "2025-05-24T21:17:00+00:00",
  },
  {
    pointsEarned: 25,
    sourceType: "test",
    createdAt: "2025-05-24T21:05:00+00:00",
  },
  {
    pointsEarned: 15,
    sourceType: "blog_quiz",
    createdAt: "2025-05-24T20:30:00+00:00",
  },
];

const RecentPointsEarnedTable = () => {
  return (
    <Card className="gap-6">
      <div className="flex items-center justify-between px-6 shrink-0 gap-6 w-full">
        <CardHeader className="flex-1 px-0 gap-0.5">
          <CardTitle className="text-lg">Recent Points Activity</CardTitle>
          <CardDescription>
            Track your latest learning actions and points earned from reading
            blogs and taking tests.
          </CardDescription>
        </CardHeader>
      </div>
      <CardContent className="space-y-1">
        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader className="bg-accent">
              <TableRow className="hover:bg-transparent">
                <TableHead className="border-e">Source Type</TableHead>
                <TableHead className="border-e">Points</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length ? (
                items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="capitalize">
                      <Badge
                        className={cn(
                          "px-4",
                          item.sourceType === "blog_quiz" &&
                            "bg-yellow-100 border-yellow-400 text-yellow-900",
                          item.sourceType === "test" &&
                            "bg-orange-100 border-orange-400 text-orange-900"
                        )}
                      >
                        {item.sourceType === "blog_quiz"
                          ? "Blog Quiz"
                          : item.sourceType === "test"
                            ? "Test"
                            : "Initial"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-teal-100 border-teal-400 text-teal-900 px-4">
                        <div className="size-3.5 relative -ms-1">
                          <Image
                            src="/icons/gems.png"
                            alt=""
                            width={512}
                            height={512}
                            className="size-full object-cover"
                          />
                        </div>
                        {item.pointsEarned}P
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(item.createdAt, "MMMM dd, yyyy 'at' HH:mm")}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-4 text-muted-foreground"
                  >
                    There are no recent learners yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentPointsEarnedTable;
