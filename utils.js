import {fileUrlToPath} from 'url';
import { dirname } from 'path';
const __filename = fileUrlToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;