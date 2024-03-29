import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthContext from '@/contexts/AuthContext';
import { BaseURL } from '@/pages/baseURL';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(1, {
    message: 'Title is required',
  }),
  list: z.number().optional(),
});

type TaskFormData = z.infer<typeof schema>;

interface TaskModalProps {
  listId: number;
}

function CreateTaskModal({ listId }: TaskModalProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { handleSubmit, control, formState, reset, setError } = useForm<TaskFormData>({
    resolver: zodResolver(schema),
  });
  let authTokens = useContext(AuthContext)?.authTokens;
  const createTask = useMutation({
    mutationFn: (formData: TaskFormData) => {
      return fetch(BaseURL + 'tascrum/crcard/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ` + authTokens.access,
        },
        body: JSON.stringify(formData),
      });
    },
    onError: (error, variables, context) => {},
    onSuccess: (data, variables, context) => {},
    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['list', listId], exact: true });
    },
  });
  const onSubmit = (data: TaskFormData) => {
    createTask.mutate({ ...data, list: listId });
    setOpen(false);
  };
  useEffect(() => {
    reset();
  }, [open]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant={'secondary'}
            className="flex w-full items-center justify-center space-x-2"
            onClick={() => setOpen(true)}
          >
            <Plus className="h-6 w-6" />
            <span>New Task</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>Enter your task title here.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="">
                  Title
                </Label>
                <div className="col-span-3">
                  <Controller name="title" control={control} render={({ field }) => <Input {...field} id="title" />} />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div></div>
                <div className="col-span-3">
                  {formState.errors.title && (
                    <p className="text-sm font-medium leading-none text-red-500 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {formState.errors.title.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={formState.isSubmitting}>
                {formState.isSubmitting || createTask.isLoading ? 'Adding Task...' : 'Add Task'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CreateTaskModal;
