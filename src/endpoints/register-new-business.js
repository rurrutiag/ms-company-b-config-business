import { queryDb } from "../db/db-query.js";

export default async function postRegisterNewBusiness({
    id, fantasy_name, legal_info, url_domain, industrial, head_quarter, branches, modules
}){
    const query = `
        INSERT INTO companies (id, fantasy_name, legal_info, url_domain, industrial, head_quarter, branches, modules)
        VALUES  ($1, $2, $3::jsonb, $4, $5::jsonb, $6::jsonb, $7::jsonb, $8::jsonb)
        RETURNING id, fantasy_name, legal_info, url_domain, industrial, head_quarter, branches, modules;
        ;
    `;
    const params = [
        id,
        fantasy_name,
        legal_info,
        url_domain,
        JSON.stringify(industrial),
        JSON.stringify(head_quarter),
        JSON.stringify(branches),
        JSON.stringify(modules)];
    try {
        const result = await queryDb(query, params, false);
        return result;
    } catch (error) {
        throw error;
    }
}