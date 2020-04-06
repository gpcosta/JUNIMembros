var express = require('express');
var router = express.Router();

const HttpStatus = require('http-status-codes');
const Competence = require('../entity/Competence');
const Area = require('../entity/Area');

/**
 * POST add competence to the list of competences available:
 *      - competence (in body)
 *      - area (in body)
 */
router.post('/', function (req, res) {
    let competence = req.body.competence;
    let area = req.body.area;
    Area.getAreaByName(area)
        .then((area) => {
            return Competence.create(competence, area);
        })
        .then((competence) => {
            res.status(HttpStatus.CREATED).send(competence);
        })
        .catch((error) => {
            res.status(error.getStatus()).send(error.getMessage());
        });
});

/**
 * DELETE a competence with the given name (as competence in body)
 */
router.delete('/', function (req, res) {
    let competence = req.body.competence;
    Competence.getCompetenceByName(competence)
        .then((competence) => {
            return competence.delete();
        })
        .then(() => {
            res.status(HttpStatus.NO_CONTENT).send();
        })
        .catch((error) => {
            res.status(error.getStatus()).send(error.getMessage());
        });
});

module.exports = router;