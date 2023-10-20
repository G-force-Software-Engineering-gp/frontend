import { Button } from '@/components/ui/button';
import { List, MoreVertical, Plus } from 'lucide-react';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useBoard } from '../hooks/useBoard';
import { BoardList } from './BoardList';
import CreateListModal from './CreateListModal';

export const KanbanBoard = () => {
  // const {boardId} = useParams()
  const { data, isLoading, error } = useBoard(2);
  return (
    <>
      <h2>{data?.title}</h2>

      <div className="duration-[.25s] flex w-full items-start space-x-4 overflow-x-auto overflow-y-hidden px-[var(--margin-x)] transition-all">
        {data?.list.map((list) => (
          <>
            <BoardList listId={list.id} columns={data.list} boardId={data.id} />
          </>
        ))}
        <div className=" relative flex max-h-full w-72 shrink-0 flex-col justify-center py-2">
          {/* <Button variant={'outline'} className="flex w-full items-center justify-center space-x-2">
            <Plus className="h-6 w-6" />
            <span>New Column</span>
          </Button> */}
          {data !== undefined && <CreateListModal boardId={data.id} />}
        </div>
      </div>
    </>
  );
};