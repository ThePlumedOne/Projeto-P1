const express = require('express')
const fs = require('node:fs/promises');
const cors = require('cors')
const status_codes = require('http')
const app = express()

const Representative = require('./Representative');
const Senator = require('./Senator');
const representativeData = require("./Senator");

const port = 3000

// Pegar arquivos com os representantes
const getUsRepresentativesFile = async () => {
    const data = await fs.readFile('./Current_US_Representatives.json', 'utf8');
    const parsed = JSON.parse(data);
    return parsed.objects;
};

const getRepresentativesByState = async (state) => {
    const reps = await getUsRepresentativesFile();
    return reps.filter(rep => rep.state === state);
};

const getUsSenatorsFile = async () => {
    const data = await fs.readFile('./Current_US_Senators.json', 'utf8');
    const parsed = JSON.parse(data);
    return parsed.objects;
};

const getSenatorsByState = async (state) => {
    const senators = await getUsSenatorsFile();
    return senators.filter(sen => sen.state === state);
};


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
        senatorData.senator_rank_label,
        senatorData.party,
        senatorData.state
    );

    const { error } = newSenator.validate();
    if (error) {
        throw new Error(error.details.map(d => d.message).join(', '));
    }

    json.objects.push(newSenator);

    await fs.writeFile('./Current_US_Senators.json', JSON.stringify(json, null, 2), 'utf8');

    return newSenator;
};

const addRepresentative = async (repData) => {
    const raw = await fs.readFile('./Current_US_Representatives.json', 'utf8');
    const json = JSON.parse(raw);

    const newRepresentative = new Representative(
        repData.bioguideid,
        repData.firstname,
        repData.lastname,
        repData.birthday,
        repData.gender,
        repData.title_long,
        repData.party,
        repData.state,
    );

    const { error } = newRepresentative.validate();
    if (error) {
        throw new Error(error.details.map(d => d.message).join(', '));
    }

    json.objects.push(newRepresentative);

    await fs.writeFile('./Current_US_Representatives.json', JSON.stringify(json, null, 2), 'utf8');

    return newRepresentative;
};



app
    .use(express.json())
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

    .post('/us.senators', async (req, res) => {
        try {
            const body = req.body;

            if (!body) return res.status(400).json({ error: 'Corpo da requisição não existe' });

            const newSenator = await addSenator(body);

            return res.status(201).json({
                message: 'Senador adicionado com sucesso',
                senator: newSenator
            });

        } catch (err) {
            console.error(err);
            return res.status(400).json({ error: err.message });
        }
    })


app.listen(port, (error) => {

    if (error) console.log(error)
    console.log(`Listening on port ${port}`)
})


