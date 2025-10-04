// Utilitaires de validation sécurisée pour prévenir les injections et assurer la qualité des données

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class SecurityValidator {
  
  // Caractères dangereux pour prévenir les injections
  private static readonly DANGEROUS_PATTERNS = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
    /<link/gi,
    /<meta/gi,
    /expression\s*\(/gi,
    /url\s*\(/gi,
    /@import/gi,
    /'|"|;|--|\/\*|\*\/|xp_|sp_/gi,
    /union\s+select/gi,
    /insert\s+into/gi,
    /delete\s+from/gi,
    /drop\s+table/gi,
    /update\s+set/gi,
    /exec\s*\(/gi,
    /eval\s*\(/gi,
    /script/gi
  ];

  // Nettoyer et valider une chaîne de caractères
  static sanitizeString(input: string): string {
    if (!input) return '';
    
    // Supprimer les espaces en début et fin
    let sanitized = input.trim();
    
    // Supprimer les caractères dangereux
    this.DANGEROUS_PATTERNS.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });
    
    // Échapper les caractères HTML
    sanitized = sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
    
    return sanitized;
  }

  // Valider un email
  static validateEmail(email: string): ValidationResult {
    const errors: string[] = [];
    
    if (!email) {
      errors.push('L\'email est requis');
      return { isValid: false, errors };
    }

    // Nettoyer l'email
    const cleanEmail = this.sanitizeString(email).toLowerCase();
    
    // Pattern email strict
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailPattern.test(cleanEmail)) {
      errors.push('Format d\'email invalide');
    }
    
    if (cleanEmail.length > 254) {
      errors.push('L\'email est trop long (maximum 254 caractères)');
    }
    
    return { isValid: errors.length === 0, errors };
  }

  // Valider un mot de passe
  static validatePassword(password: string): ValidationResult {
    const errors: string[] = [];
    
    if (!password) {
      errors.push('Le mot de passe est requis');
      return { isValid: false, errors };
    }

    if (password.length < 8) {
      errors.push('Le mot de passe doit contenir au moins 8 caractères');
    }
    
    if (password.length > 128) {
      errors.push('Le mot de passe est trop long (maximum 128 caractères)');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une majuscule');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une minuscule');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un chiffre');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un caractère spécial');
    }
    
    return { isValid: errors.length === 0, errors };
  }

  // Valider un nom (prénom/nom)
  static validateName(name: string, fieldName: string): ValidationResult {
    const errors: string[] = [];
    
    if (!name) {
      errors.push(`${fieldName} est requis`);
      return { isValid: false, errors };
    }

    const cleanName = this.sanitizeString(name);
    
    if (cleanName.length < 2) {
      errors.push(`${fieldName} doit contenir au moins 2 caractères`);
    }
    
    if (cleanName.length > 50) {
      errors.push(`${fieldName} est trop long (maximum 50 caractères)`);
    }
    
    // Seulement lettres, espaces, tirets et apostrophes
    if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(cleanName)) {
      errors.push(`${fieldName} ne peut contenir que des lettres, espaces, tirets et apostrophes`);
    }
    
    return { isValid: errors.length === 0, errors };
  }

  // Valider un numéro de téléphone
  static validatePhone(phone: string): ValidationResult {
    const errors: string[] = [];
    
    if (!phone) {
      return { isValid: true, errors }; // Le téléphone est optionnel
    }

    const cleanPhone = this.sanitizeString(phone);
    
    // Supprimer tous les caractères non numériques
    const digitsOnly = cleanPhone.replace(/\D/g, '');
    
    if (digitsOnly.length < 8 || digitsOnly.length > 15) {
      errors.push('Le numéro de téléphone doit contenir entre 8 et 15 chiffres');
    }
    
    return { isValid: errors.length === 0, errors };
  }

  // Valider une adresse
  static validateAddress(address: string): ValidationResult {
    const errors: string[] = [];
    
    if (!address) {
      return { isValid: true, errors }; // L'adresse est optionnelle
    }

    const cleanAddress = this.sanitizeString(address);
    
    if (cleanAddress.length > 255) {
      errors.push('L\'adresse est trop longue (maximum 255 caractères)');
    }
    
    return { isValid: errors.length === 0, errors };
  }

  // Valider toutes les données d'inscription
  static validateRegistration(data: {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    phone?: string;
    address?: string;
  }): ValidationResult {
    const errors: string[] = [];
    
    // Valider l'email
    const emailValidation = this.validateEmail(data.email);
    if (!emailValidation.isValid) {
      errors.push(...emailValidation.errors);
    }
    
    // Valider le mot de passe
    const passwordValidation = this.validatePassword(data.password);
    if (!passwordValidation.isValid) {
      errors.push(...passwordValidation.errors);
    }
    
    // Vérifier que les mots de passe correspondent
    if (data.password !== data.confirmPassword) {
      errors.push('Les mots de passe ne correspondent pas');
    }
    
    // Valider le prénom
    const firstNameValidation = this.validateName(data.firstName, 'Le prénom');
    if (!firstNameValidation.isValid) {
      errors.push(...firstNameValidation.errors);
    }
    
    // Valider le nom
    const lastNameValidation = this.validateName(data.lastName, 'Le nom');
    if (!lastNameValidation.isValid) {
      errors.push(...lastNameValidation.errors);
    }
    
    // Valider le téléphone
    const phoneValidation = this.validatePhone(data.phone || '');
    if (!phoneValidation.isValid) {
      errors.push(...phoneValidation.errors);
    }
    
    // Valider l'adresse
    const addressValidation = this.validateAddress(data.address || '');
    if (!addressValidation.isValid) {
      errors.push(...addressValidation.errors);
    }
    
    return { isValid: errors.length === 0, errors };
  }

  // Nettoyer les données d'inscription
  static sanitizeRegistrationData(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    address?: string;
  }) {
    return {
      email: this.sanitizeString(data.email).toLowerCase(),
      password: data.password, // Le mot de passe ne doit pas être nettoyé
      firstName: this.sanitizeString(data.firstName),
      lastName: this.sanitizeString(data.lastName),
      phone: data.phone ? this.sanitizeString(data.phone) : undefined,
      address: data.address ? this.sanitizeString(data.address) : undefined
    };
  }
}
