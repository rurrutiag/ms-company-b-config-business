import express from 'express';
import postRegisterNewBusiness from './endpoints/register-new-business.js';

const routes = express.Router();
routes.post('/register-new-business', async (req, res) => {
    try {
        const { id, fantasy_name, legal_info, url_domain, industrial, head_quarter, branches, modules } = req.body;
        const newBusiness = await postRegisterNewBusiness({id, fantasy_name, legal_info, url_domain, industrial, head_quarter, branches, modules});
        res.status(201).json(newBusiness[0]);
    } catch (error) {
        // Si ocurre un error, enviar una respuesta de error
        res.status(500).json({ message: 'Error al escribir datos', error: error.message });
    }
});

export default routes;