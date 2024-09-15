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
      generateRecommendation(); // Chama a função de recomendação dinâmica ao final
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




// codigo 2 ------------------------------------------------------------------------


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
      generateRecommendation(); // Chama a função de recomendação dinâmica ao final
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

// Função para buscar os dados do JSON
async function fetchComponents() {
  const response = await fetch('components.json'); // Carregar o arquivo JSON
  const data = await response.json(); // Converter para objeto
  return data.components; // Retorna apenas a parte relevante dos componentes
}

// // Função para gerar a recomendação com base nas respostas e no JSON
// async function generateRecommendation() {
//   const recommendationContainer = document.getElementById('recommendation-container');
//   const { budget } = answers;

// Função para gerar recomendação baseada nas respostas e aplicar o AHP
async function generateRecommendation() {
  const recommendationContainer = document.getElementById('recommendation-container');
  const { budget } = answers;

  // Carregar componentes do JSON
  const components = await loadComponents();

  // Filtrar componentes com base no orçamento do usuário
  const filteredProcessors = components.processors.filter(c => c.price <= parseInt(budget[0].replace('R$', '').replace('.', '')));
  const filteredGPUs = components.gpus.filter(c => c.price <= parseInt(budget[0].replace('R$', '').replace('.', '')));
  const filteredRAM = components.ram.filter(c => c.price <= parseInt(budget[0].replace('R$', '').replace('.', '')));
  const filteredStorage = components.storage.filter(c => c.price <= parseInt(budget[0].replace('R$', '').replace('.', '')));
  const filteredMotherboards = components.motherboards.filter(c => c.price <= parseInt(budget[0].replace('R$', '').replace('.', '')));
  const filteredPowerSupplies = components.powerSupplies.filter(c => c.price <= parseInt(budget[0].replace('R$', '').replace('.', '')));
  
  // Critérios de peso para o AHP
  const criteriaWeights = { price: 0.5, weight: 0.5 };

  // Calcular o melhor processador e GPU usando AHP
  const bestProcessor = ahpCalculate(filteredProcessors, criteriaWeights)[0];
  const bestGPU = ahpCalculate(filteredGPUs, criteriaWeights)[0];
  const bestRAM = ahpCalculate(filteredRAM, criteriaWeights)[0];
  const bestStorage = ahpCalculate(filteredStorage , criteriaWeights)[0];
  const bestMotherboards = ahpCalculate(filteredMotherboards, criteriaWeights)[0];
  const bestPowerSupplies = ahpCalculate(filteredPowerSupplies, criteriaWeights)[0];


  // Exibir a recomendação com o link de compra
  let recommendation = `
    <h2>Sua Configuração Recomendada:</h2>
    <p><strong>Processador:</strong> ${bestProcessor.name} (<a href="${bestProcessor.purchase_link}" target="_blank">Comprar</a>)</p>
    <p><strong>Placa de Vídeo:</strong> ${bestGPU.name} (<a href="${bestGPU.purchase_link}" target="_blank">Comprar</a>)</p>
    <p><strong>Memoria Ram:</strong> ${bestRAM.name} (<a href="${bestRAM.purchase_link}" target="_blank">Comprar</a>)</p>
    <p><strong>Placa de Vídeo:</strong> ${bestStorage.name} (<a href="${bestStorage.purchase_link}" target="_blank">Comprar</a>)</p>
    <p><strong>Processador:</strong> ${bestMotherboards.name} (<a href="${bestMotherboards.purchase_link}" target="_blank">Comprar</a>)</p>
    <p><strong>Placa de Vídeo:</strong> ${bestPowerSupplies.name} (<a href="${bestPowerSupplies.purchase_link}" target="_blank">Comprar</a>)</p>
  `;

  recommendationContainer.innerHTML = recommendation;
}


  // Carregar os componentes do JSON
  const components = await fetchComponents();

  // Carregar o arquivo JSON de componentes
async function loadComponents() {
  const response = await fetch('components.json'); // Certifique-se de que o caminho do arquivo está correto
  const data = await response.json();
  return data.components;
}

// Função AHP para calcular a melhor configuração
function ahpCalculate(components, criteriaWeights) {
  const comparisons = components.map(component => {
    return {
      name: component.name,
      priceScore: 1 / component.price, // Menor preço é melhor
      weightScore: component.weight // Maior custo-benefício é melhor
    };
  });

  // Normalizar os valores
  const totalPriceScore = comparisons.reduce((sum, component) => sum + component.priceScore, 0);
  const totalWeightScore = comparisons.reduce((sum, component) => sum + component.weightScore, 0);

  comparisons.forEach(component => {
    component.priceWeight = component.priceScore / totalPriceScore;
    component.weightWeight = component.weightScore / totalWeightScore;
  });

  // Combinar os pesos de cada critério com os pesos dos componentes
  const finalScores = comparisons.map(component => {
    return {
      name: component.name,
      finalScore: (component.priceWeight * criteriaWeights.price) +
                  (component.weightWeight * criteriaWeights.weight)
    };
  });

  // Ordenar pela melhor pontuação final
  finalScores.sort((a, b) => b.finalScore - a.finalScore);

  return finalScores;
}


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
