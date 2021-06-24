
const fs = require('fs');
const axios = require('axios');
require('dotenv').config();


class Busquedas {

     historial = [];
     dbPath = './db/database.json';


        constructor(){
             // TODO: leer DB si existe
            this.leerDB();
        }  

        get paramMapBox(){
             return {
                'access_token': process.env.MAPBOX_KEY,
                'limit': 5,
                'language': 'es'
            }
        }


        get paramWeather() {
            return{
                'appid': process.env.OPENWEATHER_KEY,
                'units':'metric',
                'lang': 'es' 
            }
        }

        get historialCapitalizado(){
            return this.historial.map( lugar => {
                let palabras = lugar.split(' ');
                palabras = palabras.map( p =>p[0].toUpperCase() + p.substring(1));
                return palabras.join(' ');
                });
        }

        async getCities (lugar = '') {
            
            try{
            
            // peticion http
            const instanceAxios = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramMapBox
                
            });

            const response = await instanceAxios.get();
            //const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json?access_token=pk.eyJ1IjoianVhbnBhYmxvOTEiLCJhIjoiY2txODdlN2lmMDNrNjJ4bno1Nmdxb3M4MyJ9._wMM3EhmyxOlL_tzi5-UPw&limit=5&language=es`);
            return response.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));
            

            }catch(err){
            
                return [];
            }
        }


        async weatherPlace(lat, lon){
            try {
                const instanceAxiosWeather = axios.create({
                    baseURL: `http://api.openweathermap.org/data/2.5/weather?lat=${ lat }&lon=${ lon }`,
                    params: this.paramWeather   
                
                });
                const responseWeather = await instanceAxiosWeather.get();
                const { weather, main} = responseWeather.data;
                return {
                    desc: weather[0].description,
                    min: main.temp_min,
                    max: main.temp_max,
                    temp: main.temp
                };
            } catch (error) {
                console.log(error);
            }
        }

        agregarHistorial( lugar = ''){
                        
            // TODO: prevenir duplicados
            if( this.historial.includes( lugar.toLowerCase() ))return;

            this.historial = this.historial.splice(0,5);

            this.historial.unshift( lugar.toLowerCase());

            //GrabarDB
            this.guardarDB();

        }

        guardarDB(){
            const payload= {
                historial: this.historial
            }

            fs.writeFileSync(this.dbPath, JSON.stringify( payload ));
        }


        leerDB(){
            if(!fs.existsSync(this.dbPath))return;
            
            const info = fs.readFileSync (this.dbPath, { encoding: 'utf-8' })
            const data = JSON.parse( info );
            this.historial = data.historial;
        }

    }

    module.exports = Busquedas;