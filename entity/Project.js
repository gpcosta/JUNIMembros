/**
 * Project.js
 *
 * all functions related to Project should be in this file
 */

const db = require('../database/Database');
const Exception = require('../exception/Exception');
const HttpStatus = require('http-status-codes');

class Project {

    constructor(projectId, name, beginDate) {
        if (!Project.validateArgs(projectId, name, beginDate))
            throw new Exception(
                HttpStatus.BAD_REQUEST,
                'The arguments provided to create a project are wrong.'
            );
        this.projectId = projectId;
        this.name = name;
        this.previousName = name;
        this.beginDate = beginDate;
    }

    getProjectId() {
        return this.projectId;
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.previousName = this.name;
        this.name = name;
    }

    getBeginDate() {
        return this.beginDate;
    }

    /**
     * @returns {Promise<T | never>}
     */
    update() {
        if (this.previousName === this.name)
            return new Promise(() => {return this;});

        return db.query(`UPDATE project
            SET name = ?
            WHERE name = ?`, [this.name, this.previousName])
            .then(() => {
                return this;
            })
            .catch((error) => {
                throw new Exception(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    'There was an error in update project method.',
                    error
                );
            });
    }

    /**
     * @returns {Promise<T | never>}
     */
    delete() {
        return db.query(`DELETE FROM project
            WHERE projectId = ?`, [this.projectId])
            .catch((error) => {
                throw new Exception(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    'There was an error in delete project method.',
                    error
                );
            });
    }

    /**
     * @param projectId
     * @returns {boolean}
     */
    static validateProjectId(projectId) {
        return (Number.isInteger(projectId) || projectId == null);
    }

    /**
     * @param name
     * @returns {boolean}
     */
    static validateName(name) {
        return (typeof name === 'string' || name instanceof String);
    }

    /**
     * @param beginDate
     * @returns {boolean}
     */
    static validateBeginDate(beginDate) {
        return (beginDate instanceof Date || beginDate == null);
    }

    /**
     * @param projectId
     * @param name
     * @param beginDate
     * @returns {boolean}
     */
    static validateArgs(projectId, name, beginDate) {
        return this.validateProjectId(projectId) && this.validateName(name) && this.validateBeginDate(beginDate);
    }

    /**
     * @param name
     * @param beginDate
     * @returns {*}
     */
    static create(name, beginDate) {
        if (!(this.validateName(name) && this.validateBeginDate(beginDate)))
            throw new Exception(
                HttpStatus.BAD_REQUEST,
                'The arguments provided to create a project are wrong.'
            );
        return db.query(`INSERT INTO project(name, begin_date)
            VALUES (?, ?)`, [name, beginDate])
            .then((result) => {
                return new Project(result.insertId, name, beginDate);
            })
            .catch((error) => {
                throw new Exception(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    'There was an error while creating a project.',
                    error
                );
            });
    }

    /**
     * @param name
     * @returns {Promise<T | never>}
     */
    static getProjectByName(name) {
        return db.query(`SELECT project_id, name, begin_date
            FROM project
            WHERE name = ?`, [name])
            .then((result) => {
                if (result.length === 0)
                    throw new Exception(
                        HttpStatus.NOT_FOUND,
                        'There is no such project.'
                    );
                result = result[0];
                return new Project(result['project_id'], result['name'], result['begin_date']);
            })
            .catch((error) => {
                if (error instanceof Exception)
                    throw error;

                throw new Exception(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    'There was an error in get project by name method.',
                    error
                );
            });
    }

    /**
     * @param projectId
     * @returns {Promise<T | never>}
     */
    static getProjectById(projectId) {
        return db.query(`SELECT project_id, name, begin_date
            FROM project
            WHERE project_id = ?`, [projectId])
            .then((result) => {
                if (result.length === 0)
                    throw new Exception(
                        HttpStatus.NOT_FOUND,
                        'There is no such project.'
                    );
                result = result[0];
                return new Project(result['project_id'], result['name'], result['begin_date']);
            })
            .catch((error) => {
                if (error instanceof Exception)
                    throw error;

                throw new Exception(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    'There was an error in get project by name method.',
                    error
                );
            });
    }

    /**
     * @returns {Promise<T | never>}
     */
    static getAllProjects() {
        return db.query(`SELECT project_id, name, begin_date
            FROM project`)
            .then((result) => {
                let projects = [];
                for (let i = 0, len = result.length; i < len; i++) {
                    let row = result[0];
                    projects.push(new Project(row['project_id'], row['name'], new Date(row['begin_date'])));
                }
                return projects;
            })
            .catch((error) => {
                throw new Exception(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    'There was an error in get all projects method.',
                    error
                );
            });
    }
}

module.exports = Project;