/**
 * @typedef {'facilitair' | 'mic' | 'mim'} ReportType
 */

// Export types for use in other modules
export const ReportType = {};

/**
 * @typedef {'in_behandeling' | 'afgerond'} ReportStatus
 */

/**
 * @typedef {Object} UserProfile
 * @property {string} name
 * @property {string} phone
 * @property {string} department
 */

/**
 * @typedef {Object} BaseReport
 * @property {string} id
 * @property {ReportType} type
 * @property {ReportStatus} status
 * @property {Date} createdAt
 * @property {string} submittedBy
 */

/**
 * @typedef {BaseReport & Object} FacilitairReport
 * @property {'facilitair'} type
 * @property {string} location
 * @property {string} equipmentType
 * @property {boolean} isUrgent
 * @property {Date} dateTime
 * @property {string} description
 */

/**
 * @typedef {BaseReport & Object} MIMReport
 * @property {'mim'} type
 * @property {'agressie' | 'valpartij' | 'prikincident' | 'overbelasting' | 'anders'} category
 * @property {string} description
 * @property {string} supervisor
 * @property {boolean} workAbsence
 * @property {Date} dateTime
 */

/**
 * @typedef {BaseReport & Object} MICReport
 * @property {'mic'} type
 * @property {string} clientName
 * @property {string[]} bodyLocation
 * @property {string[]} healthComplaints
 * @property {string} description
 * @property {Date} dateTime
 */

/**
 * @typedef {FacilitairReport | MIMReport | MICReport} Report
 */

/**
 * @typedef {Object} ConversationMessage
 * @property {'assistant' | 'user'} role
 * @property {string} content
 * @property {string} [fieldName]
 */

// Export types for use in other modules
export const ConversationMessage = {};
