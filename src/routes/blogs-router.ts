import {Request, Response, Router} from "express";
import {blogsRepository} from "../repositories/blogs-db-repository";
import {Params, RequestWithBody, RequestWithParams, RequestWithParamsAndBody} from "../types/common";
import {CreateAndUpdateBlogModel} from "../types/blog/input";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {blogValidation} from "../validators/blogs-validator";

export const blogsRouter = Router({})

blogsRouter.get('/', async (req: Request, res: Response) => {
    const blogs = await blogsRepository.getAllBlogs()
    res.send(blogs)
})

blogsRouter.post('/', authMiddleware, blogValidation(), async (req: RequestWithBody<CreateAndUpdateBlogModel>, res: Response) => {
    let {name, description, websiteUrl} = req.body

    const newBlog = await blogsRepository.createBlog({name, description, websiteUrl})

    res.status(201).send(newBlog)
})

blogsRouter.get('/:id', async (req: RequestWithParams<Params>, res: Response) => {
    const id = req.params.id

    const blog = await blogsRepository.getBlogById(id)

    if (!blog) {
        res.sendStatus(404)
        return
    } else {
        res.send(blog)
    }
})

blogsRouter.put('/:id', authMiddleware, blogValidation(), async (req: RequestWithParamsAndBody<Params, CreateAndUpdateBlogModel>, res: Response) => {
    const id = req.params.id
    let {name, description, websiteUrl} = req.body

    const blog = await blogsRepository.getBlogById(id)

    if (!blog) {
        res.sendStatus(404)
        return
    }

    let isUpdated = await blogsRepository.updateBlog(id, { name, description, websiteUrl })

    if (isUpdated) {
        res.sendStatus(204)
    }

})

blogsRouter.delete('/:id', authMiddleware, async (req: RequestWithParams<Params>, res: Response) => {
    const id = req.params.id

    const isDeleted = await blogsRepository.deleteBlog(id)

    if (isDeleted) {
        res.sendStatus(204)
        return
    } else {
        res.sendStatus(404)
    }
})