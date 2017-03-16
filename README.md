# Skeleton.ai

This is a template for chat bots, written in Javascript for Node.js.

## Features
### Input/Output
* Telegram (https://github.com/yagop/node-telegram-bot-api)
* IRC (https://github.com/martynsmith/node-irc)

### Behaviors
* Telegram/IRC two way relay

## Installation & run
1. Clone the repository
2. Run install.sh
3. Write a config.json file. You can use the [config.example.json](https://github.com/Jei/skeleton.ai/blob/master/config.example.json) as a reference.
4. Run `node main.js` (you may need to add the flag `--use-strict` depending on your node version)
5. Enjoy!

## Planned features
* Bot actions!
* Integration with [api.ai](https://api.ai/)
* Input/Output whitelist and blacklist
* Memory features
* Configuration file passed as command line argument
