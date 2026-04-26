// projects.js — project data + translations
//
// Schema for each entry in `projects`:
//   {
//     id:        number   — must match the projectN_* keys in projectTranslations below
//     category:  string   — 'internship' | 'academic' | 'personal' (drives the badge label)
//     images:    string[] — paths to screenshots (first one is the card thumbnail)
//     videos:    string[] — OPTIONAL paths to demo recordings (.mp4 / .webm)
//     repoUrl:   string   — OPTIONAL link to GitHub / GitLab / Bitbucket
//     liveUrl:   string   — OPTIONAL link to a live deployment
//   }
//
// Per-project text lives in `projectTranslations` keyed by language, including:
//   projectN_title, projectN_desc, projectN_tags (string[]), projectN_outcomes (string[])
// Add concrete outcomes (numbers, scale, impact) — they're what convert recruiters.

const projects = [
  {
    id: 2,
    category: 'internship',
    images: [
      "assets/cds1.png",
      "assets/cds2.png",
      "assets/cds3.png",
      "assets/cds4.png",
      "assets/cds5.png",
      "assets/cds6.png",
      "assets/cds7.png"
    ]
  },
  {
    id: 3,
    category: 'personal',
    images: [
      "assets/rsphone1.png",
      "assets/rsphone2.png"
    ]
  },
  {
    id: 4,
    category: 'internship',
    images: [
      "assets/epal1.png",
      "assets/epal2.png",
      "assets/epal3.png",
      "assets/epal4.png",
      "assets/epal5.png",
      "assets/epal6.jpeg",
      "assets/epal7.jpeg",
      "assets/epal8.jpeg",
      "assets/epal9.png"
    ]
  },
  {
    id: 6,
    category: 'academic',
    images: [
      "assets/olympix1.png",
      "assets/olympix2.png",
      "assets/olympix3.png"
    ]
  },
  {
    id: 7,
    category: 'academic',
    images: [
      "assets/toutlameche.png"
    ]
  },
  {
    id: 8,
    category: 'academic',
    images: [
      "assets/javarobi.png"
    ]
  },
  {
    id: 9,
    category: 'academic',
    images: [
      "assets/pixelwar.png"
    ]
  }
];

const projectTranslations = {
  fr: {
    project2_title: "Application de Gestion - Centre de Services",
    project2_desc: "Développement d'une solution digitale moderne pour optimiser les opérations d'un centre de services, avec modules intégrés de gestion clients, ressources, et facturation.",
    project2_tags: ["Angular", "Spring Boot", "JUnit", "Azure DevOps"],
    project2_outcomes: [],

    project3_title: "RSPhone - Boutique en ligne",
    project3_desc: "Conception d'une plateforme e-commerce spécialisée dans la vente de produits électroniques, avec système de gestion des stocks et passerelles de paiement multiples.",
    project3_tags: ["WordPress", "WooCommerce", "PHP", "MySQL"],
    project3_outcomes: [],

    project4_title: "Système de Gestion des Congés",
    project4_desc: "Application web dédiée à l'automatisation de la gestion des congés, facilitant les demandes, validations et intégration avec le système RH existant.",
    project4_tags: ["Laravel", "Bootstrap", "MySQL", "RESTful API"],
    project4_outcomes: [],

    project6_title: "Gestion de Concours en Ligne",
    project6_desc: "Plateforme de gestion de concours incluant l'inscription, le suivi des participants, le classement et la publication des résultats.",
    project6_tags: ["CodeIgniter", "Bootstrap", "MariaDB"],
    project6_outcomes: [],

    project7_title: "Éditeur de texte avec N-grammes",
    project7_desc: "Programme en C avec interface graphique GTK qui suggère des mots à l'utilisateur en se basant sur un système d'analyse par N-grammes.",
    project7_tags: ["C", "GTK", "N-grammes"],
    project7_outcomes: [],

    project8_title: "Interpréteur Graphique Client/Serveur",
    project8_desc: "Application Java capable d'interpréter des scripts graphiques sur un canevas, architecture client/serveur avec JavaFX et sockets.",
    project8_tags: ["Java", "JavaFX", "Sockets", "Client-Serveur"],
    project8_outcomes: [],

    project9_title: "Jeu de Dessin Collaboratif",
    project9_desc: "Application Java client/serveur permettant à plusieurs utilisateurs de dessiner en temps réel, basée sur les websockets, le multithreading et JavaFX.",
    project9_tags: ["Java", "WebSockets", "JavaFX", "Multicast", "Threading"],
    project9_outcomes: []
  },
  en: {
    project2_title: "Management Application - Service Center",
    project2_desc: "Development of a modern digital solution to optimize service center operations, with integrated customer management, resources, and billing modules.",
    project2_tags: ["Angular", "Spring Boot", "JUnit", "Azure DevOps"],
    project2_outcomes: [],

    project3_title: "RSPhone - Online Store",
    project3_desc: "Design of an e-commerce platform specialized in electronic products, with inventory management system and multiple payment gateways.",
    project3_tags: ["WordPress", "WooCommerce", "PHP", "MySQL"],
    project3_outcomes: [],

    project4_title: "Leave Management System",
    project4_desc: "Web application dedicated to automating leave management, facilitating requests, approvals and integration with existing HR system.",
    project4_tags: ["Laravel", "Bootstrap", "MySQL", "RESTful API"],
    project4_outcomes: [],

    project6_title: "Online Contest Management",
    project6_desc: "Contest management platform including registration, participant tracking, ranking and results publication.",
    project6_tags: ["CodeIgniter", "Bootstrap", "MariaDB"],
    project6_outcomes: [],

    project7_title: "N-gram Word Suggestion Editor",
    project7_desc: "C program with GTK graphical interface that suggests words to the user based on N-gram analysis system.",
    project7_tags: ["C", "GTK", "N-grams"],
    project7_outcomes: [],

    project8_title: "Client/Server Graphical Interpreter",
    project8_desc: "Java application capable of interpreting graphic scripts on a canvas, client/server architecture with JavaFX and sockets.",
    project8_tags: ["Java", "JavaFX", "Sockets", "Client-Server"],
    project8_outcomes: [],

    project9_title: "Collaborative Drawing Game",
    project9_desc: "Java client/server application allowing multiple users to draw in real time, based on websockets, multithreading and JavaFX.",
    project9_tags: ["Java", "WebSockets", "JavaFX", "Multicast", "Threading"],
    project9_outcomes: []
  }
};
