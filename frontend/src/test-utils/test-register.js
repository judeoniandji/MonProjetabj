/**
 * Utilitaire pour tester manuellement le formulaire d'inscription
 * 
 * Pour utiliser cet utilitaire, ouvrez la console du navigateur sur la page d'inscription
 * et copiez-collez le contenu de ce fichier.
 */

// Configuration
const TEST_CONFIG = {
  // Données de test pour un utilisateur étudiant
  studentUser: {
    name: 'Étudiant Test',
    email: `etudiant${Date.now()}@test.com`,
    password: 'Password123!',
    user_type: 'student'
  },
  
  // Données de test pour une entreprise
  companyUser: {
    name: 'Recruteur Test',
    email: `entreprise${Date.now()}@test.com`,
    password: 'Password123!',
    user_type: 'company',
    companyName: 'Entreprise Test SAS'
  },
  
  // Délai entre les actions (en ms)
  delay: 500
};

// Fonction pour attendre un certain temps
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fonction pour remplir un champ de formulaire
const fillField = async (selector, value) => {
  const field = document.querySelector(selector);
  if (field) {
    field.focus();
    field.value = value;
    field.dispatchEvent(new Event('change', { bubbles: true }));
    console.log(`✅ Champ '${selector}' rempli avec '${value}'`);
    await wait(TEST_CONFIG.delay);
  } else {
    console.error(`❌ Champ '${selector}' non trouvé`);
  }
};

// Fonction pour cliquer sur un élément
const clickElement = async (selector) => {
  const element = document.querySelector(selector);
  if (element) {
    element.click();
    console.log(`✅ Clic sur '${selector}'`);
    await wait(TEST_CONFIG.delay);
  } else {
    console.error(`❌ Élément '${selector}' non trouvé`);
  }
};

// Fonction pour tester l'inscription d'un étudiant
const testStudentRegistration = async () => {
  console.log('🔍 Test d\'inscription étudiant...');
  
  // Remplir le formulaire
  await fillField('input[name="name"]', TEST_CONFIG.studentUser.name);
  await fillField('input[name="email"]', TEST_CONFIG.studentUser.email);
  await fillField('input[name="password"]', TEST_CONFIG.studentUser.password);
  await fillField('input[name="confirmPassword"]', TEST_CONFIG.studentUser.password);
  
  // Sélectionner le type d'utilisateur
  await clickElement('input[value="student"]');
  
  // Soumettre le formulaire
  await clickElement('button[type="submit"]');
  
  console.log('✅ Test d\'inscription étudiant terminé');
};

// Fonction pour tester l'inscription d'une entreprise
const testCompanyRegistration = async () => {
  console.log('🔍 Test d\'inscription entreprise...');
  
  // Remplir le formulaire
  await fillField('input[name="name"]', TEST_CONFIG.companyUser.name);
  await fillField('input[name="email"]', TEST_CONFIG.companyUser.email);
  await fillField('input[name="password"]', TEST_CONFIG.companyUser.password);
  await fillField('input[name="confirmPassword"]', TEST_CONFIG.companyUser.password);
  
  // Sélectionner le type d'utilisateur
  await clickElement('input[value="company"]');
  
  // Remplir le nom de l'entreprise
  await wait(TEST_CONFIG.delay); // Attendre que le champ apparaisse
  await fillField('input[name="companyName"]', TEST_CONFIG.companyUser.companyName);
  
  // Soumettre le formulaire
  await clickElement('button[type="submit"]');
  
  console.log('✅ Test d\'inscription entreprise terminé');
};

// Fonction pour tester les validations du formulaire
const testFormValidations = async () => {
  console.log('🔍 Test des validations du formulaire...');
  
  // Test 1: Soumettre un formulaire vide
  console.log('Test 1: Formulaire vide');
  await clickElement('button[type="submit"]');
  await wait(1000);
  
  // Test 2: Email invalide
  console.log('Test 2: Email invalide');
  await fillField('input[name="name"]', 'Test User');
  await fillField('input[name="email"]', 'invalid-email');
  await fillField('input[name="password"]', 'password123');
  await fillField('input[name="confirmPassword"]', 'password123');
  await clickElement('button[type="submit"]');
  await wait(1000);
  
  // Test 3: Mots de passe non correspondants
  console.log('Test 3: Mots de passe non correspondants');
  await fillField('input[name="name"]', 'Test User');
  await fillField('input[name="email"]', 'test@example.com');
  await fillField('input[name="password"]', 'password123');
  await fillField('input[name="confirmPassword"]', 'different123');
  await clickElement('button[type="submit"]');
  
  console.log('✅ Test des validations terminé');
};

// Exporter les fonctions pour utilisation dans la console
window.testRegister = {
  testStudentRegistration,
  testCompanyRegistration,
  testFormValidations,
  TEST_CONFIG
};

console.log('🚀 Utilitaire de test du formulaire d\'inscription chargé');
console.log('Pour tester l\'inscription d\'un étudiant: window.testRegister.testStudentRegistration()');
console.log('Pour tester l\'inscription d\'une entreprise: window.testRegister.testCompanyRegistration()');
console.log('Pour tester les validations du formulaire: window.testRegister.testFormValidations()');
