export async function fetchAddress(cep) {
  const cepProcessed = cep.replace('-', '');

  if (!/^\d{8}$/.test(cepProcessed)) throw new Error('invalid cep format');

  const res = await fetch(`https://viacep.com.br/ws/${cepProcessed}/json/`);
  const data = await res.json();

  if (data.erro) throw new Error('cep not found');

  const newData = {
    street: data.logradouro,
    district: data.bairro,
    city: data.localidade,
    state: data.uf,
  };

  return newData;
}
