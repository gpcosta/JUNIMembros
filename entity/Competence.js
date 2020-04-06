/**
 * Competence.js
 *
 * all functions related to Competence should be in this file
 */

const db = require('../database/Database');
const Exception = require('../exception/Exception');
const HttpStatus = require('http-status-codes');

const Area = require('./Area');

class Competence {

    /**
     * @param competence
     * @param area
     */
    constructor(competence, area) {
        if (!Competence.validateArgs(competence, area))
            throw new Exception(
                HttpStatus.BAD_REQUEST,
                'The arguments provided to create a competence are wrong.'
            );
        this.competence = competence;
        this.area = area;
    }

    getCompetence() {
        return this.competence;
    }

    getArea() {
        return this.area;
    }

    toJson() {
        return {
            competence: this.competence,
            area: this.area.getArea()
        };
    }

    /**
     * @returns {Promise<T | never>}
     */
    delete() {
        return db.query(`DELETE FROM competence
            WHERE competence = ?`, [this.competence])
            .catch((error) => {
                throw new Exception(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    'There was an error in delete competence method.',
                    error
                )
            });
    }

    /**
     * @param competence
     * @param area
     * @returns {boolean}
     */
    static validateArgs(competence, area) {
        return this.validateCompetence(competence) && this.validateArea(area);
    }

    /**
     * @param competence
     * @returns {boolean}
     */
    static validateCompetence(competence) {
        return (typeof competence === 'string' || competence instanceof String);
    }

    /**
     * @returns {boolean}
     */
    static validateArea(area) {
        return (area instanceof Area);
    }

    /**
     * @param competence
     * @param area
     * @returns {Promise<T | never>}
     */
    static create(competence, area) {
        if (!this.validateArgs(competence, area))
            throw new Exception(
                HttpStatus.BAD_REQUEST,
                'The arguments provided to create a competence are wrong.'
            );
        return db.query(`INSERT INTO competence(competence, area)
            VALUES (?, ?)`, [competence, area.getArea()])
            .then(() => {
                return new Competence(competence, area);
            })
            .catch((error) => {
                console.log(error);
                throw new Exception(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    'There was an error while creating a competence.',
                    error
                );
            });
    }

    /**
     * @param competence
     * @returns {Promise<T | never>}
     */
    static getCompetenceByName(competence) {
        let row = null;
        return db.query(`SELECT competence, area
            FROM competence
            WHERE competence = ?`, [competence])
            .then((result) => {
                if (result.length === 0)
                    throw new Exception(
                        HttpStatus.NOT_FOUND,
                        'There is no such competence.'
                    );
                row = result[0];
                return Area.getAreaByName(row['area']);
            })
            .then((area) => {
                return new Competence(row['competence'], area);
            })
            .catch((error) => {
                console.log(error);
                throw new Exception(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    'There was an error in get competence by name method.',
                    error
                );
            });
    }

    /**
     * @returns {Promise<T | never>}
     */
    static getCompetencesByArea() {
        return db.query(`SELECT competence, area
            FROM competence
            WHERE competence = ?`, [competence])
            .then((result) => {
                let competences = [];
                for (let i = 0, len = result.length; i < len; i++) {
                    let row = result[i];
                    competences.push(new Competence(row['competence'], row['area']));
                }
                return competences;
            })
            .catch((error) => {
                throw new Exception(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    'There was an error in get competence by name method.',
                    error
                );
            });
    }
}

module.exports = Competence;