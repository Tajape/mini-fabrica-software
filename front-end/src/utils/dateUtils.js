/**
 * formatarDataBR: Converte uma string YYYY-MM-DD (ou com T) para DD/MM/YYYY
 * Evita problemas de timezone removendo a parte de hora
 */
export function formatarDataBR(dataString) {
  if (!dataString) return "--/--/----";

  // Remove a parte de hora se existir (ex: "2026-01-10T00:00:00" vira "2026-01-10")
  const data = dataString.split("T")[0];
  const [ano, mes, dia] = data.split("-");

  return `${dia}/${mes}/${ano}`;
}

/**
 * obterDataLocal: Retorna a data local atual em YYYY-MM-DD
 * Útil para preencher inputs type="date" com a data de hoje
 */
export function obterDataLocal() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}
