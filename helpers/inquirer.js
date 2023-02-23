import inquirer from 'inquirer';
import chalk from 'chalk';

const preguntas = [
  {
    type: 'list',
    name: 'opcion',
    message: '¿Qué desea hacer?',
    choices: [
      {
        value: 1,
        name: `${chalk.green('1.')} Buscar ciudad`,
      },
      {
        value: 2,
        name: `${chalk.green('2.')} Historial`,
      },
      {
        value: 0,
        name: `${chalk.green('0.')} Salir`,
      },
    ],
  },
];

const inquirerMenu = async () => {
  console.clear();
  console.log(chalk.green('========================='));
  console.log('  Selecciona una opcion ');
  console.log(chalk.green('=========================\n'));

  const option = inquirer.prompt(preguntas).then(({ opcion }) => {
    return opcion;
  });
  return option;
};

const pausa = async () => {
  console.log('\n');

  const enter = inquirer
    .prompt([
      {
        type: 'input',
        name: 'pause',
        message: `Presione ${chalk.green('ENTER')} para continuar`,
      },
    ])
    .then((answer) => {
      return answer;
    });
  return enter;
};

const leerInput = async (message) => {
  const quesiton = {
    type: 'input',
    name: 'desc',
    message,
    validate(value) {
      if (value.length === 0) {
        return 'Por favor ingrese un valor';
      }
      return true;
    },
  };

  const { desc } = await inquirer.prompt(quesiton).then((answer) => {
    return answer;
  });

  return desc;
};

const listadoInteractivoCiudades = async (lugares = []) => {
  const choices = lugares.map((lugar, index) => {
    const idx = chalk.green(`${index + 1}.`);
    return {
      value: lugar.id,
      name: `${idx} ${lugar.nombre}`,
    };
  });

  choices.unshift({ value: '0', name: `${chalk.green('0.')} Cancelar` });

  const preguntas = [
    {
      type: 'list',
      name: 'id',
      message: 'Seleccione lugar: ',
      choices,
    },
  ];

  const option = inquirer.prompt(preguntas).then(({ id }) => {
    return id;
  });
  return option;
};

const confirmar = async (message) => {
  const question = [{ type: 'confirm', name: 'ok', message }];
  const option = inquirer.prompt(question).then(({ ok }) => {
    return ok;
  });
  return option;
};

const mostrarListadoChecklist = async (tareas = []) => {
  const choices = tareas.map((tarea, index) => {
    const idx = chalk.green(`${index + 1}.`);
    return {
      value: tarea.id,
      name: `${idx} ${tarea.desc}`,
      checked: tarea.completadoEn ? true : false,
    };
  });

  const pregunta = [
    {
      type: 'checkbox',
      name: 'ids',
      message: 'Selecciones',
      choices,
    },
  ];

  const option = inquirer.prompt(pregunta).then(({ ids }) => {
    return ids;
  });
  return option;
};

export {
  inquirerMenu,
  pausa,
  leerInput,
  listadoInteractivoCiudades,
  confirmar,
  mostrarListadoChecklist,
};
