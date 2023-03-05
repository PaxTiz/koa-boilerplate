import { readdir } from "fs/promises";
import { join } from "path";

(async () => {
  const commandName = process.argv.slice(2, 3)[0];
  if (!commandName) {
    const commands: Array<{ name: string; description: string }> = [];

    const commandsDir = await readdir(join(__dirname, "commands"));
    for (const commandName of commandsDir) {
      const command = await import(join(__dirname, "commands", commandName));
      commands.push(command.default);
    }

    return console.table(commands, ["name", "description"]);
  }

  try {
    const command = await import(join(__dirname, "commands", commandName));
    await command.default.execute(process.argv.slice(3));
  } catch (error) {
    console.error("Error: command not found: " + commandName);
    console.error(error);
    process.exit(1);
  }
})();
