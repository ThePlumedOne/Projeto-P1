const express = require('express')
const {readFile, writeFile} = require('node:fs/promises');
const cors = require('cors')
const status_codes = require('http')
const fs = require('fs')
const app = express()

const Representative = require('./Representative');
const Senator = require('./Senator');

const port = 3000

// Pegar arquivos com os representantes
const getUsRepresentativesFile = () => {
    return readFile('./Current_US_Representatives.json', 'utf8')
        .then(data => JSON.parse(data))
        .then(parsed => parsed.objects);
}

const getRepresentativesByState = (state) => {
    return getUsRepresentativesFile().then(reps =>
        reps.filter(rep => rep.state === state))
}

const getUsSenatorsFile = () => {
    return readFile('./Current_US_Senators.json', 'utf8')
        .then(data => JSON.parse(data))
        .then(parsed => parsed.objects);

}

const getSenatorsByState = (state) => {
    return getUsSenatorsFile().then(reps =>
        reps.filter(rep => rep.state === state))

}

const addSenator = async (senatorData) => {

    const raw = await fs.readFile('./Current_US_Senators.json', 'utf8');
    const json = JSON.parse(raw);

    const newSenator = new Senator(
        senatorData.bioguideid,
        senatorData.firstname,
        senatorData.lastname,
        senatorData.birthday,
        senatorData.gender,
        senatorData.title_long,
        senatorData.senator_class_label,
        senatorData.state
    );


    json.objects.push(newSenator);
    return writeFile('./Current_US_Senators.json', JSON.stringify(json), 'utf8');
};


app
    .use(cors({methods: ['GET', 'POST', 'PUT', 'DELETE']}))
    .get('/us.representatives', async (req, res) => {
        try {
            const usRepresentatives = await getUsRepresentativesFile()
            res.json(usRepresentatives)
        } catch (err) {
            res.status(500).send({error: 'Falha ao carregar representantes'})
        }
    })

    .get('/us.senators', async (req, res) => {
        try {
            const senators = await getUsSenatorsFile()
            res.json(senators)
        } catch (err) {
            res.status(500).send({error: 'Falha ao carregar senadores'})
        }
    })

    .get('/us.representatives/:state', async (req, res) => {
        const {state} = req.params

        try {
            const usRepresentative = await getRepresentativesByState(state)
            res.json(usRepresentative)
        } catch (err) {
            res.status(500).send({error: 'Falha ao obter dados'})
        }


    })
    .get('/us.senators/:state', async (req, res) => {
        const {state} = req.params

        try {
            const usRepresentative = await getSenatorsByState(state)
            res.json(usRepresentative)
        } catch (err) {
            res.status(500).send({error: 'Falha ao obter dados'})
        }


    })

app.post('/us.senators', async (req, res) => {
    const { body } = req;

    if (!body) return res.status(400).send({ error: 'Corpo da requisição não existe' });

    try {
        const newSenatorInstance = new Senator(
            body.bioguideid,
            body.firstname,
            body.lastname,
            body.birthday,
            body.gender,
            body.title_long,
            body.senator_class_label,
            body.state
        );

        const { error } = newSenatorInstance.validate();
        if (error) {
            const message = error.details.map(d => d.message).join(", ");
            return res.status(400).send(message);
        }

        await addSenator(body);

        return res.status(201).json({ message: "Senador adicionado com sucesso" });

    } catch (err) {
        console.error(err);
        return res.status(500).send("Erro ao inserir novo Senador");
    }
});


app.listen(port, (error) => {

    if (error) console.log(error)
    console.log(`Listening on port ${port}`)
})


