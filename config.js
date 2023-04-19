export default  {
    HOST: process.env.PTHOST || "127.0.0.1",
    USER: process.env.PTUSER ||'root',
    PASSWORD: process.env.PTPASSWORD || '',
    DB: process.env.PTDB || '1PTCO'
}