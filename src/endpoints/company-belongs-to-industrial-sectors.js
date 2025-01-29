import { queryDb } from "../db/db-query.js";
import { validateArrayWithObjectsStrings } from "./common-tools.js";

/**
 * Inserts a new record in the `business_industrials_sector` table.
 * 
 * @param {Object} params - Input parameters.
 * @param {number} params.company_id - The ID of the company.
 * @param {number} params.industrial_sector_id - The ID of the industrial sector.
 * @returns {Promise<Object>} - The inserted record, containing `id`, `company_id`, and `industrial_id`.
 * @throws {Error} - Throws an error if the database query fails.
 */
async function addRow({company_id, industrial_sector_id}){
    const query = `
        INSERT INTO business_industrials_sector (company_id, industrial_id)
        VALUES ($1, $2)
        RETURNING id, company_id, industrial_id
    `;
    const params = [company_id, industrial_sector_id];
    const result = await queryDb(query, params, false);
    return result;
}

/**
 * Deletes a record from the `business_industrials_sector` table.
 * 
 * @param {Object} params - Input parameters.
 * @param {number} params.company_id - The ID of the company.
 * @param {number} params.industrial_sector_id - The ID of the industrial sector.
 * @returns {Promise<Object|null>} - The deleted record, or `null` if no record was found.
 * @throws {Error} - Throws an error if the database query fails.
 */
async function removeRow({company_id, industrial_sector_id}) {
    const query = `
        DELETE FROM business_industrials_sector
        WHERE
            company_id = $1
            AND
            industrial_sector_id = $2
        RETURNING *;
    `;
    const params = [company_id, industrial_sector_id];
    const result = await queryDb(query, params, false);
    return result;
}

/**
 * Associates a company with multiple industrial sectors by adding, updating, or removing records.
 * 
 * @param {Object} params - Input parameters.
 * @param {number} params.company_id - The ID of the company.
 * @param {Array<Object>} params.industrial - An array of objects representing industrial sector actions.
 * @param {string} params.industrial[].industrial_sector_id - The ID of the industrial sector.
 * @param {string} params.industrial[].action - The action to perform: `"add"` to insert, `"remove"` to remove.
 * @returns {Promise<Array<Object|null>>} - An array containing the results of the operations. Each result corresponds to the output of `newRow` or `deleteRow`, or `null` if the action was unrecognized.
 * @throws {Error} - Throws an error if input validation fails or if any database operation fails.
 */
export default async function companyBelongsToIndustrialSectors({
    company_id, industrial
}) {
    const requiredKeys = ["industrial_sector_id", "action"];
    const validation = validateArrayWithObjectsStrings(industrial, requiredKeys);
    if (validation.valid){
        try {
            // Mapping each industrial sector to trigger functions
            const promises = industrial.map((item) => {
                switch (item["action"]) {
                    case "add":
                        return addRow({ company_id, industrial_sector_id: item["industrial_sector_id"]})
                    case "remove":
                        return removeRow({ company_id, industrial_sector_id: item["industrial_sector_id"] })
                    default:
                        console.warn(`Unrecognized action: ${item["action"]}`)
                        return null;
                }
            });
            // Run all promises in parallel
            const results = await Promise.all(promises);
            return results;
        } catch (error) {
            throw error;
        }
    } else {
        throw new Error(validation.error);
    }
}