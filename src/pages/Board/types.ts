import internal from 'stream';
import type { UniqueIdentifier } from '@dnd-kit/core';

export type Board = {
  id: Extract<UniqueIdentifier, number>;
  title: string;
  workspace: number;
  list: List[];
  backgroundImage: any;
};

export type List = {
  id: Extract<UniqueIdentifier, number>;
  title: string;
  board?: number;
  card?: Card[];
};

export type Card = {
  id: Extract<UniqueIdentifier, number>;
  title: string;
  list?: number;
  order?: number;
  members?: Assignee[];
  role?: Role[];
  labels?: LabelItem[];
  startdate?: null;
  duedate?: '2023-10-29T00:00:00Z';
  reminder?: '1 Day before';
  storypoint?: number;
  setestimate?: number;
  description?: string;
  comment?: string;
  filtered?: boolean;
};
export type Role = {
  id: number;
  role: string;
};

export type Assignee = Member;

export type Members = {
  id: number;
  members: Assignee[];
};

export type Member = {
  id: number;
  user: User;
  profimage?: string;
  checked?: boolean;
};

export type User = {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
};

export type CheckLists = {
  id: number;
  checklists?: CheckList[];
};

export type CheckList = {
  id: number;
  title: string;
  items?: CheckListOption[];
};

export type CheckListOption = {
  id: number;
  content: string;
  checked: boolean;
};

export type LabelItem = {
  id: number;
  title: string;
  color: string;
  checked?: boolean;
};
export type LabelItems = {
  id: number;
  labels?: LabelItem[];
};
interface Labelcard {
  id: number;
}

export type LabelAssign = {
  id: number;
  labels?: LabelItem[];
  labelcard?: Labelcard[];
};

export type MergedLabel = {
  id: number;
  title: string;
  color: string;
  labelcard?: number;
  checked: boolean;
};
export type MergedLabels = {
  id: number;
  labels?: MergedLabel[];
};
