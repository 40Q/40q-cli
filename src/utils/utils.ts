import * as fs from 'fs';

export function writeFile(filePath: string, content: string, overwrite = false) {
    const yellow = "\x1b[33m";
    const green = "\x1b[32m";
    const cyan = "\x1b[36m";
    const reset = "\x1b[0m";
    
    if (fs.existsSync(filePath) && !overwrite) {
        console.log(`${yellow}File ${filePath} already exists. Skipping file creation.${reset}`);
    } else if(fs.existsSync(filePath) && overwrite) {
        fs.writeFileSync(filePath, content);
        console.log(`${cyan}File ${filePath} has been overwritten.${reset}`);
    } else {
        fs.writeFileSync(filePath, content);
        console.log(`${green}File ${filePath} has been created.${reset}`);
    }
}

export function toCamelCase(name: string) {
    return name
        .split('-')
        .map((word, index) => {
            if (index === 0) {
                return word.charAt(0).toLowerCase() + word.slice(1);
            }
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join('');
}

export function toPascalCase(name: string) {
    return name
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
}
