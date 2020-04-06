/**
 * MemberCompetence.js
 *
 * all functions related to the connection between Member and Competence should be in this file
 */

const db = require('../database/Database');
const Exception = require('../exception/Exception');
const HttpStatus = require('http-status-codes');

const Member = require('./Member');
const Competence = require('./Competence');

class MemberCompetence {

    constructor(member, competence, rating) {
        if (!MemberCompetence.validateArgs(member, competence, rating))
            throw new Exception(
                HttpStatus.BAD_REQUEST,
                'The arguments provided to create a member competence are wrong.'
            );
        this.member = member;
        this.competence = competence;
        this.rating = rating;
    }

    getMember() {
        return this.member;
    }

    getCompetence() {
        return this.competence;
    }

    getRating() {
        return this.rating;
    }

    delete() {
        return db.query(`DELETE FROM member_competence
            WHERE ist_id = ? AND competence = ?`, [this.member.getIstId(), this.competence.getCompetence()])
            .catch((error) => {
                throw new Exception(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    'There was an error in delete member competence method.',
                    error
                )
            });
    }

    /**
     * @param member
     * @returns {boolean}
     */
    static validateMember(member) {
        return true;//(member instanceof Member);
    }

    /**
     * @param competence
     * @returns {boolean}
     */
    static validateCompetence(competence) {
        return (competence instanceof Competence);
    }

    /**
     * @param rating
     * @returns {boolean}
     */
    static validateRating(rating) {
        return rating != null && !Number.isNaN(rating);
    }

    /**
     * @param member
     * @param competence
     * @param rating
     * @returns {boolean}
     */
    static validateArgs(member, competence, rating) {
        return this.validateMember(member) && this.validateCompetence(competence) && this.validateRating(rating);
    }

    /**
     * @param member
     * @param competence
     * @param rating
     * @returns {Promise<T | never>}
     */
    static create(member, competence, rating) {
        if (!this.validateArgs(member, competence, rating))
            throw new Exception(
                HttpStatus.BAD_REQUEST,
                'The arguments provided to create a member competence are wrong.'
            );
        return db.query(`INSERT INTO member_competence(ist_id, competence, rating)
            VALUES (?, ?, ?)`, [member.getIstId(), competence.getCompetence(), rating])
            .then(() => {
                return new MemberCompetence(member, competence, rating);
            })
            .catch((error) => {
                throw new Exception(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    'There was an error while creating a member competence.',
                    error
                );
            })
    }
}


module.exports = MemberCompetence;