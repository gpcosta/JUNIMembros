/**
 * ProjectCompetence.js
 *
 * all functions related to the connection between Project and Competence should be in this file
 */

const db = require('../database/Database');
const Exception = require('../exception/Exception');
const HttpStatus = require('http-status-codes');

const Project = require('./Project');
const Competence = require('./Competence');

class ProjectCompetence {

    constructor(project, competence) {
        if (!ProjectCompetence.validateArgs(project, competence))
            throw new Exception(
                HttpStatus.BAD_REQUEST,
                'The arguments provided to create a member competence are wrong.'
            );
        this.project = project;
        this.competence = competence;
    }

    getProject() {
        return this.project;
    }

    getCompetence() {
        return this.competence;
    }

    delete() {
        return db.query(`DELETE FROM project_competence
            WHERE project_id = ? AND competence = ?`, [this.project.getIstId(), this.competence.getCompetence()])
            .catch((error) => {
                throw new Exception(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    'There was an error in delete project competence method.',
                    error
                )
            });
    }

    /**
     * @param project
     * @returns {boolean}
     */
    static validateProject(project) {
        return (project instanceof Project);
    }

    /**
     * @param competence
     * @returns {boolean}
     */
    static validateCompetence(competence) {
        return (competence instanceof Competence);
    }

    /**
     * @param project
     * @param competence
     * @returns {boolean}
     */
    static validateArgs(project, competence) {
        return this.validateProject(project) && this.validateCompetence(competence);
    }

    /**
     * @param project
     * @param competence
     * @returns {Promise<T | never>}
     */
    static create(project, competence) {
        if (!this.validateArgs(project, competence))
            throw new Exception(
                HttpStatus.BAD_REQUEST,
                'The arguments provided to create a project competence are wrong.'
            );
        return db.query(`INSERT INTO project_competence(project_id, competence)
            VALUES (?, ?)`, [project.getProjectId(), competence.getCompetence()])
            .then(() => {
                return new ProjectCompetence(project, competence);
            })
            .catch((error) => {
                throw new Exception(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    'There was an error while creating a project competence.',
                    error
                );
            });
    }
}

module.exports = ProjectCompetence;