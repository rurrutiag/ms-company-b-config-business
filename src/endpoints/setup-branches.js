import { queryDb } from "../db/db-query.js";

/**
 * Configura una sucursal para una compañía, creando un nuevo registro o actualizando un registro existente.
 * Si no se proporciona un `id`, se crea una nueva sucursal. Si se proporciona un `id`, se actualiza una sucursal existente.
 * También se maneja la actualización del estado de una sucursal como matriz (headquarters) o no.
 * 
 * @async
 * @function setupBranch
 * @param {Object} params - Parámetros para crear o actualizar una sucursal.
 * @param {string} [params.id=false] - Identificador opcional de la sucursal a actualizar. Si no se especifica, se crea una nueva sucursal.
 * @param {string} [params.company_id=false] - Identificador de la compañía a la que pertenece la sucursal.
 * @param {string} [params.name=false] - Nombre de la sucursal. Solo necesario al crear o al actualizar el nombre.
 * @param {boolean} [params.is_visible=false] - Estado de visibilidad de la sucursal (si está visible o no).
 * @param {boolean} [params.is_hq=false] - Indica si la sucursal es la matriz (headquarters). Por defecto es `true`.
 * @param {Object} [params.address] - Dirección de la sucursal en formato JSON, necesaria al crear o actualizar la dirección de la sucursal.
 * @returns {Promise<Object>} Resultado de la consulta con los datos registrados o actualizados de la sucursal.
 * @throws {Error} Lanza un error si la consulta falla.
 * 
 * @example
 * // Crear una nueva sucursal
 * const result = await setupBranch({
 *   company_id: "1",
 *   name: "Sucursal Norte",
 *   is_visible: true,
 *   address: { street: "Avenida Norte", city: "Ciudad Norte" }
 * });
 * 
 * @example
 * // Actualizar una sucursal existente, cambiando solo el estado de matriz (headquarters)
 * const result = await setupBranch({
 *   id: "10",
 *   is_hq: false
 * });
 * 
 * @example
 * // Actualizar una sucursal existente, con nueva dirección y nombre
 * const result = await setupBranch({
 *   id: "10",
 *   company_id: "1",
 *   name: "Sucursal Centro",
 *   is_visible: true,
 *   address: { street: "Calle Centro", city: "Ciudad Centro" }
 * });
 */
export default async function setupBranch({
    id = false,
    company_id = false,
    name = false,
    is_visible = false,
    is_hq = false,
    address
}){
    let query;
    let params;
    try {
        if (!id) {
            // Es un nuevo registro
            // Validar que los campos obligatorios estén presentes y sean del tipo correcto
            if (!company_id || typeof company_id !== 'string') {
                return res.status(400).json({ message: 'El campo company_id es obligatorio y debe ser un string.' });
            }
            if (!name || typeof name !== 'string') {
                return res.status(400).json({ message: 'El campo name es obligatorio y debe ser un string.' });
            }
            if (!is_hq || typeof is_hq !== 'boolean') {
                return res.status(400).json({ message: 'El campo is_hq es obligatorio y debe ser un boolean.' });
            }
            if (!address || typeof address !== 'object') {
                return res.status(400).json({ message: 'El campo address es obligatorio y debe ser un objeto JSON.' });
            }
            query = `
                INSERT INTO business_branches (company_id, name, is_hq, is_visible, address)
                VALUES ($1, $2, $3, $4, $5::jsonb)
                RETURNING id, company_id, is_hq, is_visible, address;
            `;
            params = [
                company_id, name, is_hq, is_visible, JSON.stringify(address)
            ];
        } else if (!name && address === undefined) {
            // Validar que los campos obligatorios estén presentes y sean del tipo correcto
            if (!is_hq || typeof is_hq !== 'boolean') {
                return res.status(400).json({ message: 'El campo is_hq es obligatorio y debe ser un boolean.' });
            }
            if (!id || typeof id !== 'string') {
                return res.status(400).json({ message: 'El campo id es obligatorio y debe ser un string.' });
            }
            // Cambiar solo estado de sucursal a matriz o viceversa
            query = `
                UPDATE business_branches
                SET
                    is_hq = $1
                WHERE
                    id = $2
                RETURNING *;
            `;
            params = [
                is_hq, id
            ];
        } else {
            // Validar que los campos obligatorios estén presentes y sean del tipo correcto
            if (!company_id || typeof company_id !== 'string') {
                return res.status(400).json({ message: 'El campo company_id es obligatorio y debe ser un string.' });
            }
            if (!id || typeof id !== 'string') {
                return res.status(400).json({ message: 'El campo id es obligatorio y debe ser un string.' });
            }
            if (!name || typeof name !== 'string') {
                return res.status(400).json({ message: 'El campo name es obligatorio y debe ser un string.' });
            }
            if (!is_hq || typeof is_hq !== 'boolean') {
                return res.status(400).json({ message: 'El campo is_hq es obligatorio y debe ser un boolean.' });
            }
            if (!is_visible || typeof is_visible !== 'boolean') {
                return res.status(400).json({ message: 'El campo is_visible es obligatorio y debe ser un boolean.' });
            }
            if (!address || typeof address !== 'object') {
                return res.status(400).json({ message: 'El campo address es obligatorio y debe ser un objeto JSON.' });
            }
            // Se actualiza el registro completo
            query = `
                UPDATE business_branches
                SET
                    name = $1,
                    is_hq = $2,
                    is_visible = $3,
                    address = $4::jsonb
                WHERE
                    id = $5
                    AND
                    company_id = $6
                RETURNING *;
            `;
            params = [
                name,
                is_hq,
                is_visible,
                JSON.stringify(address),
                id,
                company_id
            ];
        }
        const result = await queryDb(query, params, false);
        return result;
    } catch (error) {
        throw error;
    }
}