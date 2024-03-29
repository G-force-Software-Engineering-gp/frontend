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
  board: z.number().optional(),
});

type ListFormData = z.infer<typeof schema>;

interface ListModalProps {
  boardId: number;
}

function CreateListModal({ boardId }: ListModalProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { handleSubmit, control, formState, reset, setError } = useForm<ListFormData>({
    resolver: zodResolver(schema),
  });
  let authTokens = useContext(AuthContext)?.authTokens;
  const createTask = useMutation({
    mutationFn: (formData: ListFormData) => {
      return fetch(BaseURL + 'tascrum/crlist/', {
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
      queryClient.invalidateQueries({ queryKey: ['board', boardId], exact: true });
    },
  });
  const onSubmit = (data: ListFormData) => {
    createTask.mutate({ ...data, board: boardId });
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
            <span>New Column</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Add Column</DialogTitle>
              <DialogDescription>Enter your Column title here.</DialogDescription>
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
              <Button type="submit" disabled={formState.isSubmitting || createTask.isLoading}>
                {formState.isSubmitting || createTask.isLoading ? 'Adding Task...' : 'Add Task'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CreateListModal;
