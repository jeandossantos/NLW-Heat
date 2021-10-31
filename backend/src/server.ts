import { serverHttp } from './app';

serverHttp.listen(3001, () => console.log(`Backend running on PORT 3001...`));