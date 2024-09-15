// Definir perguntas e opções dinâmicas
const questions = [
    { 
      question: "Qual o seu orçamento para o computador?", 
      key: "budget",
      options: ["Até R$ 2000", "Até R$ 2500", "Até R$ 3000", "Até R$ 4000", "Acima de R$ 5000"]
    },
    { 
      question: "Quais são os objetivos de uso do computador?", 
      key: "purpose",
      options: ["Jogo", "Trabalho", "Uso geral"],
      multiple: true // Agora é possível selecionar múltiplas opções
    }
  ];
  
  // Perguntas dinâmicas baseadas em respostas
  const followUpQuestions = {
    jogo: {
      question: "Quais jogos você planeja jogar?",
      key: "games",
      options: ["CS2", "Fortnite", "League of Legends", "Call of Duty", "GTA V", "Outros"],
      multiple: true // Permite múltipla seleção
    },
    trabalho: {
      question: "Quais ferramentas/programas você pretende usar?",
      key: "tools",
      options: ["Pacote Office", "Adobe Premiere ou algum outro editor de video", "AutoCAD", "Photoshop", "Ferramentas de Desenvolvimento", "Outros"],
      multiple: true // Permite múltipla seleção
    }
  };
  
  // Função para buscar os dados do JSON
  async function fetchComponents() {
    const response = await fetch('components.json'); // Carregar o arquivo JSON
    const data = await response.json(); // Converter para objeto
    return data.components; // Retorna apenas a parte relevante dos componentes
  }
  
  // Função para gerar a recomendação com base nas respostas e no JSON
  async function generateRecommendation() {
    const recommendationContainer = document.getElementById('recommendation-container');
    const { budget } = answers;
  
    // Carregar os componentes do JSON
    const components = await fetchComponents();
  
    // Baseado no orçamento, selecionar a configuração (simples para este exemplo)
    let config;
    if (budget[0] === "Até R$ 2000") {
      config = {
        processor: components.processors[0],
        gpu: components.gpus[0],
        ram: components.ram[0],
        storage: components.storage[0],
        powerSupply: components.powerSupplies[0],
        motherboard: components.motherboards[0]
      };
    } else if (budget[0] === "Até R$ 2500") {
      config = {
        processor: components.processors[0],
        gpu: components.gpus[0],
        ram: components.ram[1],
        storage: components.storage[0],
        powerSupply: components.powerSupplies[0],
        motherboard: components.motherboards[0]
      };
    } else if (budget[0] === "Até R$ 3000") {
      config = {
        processor: components.processors[1],
        gpu: components.gpus[1],
        ram: components.ram[0],
        storage: components.storage[0],
        powerSupply: components.powerSupplies[0],
        motherboard: components.motherboards[1]
      };
    } else if (budget[0] === "Até R$ 4000") {
      config = {
        processor: components.processors[1],
        gpu: components.gpus[1],
        ram: components.ram[1],
        storage: components.storage[0],
        powerSupply: components.powerSupplies[0],
        motherboard: components.motherboards[1]
      };
    } else {
      config = {
        processor: components.processors[2],
        gpu: components.gpus[2],
        ram: components.ram[2],
        storage: components.storage[1],
        powerSupply: components.powerSupplies[1],
        motherboard: components.motherboards[1]
      };
    }
  
    // Exibir a configuração completa do computador
    let recommendation = `
      <h2>Sua Configuração Recomendada:</h2>
      <p><strong>Processador:</strong> ${config.processor.name} - Preço: R$${config.processor.price}</p>
      <p><strong>Placa de Vídeo:</strong> ${config.gpu.name} - Preço: R$${config.gpu.price}</p>
      <p><strong>Memória RAM:</strong> ${config.ram.name} - Preço: R$${config.ram.price}</p>
      <p><strong>Armazenamento:</strong> ${config.storage.name} - Preço: R$${config.storage.price}</p>
      <p><strong>Fonte de Alimentação:</strong> ${config.powerSupply.name} - Preço: R$${config.powerSupply.price}</p>
      <p><strong>Placa-mãe:</strong> ${config.motherboard.name} - Preço: R$${config.motherboard.price}</p>
    `;
  
    recommendationContainer.innerHTML = recommendation;
  }
  
  
  // Exemplo de configuração baseada nas escolhas
  const configurations = {
    "Até R$ 2000": {
      processor: "Ryzen 5600GT",
      gpu: "Vega integrada do processador",
      ram: "8GB DDR4",
      storage: "SSD 240GB",
      powerSupply: "Fonte 500W",
      motherboard: "B450M"
    },
    "Até R$ 2500": {
      processor: "Ryzen 5600GT",
      gpu: "Vega integrada do processador",
      ram: "16GB DDR4",
      storage: "SSD 1TB",
      powerSupply: "Fonte 500W",
      motherboard: "B450M"
    },
    "Até R$ 3000": {
      processor: "Intel Core i3 10100F",
      gpu: "GTX 1650",
      ram: "8GB DDR4",
      storage: "SSD 240GB",
      powerSupply: "Fonte 500W",
      motherboard: "H410M"
    },
    "Até R$ 4000": {
      processor: "Intel Core i5 10400F",
      gpu: "RTX 2060",
      ram: "16GB DDR4",
      storage: "SSD 480GB",
      powerSupply: "Fonte 600W",
      motherboard: "B460M"
    },
    "Acima de R$ 5000": {
      processor: "AMD Ryzen 7 5800X",
      gpu: "RTX 3070",
      ram: "32GB DDR4",
      storage: "SSD 1TB NVMe",
      powerSupply: "Fonte 750W",
      motherboard: "X570"
    }
  };
  
  let currentQuestionIndex = 0;
  let answers = {};
  
  // Mostrar a primeira pergunta
  document.addEventListener("DOMContentLoaded", () => {
    showQuestion();
    document.getElementById('next-button').addEventListener('click', handleNext);
  });
  
  // Mostrar a pergunta atual e suas opções
  function showQuestion() {
    const questionContainer = document.getElementById('questions');
    const currentQuestion = questions[currentQuestionIndex];
  
    let questionHTML = `<p class="question">${currentQuestion.question}</p>`;
  
    // Criar opções de resposta, permitindo múltiplas seleções se aplicável
    currentQuestion.options.forEach(option => {
      questionHTML += `
        <div>
          <input type="${currentQuestion.multiple ? 'checkbox' : 'radio'}" name="answer" id="${option}" value="${option}">
          <label for="${option}">${option}</label>
        </div>
      `;
    });
  
    questionContainer.innerHTML = questionHTML;
  }
  
  // Coletar respostas e avançar para a próxima pergunta
  function handleNext() {
    const currentQuestion = questions[currentQuestionIndex];
    let selectedOptions = [];
  
    // Coletar as opções selecionadas
    if (currentQuestion.multiple) {
      document.querySelectorAll('input[name="answer"]:checked').forEach(input => {
        selectedOptions.push(input.value);
      });
    } else {
      const selectedOption = document.querySelector('input[name="answer"]:checked');
      if (selectedOption) {
        selectedOptions.push(selectedOption.value);
      }
    }
  
    if (selectedOptions.length > 0) {
      // Guardar as respostas
      answers[currentQuestion.key] = selectedOptions;
  
      // Verificar se precisamos fazer perguntas específicas para o objetivo escolhido
      if (currentQuestion.key === "purpose") {
        if (selectedOptions.includes("Jogo")) {
          addFollowUpQuestion("jogo");
        }
        if (selectedOptions.includes("Trabalho")) {
          addFollowUpQuestion("trabalho");
        }
      }
  
      currentQuestionIndex++;
      if (currentQuestionIndex < questions.length) {
        showQuestion();
      } else {
        generateRecommendation();
      }
    } else {
      alert("Por favor, selecione uma opção.");
    }
  }
  
  // Adicionar uma pergunta de acompanhamento (seguinte à escolha anterior)
  function addFollowUpQuestion(type) {
    const followUp = followUpQuestions[type];
    questions.splice(currentQuestionIndex + 1, 0, followUp); // Adiciona a pergunta dinâmica ao array
  }
  
  // Gerar recomendação baseada nas respostas
  function generateRecommendation() {
    const recommendationContainer = document.getElementById('recommendation-container');
    const { budget } = answers;
  
    // Exibir a configuração completa do computador
    const config = configurations[budget[0]]; // Baseado no orçamento
  
    let recommendation = `
      <h2>Sua Configuração Recomendada:</h2>
      <p><strong>Processador:</strong> ${config.processor}</p>
      <p><strong>Placa de Vídeo:</strong> ${config.gpu}</p>
      <p><strong>Memória RAM:</strong> ${config.ram}</p>
      <p><strong>Armazenamento:</strong> ${config.storage}</p>
      <p><strong>Fonte de Alimentação:</strong> ${config.powerSupply}</p>
      <p><strong>Placa-mãe:</strong> ${config.motherboard}</p>
    `;
  
    recommendationContainer.innerHTML = recommendation;
  }
  
  