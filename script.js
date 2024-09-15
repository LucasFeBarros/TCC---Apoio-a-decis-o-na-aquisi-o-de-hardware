// Definir perguntas e opções dinâmicas
const questions = [
  { 
    question: "Qual o seu orçamento para o computador?", 
    key: "budget",
    options: ["Até R$ 2000", "Até R$ 2500", "Até R$ 3000", "Até R$ 4000", "Acima de R$ 5000"]
  },
  { 
    question: "Qual o objetivo principal do computador?", 
    key: "purpose",
    options: ["Jogo", "Trabalho", "Uso geral"]
  }
];

// Perguntas dinâmicas baseadas em respostas
const followUpQuestions = {
  jogo: {
    question: "Quais jogos você planeja jogar?",
    key: "games",
    options: ["Fortnite", "League of Legends", "Call of Duty", "GTA V", "CS2", "Outros"]
  },
  trabalho: {
    question: "Quais ferramentas/programas você pretende usar?",
    key: "tools",
    options: ["Pacote Office", "Adobe Premiere", "AutoCAD", "Ferramentas de Desenvolvimento", "Outros"]
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

  currentQuestion.options.forEach(option => {
    questionHTML += `
      <div>
        <input type="radio" name="answer" id="${option}" value="${option}">
        <label for="${option}">${option}</label>
      </div>
    `;
  });

  questionContainer.innerHTML = questionHTML;
}

// Avançar para a próxima pergunta ou mostrar recomendação
function handleNext() {
  const selectedOption = document.querySelector('input[name="answer"]:checked');

  if (selectedOption) {
    // Guardar a resposta
    const currentQuestion = questions[currentQuestionIndex];
    answers[currentQuestion.key] = selectedOption.value;

    // Verificar se precisamos fazer perguntas específicas para o objetivo escolhido
    if (currentQuestion.key === "purpose") {
      if (selectedOption.value === "Jogo") {
        addFollowUpQuestion("jogo");
      } else if (selectedOption.value === "Trabalho") {
        addFollowUpQuestion("trabalho");
      } else {
        currentQuestionIndex++;
        showQuestion();
      }
    } else {
      currentQuestionIndex++;
      if (currentQuestionIndex < questions.length) {
        showQuestion();
      } else {
        generateRecommendation();
      }
    }
  } else {
    alert("Por favor, selecione uma opção.");
  }
}

// Adicionar uma pergunta de acompanhamento (seguinte à escolha anterior)
function addFollowUpQuestion(type) {
  const followUp = followUpQuestions[type];
  questions.splice(currentQuestionIndex + 1, 0, followUp); // Adiciona a pergunta dinâmica ao array
  currentQuestionIndex++;
  showQuestion();
}

// Gerar recomendação baseada nas respostas
function generateRecommendation() {
  const recommendationContainer = document.getElementById('recommendation-container');
  const { budget, purpose, games, tools } = answers;

  let recommendation = `Com um orçamento de ${budget}, recomendamos o seguinte: `;

  if (purpose === "Jogo") {
    recommendation += `Como você escolheu jogos como ${games}, sugerimos uma placa de vídeo de alta performance, como a Nvidia RTX 3060, e um processador AMD Ryzen ou Intel i7.`;
  } else if (purpose === "Trabalho") {
    recommendation += `Para ferramentas como ${tools}, sugerimos um processador multi-core (como o Intel i5 ou superior) e pelo menos 16GB de RAM.`;
  } else {
    recommendation += `Para uso geral, recomendamos um setup equilibrado, com um processador Intel i5 ou AMD Ryzen 5, e 8GB de RAM.`;
  }

  recommendationContainer.innerHTML = `<p>${recommendation}</p>`;
}
