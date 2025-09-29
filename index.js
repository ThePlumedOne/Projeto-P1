const express = require('express')
const {readFile, writeFile} = require('node:fs/promises');
const cors = require('cors')
const status_codes = require('http')
const fs = require("node:fs");
const app = express()

const port = 3000

// Pegar arquivos com os representantes
const getUsRepresentativesFile = () => {
    return readFile('./Current_US_Representatives.json', 'utf8')
        .then(data => JSON.parse(data))
        .then(parsed => parsed.objects);
}

// Pegar arquivo com os senadores
const getUsSenatorsFile = () => {
    return readFile('./Current_US_Senators.json', 'utf8')
        .then(data => JSON.parse(data))
        .then(parsed => parsed.objects);
}


app
    .use(cors({methods: ['GET', 'POST', 'PUT', 'DELETE']}))
    .get('/us.representatives', async (req, res) => {
        try {
            const usRepresentatives = await getUsRepresentativesFile()
            res.json(usRepresentatives)
        } catch (err) {
            res.status(500).json({error: 'Falha ao carregar representantes'})
        }
    })

    .get('/us.senators', async (req, res) => {
        try {
            const senators = await getUsSenatorsFile()
            res.json(senators)
        } catch (err) {
            res.status(500).json({error: 'Falha ao carregar senadores'})
        }
    })

    .post('/us.representatives', async (req, res) => {


    })

    .post('/us.senators', async (req, res) => {
    })

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})


