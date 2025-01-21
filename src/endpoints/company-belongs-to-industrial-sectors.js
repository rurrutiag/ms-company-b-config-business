import { queryDb } from "../db/db-query.js";

/**
 * Inserta un nuevo registro en la tabla `business_industrials_sector`.
 * 
 * @param {Object} params - Parámetros de entrada.
 * @param {number} params.company_id - ID de la compañía.
 * @param {number} params.industrial_sector_id - ID del sector industrial.
 * @returns {Promise<Object>} - Devuelve el registro insertado.
 * @throws {Error} - Lanza un error si la inserción falla.
 */
async function newRow({company_id, industrial_sector_id}){
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
 * Asocia una compañía con múltiples sectores industriales.
 * 
 * @param {Object} params - Parámetros de entrada.
 * @param {string} params.company_id - ID de la compañía.
 * @param {Array<string>} params.industrial - Array de IDs de sectores industriales.
 * @returns {Promise<Array>} - Devuelve un array con los resultados de las inserciones.
 * @throws {Error} - Lanza un error si alguna operación falla.
 */
export default async function companyBelongsToIndustrialSectors({
    company_id, industrial
}) {
    if (!Array.isArray(industrial) || industrial.length === 0) {
        throw new Error('El parámetro "industrial" debe ser un array no vacío.');
    }
    try {
        // Mapear cada sector industrial a la función  newRow
        const promises = industrial.map((item) =>
            newRow({ company_id, industrial_sector_id: item})
        );
        // Ejecutar todas las promesas en paralelo
        const results = await Promise.all(promises);

        return results;
    } catch(error) {
        throw error;
    }
}