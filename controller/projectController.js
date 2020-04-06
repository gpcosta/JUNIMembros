var express = require('express');
var router = express.Router();

const HttpStatus = require('http-status-codes');
const Project = require('../entity/Project');
const Competence = require('../entity/Competence');
const ProjectCompetence = require('../entity/ProjectCompetence');

/* GET all projects */
router.get('/', function(req, res) {
    Project.getAllProjects()
        .then((projects) => {
            res.status(HttpStatus.OK).send(projects);
        })
        .catch((error) => {
            res.status(error.getStatus()).send(error.getMessage());
        })
});

/* GET project with provided projectName */
router.get('/:projectName', function (req, res) {
    Project.getProjectByName(req.params.projectName)
        .then((project) => {
            res.status(HttpStatus.OK).send(project);
        })
        .catch((error) => {
            res.status(error.getStatus()).send(error.getMessage());
        })
});

/**
 * POST add project to the list of projects available:
 *      - projectName (in body)
 *      - beginDate (in body)
 */
router.post('/', function (req, res) {
    let projectName = req.body.projectName;
    let beginDate = req.body.beginDate || null;
    if (beginDate != null)
        beginDate = new Date(beginDate);
    Project.create(projectName, beginDate)
        .then((project) => {
            res.status(HttpStatus.CREATED).send(project);
        })
        .catch((error) => {
            res.status(error.getStatus()).send(error.getMessage());
        });
});

/**
 * POST add competence to a project:
 *      - projectName (in params)
 *      - competence (in body)
 */
router.post('/:projectName/competence', function (req, res) {
    let projectName = req.params.projectName;
    let competence = req.body.competence;

    let project = null;
    Project.getProjectByName(projectName)
        .then((p) => {
            project = p;
            return Competence.getCompetenceByName(competence);
        })
        .then((competence) => {
            return ProjectCompetence.create(project, competence);
        })
        .then((projectCompetence) => {
            res.status(HttpStatus.CREATED).send(projectCompetence);
        })
        .catch((error) => {
            console.log(error);
            res.status(error.getStatus()).send(error.getMessage());
        });
});

/**
 * PUT update project by providing:
 *      - projectName (in req.params - it will identify the project to update)
 *      - newName (in body)
 */
router.put('/:projectName', function (req, res) {
    let projectName = req.params.projectName;
    let newName = req.body.newName;
    Project.getProjectByName(projectName)
        .then((project) => {
            if (newName)
                project.setName(newName);
            return project.update();
        })
        .then((project) => {
            res.status(HttpStatus.OK).send(project);
        })
        .catch((error) => {
            res.status(error.getStatus()).send(error.getMessage());
        })
});

/* DELETE delete a project by providing its projectName */
router.delete('/:projectName', function (req, res) {
    let projectName = req.params.projectName;
    Project.getProjectByName(projectName)
        .then((project) => {
            return project.delete();
        })
        .then(() => {
            res.status(HttpStatus.OK).send();
        })
        .catch((error) => {
            res.status(error.getStatus()).send(error.getMessage());
        })
});

module.exports = router;