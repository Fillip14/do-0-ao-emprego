## 1. e 2.
curl -i https://example.com <-- Chamada

HTTP/2 200 <-- Linha inicial
date: Mon, 20 Jul 2026 23:30:06 GMT
content-type: text/html <-- Headers
server: cloudflare
last-modified: Thu, 16 Jul 2026 20:05:48 GMT
allow: GET, HEAD
accept-ranges: bytes
age: 13487
cf-cache-status: HIT
cf-ray: a1e5c0788dc7f1fb-GRU 


<-- body
Doctype complete commitado
<!-- <!doctype html><html lang="en"><head><title>Example Domain</title><link rel="icon" href="data:,"><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{background:#eee;width:60vw;margin:15vh auto;font-family:system-ui,sans-serif}h1{font-size:1.5em}div{opacity:0.8}a:link,a:visited{color:#348}</style></head><body><div><h1>Example Domain</h1><p>This domain is for use in documentation examples without needing permission. Avoid use in operations.</p><p><a href="https://iana.org/domains/example">Learn more</a></p></div></body></html> -->

## 3.
- O -I manda um método diferente: HEAD ao inves de GET, e assim retorna só os headers que mandaria num GET

## 4. 
- Familia 1xx: informativo (websocket - 101)
- Familia 2xx: deu certo:
    - 200 - OK
    - 201 - Created
    - 204 - No Content
- Familia 3xx: está em outro lugar/redirecionamento 
    - 301 - permanente, o navegador memoriza;
    - 302/307 - temporário
- Familia 4xx: você errou 
    - 400 - Bad Request (entrada inválida)
    - 401 - Unauthorized (autenticação faltando ou inválida)
    - 403 - Forbidden (sabe quem é mas não autorizado) 
    - 404 - Not found (não existe)
    - 405 - Method Not Allowed (rota existe, o verbo (HTTP) não serve nela)
    - 409 - Conflict (email ja cadastrado, bate com estado atual)
    - 422 - Unprocessable Entity (JSON válido, campo ok, regra de negócio violada)
    - 429 - Too Many Requests 
- Familia 5xx: culpa do servidor
    - 500 - genérico
    - 502/503/504 - normalmente do proxy na frente e não do Node.

## 5.
- GET - ler algo
- POST - criar (tem corpo)
- PUT - substitui o recurso inteiro (tem corpo)
- PATCH - altera parte do recurso (tem corpo)
- DELETE - remover
- HEAD - o GET sem corpo
- OPTIONS - opções na rota