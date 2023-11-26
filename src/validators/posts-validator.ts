import {body} from "express-validator";
import {inputModelValidation} from "../middlewares/inputModel/input-model-validation";
import {blogsRepository} from "../repositories/blogs-db-repository";

const titleValidation = body('title')
    .trim().isLength({min: 1, max: 30}).withMessage('Invalid title')

const shortDescriptionValidation = body('shortDescription')
    .isString().trim().isLength({min: 1, max: 100}).withMessage('Invalid shortDescription')

const contentValidation = body('content')
    .isString().trim().isLength({min: 1, max: 1000}).withMessage('Invalid content')

const blogIdValidation = body('blogId')
    .isString().trim().custom((value) => {
        const blog = blogsRepository.getBlogById(value)

        if (!blog) {
            throw new Error('Invalid blogId') //OR return false
        } else {
            return true
        }

    }).withMessage('Invalid blogId')

export const postValidation = () => [titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, inputModelValidation]