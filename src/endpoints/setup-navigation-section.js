import { queryDb } from "../db/db-query.js";

/**
 * Configura una sección de navegación para una empresa, insertando o actualizando registros en la base de datos.
 *
 * @async
 * @function setupNavigationSection
 * @param {Object} params - Parámetros de configuración.
 * @param {string} params.company_id - Identificador único de la empresa.
 * @param {string} params.label - Etiqueta de la sección de navegación.
 * @param {string} params.link - Enlace asociado a la sección de navegación.
 * @param {string} params.tab - Nombre de la pestaña a la que pertenece la sección.
 * @param {string} params.action - Acción asociada a la sección.
 * @param {number} params.order_position - Posición del elemento en el orden de navegación.
 * @param {Object} params.icon - Icono asociado a la sección, representado como un objeto JSON.
 * @param {string|boolean} [params.id=false] - Identificador del registro a actualizar. Si es `false`, se realizará una inserción.
 * @returns {Promise<Object>} Retorna el resultado de la operación en la base de datos.
 * @throws {Error} Lanza un error si ocurre un problema durante la ejecución de la consulta.
 *
 * @example
 * // Insertar un nuevo elemento de navegación
 * const result = await setupNavigationSection({
 *     company_id: "12345",
 *     label: "Inicio",
 *     link: "/home",
 *     tab: "principal",
 *     action: "navigate",
 *     order_position: 1,
 *     icon: { type: "svg", name: "home" },
 * });
 *
 * @example
 * // Actualizar un elemento de navegación existente
 * const result = await setupNavigationSection({
 *     company_id: "12345",
 *     label: "Dashboard",
 *     link: "/dashboard",
 *     tab: "principal",
 *     action: "navigate",
 *     order_position: 2,
 *     icon: { type: "svg", name: "dashboard" },
 *     id: "67890",
 * });
 */
export default async function setupNavigationSection({
    company_id,
    label,
    link,
    tab,
    action,
    order_position,
    icon,
    id=false,
}){
    try{
        // Validar tipos en parametros de entrada
        if (!company_id || typeof company_id !== "string") {
            throw new Error("El parámetro 'company_id' es requerido y debe ser un string.");
        }
        if (!label || typeof label !== "string") {
            throw new Error("El parámetro 'label' es requerido y debe ser un string.");
        }
        if (!link || typeof link !== "string") {
            throw new Error("El parámetro 'link' es requerido y debe ser un string.");
        }
        if (!tab || typeof tab !== "string") {
            throw new Error("El parámetro 'tab' es requerido y debe ser un string.");
        }
        if (!action || typeof action !== "string") {
            throw new Error("El parámetro 'action' es requerido y debe ser un string.");
        }
        if (!order_position || typeof order_position !== "number") {
            throw new Error("El parámetro 'order_position' es requerido y debe ser un número.");
        }
        if (!icon || typeof icon !== "object") {
            throw new Error("El parámetro 'icon' es requerido y debe ser un objeto.");
        }

        let query;
        let params;

        // Es nuevo?
        if(!id){
            query = `
                INSERT INTO business_navigation_content (company_id, label, link, tab, action, order_position, icon)
                VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb)
                RETURNING *;
            `;
            params = [
                company_id,
                label,
                link,
                tab,
                action,
                order_position,
                JSON.stringify(icon)
            ];
        } else {
            query = `
                UPDATE business_navigation_content
                SET
                    label = $1,
                    link = $2,
                    tab = $3,
                    action = $4,
                    order_position = $5,
                    icon = $6::jsonb,
                WHERE
                    id = $7
                        AND
                    company_id = $8;
            `;
            params = [
                label,
                link,
                tab,
                action,
                order_position,
                JSON.stringify(icon),
                id,
                company_id
            ];
        }
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