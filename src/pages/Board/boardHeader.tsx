import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NavigationMenuLink } from '@/components/ui/navigation-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Toggle } from '@/components/ui/toggle';
import AuthContext from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import _, { create } from 'lodash';
import {
  Bot,
  CalendarDays,
  ChevronDown,
  Copy,
  Eye,
  GanttChartSquare,
  LineChart,
  ListFilter,
  Menu,
  MoreHorizontal,
  Pen,
  Star,
  Trello,
  UserPlus2,
} from 'lucide-react';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { BaseURL } from '../baseURL';
import { BoardSidebar } from './boardSidebar';
import AddImage from './components/AddImage';
import { FilterCard } from './components/filterCards';
import { useBoard } from './hooks/useBoard';
import { useBoardLabels } from './hooks/useLabel';
import { useMembers } from './hooks/useMembers';



const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = 'ListItem';

// interface User {
//   id: number;
//   username: string;
//   first_name: string;
//   last_name: string;
//   email: string;
//   member: Member[];
// }

// interface Member {
//   profimage: string;
// }

const BoardHeader = ({ appearBot, setAppearBot }: any) => {
  const navigate = useNavigate();
  const { boardId } = useParams();
  const { data: membersData } = useMembers(parseInt(boardId ? boardId : ''));
  const { data: boardData } = useBoard(parseInt(boardId ? boardId : ''));
  const { isLoading: boardLabelLoading, data: boardLabelData } = useBoardLabels();
  const { pathname } = useLocation()
  const BurndownRoute = pathname.includes(`/burndown`)
  const [linkInput, setLinkInput] = useState(boardData?.invitation_link);
  useEffect(() => {
    setLinkInput(boardData?.invitation_link);
  }, [boardData?.invitation_link]);

  function copyToClipboard() {
    navigator.clipboard.writeText(linkInput ? 'tascrum.ir/board/join/' + linkInput : 'link is not provided');
  }
  let authTokens = useContext(AuthContext)?.authTokens;
  function changeLink() {
    console.log('changig the link');
    fetch(BaseURL + `tascrum/board/${boardId}/reset/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ` + authTokens.access,
      },
      body: JSON.stringify({
        title: '',
        backgroundimage: null,
        workspace: null,
        has_star: false,
        invitation_link: '',
      }),
    })
      .then((response) => response.json()) // Assuming the response is JSON; adjust if needed
      .then((data) => {
        console.log('Fetch result:', data);
        setLinkInput(data?.new_invitation_link);
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        // Handle errors if any
      });
    console.log('links:', linkInput);
  }
  return (
    <div className="backdrop-blur" data-testid="boardHeader">
      <>
        <div className="mt-4 flex flex-1 flex-col border-b-2 p-2 px-5 md:mt-0 md:flex-row md:items-center md:justify-between">
          <div className="pb-2 md:pb-0">
            <div className="text-2xl font-bold">
              <>
                <Sheet key="left">
                  <SheetTrigger>
                    <Button variant="secondary" className="m-1 h-8 w-8 p-0">
                      <Menu className="h-4 w-4 " />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>
                        <div className="mb-2 flex items-center">
                          <Avatar className="h-12 w-12 rounded-sm ">
                            <AvatarFallback className="rounded-sm">{boardData?.title[0]}</AvatarFallback>
                          </Avatar>
                          <div className="h-13 ml-2 flex flex-col justify-between">
                            <p className="text-xl font-bold">{boardData?.title}</p>
                            <p className="text-lg text-muted-foreground">Free</p>
                          </div>
                        </div>
                      </SheetTitle>
                      <BoardSidebar />
                    </SheetHeader>
                  </SheetContent>
                </Sheet>
                <span className="m-2">{boardData?.title}</span>
                <Button data-testid="eye" variant="secondary" className="m-1 h-8 w-8 p-0">
                  <Eye className="h-4 w-4 " />
                </Button>
                <Button data-testid="star" variant="secondary" className="m-1 h-8 w-8 p-0">
                  <Star className="h-4 w-4 " />
                </Button>
                <Popover>
                  <PopoverTrigger>
                    <Button data-testid="trello" variant="secondary" className="ml-1 h-8 w-fit px-2">
                      <Trello className="mr-2 h-4 w-4" />
                      <span className="mr-1 ">Board Link</span>
                      <ChevronDown className="h-4 w-4 " />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-100">
                    <div className="grid gap-4">
                      <div className="flex justify-center gap-2">
                        <input
                          type="text"
                          className="rounded-md border p-2 focus:outline-none"
                          value={linkInput}
                          readOnly
                        />
                        <Button onClick={() => copyToClipboard()} variant="secondary" className="mt-2 h-8 w-8 p-0">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => changeLink()} variant="secondary" className="mt-2 h-8 w-8 p-0">
                          <Pen className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <AddImage />
                <Button onClick={() => navigate(`/board/${boardId}/burndown`)} variant="secondary" className="h-8 w-8 p-0">
                  <LineChart className="h-4 w-4 " />
                </Button>
              </>
            </div>
          </div>
          <div className="flex items-center justify-end space-x-2">
            {!BurndownRoute && (
              <Toggle onClick={() => setAppearBot(!appearBot)} variant="outline" className='h-8 w-8 p-0 relative'>
                <span className="absolute top-1 right-1 transform translate-y-[-50%] translate-x-[50%] flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                </span>
                <Bot className=" h-4 w-4" />
              </Toggle>
            )}
            <Button onClick={() => navigate(`/board/${boardId}`)} variant="secondary" className="h-8 w-8 p-0">
              <Trello className="h-4 w-4" />
            </Button>
            <Button onClick={() => navigate(`/board/${boardId}/calendar`)} variant="secondary" className="h-8 w-8 p-0">
              <CalendarDays className="h-4 w-4" />
            </Button>
            <Button onClick={() => navigate(`/board/${boardId}/timeline`)} variant="secondary" className="h-8 w-8 p-0">
              <GanttChartSquare className="h-4 w-4" />
            </Button>
            {/* <Button data-testid="list filter" variant="secondary" className="h-8 w-8 p-0">
              <ListFilter className="h-4 w-4" />
            </Button> */}
            <FilterCard membersData={membersData} boardLabelData={boardLabelData} />
            <div className=" flex -space-x-2 overflow-hidden">
              {membersData?.members?.slice(0, 3).map((member, index) => (
                <Popover key={index}>
                  <PopoverTrigger>
                    <Avatar>
                      <AvatarImage src={member.profimage} />
                      <AvatarFallback>
                        {member.user.first_name[0]}
                        {member.user.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                  </PopoverTrigger>
                  <PopoverContent className="w-fit">
                    <div className="flex justify-between space-x-4">
                      <Avatar>
                        <AvatarImage src={member.profimage} />
                        <AvatarFallback>
                          {member.user.first_name[0]}
                          {member.user.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold">
                          {member.user.first_name} {member.user.last_name}
                        </h4>
                        <p className="text-sm">@{member.user.username}</p>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              ))}
              <Popover>
                {membersData?.members?.length !== undefined && membersData?.members?.length > 3 && (
                  <PopoverTrigger className="w-fit">
                    <Avatar>
                      <AvatarFallback>
                        +{membersData?.members?.length !== undefined ? membersData.members.length - 3 : 'N/A'}
                      </AvatarFallback>
                    </Avatar>
                  </PopoverTrigger>
                )}
                {membersData?.members?.length !== undefined && membersData?.members?.length > 3 && (
                  <PopoverContent className="w-fit">
                    <>
                      <p className="mb-2">Members</p>
                      <ScrollArea className="h-40 w-fit rounded-md">
                        {membersData?.members?.slice(3).map((member) => (
                          <div className="m-3">
                            <Separator className="my-2" />
                            <div className="flex  space-x-4">
                              <Avatar>
                                <AvatarImage src={member.profimage} />
                                <AvatarFallback>
                                  {member.user.first_name[0]}
                                  {member.user.last_name[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="space-y-1">
                                <h4 className="text-sm font-semibold">
                                  {member.user.first_name} {member.user.last_name}
                                </h4>
                                <p className="text-sm">@{member.user.username}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </ScrollArea>
                    </>
                  </PopoverContent>
                )}
              </Popover>
            </div>
            <Button className="h-8 w-20 p-0">
              <UserPlus2 className="mr-1 h-4 w-4" />
              <span>Share</span>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="secondary" className="m-1 h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4 " />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>WTF is this</SheetTitle>
                  <SheetDescription>saturday through sunday. monday, monday through sunday yo</SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </>
    </div>
  );
};

export default BoardHeader;
