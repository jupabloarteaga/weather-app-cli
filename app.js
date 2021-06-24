//require('dotenv').config();
const { leerInput, pausa, inquirerMenu, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");


const main = async() =>{
    let busqueda = new Busquedas();
    let opt;


    do{
        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                // Mostrar mensaje
                const lugar = await leerInput('Indique ciudad: ');
               
                // Buscar el lugar
                const lugares = await busqueda.getCities( lugar );

                // Seleccionar el lugar
                const id = await listarLugares(lugares);
                if(id === 0) continue;
                //console.log({id});
                
                const lugarSel = lugares.find( l => l.id === id);
                //console.log(lugarSel);

                busqueda.agregarHistorial(lugarSel.nombre);

                // Clima
                const weather = await busqueda.weatherPlace(lugarSel.lat, lugarSel.lng);
                //console.log({weather});
                
                // Mostrar resultados
                console.clear();
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad:', lugarSel.nombre);
                console.log('Lat:', lugarSel.lat);
                console.log('Lng:', lugarSel.lng);
                console.log('Temperatura:',weather.temp );
                console.log('Minima:', weather.min);
                console.log('Máxima:', weather.max);
                console.log('Desc:' , weather.desc);
            
            break;

            case 2:

                busqueda.historialCapitalizado.forEach( (lugar, index) => {
                    const idx = `${index + 1 }.`.green
                    console.log(`${idx} ${lugar}`);
                })


                break;
        
            }

            
        if(opt !== 0) await pausa();

    }while(opt !== 0)
    

}




main();