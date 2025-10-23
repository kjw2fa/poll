export const toGlobalId = (type: string, id: number | string) => Buffer.from(`${type}:${id}`).toString('base64');

export const fromGlobalId = (globalId: string) => {
    const decoded = Buffer.from(globalId, 'base64').toString('ascii');
    const [type, id] = decoded.split(':');
    return { type, id };
};

export const toCursor = (id: number) => Buffer.from(String(id)).toString('base64');

export const JWT_SECRET = 'your-secret-key';
