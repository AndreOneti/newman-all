#!/usr/bin/env node

const { statSync, existsSync } = require('fs');
const program = require('commander');
const { resolve } = require('path');
const figlet = require('figlet');
const chalk = require('chalk');

const newmam = require('./newman');

const package = require('./package.json');

program.version(package.version);

console.log(chalk.cyan(figlet.textSync(package.name)), '\n');

program
  .command('run')
  .description('Execute one or more collection')
  .option('-c, --collection [collection]', 'Collection to run')
  .option('-e, --environment [environment]', 'Environment to run')
  .option('-p, --path [path]', 'Collections folder')
  .action(async (command) => {
    if (Object.keys(command).length <= 0) {
      program.help();
    }
    const collectionPath = command.collection && typeof command.collection === "string" && resolve(command.collection);
    const envPath = command.environment && typeof command.environment === "string" && resolve(command.environment);
    const collectionfolderPath = command.path && typeof command.path === "string" && resolve(command.path);

    let args = {};
    let error = [];

    if (envPath) {
      if (existsSync(envPath) && statSync(envPath).isFile()) {
        args.envPath = envPath;
      } else {
        error.push("Environment not found...");
      }
    }

    if (collectionPath) {
      if (existsSync(collectionPath) && statSync(collectionPath).isFile()) {
        args.collectionPath = collectionPath;
      } else {
        error.push("Collection not found...");
      }
    }

    if (collectionfolderPath) {
      if (existsSync(collectionfolderPath) && statSync(collectionfolderPath).isDirectory()) {
        args.collectionfolderPath = collectionfolderPath;
      } else {
        error.push("Collection folder not found...");
      }
    }

    if (error.length > 0) {
      console.log(error.reduce((prev, next) => prev += `${next}\n`, ''))
      process.exit(0);
    }

    await newmam(args);
  });

program.parse(process.argv);

var NO_COMMAND_SPECIFIED = program.args.length === 0;
if (NO_COMMAND_SPECIFIED) program.help();
