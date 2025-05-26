import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { getLevelBadgeClasses } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import Image from "next/image";

const items = [
  {
    id: "1",
    name: "Alex Thompson",
    image:
      "https://res.cloudinary.com/dlzlfasou/image/upload/v1736358071/avatar-40-02_upqrxi.jpg",
    email: "alex.t@gmail.com",
    lastReadTime: "Just now",
    level: "B1",
  },
  {
    id: "2",
    name: "Sarah Chen",
    image:
      "https://res.cloudinary.com/dlzlfasou/image/upload/v1736358073/avatar-40-01_ij9v7j.jpg",
    email: "sarah.c@gmail.com",
    lastReadTime: "2 hours ago",
    level: "C1",
  },
  {
    id: "4",
    name: "Maria Garcia",
    image:
      "https://res.cloudinary.com/dlzlfasou/image/upload/v1736358072/avatar-40-03_dkeufx.jpg",
    email: "m.garcia@gmail.com",
    lastReadTime: "6 hours ago",
    level: "A2",
  },
  {
    id: "5",
    name: "David Kim",
    image:
      "https://res.cloudinary.com/dlzlfasou/image/upload/v1736358070/avatar-40-05_cmz0mg.jpg",
    email: "d.kim@gmail.com",
    lastReadTime: "Yesterday",
    level: "B2",
  },
  {
    id: "6",
    name: "Kata Luiz",
    image:
      "https://res.cloudinary.com/dlzlfasou/image/upload/v1736358070/avatar-40-02_upqrxi.jpg",
    email: "d.master@gmail.com",
    lastReadTime: "3 days ago",
    level: "B2",
  },
];

export default function NewLearnersTable() {
  return (
    <Card className="gap-6">
      <div className="flex items-center justify-between px-6 shrink-0 gap-6 w-full">
        <CardHeader className="flex-1 px-0">
          <CardTitle className="text-lg">New Learners</CardTitle>
          <CardDescription>
            Discover the latest learners engaging with your content and showing
            interest in your posts.
          </CardDescription>
        </CardHeader>
        <Button className="shrink-0" variant="outline">
          See All
          <ExternalLink className="size-4.5" />
        </Button>
      </div>
      <CardContent className="space-y-1">
        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader className="bg-accent">
              <TableRow className="hover:bg-transparent">
                <TableHead className="border-e">Full Name</TableHead>
                <TableHead className="border-e">Email</TableHead>
                <TableHead className="border-e">Last Read</TableHead>
                <TableHead>Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length ? (
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Image
                          className="rounded-xl size-9"
                          src={item.image}
                          width={40}
                          height={40}
                          alt={item.name}
                        />
                        <p className="font-medium">{item.name}</p>
                      </div>
                    </TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.lastReadTime}</TableCell>
                    <TableCell>
                      <Badge className={getLevelBadgeClasses(item.level)}>
                        {item.level} Level
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-4 text-muted-foreground"
                  >
                    There are no learners engaging with your content
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
