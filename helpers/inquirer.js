const inquirer = require('inquirer');
const fs = require('fs');
require('colors');


const preguntas = [{
        type: 'list',
        name: 'opcion',
        message: '¿Qué desea hacer?',
        choices: [
    {
        value: 1,
        name: `${'1.'.green} Buscar ciudad`,
    },{
        value: 2,
        name: `${'2.'.green} Historial`,
        
    },{
        value: 0,
        name:  `${'0.'.green} Salir`
       
    }
]
}];

const confirmacion = [{
    type: 'input',
    name: 'confirmar',
    message: `Presione ${'ENTER'.green} para continuar :`
}]; 

const inquirerMenu = async() =>{

    console.clear();
    console.log('=================='.green);
    console.log(' Seleccione una opción: '.green);
    console.log('==================\n'.green);

    const { opcion } = await inquirer.prompt(preguntas);
    return opcion;
    
};
 

const pausa = async() => {
    console.log('\n');
    const { confirmar } = await inquirer.prompt(confirmacion);
    return  confirmar;
}

const leerInput = async(message) =>{
        
    const question = [{
        type: 'input',
        name: 'desc',
        message,
            /*validate( value ){
                if(value.length === 0){
                    return 'Por favor ingrese un value';
                }
                return true;
            }*/
        }]

    const { desc } = await inquirer.prompt(question);
    return desc;
    }


    const listarLugares = async(lugares = []) => {
        const choices = lugares.map((lugar, index) => {
            const idx = `${index + 1}`.green;

            return {
                value: lugar.id,
                name: `${idx} ${lugar.nombre}`
            }
        });

        choices.unshift({
            value: 0,
            name: '0.-'.green + ' Cancelar'
        })

        const preguntas = [{
            type: 'list',
            name: 'id',
            message: 'Seleccione lugar',
            choices
        }];

        const { id }  = await inquirer.prompt(preguntas);
        return id;    
    }


    


    





module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    listarLugares,

}