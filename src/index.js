import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { getConfig, setConfig, isConfigured, getBaseUrl } from './config.js';
import { listContainers, inspectContainer, createContainer, startContainer, stopContainer, removeContainer, getContainerLogs, listImages, inspectImage, pullImage, removeImage, listNetworks, inspectNetwork, createNetwork, removeNetwork, listVolumes, inspectVolume, createVolume, removeVolume, getSystemInfo, getVersion, ping } from './api.js';

const program = new Command();

program
  .name('docker-api')
  .description('CLI for Docker Engine API - manage containers, images, networks and volumes')
  .version('1.0.0');

// Config command
const config = program.command('config');
config.command('set')
  .description('Configure Docker API base URL')
  .option('--base-url <url>', 'Docker API base URL (default: http://localhost/v1.33)')
  .action((opts) => {
    if (opts.baseUrl) setConfig('baseUrl', opts.baseUrl);
    console.log(chalk.green('✓ Configuration saved'));
  });

config.command('show')
  .description('Show current configuration')
  .action(() => {
    const baseUrl = getConfig('baseUrl') || 'http://localhost/v1.33 (default)';
    console.log(chalk.bold('Current config:'));
    console.log(`  Base URL: ${chalk.green(baseUrl)}`);
    console.log(chalk.gray('  Note: Uses /var/run/docker.sock by default'));
  });

// Containers commands
const containers = program.command('containers').description('Manage containers');

containers.command('list')
  .description('List containers')
  .option('--all', 'Show all containers (default shows just running)')
  .action(async (opts) => {
    const spinner = ora('Fetching containers...').start();
    try {
      const data = await listContainers({ all: opts.all || false });
      spinner.succeed('Containers fetched');
      if (!data || data.length === 0) return console.log(chalk.yellow('No containers found'));
      data.forEach(c => {
        console.log(`${chalk.cyan(c.Id.substring(0, 12))} | ${chalk.bold(c.Names[0])} | ${c.Image} | ${c.State} | ${c.Status}`);
      });
    } catch (e) {
      spinner.fail('Failed');
      console.error(chalk.red(e.response?.data?.message || e.message));
    }
  });

containers.command('inspect <id>')
  .description('Inspect container')
  .action(async (id) => {
    const spinner = ora('Fetching container...').start();
    try {
      const data = await inspectContainer(id);
      spinner.succeed('Container details');
      console.log(JSON.stringify(data, null, 2));
    } catch (e) {
      spinner.fail('Failed');
      console.error(chalk.red(e.response?.data?.message || e.message));
    }
  });

containers.command('start <id>')
  .description('Start container')
  .action(async (id) => {
    const spinner = ora('Starting container...').start();
    try {
      await startContainer(id);
      spinner.succeed(`Container ${id} started`);
    } catch (e) {
      spinner.fail('Failed');
      console.error(chalk.red(e.response?.data?.message || e.message));
    }
  });

containers.command('stop <id>')
  .description('Stop container')
  .action(async (id) => {
    const spinner = ora('Stopping container...').start();
    try {
      await stopContainer(id);
      spinner.succeed(`Container ${id} stopped`);
    } catch (e) {
      spinner.fail('Failed');
      console.error(chalk.red(e.response?.data?.message || e.message));
    }
  });

containers.command('remove <id>')
  .description('Remove container')
  .action(async (id) => {
    const spinner = ora('Removing container...').start();
    try {
      await removeContainer(id);
      spinner.succeed(`Container ${id} removed`);
    } catch (e) {
      spinner.fail('Failed');
      console.error(chalk.red(e.response?.data?.message || e.message));
    }
  });

containers.command('logs <id>')
  .description('Get container logs')
  .option('--stdout', 'Show stdout', true)
  .option('--stderr', 'Show stderr', true)
  .action(async (id, opts) => {
    const spinner = ora('Fetching logs...').start();
    try {
      const data = await getContainerLogs(id, { stdout: opts.stdout, stderr: opts.stderr });
      spinner.succeed('Logs fetched');
      console.log(data);
    } catch (e) {
      spinner.fail('Failed');
      console.error(chalk.red(e.response?.data?.message || e.message));
    }
  });

// Images commands
const images = program.command('images').description('Manage images');

images.command('list')
  .description('List images')
  .option('--all', 'Show all images')
  .action(async (opts) => {
    const spinner = ora('Fetching images...').start();
    try {
      const data = await listImages({ all: opts.all || false });
      spinner.succeed('Images fetched');
      if (!data || data.length === 0) return console.log(chalk.yellow('No images found'));
      data.forEach(img => {
        const tag = img.RepoTags ? img.RepoTags[0] : '<none>';
        console.log(`${chalk.cyan(img.Id.substring(7, 19))} | ${chalk.bold(tag)} | ${(img.Size / 1024 / 1024).toFixed(2)} MB`);
      });
    } catch (e) {
      spinner.fail('Failed');
      console.error(chalk.red(e.response?.data?.message || e.message));
    }
  });

images.command('inspect <name>')
  .description('Inspect image')
  .action(async (name) => {
    const spinner = ora('Fetching image...').start();
    try {
      const data = await inspectImage(name);
      spinner.succeed('Image details');
      console.log(JSON.stringify(data, null, 2));
    } catch (e) {
      spinner.fail('Failed');
      console.error(chalk.red(e.response?.data?.message || e.message));
    }
  });

images.command('pull <name>')
  .description('Pull image')
  .action(async (name) => {
    const spinner = ora(`Pulling ${name}...`).start();
    try {
      await pullImage(name);
      spinner.succeed(`Image ${name} pulled`);
    } catch (e) {
      spinner.fail('Failed');
      console.error(chalk.red(e.response?.data?.message || e.message));
    }
  });

images.command('remove <name>')
  .description('Remove image')
  .action(async (name) => {
    const spinner = ora('Removing image...').start();
    try {
      await removeImage(name);
      spinner.succeed(`Image ${name} removed`);
    } catch (e) {
      spinner.fail('Failed');
      console.error(chalk.red(e.response?.data?.message || e.message));
    }
  });

// Networks commands
const networks = program.command('networks').description('Manage networks');

networks.command('list')
  .description('List networks')
  .action(async () => {
    const spinner = ora('Fetching networks...').start();
    try {
      const data = await listNetworks();
      spinner.succeed('Networks fetched');
      if (!data || data.length === 0) return console.log(chalk.yellow('No networks found'));
      data.forEach(net => {
        console.log(`${chalk.cyan(net.Id.substring(0, 12))} | ${chalk.bold(net.Name)} | ${net.Driver} | Scope: ${net.Scope}`);
      });
    } catch (e) {
      spinner.fail('Failed');
      console.error(chalk.red(e.response?.data?.message || e.message));
    }
  });

networks.command('inspect <id>')
  .description('Inspect network')
  .action(async (id) => {
    const spinner = ora('Fetching network...').start();
    try {
      const data = await inspectNetwork(id);
      spinner.succeed('Network details');
      console.log(JSON.stringify(data, null, 2));
    } catch (e) {
      spinner.fail('Failed');
      console.error(chalk.red(e.response?.data?.message || e.message));
    }
  });

networks.command('create')
  .description('Create network')
  .requiredOption('--name <name>', 'Network name')
  .option('--driver <driver>', 'Network driver (default: bridge)')
  .action(async (opts) => {
    const spinner = ora('Creating network...').start();
    try {
      const config = { Name: opts.name };
      if (opts.driver) config.Driver = opts.driver;
      const data = await createNetwork(config);
      spinner.succeed('Network created');
      console.log(chalk.green(`Network ID: ${data.Id}`));
    } catch (e) {
      spinner.fail('Failed');
      console.error(chalk.red(e.response?.data?.message || e.message));
    }
  });

networks.command('remove <id>')
  .description('Remove network')
  .action(async (id) => {
    const spinner = ora('Removing network...').start();
    try {
      await removeNetwork(id);
      spinner.succeed(`Network ${id} removed`);
    } catch (e) {
      spinner.fail('Failed');
      console.error(chalk.red(e.response?.data?.message || e.message));
    }
  });

// Volumes commands
const volumes = program.command('volumes').description('Manage volumes');

volumes.command('list')
  .description('List volumes')
  .action(async () => {
    const spinner = ora('Fetching volumes...').start();
    try {
      const data = await listVolumes();
      spinner.succeed('Volumes fetched');
      const vols = data.Volumes || [];
      if (vols.length === 0) return console.log(chalk.yellow('No volumes found'));
      vols.forEach(vol => {
        console.log(`${chalk.cyan(vol.Name)} | Driver: ${vol.Driver} | Mountpoint: ${vol.Mountpoint}`);
      });
    } catch (e) {
      spinner.fail('Failed');
      console.error(chalk.red(e.response?.data?.message || e.message));
    }
  });

volumes.command('inspect <name>')
  .description('Inspect volume')
  .action(async (name) => {
    const spinner = ora('Fetching volume...').start();
    try {
      const data = await inspectVolume(name);
      spinner.succeed('Volume details');
      console.log(JSON.stringify(data, null, 2));
    } catch (e) {
      spinner.fail('Failed');
      console.error(chalk.red(e.response?.data?.message || e.message));
    }
  });

volumes.command('create')
  .description('Create volume')
  .requiredOption('--name <name>', 'Volume name')
  .action(async (opts) => {
    const spinner = ora('Creating volume...').start();
    try {
      const data = await createVolume({ Name: opts.name });
      spinner.succeed('Volume created');
      console.log(chalk.green(`Volume: ${data.Name}`));
    } catch (e) {
      spinner.fail('Failed');
      console.error(chalk.red(e.response?.data?.message || e.message));
    }
  });

volumes.command('remove <name>')
  .description('Remove volume')
  .action(async (name) => {
    const spinner = ora('Removing volume...').start();
    try {
      await removeVolume(name);
      spinner.succeed(`Volume ${name} removed`);
    } catch (e) {
      spinner.fail('Failed');
      console.error(chalk.red(e.response?.data?.message || e.message));
    }
  });

// System commands
program.command('info')
  .description('Get system information')
  .action(async () => {
    const spinner = ora('Fetching system info...').start();
    try {
      const data = await getSystemInfo();
      spinner.succeed('System info');
      console.log(JSON.stringify(data, null, 2));
    } catch (e) {
      spinner.fail('Failed');
      console.error(chalk.red(e.response?.data?.message || e.message));
    }
  });

program.command('version')
  .description('Get Docker version')
  .action(async () => {
    const spinner = ora('Fetching version...').start();
    try {
      const data = await getVersion();
      spinner.succeed('Docker version');
      console.log(JSON.stringify(data, null, 2));
    } catch (e) {
      spinner.fail('Failed');
      console.error(chalk.red(e.response?.data?.message || e.message));
    }
  });

program.command('ping')
  .description('Ping Docker daemon')
  .action(async () => {
    const spinner = ora('Pinging...').start();
    try {
      await ping();
      spinner.succeed('Docker daemon is running');
    } catch (e) {
      spinner.fail('Failed');
      console.error(chalk.red(e.response?.data?.message || e.message));
    }
  });

program.parse(process.argv);
