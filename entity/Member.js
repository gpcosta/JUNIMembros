/**
 * Member.js
 *
 * all functions related to Member should be in this file
 */

const db = require('../database/Database');
const Exception = require('../exception/Exception');
const HttpStatus = require('http-status-codes');

const Project = require('./Project');
const MemberCompetence = require('./MemberCompetence');
const ProjectCompetence = require('./ProjectCompetence');

class Member {

    /**
     * @param istId {int}
     * @param name {string}
     * @param availableDate {Date | null}
     * @param project {Project | null}
     */
    constructor(istId, name, availableDate, project) {
        if (!Member.validateArgs(istId, name, availableDate, project))
            throw new Exception(
                HttpStatus.BAD_REQUEST,
                'The arguments provided to construct a member are wrong.'
            );
        this.istId = istId;
        this.name = name;
        this.availableDate = availableDate;
        this.project = project;
    }

    getIstId() {
        return this.istId;
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    getAvailableDate() {
        return this.availableDate;
    }

    setAvailableDate(availableDate) {
        this.availableDate = availableDate;
    }

    getProject() {
        return this.project;
    }

    /**
     * @returns {Promise<T | never>}
     */
    update() {
        return db.query(`UPDATE member
            SET name = ?,
                available_date = ?
            WHERE ist_id = ?`, [this.name, this.availableDate, this.istId])
            .then(() => {
                return this;
            })
            .catch((error) => {
                throw new Exception(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    'There was an error in update member method.',
                    error
                );
            });
    }

    /**
     * @returns {Promise<T | never>}
     */
    delete() {
        return db.query(`DELETE FROM member
            WHERE ist_id = ?`, [this.getIstId()])
            .catch((error) => {
                throw new Exception(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    'There was an error in delete member method.',
                    error
                );
            });
    }

    /**
     * @param istId
     * @returns {boolean}
     */
    static validateIstId(istId) {
        return Number.isInteger(istId);
    }

    /**
     * @param name
     * @returns {boolean}
     */
    static validateName(name) {
        return (typeof name === 'string' || name instanceof String);
    }

    /**
     * @param availableDate
     * @returns {boolean}
     */
    static validateAvailableDate(availableDate) {
        return (availableDate instanceof Date || availableDate == null);
    }

    /**
     * @param istId
     * @param name
     * @param availableDate
     * @returns {boolean}
     */
    static validateArgs(istId, name, availableDate) {
        return this.validateIstId(istId) && this.validateName(name) && this.validateAvailableDate(availableDate);
    }

    /**
     * @param istId {int}
     * @param name {string}
     * @param availableDate {Date | null}
     * @returns {Promise<T | never>}
     */
    static create(istId, name, availableDate = null) {
        if (!Member.validateArgs(istId, name, availableDate))
            throw new Exception(
                HttpStatus.BAD_REQUEST,
                'The provided arguments to add a member are not from the right types.'
            );

        // availableDate should be stored in DB as a date
        // if null, it should be replaced by the first date possible ("1 de Janeiro de 1970 00:00:00 UTC")
        // this will simplify future comparisons
        if (availableDate == null)
            availableDate = new Date(0);

        return db.query(`INSERT INTO member(ist_id, name, available_date)
            VALUES (?, ?, ?, ?)`, [istId, name, availableDate])
            .then(() => {
                return new Member(istId, name, availableDate);
            })
            .catch((error) => {
                throw new Exception(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    'There was an error creating a member.',
                    error
                );
            });
    }

    /**
     * @param istId {int}
     * @returns {Promise<T | never>}
     */
    static getMemberByIstId(istId) {
        let row = null;
        return db.query(`SELECT ist_id, name, available_date
            FROM member
            WHERE ist_id = ?`, [istId])
            .then((result) => {
                if (result.length === 0)
                    throw new Exception(
                        HttpStatus.NOT_FOUND,
                        'There is no such member.'
                    );
                row = result[0];
                return new Member(row['ist_id'], row['name'], row['available_date']);
            })
            .catch((error) => {
                if (error instanceof Exception)
                    throw error;
                throw new Exception(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    'There was an error fetching a member given a IST ID.',
                    error
                );
            });
    }

    /**
     * @param name {string}
     * @returns {Promise<T | never>}
     */
    static getMembersByName(name) {
        return db.query(`SELECT ist_id, name, available_date
            FROM member
            WHERE name LIKE ?`, ['%' + name + '%'])
            .then((result) => {
                let members = [];
                for (let i = 0, len = result.length; i < len; i++) {
                    let row = result[i];
                    members.push(new Member(row['ist_id'], row['name'], row['available_date']));
                }
                return members;
            })
            .catch((error) => {
                throw new Exception(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    'There was an error fetching members given a name.',
                    error
                );
            });
    }

    /**
     * @returns {Promise<T | never>}
     */
    static getAllMembers() {
        return db.query(`SELECT ist_id, name, available_date
            FROM member`)
            .then((result) => {
                let members = [];
                for (let i = 0, len = result.length; i < len; i++) {
                    let row = result[i];
                    members.push(new Member(row['ist_id'], row['name'], row['available_date']));
                }
                return members;
            })
            .then((members) => {
                return members;
            })
            .catch((error) => {
                throw new Exception(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    'There was an error fetching all members.',
                    error
                );
            });
    }
}

module.exports = Member;