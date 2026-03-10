// File System Access API Helpers

export async function verifyPermission(fileHandle: any, readWrite: boolean) {
  const options = { mode: readWrite ? 'readwrite' : 'read' };
  
  if (await fileHandle.queryPermission(options) === 'granted') {
    return true;
  }
  
  if (await fileHandle.requestPermission(options) === 'granted') {
    return true;
  }
  
  return false;
}

export async function getFilesRecursively(dirHandle: any, path = ''): Promise<{path: string, handle: any}[]> {
  const files = [];

  for await (const entry of dirHandle.values()) {
    // Skip common ignored directories
    if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === '.env') continue;
    
    // Skip binary files and archives by extension
    if (entry.name.match(/\.(png|jpg|jpeg|gif|zip|rar|tar|gz|exe|bin|dll|so|dylib|pyc|class)$/i)) continue;

    if (entry.kind === 'file') {
      files.push({ path: path + entry.name, handle: entry });
    } else if (entry.kind === 'directory') {
      const subFiles = await getFilesRecursively(entry, path + entry.name + '/');
      files.push(...subFiles);
    }
  }

  return files;
}
