/**
 * Area.js
 *
 * all functions related to Area should be in this file
 */

const db = require('../database/Database');
const Exception = require('../exception/Exception');
const HttpStatus = require('http-status-codes');

class Area {

    constructor(area) {
        this.area = area;
    }

    getArea() {
        return this.area;
    }

    toJson() {
        return {
            area: this.area
        };
    }

    /**
     * @returns {Promise<T | never>}
     */
    delete() {
        return db.query(`DELETE FROM area
            WHERE area = ?`, [this.area])
            .catch((error) => {
                throw new Exception(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    'There was an error in delete area method',
                    error
                );
            });
    }

    /**
     * @param area
     * @returns {Promise<T | never>}
     */
    static create(area) {
        return db.query(`INSERT INTO area(area)
            VALUES (?)`, [area])
            .then(() => {
                return new Area(area);
            })
            .catch((error) => {
                throw new Exception(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    'There was an error in add area method',
                    error
                );
            });
    }

    /**
     * @param name
     * @returns {Promise<T | never>}
     */
    static getAreaByName(name) {
        return db.query(`SELECT area
            FROM area
            WHERE area = ?`, [name])
            .then((result) => {
                return new Area(result[0]['area']);
            })
            .catch((error) => {
                throw new Exception(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    'There was an error in get area by name method',
                    error
                )
            });
    }
}

module.exports = Area;