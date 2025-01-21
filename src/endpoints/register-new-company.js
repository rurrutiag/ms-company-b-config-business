import { queryDb } from "../db/db-query.js";

/**
 * Registra una nueva compañía en la base de datos.
 * 
 * Si no se proporciona un `id`, se genera automáticamente al insertar el registro.
 * Si se proporciona un `id`, se utiliza para registrar explícitamente la compañía con ese identificador.
 * 
 * @async
 * @function registerNewCompany
 * @param {Object} params - Parámetros de la compañía a registrar.
 * @param {string} params.fantasy_name - Nombre de fantasía de la compañía.
 * @param {Object} params.legal_info - Información legal de la compañía en formato JSON.
 * @param {string} params.url_domain - Dominio asociado a la compañía.
 * @param {number} [params.id] - Identificador opcional de la compañía (si no se especifica, se generará automáticamente).
 * @returns {Promise<Object>} Resultado de la inserción con el `id` de la compañía registrada.
 * @throws {Error} Lanza un error si la consulta falla.
 */
export default async function registerNewCompany({
    fantasy_name,
    legal_info,
    url_domain,
    id
}) {

    // Validar que los campos obligatorios estén presentes y sean del tipo correcto
    if (!fantasy_name || typeof fantasy_name !== 'string') {
        return res.status(400).json({ message: 'El campo fantasy_name es obligatorio y debe ser un string.' });
    }
    if (!legal_info || typeof legal_info !== 'object') {
        return res.status(400).json({ message: 'El campo legal_info es obligatorio y debe ser un objeto.' });
    }
    if (!url_domain || typeof url_domain !== 'string') {
        return res.status(400).json({ message: 'El campo url_domain es obligatorio y debe ser un string.' });
    }

    let query;
    let params;

    // Determinar la consulta SQL y los parámetros según la existencia de `id`
    if (!id) {
        query = `
            INSERT INTO businesses (fantasy_name, legal_info, url_domain)
            VALUES ($1, $2::jsonb, $3)
            RETURNING id
        `;
        params = [
            fantasy_name, legal_info, url_domain
        ];
    } else {
        query = `
            INSERT INTO businesses (id, fantasy_name, legal_info, url_domain)
            VALUES ($1, $2, $3::jsonb, $4)
            RETURNING id
        `;
        params = [
            id, fantasy_name, legal_info, url_domain
        ];
    }
    try {
        const result = await queryDb(
            query,
            params,
            false
        );
        return result;
    } catch (error) {
        throw error;
    }
}