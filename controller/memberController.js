var express = require('express');
var router = express.Router();

const HttpStatus = require('http-status-codes');
const Member = require('../entity/Member');
const Project = require('../entity/Project');
const Competence = require('../entity/Competence');
const MemberCompetence = require('../entity/MemberCompetence');
const MemberProject = require('../entity/MemberProject');

/* GET all users */
router.get('/', function(req, res) {
    Member.getAllMembers()
        .then((members) => {
            res.status(HttpStatus.OK).send(members);
        })
        .catch((error) => {
            res.status(error.getStatus()).send(error.getMessage());
        })
});

/* GET user with provided IST ID */
router.get('/:istId', function (req, res) {
    Member.getMemberByIstId(req.params.istId)
        .then((member) => {
            res.status(HttpStatus.OK).send(member);
        })
        .catch((error) => {
            res.status(error.getStatus()).send(error.getMessage());
        })
});

/* GET users that has name that matches with the provided one */
router.get('/search/:name', function (req, res) {
    Member.getMembersByName(req.params.name)
        .then((members) => {
            res.status(HttpStatus.OK).send(members);
        })
        .catch((error) => {
            res.status(error.getStatus()).send(error.getMessage());
        });
});

/**
 * POST add member by providing:
 *      - istId
 *      - name
 *      - availableDate
 */
router.post('/', function (req, res) {
    let istId = Number.parseInt(req.body.istId);
    let name = req.body.name;
    let availableDate = req.body.availableDate || null;
    if (availableDate != null)
        availableDate = new Date(availableDate);

    return Member.create(istId, name, availableDate, null)
        .then((member) => {
            res.status(HttpStatus.CREATED).send(member);
        })
        .catch((error) => {
            res.status(error.getStatus()).send(error.getMessage());
        });
});

/**
 * POST add competence to a member:
 *      - istId (in params)
 *      - competence (in body)
 *      - rating (in body)
 */
router.post('/:istId/competence', function (req, res) {
    let istId = Number.parseInt(req.params.istId);
    let competence = req.body.competence;
    let rating = req.body.rating;

    let member = null;
    Member.getMemberByIstId(istId)
        .then((m) => {
            member = m;
            return Competence.getCompetenceByName(competence);
        })
        .then((competence) => {
            return MemberCompetence.create(member, competence, rating);
        })
        .then((memberCompetence) => {
            res.status(HttpStatus.CREATED).send(memberCompetence);
        })
        .catch((error) => {
            console.log(error);
            res.status(error.getStatus()).send(error.getMessage());
        });
});

/**
 * PUT update member by providing:
 *      - istId (in req.params - it will identify the member to update)
 *      - name (in body)
 *      - availableDate (in body)
 */
router.put('/:istId', function (req, res) {
    let istId = Number.parseInt(req.body.istId);
    let name = req.body.name;
    let availableDate = req.body.availableDate || null;
    if (availableDate != null)
        availableDate = new Date(availableDate);

    Member.getMemberByIstId(istId)
        .then((member) => {
            if (name)
                member.setName(name);
            if (availableDate)
                member.setAvailableDate(availableDate);
            return member.update();
        })
        .then((member) => {
            res.status(HttpStatus.OK).send(member);
        })
        .catch((error) => {
            res.status(error.getStatus()).send(error.getMessage());
        })
});

/* DELETE delete a member by providing its istId */
router.delete('/:istId', function (req, res) {
    let istId = req.params.istId;
    Member.getMemberByIstId(istId)
        .then((member) => {
            return member.delete();
        })
        .then(() => {
            res.status(HttpStatus.OK).send();
        })
        .catch((error) => {
            res.status(error.getStatus()).send(error.getMessage());
        })
});


router.post('/:istId/addToProject/:projectName', function (req, res) {
    let istId = req.params.istId;
    let projectName = req.params.projectName;
    let competences = req.body.competences;

    let member = null;
    let project = null;
    Member.getMemberByIstId(istId)
        .then((m) => {
            member = m;
            return Project.getProjectByName(projectName)
        })
        .then((p) => {
            project = p;
            let c = [];
            for (let i = 0, len = competences.length; i < len; i++) {
                c.push(Competence.getCompetenceByName(competences[i]));
            }
            return Promise.all(c);
        })
        .then((competences) => {
            return MemberProject.addToProject(member, project, competences);
        })
        .then((memberProject) => {
            res.status(HttpStatus.OK).send(memberProject);
        })
        .catch((error) => {
            res.status(error.getStatus()).send(error.getMessage());
        });
});

module.exports = router;
