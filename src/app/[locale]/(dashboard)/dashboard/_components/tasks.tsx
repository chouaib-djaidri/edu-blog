"use client";

import NewTaskForm from "@/components/forms/creator/new-task-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { getSimpleDueDate } from "@/lib/dates";
import { cn, getPriorityBadgeClasses } from "@/lib/utils";
import { TaskFormValues } from "@/schemas/creator/task.schema";
import { PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";

const Tasks = () => {
  const [open, setOpen] = useState(false);
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Create the first blog",
      description:
        "Write and publish an introductory blog post to engage users.",
      priority: "medium",
      dueDate: new Date(),
      completed: false,
    },
    {
      id: 2,
      title: "Create the first challenge",
      description:
        "Design and set up an initial coding challenge for the platform.",
      priority: "low",
      dueDate: new Date(Date.now() + 86400000),
      completed: false,
    },
  ]);

  const handleAddTask = (data: TaskFormValues) => {
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        ...data,
        completed: false,
      },
    ]);
    setOpen(false);
  };

  const handleToggleComplete = (taskId: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  return (
    <>
      <Card className="w-full">
        <div className="flex items-center justify-between px-6 gap-6 shrink-0">
          <CardHeader className="flex-1 px-0">
            <CardTitle className="text-lg">Tasks Management</CardTitle>
            <CardDescription>
              Stay on top of your to-dos and deadlines with your smart personal
              task manager.
            </CardDescription>
          </CardHeader>
          <Button
            className="shrink-0"
            variant="outline"
            onClick={() => setOpen(true)}
          >
            <PlusCircle className="size-4.5" />
            Add Task
          </Button>
        </div>
        <CardContent
          className={cn(
            "space-y-4",
            tasks.length === 0 && "flex-1 flex items-center justify-center"
          )}
        >
          {tasks.length === 0 ? (
            <div className="text-center text-muted-foreground flex flex-col items-center gap-2 pb-2">
              {"No tasks yet. Click 'Add Task' to create new one."}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="group border relative items-start flex w-full gap-2 rounded-xl p-4"
                >
                  <div className="shrink-0 pt-0.5">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => handleToggleComplete(task.id)}
                    />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="space-y-0.5">
                      <p
                        className={cn(
                          "capitalize font-medium pe-8",
                          task.completed && "line-through text-muted-foreground"
                        )}
                      >
                        {task.title}
                      </p>
                      <p
                        className={`text-muted-foreground font-normal ${task.completed ? "line-through" : ""}`}
                      >
                        {task.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        className={`capitalize ${getPriorityBadgeClasses(task.priority)}`}
                      >
                        {task.priority}
                      </Badge>
                      <time className="font-medium text-muted-foreground text-xs pt-px">
                        {getSimpleDueDate(task.dueDate)}
                      </time>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-50 hover:opacity-100 absolute top-1.5 right-0 transition-opacity hover:bg-transparent size-10"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    <Trash2 className="size-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      {open && (
        <NewTaskForm
          open={open}
          onOpenChange={setOpen}
          onAddTask={handleAddTask}
        />
      )}
    </>
  );
};

export default Tasks;
