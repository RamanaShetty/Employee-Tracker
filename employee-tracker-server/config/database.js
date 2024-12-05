const mongoose = require('mongoose');
const employeeModel = require('../models/employee');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config;
module.exports = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await checkAdminExist();
        console.log('Connected to db');
    }
    catch(error){
        console.log('Error connecting db: '+error);
    }
}

const checkAdminExist = async () => {
    try {
        const admin = await employeeModel.find({ role: 'superAdmin' });
        if (admin.length === 0) {
            const superAdmin = {
                name: 'Admin',
                email: 'admin@gmail.com',
                password: 'Admin',
                mobile: '1234567890',
                role: 'superAdmin',
                skill:'management',
                specification: 'admin',
                profilePhoto: {
                    imageUrl: 'image.jpg'
                },
                employeeId: uuidv4()
            }
            await employeeModel.create(superAdmin);
        }
    }
    catch(error) {
        console.log('Error adding default admin: '+error);
    }
}

// const deleteEmployeeById = async (employeeId) => {
//     try {
//         const result = await employeeModel.deleteOne({ employeeId: employeeId });
        
//         if (result.deletedCount > 0) {
//             console.log(`Employee with employeeId ${employeeId} deleted successfully.`);
//         } else {
//             console.log('No employee found with the given employeeId.');
//         }
//     } catch (error) {
//         console.log('Error deleting employee: ', error);
//     }
// };

// // Example usage:
// const employeeIdToDelete = '801119c5-1aa5-4d82-be5b-b458250b13a6'; 
// deleteEmployeeById(employeeIdToDelete);
