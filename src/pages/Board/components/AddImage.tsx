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
import AuthContext from '@/contexts/AuthContext';
import { DialogClose } from '@radix-ui/react-dialog';
import axios from 'axios';
import { ImagePlus } from 'lucide-react';
import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const AddImage = () => {
  const { boardId } = useParams();
  // console.log(boardId);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(event)
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
    // console.log(file);
  };
  // console.log(selectedImage)
  let authTokens = useContext(AuthContext)?.authTokens;
  // console.log(authTokens);
  const handleUpload = async () => {
    if (selectedImage) {
      const formData = new FormData();
      formData.append('backgroundImage', selectedImage);

      // formData.append('id', boardId ? boardId : '');
      // console.log(formData);

      const data = await fetch(`https://amirmohammadkomijani.pythonanywhere.com/tascrum/board-bgimage/${boardId}/`, {
        method: 'PUT',
        headers: {
          Authorization: `JWT ${authTokens.access}`,
          // 'Content-Type': 'multipart/form-data',
        },
        body: formData,
      }).then((response) => response);
      // console.log(data);
      if (data.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Successful',
          text: 'Picture uploaded completely',
          timer: 3000,
        });
        // setInterval(() => {
        //   navigate(0);
        // }, 2000);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Something went wrong!',
          timer: 3000,
        });
        // setInterval(() => {
        //   navigate(0);
        // }, 2000);
      }
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary" className="m-1 ml-2 h-8 w-8 p-0">
            <ImagePlus className="h-4 w-4 " />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Image</DialogTitle>
            <DialogDescription>Here use can set a BackGround for your board</DialogDescription>
            <DialogDescription>You can select only .jpg and .png files</DialogDescription>
          </DialogHeader>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Input
              id="picture"
              type="file"
              className=" cursor-pointer placeholder:text-white"
              accept=".jpg, .jpeg, .png"
              onChange={handleFileChange}
            />
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary" onClick={handleUpload}>
                Change Picture
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddImage;
