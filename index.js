const express = require('express')
const { readFile, writeFile } = require('node:fs/promises');
const cors = require('cors')
const status_codes = require('http')
const fs = require("node:fs");
const app = express()

const port = 3000

const getUsRepresentativesFile = () => {
    return readFile('./Current_US_Representatives.json', 'utf8')
        .then(data => JSON.parse(data))   // return parsed JSON
        .then(parsed => parsed.objects);  // return the .objects property
}

const getUsSenatorsFile = () => {
    return readFile('./Current_US_Representatives.json', 'utf8')
        .then(data => JSON.parse(data))
        .then(parsed => parsed.objects);
}



app.
    get('/us.representatives',(req, res) => {
        return getUsRepresentativesFile()
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})


