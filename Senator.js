const Joi = require('joi')

const SenatorSchema = Joi.object({
    bioguideid: Joi.string().required(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    birthday: Joi.date().required(),
    gender: Joi.string().required(),
    title_long: Joi.string().required(),
    senator_class_label: Joi.string().required(),
    party: Joi.string().required(),
    senator_rank_label: Joi.string().required(),
    state: Joi.string().required()
})

class Senator {
    constructor(bioguideid, firstname, lastname, birthday, gender, title_long, senator_class_label, state) {
        this.bioguideid = bioguideid;
        this.firstname = firstname;
        this.lastname = lastname;
        this.gender = gender;
        this.title_long = title_long;
        this.senator_class_label = senator_class_label;
        this.state = state;
    }

    validate() {
        return SenatorSchema.validate(this, {abortEarly: false})
    }
}

module.exports = Senator;
