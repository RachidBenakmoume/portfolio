// translations.js - Language Translations for Portfolio
const translations = {
  fr: {
    // Navigation
    nav_home: "Accueil",
    nav_about: "\u00c0 propos",
    nav_experience: "Exp\u00e9rience",
    nav_projects: "Projets",
    nav_education: "Formation",
    nav_contact: "Contact",
    nav_terminal: "Terminal",
    terminal_back: "Retour au portfolio",

    // Hero Section
    hero_greeting: "Bonjour, je suis",
    hero_title: "Concepteur & D\u00e9veloppeur Full Stack",
    hero_description: "Cr\u00e9ations num\u00e9riques innovantes \u2022 Architecture logicielle moderne",
    hero_button: "Voir mes projets",
    hero_download_cv: "T\u00e9l\u00e9charger CV",
    hero_scroll: "D\u00e9filer",

    // About Section
    about_tag: "01 \u2014 \u00c0 propos",
    about_title: "\u00c0 propos de moi",
    about_text_1: "D\u00e9veloppeur Full Stack passionn\u00e9, actuellement en Master Science du Logiciel \u00e0 l'Universit\u00e9 Toulouse Paul Sabatier. Je con\u00e7ois des applications web performantes, du front-end au back-end, en mettant l'accent sur la qualit\u00e9 du code et l'exp\u00e9rience utilisateur.",
    about_text_2: "Fort de deux stages en entreprise et de plus de sept projets r\u00e9alis\u00e9s, je ma\u00eetrise les architectures modernes et les pratiques DevOps. Toujours \u00e0 la recherche de nouveaux d\u00e9fis techniques.",
    skills_title: "Stack Technique",
    stat_projects: "Projets",
    stat_internships: "Stages",
    stat_technologies: "Technologies",
    lang_french: "Fran\u00e7ais",
    lang_english: "Anglais",
    lang_arabic: "Arabe",

    // Experience Section
    experience_tag: "02 \u2014 Exp\u00e9rience",
    experience_title: "Exp\u00e9rience Professionnelle",
    exp1_date: "04/2025 - 08/2025",
    exp1_title: "Stage en D\u00e9veloppement d'Applications",
    exp1_company: "Consort France",
    exp1_desc: "En charge de l'\u00e9laboration d'une solution de gestion int\u00e9gr\u00e9e pour le centre de services, couvrant multiples aspects op\u00e9rationnels de l'entreprise.",
    exp1_point1: "D\u00e9veloppement d'une couverture de tests unitaires compl\u00e8te, garantissant la fiabilit\u00e9 du code",
    exp1_point2: "Int\u00e9gration d'analyses de qualit\u00e9 et s\u00e9curit\u00e9 via SonarQube, optimisant la maintenance",
    exp1_point3: "Configuration de l'environnement DevOps avec Azure pour une livraison continue",
    exp1_point4: "Impl\u00e9mentation de fonctionnalit\u00e9s IA pour l'analyse pr\u00e9dictive des incidents",

    exp2_date: "02/2024 - 05/2024",
    exp2_title: "Stage en Conception Web",
    exp2_company: "Entreprise Portuaire d'Alger",
    exp2_desc: "Conception et impl\u00e9mentation d'une solution digitale pour la gestion du personnel.",
    exp2_point1: "D\u00e9veloppement d'une interface utilisateur intuitive avec Laravel et Bootstrap",
    exp2_point2: "Optimisation des flux de donn\u00e9es avec l'infrastructure existante",
    exp2_point3: "Automatisation des processus de validation et notification",
    exp2_point4: "Am\u00e9lioration de la productivit\u00e9 RH et satisfaction des employ\u00e9s",

    // Projects Section
    projects_tag: "03 \u2014 Projets",
    projects_title: "Projets",
    viewProject: "Voir le projet",
    privateProject: "Projet priv\u00e9",
    viewGallery: "Voir les images",
    imageCounter: "Image {current} sur {total}",

    // Education Section
    education_tag: "04 \u2014 Formation",
    education_title: "Formation",
    edu0_date: "09/2025 - Pr\u00e9sent",
    edu0_title: "Master Science du Logiciel",
    edu0_location: "Universit\u00e9 Toulouse Paul Sabatier \u2013 Toulouse, France",
    edu0_point1: "Conception avanc\u00e9e de syst\u00e8mes logiciels distribu\u00e9s",
    edu0_point2: "M\u00e9thodes formelles et v\u00e9rification de logiciels",
    edu0_point3: "Recherche et innovation en g\u00e9nie logiciel",

    edu1_date: "09/2023 - 08/2025",
    edu1_title: "Licence Informatique \u2013 Fondamentaux et Applications",
    edu1_location: "Universit\u00e9 de Bretagne Occidentale \u2013 Brest, France",
    edu1_point1: "Conception et mod\u00e9lisation de syst\u00e8mes informatiques complexes",
    edu1_point2: "D\u00e9veloppement d'applications \u00e0 partir de m\u00e9thodologies agiles",
    edu1_point3: "Exploration des architectures mat\u00e9rielles et protocoles r\u00e9seau",

    edu2_date: "09/2021 - 06/2024",
    edu2_title: "Licence en G\u00e9nie Logiciel et Syst\u00e8mes d'Information",
    edu2_location: "Universit\u00e9 Houari Boumediene \u2013 Alger, Alg\u00e9rie",
    edu2_point1: "Architecture et conception d'applications \u00e9volutives",
    edu2_point2: "M\u00e9thodologies de d\u00e9veloppement et assurance qualit\u00e9",
    edu2_point3: "Int\u00e9gration de syst\u00e8mes et solutions logicielles d'entreprise",

    edu3_date: "2023",
    edu3_title: "CLES B2 Anglais",
    edu3_location: "Certification de comp\u00e9tence en langue anglaise",
    edu3_desc: "Ma\u00eetrise professionnelle de la communication en anglais, \u00e9crite et orale",

    // Contact Section
    contact_tag: "05 \u2014 Contact",
    contact_title: "Contact",
    contact_intro: "Vous avez un projet en t\u00eate ou une opportunit\u00e9 ? N'h\u00e9sitez pas \u00e0 me contacter.",
    contact_email: "Email",
    contact_location: "Localisation",
    contact_languages: "Langues",
    contact_languages_list: "Fran\u00e7ais (Avanc\u00e9), Anglais (Avanc\u00e9)",
    contact_name: "Votre nom",
    contact_email_input: "Votre email",
    contact_subject: "Sujet",
    contact_message: "Message",
    contact_send: "Envoyer",

    // Alerts
    alert_success: "Message envoy\u00e9 avec succ\u00e8s !",
    alert_error: "Erreur lors de l'envoi du message. Veuillez r\u00e9essayer."
  },
  en: {
    // Navigation
    nav_home: "Home",
    nav_about: "About",
    nav_experience: "Experience",
    nav_projects: "Projects",
    nav_education: "Education",
    nav_contact: "Contact",
    nav_terminal: "Terminal",
    terminal_back: "Back to portfolio",

    // Hero Section
    hero_greeting: "Hello, I'm",
    hero_title: "Full Stack Developer & Designer",
    hero_description: "Innovative Digital Solutions \u2022 Modern Software Architecture",
    hero_button: "View My Work",
    hero_download_cv: "Download Resume",
    hero_scroll: "Scroll",

    // About Section
    about_tag: "01 \u2014 About",
    about_title: "About Me",
    about_text_1: "Passionate Full Stack Developer, currently pursuing a Master's in Software Science at Universit\u00e9 Toulouse Paul Sabatier. I build high-performance web applications from front-end to back-end, with a strong focus on code quality and user experience.",
    about_text_2: "With two professional internships and over seven completed projects, I have solid experience with modern architectures and DevOps practices. Always looking for the next technical challenge.",
    skills_title: "Tech Stack",
    stat_projects: "Projects",
    stat_internships: "Internships",
    stat_technologies: "Technologies",
    lang_french: "French",
    lang_english: "English",
    lang_arabic: "Arabic",

    // Experience Section
    experience_tag: "02 \u2014 Experience",
    experience_title: "Professional Experience",
    exp1_date: "04/2025 - 08/2025",
    exp1_title: "Application Development Internship",
    exp1_company: "Consort France",
    exp1_desc: "In charge of developing an integrated management solution for the service center, covering multiple operational aspects of the company.",
    exp1_point1: "Development of complete unit test coverage, ensuring code reliability",
    exp1_point2: "Integration of quality and security analyses via SonarQube, optimizing maintenance",
    exp1_point3: "Configuration of DevOps environment with Azure for continuous delivery",
    exp1_point4: "Implementation of AI features for predictive incident analysis",

    exp2_date: "02/2024 - 05/2024",
    exp2_title: "Web Design Internship",
    exp2_company: "Algiers Port Enterprise",
    exp2_desc: "Design and implementation of a digital solution for personnel management.",
    exp2_point1: "Development of an intuitive user interface with Laravel and Bootstrap",
    exp2_point2: "Optimization of data flows with existing infrastructure",
    exp2_point3: "Automation of validation and notification processes",
    exp2_point4: "Improvement of HR productivity and employee satisfaction",

    // Projects Section
    projects_tag: "03 \u2014 Projects",
    projects_title: "Projects",
    viewProject: "View project",
    privateProject: "Private project",
    viewGallery: "View gallery",
    imageCounter: "Image {current} of {total}",

    // Education Section
    education_tag: "04 \u2014 Education",
    education_title: "Education",
    edu0_date: "09/2025 - Present",
    edu0_title: "Master's in Software Science",
    edu0_location: "Universit\u00e9 Toulouse Paul Sabatier \u2013 Toulouse, France",
    edu0_point1: "Advanced design of distributed software systems",
    edu0_point2: "Formal methods and software verification",
    edu0_point3: "Research and innovation in software engineering",

    edu1_date: "09/2023 - 08/2025",
    edu1_title: "Bachelor's Degree in Computer Science - Fundamentals and Applications",
    edu1_location: "University of Western Brittany - Brest, France",
    edu1_point1: "Design and modeling of complex computer systems",
    edu1_point2: "Application development using agile methodologies",
    edu1_point3: "Exploration of hardware architectures and network protocols",

    edu2_date: "09/2021 - 06/2024",
    edu2_title: "Bachelor's Degree in Software Engineering and Information Systems",
    edu2_location: "Houari Boumediene University - Algiers, Algeria",
    edu2_point1: "Architecture and design of scalable applications",
    edu2_point2: "Development methodologies and quality assurance",
    edu2_point3: "System integration and enterprise software solutions",

    edu3_date: "2023",
    edu3_title: "CLES B2 English",
    edu3_location: "Certification of English language proficiency",
    edu3_desc: "Professional mastery of written and oral communication in English",

    // Contact Section
    contact_tag: "05 \u2014 Contact",
    contact_title: "Contact",
    contact_intro: "Have a project in mind or an opportunity? Don't hesitate to reach out.",
    contact_email: "Email",
    contact_location: "Location",
    contact_languages: "Languages",
    contact_languages_list: "French (Advanced), English (Advanced)",
    contact_name: "Your name",
    contact_email_input: "Your email",
    contact_subject: "Subject",
    contact_message: "Message",
    contact_send: "Send",

    // Alerts
    alert_success: "Message sent successfully!",
    alert_error: "Error sending message. Please try again."
  }
};
