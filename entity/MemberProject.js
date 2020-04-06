/**
 * MemberProject.js
 *
 * all functions related to Member with Project should be in this file
 */

const db = require('../database/Database');
const Exception = require('../exception/Exception');
const HttpStatus = require('http-status-codes');

const Member = require('./Member');
const Project = require('./Project');
const Competence = require('./Competence');

class MemberProject {

    constructor(member, project, competences) {
        if (!MemberProject.validateArgs(member, project, competences))
            throw new Exception(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'There was an error creating member with project.'
            );

        this.member = member;
        this.project = projectCompetence.getProject();
        this.competence = projectCompetence.getCompetence();
    }

    /**
     * @param member
     * @returns {boolean}
     */
    static validateMember(member) {
        return member instanceof Member;
    }

    /**
     * @param project
     * @returns {boolean}
     */
    static validateProject(project) {
        return project instanceof Project;
    }

    /**
     * @param competences
     * @returns {boolean}
     */
    static validateCompetences(competences) {
        if (!Array.isArray(competences) || competences.length === 0)
            return false;

        for (let i = 0, len = competences.length; i < len; i++) {
            if (!(competences[i] instanceof Competence))
                return false;
        }
        return true;
    }

    /**
     * @param member
     * @param project
     * @param competences
     * @returns {boolean|*}
     */
    static validateArgs(member, project, competences) {
        return this.validateMember(member) && this.validateProject(project) && this.validateCompetences(competences);
    }

    /**
     * @param member
     * @param project
     * @param competences
     * @returns {Promise<T | never>}
     */
    static addToProject(member, project, competences) {
        if (!this.validateArgs(member, project, competences))
            throw new Exception(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'There was an error in trying to add member to project.'
            );

        let query = '';
        let queryParameters = [];
        for (let i = 0, len = competences.length; i < len; i++) {
            query += '(?, ?, ?), ';
            queryParameters.push(member.getIstId());
            queryParameters.push(project.getProjectId());
            queryParameters.push(competences[i].getCompetence());
        }
        query = query.substr(0, -2);

        return db.query(`INSERT INTO member_competence_project(istId, competence, project_id)
                VALUES ` + query, queryParameters)
            .then(() => {
                return new MemberProject(member, projectCompetence);
            })
            .catch((error) => {
                throw new Exception(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    'There was an error in add a member to project method.',
                    error
                );
            });
    }

    /**
     * @param istId
     * @param projectName
     * @returns {*}
     */
    static getMemberWithProject(istId, projectName) {
        let member = null;
        let project = null;
        Member.getMemberByIstId(istId)
            .then((m) => {
                member = m;
                return Project.getProjectByName(projectName);
            })
            .then((p) => {
                project = p;
                return db.query(`SELECT competence
                    FROM member_project_competence
                    WHERE ist_id = ?
                    AND project_id = ?`, [member.getIstId(), project.getProjectId()]);
            })
            .then((result) => {
                if (result.length === 0)
                    return null;

                let competences = [];
                for (let i = 0, len = result.length; i < len; i++) {
                    competences.push(Competence.getCompetenceByName(result[i]['competence']));
                }
                return Promise.all(competences);
            })
            .then((competences) => {
                return new MemberProject(member, project, competences);
            })
            .catch((error) => {
                throw new Exception(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    'There was an error in get member with project method.',
                    error
                );
            });
    }
}