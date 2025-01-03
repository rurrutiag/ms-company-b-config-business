import { queryDb } from "../db/db-query.js";

export default async function postRegisterNewBusiness({
    id, fantasy_name, legal_info, url_domain, industrial, head_quarter, branches, modules
}){
    const query = `
        INSERT INTO companies (id, fantasy_name, legal_info, url_domain, industrial, head_quarter, branches, modules)
        VALUES  ($1, $2, $3::jsonb, $4, $5::jsonb, $6::jsonb, $7::jsonb, $8::jsonb)
        ;
    `;
    const params = [id, fantasy_name, legal_info, url_domain, industrial, head_quarter, branches, modules];
    try {
        const result = await queryDb(query, params, false);
        console.log(result);
        return result;
    } catch (error) {
        throw error;
    }
}