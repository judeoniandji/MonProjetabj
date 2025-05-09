describe('Registration Form', () => {
  beforeEach(() => {
    // Visiter la page d'inscription
    cy.visit('/register');
  });

  it('should display validation errors for empty fields', () => {
    // Cliquer sur le bouton d'inscription sans remplir les champs
    cy.get('button[type="submit"]').click();
    
    // Vérifier que les messages d'erreur sont affichés
    cy.contains('Email is required').should('be.visible');
    cy.contains('Password is required').should('be.visible');
  });

  it('should display error for invalid email format', () => {
    // Entrer un email invalide
    cy.get('input[name="email"]').type('invalid-email');
    cy.get('button[type="submit"]').click();
    
    // Vérifier que le message d'erreur est affiché
    cy.contains('Invalid email format').should('be.visible');
  });

  it('should display error for weak password', () => {
    // Entrer un mot de passe trop court
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('weak');
    cy.get('button[type="submit"]').click();
    
    // Vérifier que le message d'erreur est affiché
    cy.contains('Password must be at least 8 characters').should('be.visible');
  });

  it('should register a new user successfully', () => {
    // Intercepter les requêtes API
    cy.intercept('POST', `${Cypress.env('apiUrl')}/auth/register`).as('registerRequest');
    
    // Remplir le formulaire
    cy.get('input[name="email"]').type('cypress@example.com');
    cy.get('input[name="password"]').type('StrongPassword1!');
    cy.get('input[name="confirmPassword"]').type('StrongPassword1!');
    cy.get('select[name="userType"]').select('student');
    
    // Soumettre le formulaire
    cy.get('button[type="submit"]').click();
    
    // Attendre la réponse de l'API
    cy.wait('@registerRequest').its('response.statusCode').should('eq', 201);
    
    // Vérifier la redirection ou le message de succès
    cy.contains('Registration successful').should('be.visible');
  });
});

describe('Simple Registration Form', () => {
  beforeEach(() => {
    // Visiter la page d'inscription simplifiée
    cy.visit('/auth/inscription-simple');
  });

  it('should display additional fields based on user type', () => {
    // Vérifier que les champs supplémentaires sont initialement cachés
    cy.get('#studentFields').should('not.be.visible');
    cy.get('#universityFields').should('not.be.visible');
    cy.get('#companyFields').should('not.be.visible');
    
    // Sélectionner le type étudiant
    cy.get('#userType').select('student');
    cy.get('#studentFields').should('be.visible');
    
    // Sélectionner le type université
    cy.get('#userType').select('university');
    cy.get('#universityFields').should('be.visible');
    cy.get('#studentFields').should('not.be.visible');
    
    // Sélectionner le type entreprise
    cy.get('#userType').select('company');
    cy.get('#companyFields').should('be.visible');
    cy.get('#universityFields').should('not.be.visible');
  });

  it('should register a new user successfully', () => {
    // Intercepter les requêtes API
    cy.intercept('POST', `/api/auth/register-simple`).as('registerSimpleRequest');
    
    // Remplir le formulaire
    cy.get('#name').type('Cypress Test User');
    cy.get('#email').type('cypress-simple@example.com');
    cy.get('#userType').select('student');
    
    // Remplir les champs spécifiques à l'étudiant
    cy.get('#school').type('Cypress University');
    cy.get('#fieldOfStudy').type('Test Automation');
    
    // Soumettre le formulaire
    cy.get('button[onclick="submitForm()"]').click();
    
    // Vérifier que le message de succès est affiché
    cy.get('#successMessage').should('be.visible');
    cy.contains('Inscription réussie!').should('be.visible');
    
    // Vérifier que les données sont affichées correctement
    cy.contains('Cypress Test User').should('be.visible');
    cy.contains('cypress-simple@example.com').should('be.visible');
    cy.contains('Cypress University').should('be.visible');
    cy.contains('Test Automation').should('be.visible');
  });
});
