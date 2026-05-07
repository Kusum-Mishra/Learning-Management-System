import RichTextEditor from '@/components/RichTextEditor';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEditCourseMutation, useGetCourseByIdQuery, usePublishCourseMutation } from '@/features/api/courseApi';
import { toast } from 'sonner';

const CourseTab = () => {

    const [input, setInput] = useState({
        courseTitle: "",
        subTitle: "",
        description: "",
        category: "",
        courseLevel: "",
        coursePrice: "",
        courseThumbnail: ""
    });
    const params = useParams();
    const courseId = params.courseId;

    //fetching the existing details of the course before editing and providing new details
    const { data: courseByIdData, isLoading: courseByIdLoading, refetch } = useGetCourseByIdQuery(courseId, { refetchOnMountOrArgChange: true });

    const [publishCourse, {}] = usePublishCourseMutation();

    {/*useEffect(() => {
        if(courseByIdData?.course){
            const course = courseByIdData?.course;
            setInput({
                courseTitle: course.courseTitle,
                subTitle: course.subTitle,
                description: course.description,
                category: course.category,
                courseLevel: course.courseLevel,
                coursePrice: course.coursePrice,
                courseThumbnail: "" 
            });
        }
    },[courseByIdData?.course])*/}

    useEffect(() => {
        // Only set input if data exists and we haven't manually started editing 
        // a thumbnail (to avoid overwriting local preview state)
        if (courseByIdData?.course) {
            const course = courseByIdData.course;
            setInput({
                courseTitle: course.courseTitle || "",
                subTitle: course.subTitle || "",
                description: course.description || "",
                category: course.category || "",
                courseLevel: course.courseLevel || "",
                coursePrice: course.coursePrice || "",
                courseThumbnail: course.courseThumbnail || ""
            });
        }
    }, [courseByIdData, courseId]);

    const [previewThumbnail, setPreviewThumbnail] = useState("");
    const navigate = useNavigate();


    const [editCourse, { data, isLoading, isSuccess, error }] = useEditCourseMutation();

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    };

    const selectCategory = (value) => {
        setInput({ ...input, category: value });
    };
    const selectCourseLevel = (value) => {
        setInput({ ...input, courseLevel: value });
    };

    //get file
    const selectThumbnail = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({ ...input, courseThumbnail: file });
            const fileReader = new FileReader();
            fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
            fileReader.readAsDataURL(file);
        }
    };

    const updateCourseHandler = async () => {
        const formData = new FormData();
        formData.append("courseTitle", input.courseTitle);
        formData.append("subTitle", input.subTitle);
        formData.append("description", input.description);
        formData.append("category", input.category);
        formData.append("courseLevel", input.courseLevel);
        formData.append("coursePrice", input.coursePrice);
        formData.append("courseThumbnail", input.courseThumbnail);

        await editCourse({ formData, courseId });
    }

    const publishStatusHandler = async(action) => {
        try{
            const response = await publishCourse({courseId, query:action});
            if(response.data){
                refetch();
                toast.success(response.data.message);
            }
        }catch(error){
            toast.error("Failed to publish/unpublish course.")
        }
    }

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || "Course details updated.");
        }
        if (error) {
            toast.error(error.data?.message || "Failed to update course details.")
        }
    }, [isSuccess, error]);

    if (courseByIdLoading) return <Loader2 className='h-4 w-4 animate-spin' />


    return (
        <Card>
            <CardHeader className='flex flex-row justify-between'>
                <div>
                    <CardTitle>Basic information for course</CardTitle>
                    <CardDescription>
                        Make changes to your course here. Click save when done.
                    </CardDescription>
                </div>
                <div className='space-x-2'>
                    <Button disabled={courseByIdData?.course.lectures.length === 0} onClick={()=> publishStatusHandler(courseByIdData?.course.isPublished ? "false" : "true")} variant="outline">
                        {
                            courseByIdData?.course.isPublished ? "Unpublish" : "Publish"
                        }
                    </Button>
                    <Button>Remove Course</Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className='space-y-4 mt-5'>
                    <div>
                        <Label>Title</Label>
                        <Input
                            type="text"
                            name="courseTitle"
                            value={input.courseTitle}
                            onChange={changeEventHandler}
                            placeholder="Course title here"
                        />
                    </div>
                    <div>
                        <Label>Subtitle</Label>
                        <Input
                            type="text"
                            name="subTitle"
                            value={input.subTitle}
                            onChange={changeEventHandler}
                            placeholder="e.g., Master JavaScript from basics to advanced with hands-on projects"
                        />
                    </div>
                    <div>
                        <Label>Description</Label>
                        <RichTextEditor input={input} setInput={setInput} />
                    </div>
                    <div className='flex items-center gap-5'>
                        {/* COURSE CATEGORY */}
                        <div>
                            <Label>Category</Label>
                            <Select value={input.category} onValueChange={selectCategory}>
                                <SelectTrigger className="w-full max-w-48">
                                    <SelectValue placeholder="Select a course category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Category</SelectLabel>
                                        <SelectItem value="Next JS">Next JS</SelectItem>
                                        <SelectItem value="Data Science">Data Science</SelectItem>
                                        <SelectItem value="Artificial Intelligence">Artificial Intelligence</SelectItem>
                                        <SelectItem value="Frontend Development">Frontend Development</SelectItem>
                                        <SelectItem value="Fullstack Development">Fullstack Development</SelectItem>
                                        <SelectItem value="MERN Stack Development">MERN Stack Development</SelectItem>
                                        <SelectItem value="Javascript">Javascript</SelectItem>
                                        <SelectItem value="Python">Python</SelectItem>
                                        <SelectItem value="MongoDB">MongoDB</SelectItem>
                                        <SelectItem value="HTML">HTML</SelectItem>
                                        <SelectItem value="Docker">Docker</SelectItem>
                                        <SelectItem value="React Redux">React Redux</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        {/* COURSE LEVEL */}
                        <div>
                            <Label>Course Level</Label>
                            <Select value={input.courseLevel} onValueChange={selectCourseLevel}>
                                <SelectTrigger className="w-full max-w-48">
                                    <SelectValue placeholder="Select course difficulty" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Course Level</SelectLabel>
                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                                        <SelectItem value="Advanced">Advanced</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        {/* PRICE */}
                        <div>
                            <Label>Price (in INR)</Label>
                            <Input
                                type="number"
                                name="coursePrice"
                                value={input.coursePrice}
                                onChange={changeEventHandler}
                                placeholder="e.g. ₹499"
                                className='w-fit'
                            />
                        </div>
                        {/* COURSE THUMBNAIL */}
                    </div>
                    <div>
                        <Label>Course thumbnail</Label>
                        <Input
                            type="file"
                            name="courseThumbnail"
                            accept="image/*"
                            className="w-fit"
                            onChange={selectThumbnail}
                        />
                        {
                            (previewThumbnail || input.courseThumbnail) && (
                                <img
                                    src={previewThumbnail || input.courseThumbnail}
                                    className='w-64 my-2'
                                    alt="Course Thumbnail"
                                />
                            )
                        }
                    </div>

                    {/* CANCEL/SAVE BUTTONS */}
                    <div>
                        <Button variant="outline" onClick={() => navigate("/admin/course")} className='mr-2'>Cancel</Button>
                        <Button disabled={isLoading} onClick={updateCourseHandler}>
                            {
                                isLoading ? (
                                    <>
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />Please wait
                                    </>
                                ) : ("Save")
                            }
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default CourseTab