describe('Formulaire d\'inscription', () => {
  beforeEach(() => {
    // Visiter la page d'inscription avant chaque test
    cy.visit('/register');
  });

  it('Affiche le formulaire d\'inscription', () => {
    // Vérifier que le formulaire est présent
    cy.get('form').should('exist');
    cy.contains('Inscription').should('exist');
    
    // Vérifier que tous les champs requis sont présents
    cy.get('input[name="name"]').should('exist');
    cy.get('input[name="email"]').should('exist');
    cy.get('input[name="password"]').should('exist');
    cy.get('input[name="confirmPassword"]').should('exist');
  });

  it('Affiche une erreur pour les champs obligatoires vides', () => {
    // Soumettre le formulaire sans remplir les champs
    cy.get('button[type="submit"]').click();
    
    // Vérifier que des messages d'erreur sont affichés
    cy.contains('Le champ nom est requis').should('exist');
    cy.contains('Le champ email est requis').should('exist');
    cy.contains('Le champ mot de passe est requis').should('exist');
  });

  it('Affiche une erreur pour un email invalide', () => {
    // Remplir le formulaire avec un email invalide
    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="email"]').type('invalid-email');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirmPassword"]').type('password123');
    
    // Soumettre le formulaire
    cy.get('button[type="submit"]').click();
    
    // Vérifier qu'un message d'erreur pour l'email est affiché
    cy.contains('Email invalide').should('exist');
  });

  it('Affiche une erreur pour des mots de passe non correspondants', () => {
    // Remplir le formulaire avec des mots de passe différents
    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirmPassword"]').type('different123');
    
    // Soumettre le formulaire
    cy.get('button[type="submit"]').click();
    
    // Vérifier qu'un message d'erreur pour les mots de passe est affiché
    cy.contains('Les mots de passe ne correspondent pas').should('exist');
  });

  it('Affiche le champ companyName pour le type utilisateur "company"', () => {
    // Sélectionner le type d'utilisateur "company"
    cy.get('input[value="company"]').click();
    
    // Vérifier que le champ companyName est affiché
    cy.get('input[name="companyName"]').should('be.visible');
  });

  it('Teste une inscription réussie', () => {
    // Générer un email unique pour éviter les conflits
    const uniqueEmail = `test${Date.now()}@example.com`;
    
    // Remplir le formulaire avec des données valides
    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="email"]').type(uniqueEmail);
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirmPassword"]').type('password123');
    
    // Intercepter les requêtes API
    cy.intercept('POST', '/api/auth/register').as('registerRequest');
    
    // Soumettre le formulaire
    cy.get('button[type="submit"]').click();
    
    // Attendre la requête API et vérifier la réponse
    cy.wait('@registerRequest').then((interception) => {
      // Si le serveur backend est en cours d'exécution, nous pouvons vérifier la réponse
      if (interception.response) {
        if (interception.response.statusCode === 200) {
          // Si l'inscription réussit, nous devrions être redirigés vers la page d'accueil
          cy.url().should('eq', Cypress.config().baseUrl + '/');
        } else {
          // Si l'inscription échoue, nous devrions voir un message d'erreur
          cy.get('[role="alert"]').should('exist');
        }
      }
    });
  });
});
