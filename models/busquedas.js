import { writeFileSync, readFileSync, existsSync } from 'node:fs';

import axios from 'axios';

class Busquedas {
  historial = [];
  dbPath = './db/database.json';

  constructor() {
    //TODO: leer DB si existe
    this.leerDB();
  }

  get historialCapitalizado() {
    return this.historial.map((lugar) => {
      return lugar
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    });
  }

  get paramsMapBox() {
    return {
      access_token: process.env.MAPBOX_KEY,
      limit: 5,
      language: 'es',
    };
  }

  get paramsOpenWeatherMap() {
    return {
      appid: process.env.OPENWEATHERMAP_KEY,
      units: 'metric',
      lang: 'es',
    };
  }

  async ciudades(lugar = '') {
    // Peticion http
    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
        params: this.paramsMapBox,
      });

      const { data } = await instance.get();
      return data.features.map((lugar) => ({
        id: lugar.id,
        nombre: lugar.place_name,
        lng: lugar.center[0],
        lat: lugar.center[1],
      }));
    } catch (error) {
      return [];
    }
  }

  async climaLugar(lat, lon) {
    try {
      // Instancia de axios.create
      const instance = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather`,
        params: { ...this.paramsOpenWeatherMap, lat, lon },
      });

      // de response extraer la data
      const { data } = await instance.get();
      const { weather, main } = data;
      return {
        desc: weather[0].description,
        temp_min: main.temp_min,
        temp_max: main.temp_max,
        temp: main.temp,
      };
    } catch (error) {
      console.log(error);
    }
  }

  agregarAlHistorial(lugar = '') {
    // prevenir duplicados
    if (this.historial.includes(lugar.toLowerCase())) {
      return;
    }

    this.historial = this.historial.splice(0, 5);

    this.historial.unshift(lugar.toLowerCase());

    // Grabar en archivo json
    this.guardarEnDB();
  }

  guardarEnDB() {
    const payload = {
      historial: this.historial,
    };
    writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  leerDB() {
    if (!existsSync(this.dbPath)) return;
    const info = readFileSync(this.dbPath, { encoding: 'utf-8' });
    const { historial } = JSON.parse(info);
    this.historial = historial;
  }
}

export default Busquedas;
