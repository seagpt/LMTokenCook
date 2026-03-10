export interface FSHandler {
    selectDirectory(): Promise<FileSystemDirectoryHandle | null>;
    recursiveRead(dirHandle: FileSystemDirectoryHandle, callback: (path: string, content: string) => void): Promise<void>;
    writeChunk(dirHandle: FileSystemDirectoryHandle, relativePath: string, content: string): Promise<void>;
}

export async function verifyPermission(fileHandle: FileSystemHandle, readWrite: boolean): Promise<boolean> {
    const options = { mode: readWrite ? 'readwrite' : 'read' };
    // @ts-ignore
    if ((await fileHandle.queryPermission(options)) === 'granted') {
        return true;
    }
    // @ts-ignore
    if ((await fileHandle.requestPermission(options)) === 'granted') {
        return true;
    }
    return false;
}

export async function getFilesRecursively(entry: FileSystemDirectoryHandle, path = ""): Promise<{ path: string, handle: FileSystemFileHandle }[]> {
    const files: { path: string, handle: FileSystemFileHandle }[] = [];

    // @ts-ignore - TS Definitions for FSA API are sometimes incomplete in standard lib
    for await (const [name, handle] of entry.entries()) {
        const newPath = path ? `${path}/${name}` : name;
        if (handle.kind === 'file') {
            // Filter for text files generally relevant to code/docs
            if (!name.startsWith('.') && !name.endsWith('.png') && !name.endsWith('.jpg') && !name.endsWith('.exe')) {
                files.push({ path: newPath, handle: handle as FileSystemFileHandle });
            }
        } else if (handle.kind === 'directory') {
            if (!name.startsWith('.') && name !== 'node_modules' && name !== 'dist') {
                // Explicit cast for recursion
                files.push(...await getFilesRecursively(handle as FileSystemDirectoryHandle, newPath));
            }
        }
    }
    return files;
}
