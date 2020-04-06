var express = require('express');
var router = express.Router();

const HttpStatus = require('http-status-codes');
const Area = require('../entity/Area');

/**
 * POST add area to the list of areas available:
 *      - area (in body)
 */
router.post('/', function (req, res) {
    let area = req.body.area;
    Area.create(area)
        .then((area) => {
            res.status(HttpStatus.CREATED).send(area);
        })
        .catch((error) => {
            res.status(error.getStatus()).send(error.getMessage());
        });
});

/**
 * DELETE an area with the given name (as area in body)
 */
router.delete('/', function (req, res) {
    let area = req.body.area;
    Area.getAreaByName(area)
        .then((area) => {
            return area.delete();
        })
        .then(() => {
            res.status(HttpStatus.NO_CONTENT).send();
        })
        .catch((error) => {
            res.status(error.getStatus()).send(error.getMessage());
        });
});

module.exports = router;