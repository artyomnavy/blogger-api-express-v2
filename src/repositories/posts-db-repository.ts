import {postsCollection} from "../db/db";
import {OutputPostsType} from "../types/post/output";
import {postMapper} from "../types/post/mapper";
import {CreateAndUpdatePostModel} from "../types/post/input";
import {ObjectId} from "mongodb";
import {blogsRepository} from "./blogs-db-repository";

export const postsRepository = {
    async getAllPosts(): Promise<OutputPostsType[]> {
        const posts = await postsCollection
            .find({}).toArray()
        return posts.map(postMapper)
    },
    async createPost(createData: CreateAndUpdatePostModel): Promise<OutputPostsType> {
        const blog = await blogsRepository.getBlogById(createData.blogId)

        const newPost = {
            _id: new ObjectId(),
            title: createData.title,
            shortDescription: createData.shortDescription,
            content: createData.content,
            blogId: createData.blogId,
            blogName: blog!.name,
            createdAt: new Date().toISOString()
        }
        const resultCreatePost = await postsCollection
            .insertOne(newPost)
        return postMapper(newPost)
    },
    async getPostById(id: string): Promise<OutputPostsType | null> {
        const post = await postsCollection
            .findOne({_id: new ObjectId(id)})
        if (!post) {
            return null
        } else {
            return postMapper(post)
        }
    },
    async updatePost(id: string, updateData: CreateAndUpdatePostModel): Promise<boolean> {
        const resultUpdatePost = await postsCollection
            .updateOne({_id: new ObjectId(id)}, {
            $set: {
                title: updateData.title,
                shortDescription: updateData.shortDescription,
                content: updateData.content,
                blogId: updateData.blogId
            }
        })
        return resultUpdatePost.matchedCount === 1
    },
    async deletePost(id: string): Promise<boolean> {
        const resultDeletePost = await postsCollection
            .deleteOne({_id: new ObjectId(id)})
        return resultDeletePost.deletedCount === 1
    }
}