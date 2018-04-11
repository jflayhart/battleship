const logger = {
    info: (msg) => console.log(`%c${msg}`, 'color: blue'),
    success: (msg) => console.log(`%c${msg}`, 'color: green'),
    warn: (msg) => console.log(`%c${msg}`, 'color: orange'),
    danger: (msg) => console.log(`%c${msg}`, 'color: red'),
}
