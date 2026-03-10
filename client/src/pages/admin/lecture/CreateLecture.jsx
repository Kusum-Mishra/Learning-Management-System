import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

const CreateLecture = () => {
    const [lectureTitle, setLectureTitle] = useState("");
    const params = useParams();
    const courseId = params.courseId;
    const isLoading = false;
    const navigate = useNavigate();
    return (
        <div className='flex-1 mx-10'>
            <div className='mb-4'>
                <h1 className='font-bold text-xl'>Add lectures to your course in the form of videos, documents or other study materials.</h1>
            </div>

            <div>
                <div className='space-y-4'>
                    <Label>Title</Label>
                    <Input
                        type="text"
                        placeholder="Name for the course lecture"
                        value={lectureTitle}
                        onChange={(e) => setLectureTitle(e.target.value)}
                    />
                </div>
    
                <div className='flex items-center gap-2 mt-4'>
                    <Button variant="outline" onClick={() => navigate(`/admin/course/${courseId}`)}>Back to course details</Button>
                    <Button disabled={isLoading}>
                        {
                            isLoading ? (
                                <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                                </>
                            ) : "Add Lecture"
                        }
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default CreateLecture