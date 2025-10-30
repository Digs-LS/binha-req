/**
 * Sistema de Consulta de Requerimentos
 * Ministério dos Direitos Humanos e da Cidadania
 * Script principal da aplicação
 */

class SistemaConsulta {
  constructor() {
    this.init();
  }

  /**
   * Inicialização principal da aplicação
   */
  init() {
    this.initializeGovBR();
    this.applyMasks();
    this.setupEventListeners();
    this.setupTableActions();
    this.setupPagination();
    console.log("Sistema de Consulta inicializado com sucesso!");
  }

  /**
   * Inicializa os componentes do GOV.BR Design System
   */
  initializeGovBR() {
    if (typeof core !== "undefined") {
      // Inicializa todos os componentes
      core.init();

      // Inicialização específica do header
      const brHeaders = document.querySelectorAll(".br-header");
      brHeaders.forEach((headerElement) => {
        new core.BRHeader("br-header", headerElement);
      });

      console.log("GOV.BR Design System inicializado");
    } else {
      console.error("GOV.BR Design System não encontrado");
    }
  }

  /**
   * Aplica máscaras nos campos de formulário
   */
  applyMasks() {
    // Máscara para CPF
    const cpfInput = document.getElementById("cpf");
    if (cpfInput) {
      this.applyCpfMask(cpfInput);
    }

    // Máscara para número SEI
    const seiInput = document.getElementById("numero-sei");
    if (seiInput) {
      this.applySeiMask(seiInput);
    }

    // Máscara para data (opcional)
    const dataInputs = document.querySelectorAll('input[type="date"]');
    dataInputs.forEach((input) => {
      this.setupDateInput(input);
    });
  }

  /**
   * Máscara para CPF (000.000.000-00)
   */
  applyCpfMask(input) {
    input.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "");
      if (value.length <= 11) {
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        e.target.value = value;
      }
    });

    // Validação básica no blur
    input.addEventListener("blur", (e) => {
      this.validateCpf(e.target);
    });
  }

  /**
   * Máscara para número SEI (00000.000000/0000-00)
   */
  applySeiMask(input) {
    input.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "");
      let formattedValue = "";

      if (value.length > 0) {
        formattedValue = value.substring(0, 5);
      }
      if (value.length > 5) {
        formattedValue += "." + value.substring(5, 11);
      }
      if (value.length > 11) {
        formattedValue += "/" + value.substring(11, 15);
      }
      if (value.length > 15) {
        formattedValue += "-" + value.substring(15, 17);
      }

      e.target.value = formattedValue;
    });

    // Validação no blur
    input.addEventListener("blur", (e) => {
      this.validateSei(e.target);
    });
  }

  /**
   * Configura inputs de data
   */
  setupDateInput(input) {
    // Adiciona placeholder se necessário
    if (!input.getAttribute("placeholder")) {
      input.setAttribute("placeholder", "dd/mm/aaaa");
    }
  }

  /**
   * Validação básica de CPF
   */
  validateCpf(input) {
    const value = input.value.replace(/\D/g, "");
    if (value.length > 0 && value.length !== 11) {
      this.showFieldError(input, "CPF deve ter 11 dígitos");
    } else {
      this.clearFieldError(input);
    }
  }

  /**
   * Validação básica de número SEI
   */
  validateSei(input) {
    const value = input.value.replace(/\D/g, "");
    if (value.length > 0 && value.length !== 17) {
      this.showFieldError(input, "Número SEI deve ter 17 dígitos");
    } else {
      this.clearFieldError(input);
    }
  }

  /**
   * Exibe erro em campo
   */
  showFieldError(input, message) {
    this.clearFieldError(input);

    const errorDiv = document.createElement("div");
    errorDiv.className = "br-input-error";
    errorDiv.textContent = message;
    errorDiv.style.color = "#d4665a";
    errorDiv.style.fontSize = "0.875rem";
    errorDiv.style.marginTop = "0.25rem";

    input.parentNode.appendChild(errorDiv);
    input.style.borderColor = "#d4665a";
  }

  /**
   * Remove erro do campo
   */
  clearFieldError(input) {
    const existingError = input.parentNode.querySelector(".br-input-error");
    if (existingError) {
      existingError.remove();
    }
    input.style.borderColor = "";
  }

  /**
   * Configura os event listeners da aplicação
   */
  setupEventListeners() {
    // Formulário de pesquisa
    const form = document.querySelector(".br-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleSearch();
      });
    }

    // Botão limpar
    const clearButton = document.querySelector('button[type="reset"]');
    if (clearButton) {
      clearButton.addEventListener("click", () => {
        this.clearForm();
      });
    }

    // Botão novo requerimento
    const newRequestButton = document.querySelector(".br-button.primary");
    if (
      newRequestButton &&
      newRequestButton.textContent.includes("Novo Requerimento")
    ) {
      newRequestButton.addEventListener("click", () => {
        this.newRequest();
      });
    }

    // Botões de exportação
    const exportButtons = document.querySelectorAll(
      '[aria-label="Exportar"], [aria-label="Imprimir"]'
    );
    exportButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        this.handleExport(e.target);
      });
    });
  }

  /**
   * Manipula a pesquisa de requerimentos
   */
  handleSearch() {
    const formData = this.getFormData();

    // Validações
    if (!this.validateSearch(formData)) {
      return;
    }

    this.showLoading();

    // Simula requisição AJAX
    setTimeout(() => {
      this.hideLoading();
      this.displayResults(this.mockSearchResults());
      this.showSuccess("Pesquisa realizada com sucesso!");
    }, 1500);
  }

  /**
   * Obtém dados do formulário
   */
  getFormData() {
    return {
      cpf: document.getElementById("cpf").value,
      numeroSei: document.getElementById("numero-sei").value,
      situacao: document.getElementById("situacao").value,
      dataInicio: document.getElementById("data-inicio").value,
      dataFim: document.getElementById("data-fim").value,
    };
  }

  /**
   * Valida dados da pesquisa
   */
  validateSearch(formData) {
    // Validação de datas
    if (formData.dataInicio && formData.dataFim) {
      const inicio = new Date(formData.dataInicio);
      const fim = new Date(formData.dataFim);

      if (inicio > fim) {
        this.showError("Data início não pode ser maior que data fim");
        return false;
      }
    }

    return true;
  }

  /**
   * Limpa o formulário
   */
  clearForm() {
    const form = document.querySelector(".br-form");
    if (form) {
      form.reset();
      this.clearAllFieldErrors();
      this.showSuccess("Formulário limpo com sucesso!");
    }
  }

  /**
   * Remove todos os erros dos campos
   */
  clearAllFieldErrors() {
    const inputs = document.querySelectorAll(
      ".br-input input, .br-input select"
    );
    inputs.forEach((input) => {
      this.clearFieldError(input);
    });
  }

  /**
   * Configura ações da tabela
   */
  setupTableActions() {
    // Botões de visualizar
    const viewButtons = document.querySelectorAll('[aria-label="Visualizar"]');
    viewButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const row = e.target.closest("tr");
        this.viewDetails(row);
      });
    });

    // Botões de editar
    const editButtons = document.querySelectorAll('[aria-label="Editar"]');
    editButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const row = e.target.closest("tr");
        this.editRequest(row);
      });
    });
  }

  /**
   * Visualiza detalhes do requerimento
   */
  viewDetails(row) {
    const cells = row.querySelectorAll("td");
    const data = {
      cpf: cells[0].textContent,
      numeroSei: cells[1].textContent,
      dataProtocolo: cells[2].textContent,
      relator: cells[3].textContent,
      situacao: cells[4].textContent,
    };

    this.showModal(
      "Detalhes do Requerimento",
      `
            <div class="br-list">
                <div class="br-item">
                    <strong>CPF:</strong> ${data.cpf}
                </div>
                <div class="br-item">
                    <strong>Número SEI:</strong> ${data.numeroSei}
                </div>
                <div class="br-item">
                    <strong>Data de Protocolo:</strong> ${data.dataProtocolo}
                </div>
                <div class="br-item">
                    <strong>Relator:</strong> ${data.relator}
                </div>
                <div class="br-item">
                    <strong>Situação:</strong> ${data.situacao}
                </div>
            </div>
        `
    );
  }

  /**
   * Edita requerimento
   */
  editRequest(row) {
    const numeroSei = row.querySelector("td:nth-child(2)").textContent;
    this.showSuccess(`Editando requerimento: ${numeroSei}`);
    // Aqui você redirecionaria para a tela de edição
  }

  /**
   * Novo requerimento
   */
  newRequest() {
    this.showSuccess("Abrindo formulário para novo requerimento...");
    // Aqui você redirecionaria para a tela de novo requerimento
  }

  /**
   * Configura paginação
   */
  setupPagination() {
    const paginationButtons = document.querySelectorAll(
      ".br-pagination .br-button"
    );
    paginationButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const pageText = button.textContent.trim();
        if (!isNaN(pageText)) {
          this.changePage(parseInt(pageText));
        } else if (button.querySelector(".fa-chevron-left")) {
          this.previousPage();
        } else if (button.querySelector(".fa-chevron-right")) {
          this.nextPage();
        }
      });
    });
  }

  /**
   * Muda de página
   */
  changePage(page) {
    this.showLoading();
    setTimeout(() => {
      this.hideLoading();
      this.showSuccess(`Página ${page} carregada`);
    }, 1000);
  }

  previousPage() {
    this.showSuccess("Página anterior");
  }

  nextPage() {
    this.showSuccess("Próxima página");
  }

  /**
   * Manipula exportação
   */
  handleExport(button) {
    const type = button.getAttribute("aria-label").toLowerCase();
    this.showSuccess(`Exportando dados em formato ${type}...`);

    // Simula tempo de exportação
    setTimeout(() => {
      this.showSuccess(`Dados exportados com sucesso!`);
    }, 2000);
  }

  /**
   * Exibe loading
   */
  showLoading() {
    let loading = document.querySelector(".br-loading");
    if (!loading) {
      loading = document.createElement("div");
      loading.className = "br-loading medium";
      loading.innerHTML = "Carregando...";
      document.querySelector("main").appendChild(loading);
    }
  }

  /**
   * Esconde loading
   */
  hideLoading() {
    const loading = document.querySelector(".br-loading");
    if (loading) {
      loading.remove();
    }
  }

  /**
   * Exibe mensagem de sucesso
   */
  showSuccess(message) {
    this.showNotification(message, "success");
  }

  /**
   * Exibe mensagem de erro
   */
  showError(message) {
    this.showNotification(message, "error");
  }

  /**
   * Exibe notificação
   */
  showNotification(message, type = "info") {
    // Aqui você pode implementar um sistema de notificação mais sofisticado
    console.log(`${type.toUpperCase()}: ${message}`);
    alert(message); // Temporário - substituir por sistema de notificação
  }

  /**
   * Exibe modal
   */
  showModal(title, content) {
    // Aqui você pode implementar um modal customizado
    const modalHtml = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
                <div style="background: white; padding: 2rem; border-radius: 8px; max-width: 500px; width: 90%;">
                    <h3>${title}</h3>
                    ${content}
                    <div style="margin-top: 1rem; text-align: right;">
                        <button class="br-button" onclick="this.closest('div[style]').remove()">Fechar</button>
                    </div>
                </div>
            </div>
        `;

    document.body.insertAdjacentHTML("beforeend", modalHtml);
  }

  /**
   * Dados mock para demonstração
   */
  mockSearchResults() {
    return [
      {
        cpf: "000.000.000-00",
        numeroSei: "01234.567890/2024-00",
        dataProtocolo: "01/10/2024",
        relator: "Maria Silva",
        situacao: "Deferido",
      },
      {
        cpf: "111.111.111-11",
        numeroSei: "05678.901234/2024-01",
        dataProtocolo: "15/09/2024",
        relator: "João Santos",
        situacao: "Em análise",
      },
    ];
  }

  /**
   * Exibe resultados na tabela
   */
  displayResults(results) {
    // Aqui você atualizaria a tabela com os resultados reais
    console.log("Resultados da pesquisa:", results);
    this.updateResultsCount(results.length);
  }

  /**
   * Atualiza contador de resultados
   */
  updateResultsCount(count) {
    const countElement = document.querySelector(".br-tag");
    if (countElement) {
      countElement.textContent = `${count} requerimentos encontrados`;
    }
  }
}

// Inicializa a aplicação quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
  window.sistemaConsulta = new SistemaConsulta();
});

// Export para uso em outros módulos (se necessário)
if (typeof module !== "undefined" && module.exports) {
  module.exports = SistemaConsulta;
}

const listFooter = [];
for (const brFooter of window.document.querySelectorAll(".br-footer")) {
  listFooter.push(new core.BRFooter("br-footer", brFooter));
}
document.addEventListener("DOMContentLoaded", () => {
  fetch("consulta_requerimentos.php")
    .then((response) => response.json())
    .then((data) => {
      const tbody = document.querySelector("table tbody");
      tbody.innerHTML = "";

      data.forEach((row) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td>${row.req_nome_requerente || ""}</td>
          <td>${row.req_processo_sei || ""}</td>
          <td>${row.req_data_protocolo || ""}</td>
          <td>${row.rel_nome || ""}</td>
          <td><span class="br-tag">${row.req_situacao_doenca || ""}</span></td>
          <td>
            <button class="br-button circle small" aria-label="Visualizar"><i class="fas fa-eye"></i></button>
            <button class="br-button circle small" aria-label="Editar"><i class="fas fa-edit"></i></button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch((error) => {
      console.error("Erro ao buscar dados:", error);
    });
});
