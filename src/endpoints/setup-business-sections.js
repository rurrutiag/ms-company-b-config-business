import { queryDb } from "../db/db-query.js";

/**
 * Configura una sección de negocio en la base de datos.
 *
 * @param {Object} params - Parámetros necesarios para configurar la sección.
 * @param {string} params.company_id - Identificador único de la empresa.
 * @param {string} params.page - Página a la que pertenece la sección.
 * @param {number} params.order_position - Posición del orden en la página.
 * @param {string} params.component - Componente de la sección.
 * @param {string} params.component_variant_id - Variante del componente.
 * @param {Object} params.content - Contenido de la sección.
 * @param {Object} params.metadata - Metadatos adicionales para la sección.
 * @param {string|boolean} [params.id=false] - Identificador de la sección, si ya existe.
 *
 * @throws {Error} Si algún parámetro no cumple con los tipos o no está definido.
 * @returns {Promise<Object>} Resultado de la operación en la base de datos.
 */
export default async function setupBusinessSection({
    company_id,
    page,
    order_position,
    component,
    component_variant_id,
    content,
    metadata,
    id=false,
}){
    try{
        
        // Validar tipos en parametros de entrada
        if (!company_id || typeof company_id !== "string") {
            throw new Error("El parámetro 'company_id' es requerido y debe ser un string.");
        }
        if (!page || typeof page !== "string") {
            throw new Error("El parámetro 'page' es requerido y debe ser un string.");
        }
        if (typeof order_position !== "number") {
            throw new Error("El parámetro 'order_position' es requerido y debe ser un número.");
        }
        if (!component || typeof component !== "string") {
            throw new Error("El parámetro 'component' es requerido y debe ser un string.");
        }
        if (!component_variant_id || typeof component_variant_id !== "string") {
            throw new Error("El parámetro 'component_variant_id' es requerido y debe ser un string.");
        }
        if (!content || typeof content !== "object") {
            throw new Error("El parámetro 'content' es requerido y debe ser un objeto.");
        }
        if (!metadata || typeof metadata !== "object") {
            throw new Error("El parámetro 'metadata' es requerido y debe ser un objeto.");
        }

        let query;
        let params;

        // Es nuevo?
        if(!id){
            query = `
                INSERT INTO business_sections (company_id, page, order, component, component_variant_id, content, metadata)
                VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb)
                RETURNING *;
            `;
            params = [
                company_id,
                page,
                order_position,
                component,
                component_variant_id,
                JSON.stringify(content),
                JSON.stringify(metadata)
            ];
        } else {
            query = `
                UPDATE business_navigation_content
                SET
                    page = $1,
                    order = $2,
                    component = $3,
                    component_variant_id = $4,
                    content = $5::jsonb,
                    metadata = $6::jsonb,
                WHERE
                    id = $7
                        AND
                    company_id = $8;
            `;
            params = [
                page,
                order_position,
                component,
                component_variant_id,
                content,
                metadata,
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