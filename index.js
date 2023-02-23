import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import chalk from 'chalk';
import {
  inquirerMenu,
  leerInput,
  listadoInteractivoCiudades,
  pausa,
} from './helpers/inquirer.js';
import Busquedas from './models/busquedas.js';

dotenv.config();

const main = async () => {
  let opt;

  const busquedas = new Busquedas();

  do {
    opt = await inquirerMenu();
    switch (opt) {
      case 1:
        // Mostrar mensaje
        const termino = await leerInput('Ingrese ciudad:');

        // Buscar los lugares
        const lugares = await busquedas.ciudades(termino);

        // Seleccionar el lugar
        const idLugar = await listadoInteractivoCiudades(lugares);
        if (idLugar === '0') continue;

        const lugarSeleccionado = lugares.find((l) => l.id === idLugar);

        //Guardar en DB
        busquedas.agregarAlHistorial(lugarSeleccionado.nombre);

        // Obtener datos del clima
        const clima = await busquedas.climaLugar(
          lugarSeleccionado.lat,
          lugarSeleccionado.lng
        );

        // Mostrar resultados
        console.clear();
        console.log(chalk.green('\nInformación de la ciudad\n'));
        console.log('Ciudad: ', chalk.green(lugarSeleccionado.nombre));
        console.log('Lat:', lugarSeleccionado.lat);
        console.log('Lng:', lugarSeleccionado.lng);
        console.log('Temperatura:', clima.temp);
        console.log('Min:', clima.temp_min);
        console.log('Max:', clima.temp_max);
        console.log('El clima es:', chalk.green(clima.desc));

        break;
      case 2:
        busquedas.historialCapitalizado.forEach((lugar, i) => {
          const idx = chalk.green(`${i + 1}.`);
          console.log(`${idx} ${lugar}`);
        });
        break;
    }
    if (opt !== 0) await pausa();
  } while (opt !== 0);
};

main();
