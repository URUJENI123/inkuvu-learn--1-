"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "fr" | "rw";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Translation dictionaries
const translations = {
  en: {
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.courses": "Courses",
    "nav.forum": " Forum",
    "nav.profile": "Profile",
    "nav.admin": "Admin",
    "nav.logout": "Logout",

    // Dashboard
    "dashboard.title": " Learn - Inclusive Education Platform",
    "dashboard.subtitle":
      "Accessible learning resources and teacher training for inclusive education in Rwanda",
    "dashboard.featured": "Featured Resources",
    "dashboard.recent_posts": "Recent Forum Posts",
    "dashboard.offline_downloads": "Offline Downloads",
    "dashboard.manage_downloads": "Manage Downloads",

    // Digital Library
    "library.title": "Digital Library",
    "library.subtitle": "Accessible learning resources for inclusive education",
    "library.search": "Search resources...",
    "library.filter_by": "Filter by:",
    "library.all_resources": "All Resources",
    "library.featured": "Featured This Week",
    "library.new_resources": "New Resources",
    "library.sort_by": "Sort by:",
    "library.newest": "Newest",
    "library.popular": "Most Popular",
    "library.rating": "Highest Rated",

    // Course
    "course.overview": "Course Overview",
    "course.curriculum": "Curriculum",
    "course.discussions": "Discussions",
    "course.resources": "Resources",
    "course.progress": "Your Progress",
    "course.completed": "Completed",
    "course.in_progress": "In Progress",
    "course.not_started": "Not Started",

    // Authentication
    "auth.welcome_back": "Welcome Back",
    "auth.sign_in_subtitle": "Sign in to your Inclusive Learn account",
    "auth.join_platform": "Join Inclusive Learn",
    "auth.create_account_subtitle": "Create your account to start learning",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.full_name": "Full Name",
    "auth.role": "Role",
    "auth.confirm_password": "Confirm Password",
    "auth.sign_in": "Sign In",
    "auth.create_account": "Create Account",
    "auth.no_account": "Don't have an account?",
    "auth.have_account": "Already have an account?",
    "auth.sign_up": "Sign up",

    // Roles
    "role.student": "Student",
    "role.teacher": "Teacher",
    "role.parent": "Parent",
    "role.admin": "Administrator",

    // Common
    "common.loading": "Loading...",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.view": "View",
    "common.add": "Add",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.sort": "Sort",
  },

  fr: {
    // Navigation
    "nav.dashboard": "Tableau de bord",
    "nav.courses": "Cours",
    "nav.forum": "Forum communautaire",
    "nav.profile": "Profil",
    "nav.admin": "Admin",
    "nav.logout": "Déconnexion",

    // Dashboard
    "dashboard.title": "Inclusive Learn - Plateforme d'éducation inclusive",
    "dashboard.subtitle":
      "Ressources d'apprentissage accessibles et formation des enseignants pour l'éducation inclusive au Rwanda",
    "dashboard.featured": "Ressources en vedette",
    "dashboard.recent_posts": "Messages récents du forum",
    "dashboard.offline_downloads": "Téléchargements hors ligne",
    "dashboard.manage_downloads": "Gérer les téléchargements",

    // Digital Library
    "library.title": "Bibliothèque numérique",
    "library.subtitle":
      "Ressources d'apprentissage accessibles pour l'éducation inclusive",
    "library.search": "Rechercher des ressources...",
    "library.filter_by": "Filtrer par:",
    "library.all_resources": "Toutes les ressources",
    "library.featured": "En vedette cette semaine",
    "library.new_resources": "Nouvelles ressources",
    "library.sort_by": "Trier par:",
    "library.newest": "Plus récent",
    "library.popular": "Plus populaire",
    "library.rating": "Mieux noté",

    // Course
    "course.overview": "Aperçu du cours",
    "course.curriculum": "Programme",
    "course.discussions": "Discussions",
    "course.resources": "Ressources",
    "course.progress": "Votre progression",
    "course.completed": "Terminé",
    "course.in_progress": "En cours",
    "course.not_started": "Pas commencé",

    // Authentication
    "auth.welcome_back": "Bon retour",
    "auth.sign_in_subtitle": "Connectez-vous à votre compte Inkuvu Learn",
    "auth.join_platform": "Rejoindre Inkuvu Learn",
    "auth.create_account_subtitle":
      "Créez votre compte pour commencer à apprendre",
    "auth.email": "Email",
    "auth.password": "Mot de passe",
    "auth.full_name": "Nom complet",
    "auth.role": "Rôle",
    "auth.confirm_password": "Confirmer le mot de passe",
    "auth.sign_in": "Se connecter",
    "auth.create_account": "Créer un compte",
    "auth.no_account": "Vous n'avez pas de compte?",
    "auth.have_account": "Vous avez déjà un compte?",
    "auth.sign_up": "S'inscrire",

    // Roles
    "role.student": "Étudiant",
    "role.teacher": "Enseignant",
    "role.parent": "Parent",
    "role.admin": "Administrateur",

    // Common
    "common.loading": "Chargement...",
    "common.save": "Enregistrer",
    "common.cancel": "Annuler",
    "common.edit": "Modifier",
    "common.delete": "Supprimer",
    "common.view": "Voir",
    "common.add": "Ajouter",
    "common.search": "Rechercher",
    "common.filter": "Filtrer",
    "common.sort": "Trier",
  },

  rw: {
    // Navigation
    "nav.dashboard": "Ikibaho",
    "nav.courses": "Amasomo",
    "nav.forum": "Ikiganiro cy'abaturage",
    "nav.profile": "Umwirondoro",
    "nav.admin": "Ubuyobozi",
    "nav.logout": "Gusohoka",

    // Dashboard
    "dashboard.title": "Inkuvu Learn - Urubuga rw'uburezi bwuzuye",
    "dashboard.subtitle":
      "Ibikoresho by'uburezi biboroheye n'amahugurwa y'abarimu ku burezi bwuzuye mu Rwanda",
    "dashboard.featured": "Ibikoresho byibanze",
    "dashboard.recent_posts": "Ubutumwa bwa vuba bw'ikiganiro",
    "dashboard.offline_downloads": "Ibikurwa nta murongo",
    "dashboard.manage_downloads": "Gucunga ibikurwa",

    // Digital Library
    "library.title": "Isomero rya digitale",
    "library.subtitle": "Ibikoresho by'uburezi biboroheye ku burezi bwuzuye",
    "library.search": "Shakisha ibikoresho...",
    "library.filter_by": "Shungura ukurikije:",
    "library.all_resources": "Ibikoresho byose",
    "library.featured": "Byibanze muri iki cyumweru",
    "library.new_resources": "Ibikoresho bishya",
    "library.sort_by": "Shirisha ukurikije:",
    "library.newest": "Bishya",
    "library.popular": "Bikunzwe cyane",
    "library.rating": "Bifite amanota menshi",

    // Course
    "course.overview": "Incamake y'isomo",
    "course.curriculum": "Integanyanyigisho",
    "course.discussions": "Ibiganiro",
    "course.resources": "Ibikoresho",
    "course.progress": "Uko ugenda utera imbere",
    "course.completed": "Byarangiye",
    "course.in_progress": "Biragenda",
    "course.not_started": "Bitaratangira",

    // Authentication
    "auth.welcome_back": "Murakaza neza",
    "auth.sign_in_subtitle": "Injira muri konti yawe ya Inkuvu Learn",
    "auth.join_platform": "Kwinjira muri Inkuvu Learn",
    "auth.create_account_subtitle": "Kora konti yawe kugira ngo utangire kwiga",
    "auth.email": "Imeyili",
    "auth.password": "Ijambo ry'ibanga",
    "auth.full_name": "Amazina yose",
    "auth.role": "Uruhare",
    "auth.confirm_password": "Emeza ijambo ry'ibanga",
    "auth.sign_in": "Kwinjira",
    "auth.create_account": "Kora konti",
    "auth.no_account": "Ntufite konti?",
    "auth.have_account": "Usanzwe ufite konti?",
    "auth.sign_up": "Iyandikishe",

    // Roles
    "role.student": "Umunyeshuri",
    "role.teacher": "Umwarimu",
    "role.parent": "Umubyeyi",
    "role.admin": "Umuyobozi",

    // Common
    "common.loading": "Biragenda...",
    "common.save": "Bika",
    "common.cancel": "Hagarika",
    "common.edit": "Hindura",
    "common.delete": "Siba",
    "common.view": "Reba",
    "common.add": "Ongeraho",
    "common.search": "Shakisha",
    "common.filter": "Shungura",
    "common.sort": "Shirisha",
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("inkuvu-language") as Language;
    if (savedLanguage && ["en", "fr", "rw"].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("inkuvu-language", lang);
  };

  const t = (key: string): string => {
    return (translations[language] as Record<string, string>)[key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleSetLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
