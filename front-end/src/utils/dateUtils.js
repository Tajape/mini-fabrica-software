/**
 * Converte uma string de data (YYYY-MM-DD) para formato BR (DD/MM/YYYY)
 * Evita o problema de timezone interpretando como UTC
 */
export function formatarDataBR(dataString) {
  if (!dataString) return '--/--/----';
  
  // Remove a parte de hora se existir (ex: "2026-01-10T00:00:00")
  const data = dataString.split('T')[0]; // "2026-01-10"
  const [ano, mes, dia] = data.split('-');
  
  return `${dia}/${mes}/${ano}`;
}

/**
 * Obtém a data local atual no formato YYYY-MM-DD
 * Sem converter para UTC
 */
export function obterDataLocal() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}
