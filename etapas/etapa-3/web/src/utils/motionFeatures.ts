// Arquivo só para o `import()` do LazyMotion ter o que carregar em separado.
// `domMax` porque o app usa `drag` e `layout`, que não existem no `domAnimation`.
import { domMax } from 'motion/react';

export default domMax;
