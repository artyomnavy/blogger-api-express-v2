import {Request, Response, Router} from "express";
import {
} from "../settings";
import {postsRepository} from "../repositories/posts-db-repository";
import {Params, RequestWithBody, RequestWithParams, RequestWithParamsAndBody} from "../types/common";
import {CreateAndUpdatePostModel} from "../types/post/input";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {postValidation} from "../validators/posts-validator";
export const postsRouter = Router({})



postsRouter.get('/', async (req: Request, res: Response) => {
    const posts = await postsRepository.getAllPosts()
    res.send(posts)
})

postsRouter.post('/', authMiddleware, postValidation(), async (req: RequestWithBody<CreateAndUpdatePostModel>, res: Response) => {
    let {title, shortDescription, content, blogId} = req.body

    const newPost = await postsRepository.createPost({title, shortDescription, content, blogId})

    res.status(201).send(newPost)


})

postsRouter.get('/:id', async (req: RequestWithParams<Params>, res: Response) => {
    const id = req.params.id

    let post = await postsRepository.getPostById(id)

    if (!post) {
        res.sendStatus(404)
        return
    } else {
        res.send(post)
    }
})

postsRouter.put('/:id', authMiddleware, postValidation(), async (req: RequestWithParamsAndBody<Params, CreateAndUpdatePostModel>, res: Response) => {
    const id = req.params.id
    let {title, shortDescription, content, blogId} = req.body

    const post = await postsRepository.getPostById(id)

    if (!post) {
        res.sendStatus(404)
        return
    }

    let isUpdated = await postsRepository.updatePost(id, {title, shortDescription, content, blogId})

    if (isUpdated) {
        res.sendStatus(204)
    }
})

postsRouter.delete('/:id', authMiddleware, async (req: RequestWithParams<Params>, res: Response) => {
    const id = req.params.id

    const isDeleted = await postsRepository.deletePost(id)

    if (isDeleted) {
        res.sendStatus(204)
        return
    } else {
        res.sendStatus(404)
    }
})