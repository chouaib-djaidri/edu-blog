"use client";

import SubmitButton from "@/components/buttons/submit-button";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DateInput } from "@/components/ui/datefield-rac";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { dateToDateValue, dateValueToDate } from "@/lib/dates";
import { cn } from "@/lib/utils";
import {
  TASK_DEFAULT_FORM_VALUES,
  TaskFormSchema,
  TaskFormValues,
} from "@/schemas/creator/task.schema";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { CalendarIcon, PlusCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { DatePicker, Group } from "react-aria-components";
import { useForm } from "react-hook-form";

interface TaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTask: (task: TaskFormValues) => void;
}

const NewTaskForm = ({ open, onOpenChange, onAddTask }: TaskFormProps) => {
  const tf = useTranslations("Fields");
  const tb = useTranslations("Buttons");

  const [isPending, setIsPending] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<TaskFormValues>({
    resolver: valibotResolver(TaskFormSchema()),
    defaultValues: TASK_DEFAULT_FORM_VALUES,
    mode: "onSubmit",
  });

  const handleSubmit = async (data: TaskFormValues) => {
    if (isPending) return;
    setIsPending(true);
    try {
      onAddTask(data);
      form.reset(TASK_DEFAULT_FORM_VALUES);
      onOpenChange(false);
    } catch {
    } finally {
      setIsPending(false);
    }
  };

  const { dueDate: dueDateError } = form.formState.errors;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            <PlusCircle className="size-5" /> Add New Task
          </DialogTitle>
          <DialogDescription>
            Track and manage your upcoming tasks.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} noValidate>
            <div className="flex flex-col gap-3 w-full py-6 px-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <div className="group relative mt-3">
                      <FormLabel className="bg-background text-foreground absolute start-2 top-0 z-10 block -translate-y-[75%] px-1 font-medium group-has-disabled:opacity-50">
                        {tf("task.title.label")}
                        <span className="text-destructive ms-0.5">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={tf("task.title.placeholder")}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <div className="group relative mt-3">
                      <FormLabel className="bg-background text-foreground absolute start-2 top-0 z-10 block -translate-y-[75%] px-1 font-medium group-has-disabled:opacity-50">
                        {tf("task.priority.label")}
                        <span className="text-destructive ms-0.5">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={tf("task.priority.placeholder")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">
                            {tf("task.priority.options.low")}
                          </SelectItem>
                          <SelectItem value="medium">
                            {tf("task.priority.options.medium")}
                          </SelectItem>
                          <SelectItem value="high">
                            {tf("task.priority.options.high")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <div className="group relative mt-3">
                      <FormLabel className="bg-background text-foreground absolute start-2 top-0 z-10 block -translate-y-[75%] px-1 font-medium group-has-disabled:opacity-50">
                        {tf("task.description.label")}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder={tf("task.description.placeholder")}
                          className="min-h-24 resize-none"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <div className="group relative mt-3">
                      <FormLabel className="bg-background text-foreground absolute start-2 top-0 z-10 block -translate-y-[75%] px-1 font-medium group-has-disabled:opacity-50">
                        {tf("task.dueDate.label")}
                        <span className="text-destructive ms-0.5">*</span>
                      </FormLabel>
                      <DatePicker
                        className="*:not-first:mt-2"
                        value={dateToDateValue(field.value)}
                        onChange={(date) =>
                          field.onChange(dateValueToDate(date))
                        }
                      >
                        <div className="flex">
                          <Group className="w-full">
                            <DateInput
                              className={cn(
                                "pe-9",
                                dueDateError &&
                                  "[&>span]:text-destructive [&>span]:focus:text-destructive/70 data-focus-within:border-destructive  border-destructive data-focus-within:ring-destructive"
                              )}
                            />
                          </Group>
                          <Popover
                            open={isOpen}
                            onOpenChange={setIsOpen}
                            modal={true}
                          >
                            <PopoverTrigger asChild>
                              <button className="text-muted-foreground/80 hover:text-foreground data-focus-visible:border-ring data-focus-visible:ring-ring/50 z-10 -ms-9 -me-px flex w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none data-focus-visible:ring-1">
                                <CalendarIcon className="size-4" />
                              </button>
                            </PopoverTrigger>

                            {isOpen && (
                              <PopoverContent
                                className="w-auto p-2"
                                align="end"
                                onCloseAutoFocus={(e) => e.preventDefault()}
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={(e) => {
                                    field.onChange(e);
                                    setIsOpen(false);
                                  }}
                                  disabled={[{ before: new Date() }]}
                                />
                              </PopoverContent>
                            )}
                          </Popover>
                        </div>
                      </DatePicker>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => {
                  onOpenChange(false);
                }}
                className="flex-1 text-muted-foreground hover:text-foreground"
              >
                Close
              </Button>
              <SubmitButton className="flex-1" isPending={isPending}>
                {tb("addTask")}
              </SubmitButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewTaskForm;
