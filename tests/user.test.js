const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/models/user')

const userOneID = new mongoose.Types.ObjectId() 

const userOne = {
    _id: userOneID,
    name: 'Mike', 
    email: 'Mike@example.com', 
    password: '56what!!', 
    tokens: [{
        token: jwt.sign( {_id: userOneID}, process.env.JWT_SECRET )
    }]
}

//Delete all users before creating new ones so we don't error out
beforeEach(async () => {
    await User.deleteMany()
    await new User(userOne).save()
})


test('Should signup a new user', async () => {
    const response = await request(app)
            .post('/users')
            .send({
                name: 'Andrew', 
                email: 'andrew@example.com', 
                password: 'MyPass777!'
            }).expect(201)

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertions about the response 
    expect(response.body).toMatchObject({
        user: {
            name: 'Andrew', 
            email: 'andrew@example.com', 
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('MyPass777!')

})

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOne._id)
    expect(user.tokens[1].token).toBe(response.body.token)
})

test('Should not login nonexistent user', async () => {
    await request(app).post('/users/login').send({
        email: 'bobMike@gmail.com',
        password: 'test1234'
    }).expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
            .get('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
            .get('/users/me')
            .send()
            .expect(401)
})

test('Should delete account for user', async () => {
         await request(app)
            .delete('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200)

        const user = await User.findById(userOneID)
        expect(user).toBeNull()
        
})

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
            .delete('/users/me')
            .send()
            .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
            .post('/users/me/avatar')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .attach('avatar', 'tests/fixtures/profile-pic.jpg')
            .expect(200)

    const user = await User.findById(userOneID)

    // toBe uses === operator. No two objects are the same
    expect(user.avatar).toEqual(expect.any(Buffer))
})