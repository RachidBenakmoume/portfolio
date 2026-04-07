// projects.js - Project data with translations
const projects = [
  {
    id: 2,
    images: [
      "assets/cds1.png",
      "assets/cds2.png",
      "assets/cds3.png",
      "assets/cds4.png",
      "assets/cds5.png",
      "assets/cds6.png",
      "assets/cds7.png"
    ],
    isPublic: false
  },
  {
    id: 3,
    images: [
      "assets/rsphone1.png",
      "assets/rsphone2.png"
    ],
    isPublic: false
  },
  {
    id: 4,
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
    ],
    isPublic: false
  },
  {
    id: 6,
    images: [
      "assets/olympix1.png",
      "assets/olympix2.png",
      "assets/olympix3.png"
    ],
    isPublic: false
  },
  {
    id: 7,
    images: [
      "assets/toutlameche.png"
    ],
    isPublic: false
  },
  {
    id: 8,
    images: [
      "assets/javarobi.png"
    ],
    isPublic: false
  },
  {
    id: 9,
    images: [
      "assets/pixelwar.png"
    ],
    isPublic: false
  }
];

const projectTranslations = {
  fr: {
    project2_title: "Application de Gestion - Centre de Services",
    project2_desc: "D\u00e9veloppement d'une solution digitale moderne pour optimiser les op\u00e9rations d'un centre de services, avec modules int\u00e9gr\u00e9s de gestion clients, ressources, et facturation.",
    project2_tags: ["Angular", "Spring Boot", "JUnit", "Azure DevOps"],

    project3_title: "RSPhone - Boutique en ligne",
    project3_desc: "Conception d'une plateforme e-commerce sp\u00e9cialis\u00e9e dans la vente de produits \u00e9lectroniques, avec syst\u00e8me de gestion des stocks et passerelles de paiement multiples.",
    project3_tags: ["WordPress", "WooCommerce", "PHP", "MySQL"],

    project4_title: "Syst\u00e8me de Gestion des Cong\u00e9s",
    project4_desc: "Application web d\u00e9di\u00e9e \u00e0 l'automatisation de la gestion des cong\u00e9s, facilitant les demandes, validations et int\u00e9gration avec le syst\u00e8me RH existant.",
    project4_tags: ["Laravel", "Bootstrap", "MySQL", "RESTful API"],

    project6_title: "Gestion de Concours en Ligne",
    project6_desc: "Plateforme de gestion de concours incluant l'inscription, le suivi des participants, le classement et la publication des r\u00e9sultats.",
    project6_tags: ["CodeIgniter", "Bootstrap", "MariaDB"],

    project7_title: "\u00c9diteur de texte avec N-grammes",
    project7_desc: "Programme en C avec interface graphique GTK qui sugg\u00e8re des mots \u00e0 l'utilisateur en se basant sur un syst\u00e8me d'analyse par N-grammes.",
    project7_tags: ["C", "GTK", "N-grammes"],

    project8_title: "Interpr\u00e9teur Graphique Client/Serveur",
    project8_desc: "Application Java capable d'interpr\u00e9ter des scripts graphiques sur un canevas, architecture client/serveur avec JavaFX et sockets.",
    project8_tags: ["Java", "JavaFX", "Sockets", "Client-Serveur"],

    project9_title: "Jeu de Dessin Collaboratif",
    project9_desc: "Application Java client/serveur permettant \u00e0 plusieurs utilisateurs de dessiner en temps r\u00e9el, bas\u00e9e sur les websockets, le multithreading et JavaFX.",
    project9_tags: ["Java", "WebSockets", "JavaFX", "Multicast", "Threading"]
  },
  en: {
    project2_title: "Management Application - Service Center",
    project2_desc: "Development of a modern digital solution to optimize service center operations, with integrated customer management, resources, and billing modules.",
    project2_tags: ["Angular", "Spring Boot", "JUnit", "Azure DevOps"],

    project3_title: "RSPhone - Online Store",
    project3_desc: "Design of an e-commerce platform specialized in electronic products, with inventory management system and multiple payment gateways.",
    project3_tags: ["WordPress", "WooCommerce", "PHP", "MySQL"],

    project4_title: "Leave Management System",
    project4_desc: "Web application dedicated to automating leave management, facilitating requests, approvals and integration with existing HR system.",
    project4_tags: ["Laravel", "Bootstrap", "MySQL", "RESTful API"],

    project6_title: "Online Contest Management",
    project6_desc: "Contest management platform including registration, participant tracking, ranking and results publication.",
    project6_tags: ["CodeIgniter", "Bootstrap", "MariaDB"],

    project7_title: "N-gram Word Suggestion Editor",
    project7_desc: "C program with GTK graphical interface that suggests words to the user based on N-gram analysis system.",
    project7_tags: ["C", "GTK", "N-grams"],

    project8_title: "Client/Server Graphical Interpreter",
    project8_desc: "Java application capable of interpreting graphic scripts on a canvas, client/server architecture with JavaFX and sockets.",
    project8_tags: ["Java", "JavaFX", "Sockets", "Client-Server"],

    project9_title: "Collaborative Drawing Game",
    project9_desc: "Java client/server application allowing multiple users to draw in real time, based on websockets, multithreading and JavaFX.",
    project9_tags: ["Java", "WebSockets", "JavaFX", "Multicast", "Threading"]
  }
};
