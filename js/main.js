// Load Language JSON
const langFiles = {
    en: './assets/lang/en.json',
    fr: './assets/lang/fr.json',
  };
  
  let currentLang = 'en';
  
  function setLanguage(lang) {
    fetch(langFiles[lang])
      .then((response) => response.json())
      .then((data) => {
        document.querySelectorAll('[data-translate]').forEach((element) => {
          const key = element.getAttribute('data-translate');
          element.textContent = data[key];
        });
      });
  }
  
  document.getElementById('lang-en').addEventListener('click', () => {
    currentLang = 'en';
    setLanguage('en');
  });
  document.getElementById('lang-fr').addEventListener('click', () => {
    currentLang = 'fr';
    setLanguage('fr');
  });
  
  // Roadmap Data
  const roadmapData = [
    { year: '2023', title: 'Fulltime Developer at EmyeHR', description: 'Built multi-agent chatbot, supervised interns, and more.' },
    { year: '2022', title: 'Part-time Developer at Westic', description: 'Contributed to web platforms and mobile apps.' },
    // Add more milestones
  ];
  
  function createRoadmap() {
    const roadmap = document.getElementById('roadmap');
    roadmap.innerHTML = roadmapData
      .map(
        (item, index) => `
        <div class="absolute left-${index * 10} top-${index * 20}">
          <div class="p-4 bg-white rounded shadow">${item.year}<br>${item.title}</div>
        </div>
      `
      )
      .join('');
  }
  
  createRoadmap();
  
  // Word Map
  const skills = ['JavaScript', 'Node.js', 'Angular', 'PostgreSQL', 'Git', 'React'];
  wordcloud2(document.getElementById('wordMap'), { list: skills.map((skill) => [skill, Math.random() * 10]) });
  