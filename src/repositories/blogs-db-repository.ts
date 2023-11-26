import {blogsCollection} from "../db/db";
import {ObjectId} from "mongodb";
import {OutputBlogsType} from "../types/blog/output";
import {blogMapper} from "../types/blog/mapper";
import {CreateAndUpdateBlogModel} from "../types/blog/input";

export const blogsRepository = {
    async getAllBlogs(): Promise<OutputBlogsType[]> {
        const blogs = await blogsCollection
            .find({}).toArray()
        return blogs.map(blogMapper)
    },
    async createBlog(createData: CreateAndUpdateBlogModel): Promise<OutputBlogsType> {
        const newBlog = {
            _id: new ObjectId(),
            name: createData.name,
            description: createData.description,
            websiteUrl: createData.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        const resultCreateBlog = await blogsCollection
            .insertOne(newBlog)
        return blogMapper(newBlog)
    },
    async getBlogById(id: string): Promise<OutputBlogsType | null> {
        const blog = await blogsCollection
            .findOne({_id: new ObjectId(id)})
        if (!blog) {
            return null
        } else {
            return blogMapper(blog)
        }
    },
    async updateBlog(id: string, updateData: CreateAndUpdateBlogModel): Promise<boolean> {
        const resultUpdateBlog = await blogsCollection
            .updateOne({_id: new ObjectId(id)}, {
            $set: {
                name: updateData.name,
                description: updateData.description,
                websiteUrl: updateData.websiteUrl
            }
        })
        return  resultUpdateBlog.matchedCount === 1
    },
    async deleteBlog(id: string): Promise<boolean> {
        const resultDeleteBlog = await blogsCollection
            .deleteOne({_id: new ObjectId(id)})
        return resultDeleteBlog.deletedCount === 1
    }
}