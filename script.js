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

 // Função para gerar recomendação baseada nas respostas e aplicar o AHP
async function generateRecommendation() {
  const recommendationContainer = document.getElementById('recommendation-container');
  // GAMBIARRA:
  const budget = parseInt(answers.budget[0].split(' ')[2]);

  // Carregar componentes do JSON
  const components = await loadComponents();

  // Filtrar componentes com base no orçamento do usuário
  const filteredProcessors = components.processors.filter(c => c.price <= budget);
  const filteredGPUs = components.gpus.filter(c => c.price <= budget);
  const filteredRAM = components.ram.filter(c => c.price <= budget);
  const filteredStorage = components.storage.filter(c => c.price <= budget);
  const filteredMotherboards = components.motherboards.filter(c => c.price <= budget);
  const filteredPowerSupplies = components.powerSupplies.filter(c => c.price <= budget);
  
  // Critérios de peso para o AHP
  const criteriaWeights = { price: 0.5, weight: 0.5 };

  // Calcular o melhor processador e GPU usando AHP
  const bestProcessor = ahpCalculate(filteredProcessors, criteriaWeights)[0];
  const bestGPU = ahpCalculate(filteredGPUs, criteriaWeights)[0];
  const bestRAM = ahpCalculate(filteredRAM, criteriaWeights)[0];
  const bestStorage = ahpCalculate(filteredStorage, criteriaWeights)[0];
  const bestMotherboard = ahpCalculate(filteredMotherboards, criteriaWeights)[0];
  const bestPowerSupply = ahpCalculate(filteredPowerSupplies, criteriaWeights)[0];

  console.log(bestProcessor);

  // Exibir a recomendação com o link de compra
  let recommendation = `
    <h2>Sua Configuração Recomendada:</h2>
    <p><strong>Processador:</strong> ${bestProcessor.name} (R$${1 / bestProcessor.priceScore}) (<a href="${bestProcessor.purchase_link}" target="_blank">Comprar</a>)</p>
    <p><strong>Placa de Vídeo:</strong> ${bestGPU.name} (R$${1 / bestGPU.priceScore}) (<a href="${bestGPU.purchase_link}" target="_blank">Comprar</a>)</p>
    <p><strong>Memória RAM:</strong> ${bestRAM.name} (R$${1 / bestRAM.priceScore}) (<a href="${bestRAM.purchase_link}" target="_blank">Comprar</a>)</p>
    <p><strong>Armazenamento:</strong> ${bestStorage.name} (R$${1 / bestStorage.priceScore}) (<a href="${bestStorage.purchase_link}" target="_blank">Comprar</a>)</p>
    <p><strong>Placa-mãe:</strong> ${bestMotherboard.name} (R$${1 / bestMotherboard.priceScore}) (<a href="${bestMotherboard.purchase_link}" target="_blank">Comprar</a>)</p>
    <p><strong>Fonte de Alimentação:</strong> ${bestPowerSupply.name} (R$${1 / bestPowerSupply.priceScore}) (<a href="${bestPowerSupply.purchase_link}" target="_blank">Comprar</a>)</p>
  `;

  recommendationContainer.innerHTML = recommendation;
}

// Carregar o arquivo JSON de componentes
async function loadComponents() {
  const response = await fetch('components.json'); // Certifique-se de que o caminho do arquivo está correto
  const data = await response.json(); // Converter para objeto
  return data.components; // Retorna apenas a parte relevante dos componentes
}

async function loadComponents() {
  const response = await fetch('components.json');
  
  if (!response.ok) {
    console.error('Erro ao carregar o JSON:', response.statusText);
    return [];
  }

  const data = await response.json();
  console.log(data); // Adicione isso para ver o conteúdo no console
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
