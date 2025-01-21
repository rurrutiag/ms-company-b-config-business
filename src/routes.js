import express from 'express';
import registerNewCompany from './endpoints/register-new-company.js';
import setupBranch from './endpoints/setup-branches.js';
import setupBusinessSection from './endpoints/setup-business-sections.js';
import setupNavigationSection from './endpoints/setup-navigation-section.js';
import companyBelongsToIndustrialSectors from './endpoints/company-belongs-to-industrial-sectors.js';

const routes = express.Router();

routes.post('/register-new-company', async (req, res) => {
    try {
        const { id=false, fantasy_name, legal_info, url_domain } = req.body;
        const endpointRequest = await registerNewCompany({fantasy_name, legal_info, url_domain, id});
        // Verificar si se obtuvo un resultado esperado
        if (!endpointRequest || !Array.isArray(endpointRequest) || endpointRequest.length === 0) {
            return res.status(500).json({ message: 'No se pudo registrar la nueva empresa. Por favor, intente de nuevo.' });
        }
        res.status(201).json(endpointRequest[0]);
    } catch (error) {
        // Si ocurre un error, enviar una respuesta de error
        res.status(500).json({ message: 'Error al escribir datos', error: error.message });
    }
});

routes.post('/setup-branches', async (req, res) => {
    try {
        const { id = false,
            company_id = false,
            name = false,
            is_visible = false,
            is_hq = false,
            address = false } = req.body;
        const endpointRequest = await setupBranch({id, company_id, name, is_visible, is_hq, address});
        // Verificar si se obtuvo un resultado esperado
        if (!endpointRequest || !Array.isArray(endpointRequest) || endpointRequest.length === 0) {
            return res.status(500).json({ message: 'Error al actualizar sucursales del negocio.' });
        }
        res.status(201).json(endpointRequest[0]);
    } catch (error) {
        // Si ocurre un error, enviar una respuesta de error
        res.status(500).json({ message: 'Error al escribir datos', error: error.message });
    }
});

routes.post('/setup-business-sections', async (req, res) => {
    try {
        const {
            id = false,
            company_id = false,
            page = false,
            order_position = false,
            component = false,
            component_variant_id = false,
            content = false,
            metadata = false
        } = req.body;
        const endpointRequest = await setupBusinessSection({company_id, page, order_position, component, component_variant_id, content, metadata, id});
        // Verificar si se obtuvo un resultado esperado
        if (!endpointRequest || !Array.isArray(endpointRequest) || endpointRequest.length === 0) {
            return res.status(500).json({ message: 'Error al actualizar páginas del negocio.' });
        }
        res.status(201).json(endpointRequest[0]);
    } catch (error) {
        // Si ocurre un error, enviar una respuesta de error
        res.status(500).json({ message: 'Error al escribir datos', error: error.message });
    }
});

routes.post('/setup-navigation-section', async (req, res) => {
    try {
        const {
            id = false,
            company_id = false,
            label = false,
            link = false,
            tab = false,
            action = false,
            order_position = false,
            icon = false
        } = req.body;
        const endpointRequest = await setupNavigationSection({company_id, label, link, tab, action, order_position, icon, id});
        // Verificar si se obtuvo un resultado esperado
        if (!endpointRequest || !Array.isArray(endpointRequest) || endpointRequest.length === 0) {
            return res.status(500).json({ message: 'Error al actualizar sección de navegación del negocio.' });
        }
        res.status(201).json(endpointRequest[0]);
    } catch (error) {
        // Si ocurre un error, enviar una respuesta de error
        res.status(500).json({ message: 'Error al escribir datos', error: error.message });
    }
});

routes.post('/company-belongs-to-industrial-sector', async (req, res) => {
    try {
        const {
            company_id = false,
            industrial = false
        } = req.body;
        const endpointRequest = await companyBelongsToIndustrialSectors({company_id, industrial});
        // Verificar si se obtuvo un resultado esperado
        if (!endpointRequest || !Array.isArray(endpointRequest) || endpointRequest.length === 0) {
            return res.status(500).json({ message: 'Error al actualizar áreas industriales del negocio.' });
        }
        res.status(201).json(endpointRequest[0]);
    } catch (error) {
        // Si ocurre un error, enviar una respuesta de error
        res.status(500).json({ message: 'Error al escribir datos', error: error.message });
    }
});

export default routes;