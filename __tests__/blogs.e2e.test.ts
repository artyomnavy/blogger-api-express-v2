import request from 'supertest'
import {app} from "../src/settings"
import {OutputBlogsType} from "../src/types/blog/output"

const login = 'admin'
const password = 'qwerty'

describe('/blogs', () => {
    let newBlog: OutputBlogsType | null = null

    beforeAll(async () => {
        await request(app).delete('/testing/all-data').expect(204)
    })

    it('GET blogs database', async () => {
        await request(app)
            .get('/blogs')
            .expect(200, [])
    })

    it('- POST does not create blog with incorrect login and password)', async () => {
        await request(app)
            .post('/blogs')
            .auth('name', 'pass')
            .expect(401)

        await request(app)
            .get('/blogs')
            .expect(200, [])
    })

    it('- POST does not create blog with incorrect name, description and websiteUrl)', async () => {
        await request(app)
            .post('/blogs')
            .auth(login, password)
            .send({name: '', description: '', websiteUrl: ''})
            .expect(400, {
                errorsMessages: [
                    {message: 'Invalid name', field: 'name'},
                    {message: 'Invalid description', field: 'description'},
                    {message: 'Invalid websiteUrl', field: 'websiteUrl'},
                ]
            })

        await request(app)
            .get('/blogs')
            .expect(200, [])
    })

    it('+ POST create blog with correct data)', async () => {
        const createBlog = await request(app)
            .post('/blogs')
            .auth(login, password)
            .send({name: 'New blog 1', description: 'New description 1', websiteUrl: 'https://website1.com'})
            .expect(201)

        newBlog = createBlog.body

        expect(newBlog).toEqual({
            id: expect.any(String),
            name: 'New blog 1',
            description: 'New description 1',
            websiteUrl: 'https://website1.com',
            createdAt: expect.any(String),
            isMembership: false
        })

        await request(app)
            .get('/blogs')
            .expect(200, [newBlog])
    })

    it('- GET blog by ID with incorrect id', async () => {
        await request(app)
            .get('/blogs/' + 'aaaaa1111111111111111111')
            .expect(404)
    })

    it('+ GET blog by ID with correct id', async () => {
        await request(app)
            .get('/blogs/' + newBlog!.id)
            .expect(200, newBlog)
    })

    it('- PUT blog by ID with incorrect id', async () => {
        await request(app)
            .put('/blogs/' + 'aaaaa1111111111111111111')
            .auth(login, password)
            .send({name: 'Bad name', description: 'Bad description', websiteUrl: 'https://badwebsite.com'})
            .expect(404)

        await request(app)
            .get('/blogs')
            .expect(200, [newBlog])
    })

    it('- PUT blog by ID with incorrect data', async () => {
        await request(app)
            .put('/blogs/' + newBlog!.id)
            .auth(login, password)
            .send({name: '', description: '', websiteUrl: 'bad'})
            .expect(400)

        await request(app)
            .get('/blogs')
            .expect(200, [newBlog])
    })

    it('+ PUT blog by ID with correct data', async () => {
        await request(app)
            .put('/blogs/' + newBlog!.id)
            .auth(login, password)
            .send({name: 'New blog 2', description: 'New description 2', websiteUrl: 'https://website2.com'})
            .expect(204)

        const res = await request(app).get('/blogs/')
        expect(res.body[0]).toEqual({
            ...newBlog,
            name: 'New blog 2',
            description: 'New description 2',
            websiteUrl: 'https://website2.com',
        })
        newBlog = res.body[0]
    })

    it('- DELETE blog by ID with incorrect id', async () => {
        await request(app)
            .delete('/blogs/' + 'aaaaa1111111111111111111')
            .auth(login, password)
            .expect(404)

        await request(app)
            .get('/blogs')
            .expect(200, [newBlog])
    })

    it('+ DELETE blog by ID with correct id', async () => {
        await request(app)
            .delete('/blogs/' + newBlog!.id)
            .auth(login, password)
            .expect(204)

        await request(app)
            .get('/blogs')
            .expect(200, [])
    })
})