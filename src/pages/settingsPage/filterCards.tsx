import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarDays, CircleUserRound, Clock4, ListFilter, Tag } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { BaseURL } from '../baseURL';
import AuthContext from '@/contexts/AuthContext';
import { cw } from '@fullcalendar/core/internal-common';



export function FilterCards({ labels, setLabels, myCards, setMyCards, selectedLabels, setSelectedLabels }: any) {

  let authTokens = useContext(AuthContext)?.authTokens;

  return (
    <Popover>
      <PopoverTrigger asChild>
        {/* <Button variant="outline">Open popover</Button> */}
        <Button data-testid="list filter" variant="secondary" className="h-8 w-8 p-0">
          <ListFilter className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96">
        <div className="grid gap-6 overflow-y-auto">
          <div className="space-y-6">
            <h4 className="text-center text-sm font-bold leading-none text-muted-foreground">Filter</h4>
          </div>
          <div className="grid gap-4 p-3">

            <div className="grid grid-cols-3 items-center gap-5">
              <Label className="col-span-3 text-xs font-semibold text-muted-foreground">Members</Label>
              <div className="col-span-3 ml-2 flex space-x-4 ">
                <Checkbox id="terms" onClick={() => setMyCards(!myCards)} />
                <label
                  htmlFor="terms"
                  className="text-sm  text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Cards assigned to me
                </label>
              </div>
            </div>
            <div className="grid grid-cols-3 items-center gap-5">
              <Label className="col-span-3 text-xs font-semibold text-muted-foreground">Labels</Label>
              <div className="col-span-3 ml-2 flex space-x-4">
                <Checkbox id="terms" />
                <div className="flex gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <label
                    htmlFor="terms"
                    className="text-sm  text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    No labels
                  </label>
                </div>
              </div>
              {labels.map((item: any) => (
                <div key={item.id} className="col-span-3 ml-2 flex space-x-4">
                  {/* onCheckedChange={() => handleCheckChange(item.id)} */}
                  <Checkbox
                    //checked={selectedLabels?.some((label: any) => label.id === item?.id)}
                    onClick={async () => {
                      const isItemInArray = selectedLabels.some((label: any) => label.id === item.id)
                      if (isItemInArray) {
                        const updatedLabels = selectedLabels.filter((label: any) => label.id !== item.id)
                        setSelectedLabels(updatedLabels)
                      }
                      else {
                        const selectedItem = labels.find((label: any) => label.id === item.id)
                        setSelectedLabels([...selectedLabels, selectedItem])
                      }
                    }}
                  />

                  <div
                    className={`-mt-2 h-8 w-full rounded px-2 py-2 text-sm font-semibold`}
                    style={{ backgroundColor: item.color }}
                  >
                    {item.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
