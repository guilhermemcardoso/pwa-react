export function getPageTitleByRoute(path: string) {
  switch (path) {
    case "/main/materials":
      return "Materiais";
    case "/main/orders":
      return "Pedidos";
    case "/main/products":
      return "Produtos";
    case "/main/unities":
      return "Unidades de Medida";
    default:
      return "Painel Geral";
  }
}
