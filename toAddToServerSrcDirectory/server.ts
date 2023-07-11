import 'dotenv/config';
import express from 'express';
import { required } from '../validators.js';
const app = express();


console.log('test', required(''))

//get port from .env file
const port = process.env['API_PORT'] || 9999;

/* 
Create a set of apis for registing a user, login, and logout all using JWT under the path /api/auth
*/

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const apiDocs = {
    register: {
        method: 'POST',
        path: '/api/auth/register',
        body: {
            username: 'string',
            email: 'string',
            password: 'string',
        },
    }
}

// app.post(apiDocs.register.path, async (req, res) => {
//     const passwordHash = bcrypt.hashSync(req.body.password, 10);
//     const authUser = {
//         username: req.body.username,
//         email: req.body.email,
//         password: passwordHash,
//     }

//     const authInsertResult = await sql`
//         INSERT INTO auth ${sql(authUser, 'username', 'email', 'password')}
//         RETURNING id;
//     `;
//     const authId = authInsertResult[0].id;
//     const user = {
//         username: req.body.username.toLowerCase(),
//         email: req.body.email.toLowerCase(),
//         userDisplayName: req.body.username,
//     }
//     const userInsertResult = await sql`
//         INSERT INTO user_profile ${sql(user, 'username', 'email', 'userDisplayName')}
//         RETURNING id;
//     `;
//     res.json({ success: true, message: 'User created', authId, userId: userInsertResult[0].id });
// });

// app.post('/api/auth/login', async (req, res) => {
//     sql`
//         SELECT * FROM auth
//         WHERE username = ${req.body.username}
//         AND password = ${req.body.password}
//     `;
// })


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})