/* ========================================================
   CERTIFICATES DATA
   ────────────────────────────────────────────────────────
   Para adicionar um novo certificado, basta copiar o
   template abaixo e preencher os campos. A ordem do array
   define a ordem de exibição no portfólio.

   TEMPLATE:
   {
       title: "Nome do Certificado",
       issuer: "Instituição Emissora",
       date: "Mês Ano",
       category: "Categoria",
       description: "Descrição breve do certificado.",
       skills: ["Skill 1", "Skill 2", "Skill 3"],
       image: "caminho/para/imagem.png",  // opcional
       credentialUrl: "https://link-da-credencial.com",  // opcional
   }
   ======================================================== */

const CERTIFICATES = [
    {
        title: "Domine a IA com Gemini",
        issuer: "Santander & Google",
        date: "Junho 2026",
        category: "Ferramentas de IA",
        description: "Certificação que comprova a conclusão do curso 'Domine a IA com Gemini', que aborda o uso de ferramentas do Google Gemini para impulsionar a produtividade, inovação, criatividade humana, automação e conceitos de inteligência artificial.",
        skills: ["Prompt Engineering", "Multimodal Functions", "Integration and Automation in the Workspace", "Responsible Use"],
        image: "images/santander-gemini.jpg",
        credentialUrl: "#",
    },
    {
        title: "Fundamentos de Segurança Cibernética",
        issuer: "Santander & IBM",
        date: "Julho 2026",
        category: "Segurança",
        description: "Certificação que comprova a conclusão do curso 'Fundamentos de Segurança Cibernética', que aborda os princípios básicos de segurança cibernética, incluindo proteção de dados, tipos e prevenção de ataques e melhores práticas para manter sistemas seguros.",
        skills: ["Cybersecurity", "Social Engineering", "Digital Security", "Data Protection", "Cyber Threats", "Physical Security", "Attack Prevention"],
        image: "images/santander-seguranca-cibernetica.jpg",
        credentialUrl: "#",
    },
    {
        title: "Ética na Inteligência Artificial",
        issuer: "SENAI",
        date: "Março 2026",
        category: "Ferramentas de IA",
        description: "Certificação que comprova a conclusão do curso 'Ética na IA', que aborda os princípios do uso da inteligência artificial de modo ético e eficiente da IA no ambiente de trabalho e pessoal.",
        skills: ["Definition of Artificial Intelligence", "The importance of ethics in AI", "Pillars of Responsible AI", "Legal Framework for AI", "The Future of AI"],
        image: "images/senai-etica-na-ia.jpg",
        credentialUrl: "https://www.sp.senai.br/consulta-certificado?qrcode=00054/8348411",
    },
    {
        title: "Capacidades e Limitações da Inteligência Artificial",
        issuer: "Anthropic",
        date: "Julho 2026",
        category: "IA Generativa",
        description: "Certificação que comprova a conclusão do curso 'Capacidades e Limitações da IA', que aborda como uma IA generativa funciona e é desenvolvida, incluindo suas capacidades elimitações.",
        skills: ["Understanding Generative AI", "Capabilities of Generative AI", "Limitations of Generative AI", "Responsible Use of Generative AI"],
        image: "images/capacidades-limitacoes-ia.jpg",
        credentialUrl: "https://verify.skilljar.com/c/qv7k9vtnmsxn",
    },
];

/* ──────────────────────────────────────────────
   CATEGORY COLORS
   Defina cores personalizadas por categoria.
   Se uma categoria não tiver cor definida, será
   usada a cor padrão (accent-primary).
   ────────────────────────────────────────────── */

const CATEGORY_COLORS = {
    "Cloud Computing":      { bg: "rgba(59, 130, 246, 0.10)", border: "rgba(59, 130, 246, 0.20)", text: "#60a5fa" },
    "Desenvolvimento Web":  { bg: "rgba(16, 185, 129, 0.10)", border: "rgba(16, 185, 129, 0.20)", text: "#34d399" },
    "Machine Learning":     { bg: "rgba(245, 158, 11, 0.10)", border: "rgba(245, 158, 11, 0.20)", text: "#fbbf24" },
    "DevOps":               { bg: "rgba(239, 68, 68, 0.10)",  border: "rgba(239, 68, 68, 0.20)",  text: "#f87171" },
    "Segurança":            { bg: "rgba(168, 85, 247, 0.10)", border: "rgba(168, 85, 247, 0.20)", text: "#c084fc" },
    "Data Science":         { bg: "rgba(34, 211, 238, 0.10)", border: "rgba(34, 211, 238, 0.20)", text: "#22d3ee" },
    "Design":               { bg: "rgba(236, 72, 153, 0.10)", border: "rgba(236, 72, 153, 0.20)", text: "#f472b6" },
};
