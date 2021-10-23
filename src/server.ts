import { serverHttp } from './app';

serverHttp.listen(4000, () => {
  console.log(`Servidor Rodando em: http://localhost:4000`);
});
