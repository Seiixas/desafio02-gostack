const express = require('express');
const { uuid } = require('uuidv4');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const repositories = [];

function verififyIfRepositoryExists(req, res, next) {
    const { id } = req.params;

    const repIndex = repositories.findIndex(repository => repository.id === id);

    return repIndex < 0 ?
        res.status(400).json({ error: "Repository not found" }) :
        next();
}

function applicationLog(req, res, next) {
    const { method, url } = req;

    var log = `Method: ${method.toUpperCase()} - URL: ${url}\nAction: `;

    switch (method.toUpperCase()) {
        case 'GET':
            log += 'Showing users.';
            break;
        case 'POST':
            log += 'Repository created.';
            break;
        case 'PUT':
            log += 'Repository updateded.';
            break;
        case 'DELETE':
            log += 'Repository deleted.';
            break;
    }

    console.log(log);

    return next();
}

app.use('/repositories/:id', verififyIfRepositoryExists);
app.use(applicationLog);

app.get('/repositories', (req, res) => {
    return res.json(repositories);
});

app.post('/repositories', (req, res) => {
    const { title, url, techs } = req.body;

    const repository = {
        id: uuid(),
        title,
        url,
        techs,
        likes: 0
    };

    repositories.push(repository);

    return res.json(repository);
});

app.put('/repositories/:id', (req, res) => {
    const { id } = req.params;
    const { title, url, techs } = req.body;

    const repIndex = repositories.findIndex(repository => repository.id === id);

    const { likes } = repositories[repIndex];

    const repository = {
        id,
        title,
        url,
        techs,
        likes
    };

    repositories[repIndex] = repository;

    return res.json(repository);
});

app.delete('/repositories/:id', (req, res) => {
    const { id } = req.params;

    const repIndex = repositories.findIndex(repository => repository.id === id);

    repositories.splice(repIndex, 1);

    return res.status(204).send();
});

app.post('/repositories/:id/like', (req, res) => {
    const { id } = req.params;

    const repIndex = repositories.findIndex(repository => repository.id === id);

    repositories[repIndex].likes++;

    return res.json(repositories[repIndex]);
})

module.exports = app;