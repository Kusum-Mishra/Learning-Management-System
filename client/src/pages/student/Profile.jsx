import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Course from './Course'
import { useLoadUserQuery, useUpdateUserMutation } from '@/features/api/authApi'
import { toast } from 'sonner'

const Profile = () => {
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");

  const { data, isLoading, refetch } = useLoadUserQuery();   //query
  const [updateUser, { data: updateUserData, isLoading: updateUserIsLoading, isError, error, isSuccess }] = useUpdateUserMutation();      //mutation

  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
  }


  const updateUserHandler = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("profilePhoto", profilePhoto);
    await updateUser(formData);
  };

  useEffect(() => {
    refetch();
  }, [])

  useEffect(() => {
    if(isSuccess){
      refetch();
      toast.success(data.message || "Profile updated");
    }
    if(isError){
      toast.error(error.message || "Failed to update profile.")
    }
  }, [error, updateUserData, isSuccess, isError])
  
  // Replace your current loading check with this:
if (isLoading) return <h1>Profile loading...</h1>;

const user = data?.user;

// If loading is finished but there is no user data (e.g., 401 error)
if (!user) {
  return <div className='my-24 text-center'>Please log in to view your profile.</div>;
}
  
  return (
    <div className='max-w-4xl mx-auto my-24 px-4 '>
      <h1 className='font-bold text-2xl text-center md:text-left'>PROFILE</h1>
      <div className='flex flex-col md:flex-row items-center md:items-start gap-8 my-5'>
        <div className='flex flex-col items-center'>
          <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4">
            <AvatarImage src={user?.photoUrl || "https://github.com/shadcn.png"} alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>

        <div>
          <div className='mb-2'>
            <h1 className='font-semibold text-gray-900 dark:text-gray-100 '>
              Name:
              <span className='font-normal text-gray-700 dark:text-gray-300 ml-2'>
                {user.name}
              </span>
            </h1>
          </div>
          <div className='mb-2'>
            <h1 className='font-semibold text-gray-900 dark:text-gray-100 '>
              Email:
              <span className='font-normal text-gray-700 dark:text-gray-300 ml-2'>
                {user.email}
              </span>
            </h1>
          </div>
          <div className='mb-2'>
            <h1 className='font-semibold text-gray-900 dark:text-gray-100 '>
              Role:
              <span className='font-normal text-gray-700 dark:text-gray-300 ml-2'>
                {user.role.toUpperCase()}
              </span>
            </h1>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="mt-2">Edit Profile</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when done.
                </DialogDescription>
              </DialogHeader>
              <div className='grid gap-4 py-4 '>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label>Name: </Label>
                  <Input
                    type="text"
                    placeholder="Your name here"
                    className="col-span-3"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label>Profile photo: </Label>
                  <Input
                    type="file"
                    onChange={onChangeHandler}
                    accept="image/*"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button disabled={updateUserIsLoading} onClick={updateUserHandler}>
                  {
                    updateUserIsLoading ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />Please wait
                      </>
                    ) : "Save Changes"
                  }
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div>
        <h1 className='font-medium text-lg underline'>Courses you're enrolled in:</h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5'>
          {
            user.enrolledCourses.length === 0 ? (<p className="col-span-full text-gray-500">You have not purchased any course yet. Begin your learning journey now.</p>) : (
              user.enrolledCourses.map((course, index) => <Course course={course} key={course._id} />)
            )

          }
        </div>
      </div>
    </div>
  )
}

export default Profile