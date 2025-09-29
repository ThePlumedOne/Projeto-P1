const Joi = require("joi");

const RepresentativeSchema = Joi.object({
    bioguideid: Joi.string().required(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    birthday: Joi.string().required(),
    gender: Joi.string().required(),
    title_long: Joi.string().required(),
    party: Joi.string().required(),
    state: Joi.string().required()
})

class Representative {
    constructor(bioguideid, firstname, lastname, gender, title_long, party, state) {
        this.bioguideid = bioguideid
        this.firstname = firstname
        this.lastname = lastname
        this.gender = gender
        this.title_long = title_long
        this.party = party
        this.state = state
    }

    validate() {
        return RepresentativeSchema.validate(this, {abortEarly: false})
    }
}

module.exports = Representative