import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AuthContext from '@/contexts/AuthContext';
import { BaseURL } from '@/pages/baseURL';
import { Active, DataRef, Over, useDndContext, type UniqueIdentifier } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cva } from 'class-variance-authority';
import {
  Calendar,
  Check,
  GripVertical,
  ListIcon,
  MoreHorizontal,
  Pencil,
  Tags,
  Trash,
  User as UserIcon,
} from 'lucide-react';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CardDetail } from '../cardDetail';
import { useCard } from '../hooks/useCard';
import { useList } from '../hooks/useList';
import { useMembers } from '../hooks/useMembers';
import { Card as CardType, List, Members, User } from '../types';
import CreateTaskModal from './CreateTaskModal';

interface Props {
  listId: number;
  columns: List[];
  boardId: number;
  isOverlay?: boolean;
}

export type ColumnType = 'Column';

export interface ColumnDragData {
  type: ColumnType;
  list: List | undefined;
}

export const BoardList = ({ listId, columns, boardId, isOverlay }: Props) => {
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();
  let authTokens = useContext(AuthContext)?.authTokens;
  const deleteList = useMutation({
    mutationFn: () => {
      return fetch(BaseURL + `tascrum/list/${listId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ` + authTokens.access,
        },
      });
    },
    onError: (error, variables, context) => {},
    onSuccess: (data, variables, context) => {},
    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['board', boardId] });
    },
  });

  const { data } = useList(listId);
  const tasksIds = useMemo(() => {
    return data?.card?.map((card) => card.id) || [1, 2, 3, 4, 5, 6, 7];
  }, [data]);

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: listId,
    data: {
      type: 'Column',
      list: data !== undefined ? data : columns.at(listId),
    } satisfies ColumnDragData,
    attributes: {
      roleDescription: `Column`,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva(
    'board-draggable relative flex max-h-full w-72 shrink-0 snap-center flex-col', //h-[500px] max-h-[500px] w-[350px] max-w-full
    {
      variants: {
        dragging: {
          default: 'border-2 border-transparent',
          over: 'opacity-30 ring-2',
          overlay: 'ring-2 ring-primary',
        },
      },
    }
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? 'overlay' : isDragging ? 'over' : undefined,
      })}
    >
      <div className="board-draggable-handler flex items-center justify-between px-0.5 pb-3">
        <div className="flex items-center space-x-2">
          <div className="bg-info/10 text-info flex h-8 w-8 items-center justify-center rounded-lg">
            <ListIcon className="text-base" />
          </div>
          <h3 className=" text-base">{data?.title}</h3>
          <Button
            variant={'ghost'}
            {...attributes}
            {...listeners}
            className=" relative -ml-2 h-auto cursor-grab p-1 text-primary/50"
          >
            <span className="sr-only">{`Move `}</span>
            <GripVertical />
          </Button>
        </div>
        <div className="inline-flex">
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => deleteList.mutate()} className="text-red-600">
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                  <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="is-scrollbar-hidden relative space-y-2.5 overflow-y-auto p-0.5">
        <SortableContext items={tasksIds}>
          {data?.card?.map((card) => <ListCard key={card.id} columns={columns} cardId={card.id} listId={listId} />)}
        </SortableContext>
      </div>
      <div className="flex justify-center  py-2">{data !== undefined && <CreateTaskModal listId={data.id} />}</div>
    </div>
  );
};

type CardProps = {
  cardId: number;
  listId: number;
  columns: List[];
  isOverlay?: boolean;
};

export interface TaskDragData {
  type: TaskType;
  card: CardType | undefined;
}
export type TaskType = 'Task';

export const ListCard = ({ cardId, columns, listId, isOverlay }: CardProps) => {
  const { data, isLoading, refetch: cardRefetch } = useCard(cardId);

  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const queryClient = useQueryClient();
  let authTokens = useContext(AuthContext)?.authTokens;
  const { boardId } = useParams();
  const parsedBoardId = parseInt(boardId ? boardId : '');
  const deleteTask = useMutation({
    mutationFn: () => {
      return fetch(BaseURL + `tascrum/card/${cardId}/?board=${parsedBoardId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ` + authTokens.access,
        },
      });
    },
    onError: (error, variables, context) => {},
    onSuccess: (data, variables, context) => {},
    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['list', listId] });
    },
  });

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: cardId,
    data: {
      type: 'Task',
      card: data ? data : columns?.at(listId)?.card?.at(cardId),
    } satisfies TaskDragData,
    attributes: {
      roleDescription: 'Task',
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva('w-full', {
    variants: {
      dragging: {
        over: 'opacity-30 ring-2',
        overlay: 'ring-2 ring-primary',
      },
    },
  });
  // if (data !== undefined || isLoading) {
  //   <Card

  //   >
  //     <CardHeader>
  //       <CardTitle className="flex items-center justify-between">
  //         <p className="  bg-inherit/20 text-lg">{data?.title}</p>
  //       </CardTitle>
  //     </CardHeader>
  //   </Card>;
  // }
  if (data?.filtered) {
    return <div></div>;
  }
  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        className={variants({
          dragging: isOverlay ? 'overlay' : isDragging ? 'over' : undefined,
        })}
      >
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <p className=" text-lg">
              {/* {data?.title}:  */}
              id - {data?.id} - order:{data?.order}
            </p>
            <Button
              variant={'ghost'}
              {...attributes}
              {...listeners}
              className=" relative -ml-2 h-auto cursor-grab p-1 text-primary/50"
            >
              <span className="sr-only">{`Move `}</span>
              <GripVertical />
            </Button>

            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => {
                      setOpen(false);
                      setModalOpen(true);
                    }}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>

                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <UserIcon className="mr-2 h-4 w-4" />
                      Assign to...
                    </DropdownMenuSubTrigger>
                    <AssignmentSubmenu
                      columns={columns}
                      listId={listId}
                      cardId={cardId}
                      setOpen={setOpen}
                      open={open}
                      cardData={data}
                      cardRefetch={cardRefetch}
                    />
                  </DropdownMenuSub>
                  <DropdownMenuItem>
                    <Calendar className="mr-2 h-4 w-4" />
                    Set due date...
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <Tags className="mr-2 h-4 w-4" />
                      Move to
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="p-0">
                      <Command>
                        <CommandList>
                          <CommandGroup>
                            {columns.map((col) => (
                              <CommandItem
                                key={col.id}
                                onSelect={(value) => {
                                  setOpen(false);
                                }}
                              >
                                {col.title}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => deleteTask.mutate()} className="text-red-600">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                    <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">lllhlhhlkhkklj</div>
            <div className="flex flex-col space-y-1.5">
              <div className="flex flex-wrap space-x-1">
                <Badge className=" space-x-1 px-1.5 py-1 ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span> Sep 12</span>
                </Badge>
                <Badge className="px-1.5 py-1">Update</Badge>
                <Badge className=" space-x-1 px-1.5 py-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>4/5</span>
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-end justify-between pt-1">
          <div className="flex flex-wrap -space-x-1.5">
            {data?.members?.length != 0 &&
              data?.members?.map((member, index) => (
                <Avatar key={member.id} className="h-6 w-6 hover:z-10 hover:bg-primary">
                  <AvatarFallback className="text-xs hover:bg-primary hover:text-primary-foreground">
                    {member.user.first_name[0]}
                    {member.user.last_name[0]}
                  </AvatarFallback>
                </Avatar>
              ))}
          </div>
          <div className="dark:text-navy-300 flex items-center space-x-2 text-xs text-slate-400">
            <div className="flex items-center space-x-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              <span>3</span>
            </div>
            <div className="flex items-center space-x-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              <span>1</span>
            </div>
          </div>
        </CardFooter>
      </Card>
      {data !== undefined && <CardDetail setModalOpen={setModalOpen} modalOpen={modalOpen} data={data} />}
    </>
  );
};
type openState = {
  open: boolean;
  setOpen: any;
  cardData: CardType | undefined;
  cardRefetch: any;
};
type AssignmentSubmenuProps = Omit<CardProps, 'isOverlay'> & openState;
export const AssignmentSubmenu = ({ cardId, setOpen, cardData, cardRefetch }: AssignmentSubmenuProps) => {
  const { boardId } = useParams();
  const { data: membersData } = useMembers(parseInt(boardId ? boardId : ''));
  let authTokens = useContext(AuthContext)?.authTokens;
  const createAssignee = useMutation({
    mutationFn: (formData: any) => {
      return fetch(BaseURL + 'tascrum/assign/', {
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
      cardRefetch();
    },
  });
  const deleteAssignee = useMutation({
    mutationFn: (formData: any) => {
      const roleId = formData.role;
      delete formData.role;

      return fetch(BaseURL + `tascrum/assign/${roleId}`, {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ` + authTokens.access,
        },
        body: JSON.stringify(formData),
      });
    },
    onMutate: () => {},
    onError: (error, variables, context) => {},
    onSuccess: (data, variables, context) => {},
    onSettled: (data, error, variables, context) => {
      cardRefetch();
    },
  });
  // const mergeObject = useMemo(() => {
  //   const mergedLabelsData = _.map(labelData?.labels, (label, index) => {
  //     const assignedLabel = _.find(assigndata?.labels, { id: label?.id });
  //     const assignedLabelIndex = _.findIndex(assigndata?.labels, { id: label?.id });
  //     return assignedLabel
  //       ? { ...label, labelcard: assigndata?.labelcard?.[assignedLabelIndex]?.id, checked: true }
  //       : { ...label, labelcard: assigndata?.labelcard?.[assignedLabelIndex]?.id, checked: false };
  //   });
  return (
    <DropdownMenuSubContent className="p-0">
      <Command>
        <CommandInput placeholder="Search for user" autoFocus={true} />
        <CommandList>
          <CommandEmpty>No label found.</CommandEmpty>
          <CommandGroup>
            {membersData?.members?.map((member, index) => (
              <CommandItem
                key={member.id}
                className="flex items-center px-2"
                onSelect={() => {
                  if (cardData) {
                    if (cardData?.members !== undefined) {
                      if (cardData?.members?.filter((item) => item.id === member.id).length > 0) {
                        deleteAssignee.mutate({ member: member.id, card: cardId, role: cardData.role?.at(index)?.id });
                      } else {
                        createAssignee.mutate({ member: member.id, card: cardId });
                      }
                    }
                  }
                  setOpen(false);
                }}
              >
                <Avatar>
                  <AvatarFallback>
                    {member.user.first_name[0]}
                    {member.user.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-2 mr-3">
                  <p className="text-sm font-medium leading-none">
                    {member.user.first_name} {member.user.last_name}
                  </p>
                  <p className="text-sm text-muted-foreground">{member.user.email}</p>
                </div>
                {cardData?.members?.filter((item) => item.id === member.id)?.length != 0 ? (
                  <Check className="ml-auto flex h-5 w-5 text-primary" />
                ) : null}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </DropdownMenuSubContent>
  );
};
