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

const getRepresentativesByState = (state) => {
    return getUsRepresentativesFile().then(reps =>
        reps.filter(rep => rep.state === state))
}

const getSenatorsByState = (state) => {
    return getUsSenatorsFile().then(reps =>
        reps.filter(rep => rep.state === state))
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

    .get('/us.representatives/:state', async (req, res) => {
        const {state} = req.params

        try {
            const usRepresentative = await getRepresentativesByState(state)
            res.json(usRepresentative)
        } catch (err) {
            res.status(500).json({error: 'Falha ao obter dados'})
        }


    })
    .get('/us.senators/:state', async (req, res) => {
        const {state} = req.params

        try {
            const usRepresentative = await getRepresentativesByState(state)
            res.json(usRepresentative)
        } catch (err) {
            res.status(500).json({error: 'Falha ao obter dados'})
        }


    })

    .post('/us.senators', async (req, res) => {
    })

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})


