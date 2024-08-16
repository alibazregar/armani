import express from 'express';
import { createAddress, modifyAddress, deleteAddress, getUserAddresses } from './addressController';
import { checkLogin } from '../../middleware/checkLogin';
const router = express.Router();

// Create address endpoint
router.post('/', checkLogin, createAddress);

// Modify address endpoint
router.put('/:id',checkLogin ,modifyAddress);

// Delete address endpoint
router.delete('/:id',checkLogin, deleteAddress);

// See user addresses endpoint
router.get('/mine',checkLogin, getUserAddresses);

export default router;