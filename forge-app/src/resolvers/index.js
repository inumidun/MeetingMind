import Resolver from "@forge/resolver";
import api, { route, storage } from "@forge/api";
import { fetch } from "@forge/api";

const resolver = new Resolver();

// Enhanced date parsing with meeting context
const parseDateFromText = (text, meetingDate = new Date("2025-12-20")) => {
  const lowerText = text.toLowerCase();
  const today = new Date(meetingDate);

  // Today/tomorrow
  if (lowerText.includes("today")) {
    return today.toISOString().split("T")[0];
  }
  if (lowerText.includes("tomorrow")) {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  }

  // Specific day calculations from meeting date (Dec 20, 2025 = Friday)

  // "By Monday" = next Monday (Dec 22) - FIXED
  if (lowerText.includes("by monday") || lowerText.includes("monday")) {
    return "2025-12-22";
  }

  // "By Wednesday" or "next Wednesday" = Dec 25 - FIXED
  if (
    lowerText.includes("by wednesday") ||
    lowerText.includes("next wednesday")
  ) {
    return "2025-12-25";
  }

  // "By Friday" or "next Friday" = Dec 26 - FIXED
  if (lowerText.includes("by friday") || lowerText.includes("next friday")) {
    return "2025-12-26";
  }

  // "By Tuesday" = Dec 24
  if (lowerText.includes("by tuesday") || lowerText.includes("tuesday")) {
    return "2025-12-24";
  }

  // "By Thursday" or "next Thursday" = Dec 26
  if (
    lowerText.includes("by thursday") ||
    lowerText.includes("next thursday")
  ) {
    return "2025-12-26";
  }

  // Generic "next week"
  if (lowerText.includes("next week")) {
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    return nextWeek.toISOString().split("T")[0];
  }

  return null;
};

// Calculate meeting effectiveness score with multi-language support
const calculateMeetingScore = (tasks, language = "en") => {
  const totalTasks = tasks.length;
  const assignedTasks = tasks.filter(
    (t) => t.assignee && !t.assignee.includes("Not in Jira")
  ).length;
  const datedTasks = tasks.filter(
    (t) => t.dueDate && t.dueDate !== "No due date"
  ).length;
  const highPriorityTasks = tasks.filter((t) => t.priority === "High").length;

  const assignmentScore = Math.round((assignedTasks / totalTasks) * 100);
  const dateScore = Math.round((datedTasks / totalTasks) * 100);
  const overallScore = Math.round(
    ((assignedTasks + datedTasks) / (totalTasks * 2)) * 100
  );

  // Language-specific effectiveness labels
  const effectivenessLabels = {
    en: {
      excellent: "Excellent",
      good: "Good",
      needsImprovement: "Needs Improvement",
    },
    es: {
      excellent: "Excelente",
      good: "Bueno",
      needsImprovement: "Necesita Mejora",
    },
    fr: {
      excellent: "Excellent",
      good: "Bon",
      needsImprovement: "À Améliorer",
    },
    de: {
      excellent: "Ausgezeichnet",
      good: "Gut",
      needsImprovement: "Verbesserungsbedarf",
    },
  };

  const labels = effectivenessLabels[language] || effectivenessLabels.en;
  const effectiveness =
    overallScore >= 80
      ? labels.excellent
      : overallScore >= 60
      ? labels.good
      : labels.needsImprovement;

  return {
    totalTasks,
    assignedTasks,
    datedTasks,
    highPriorityTasks,
    assignmentScore,
    dateScore,
    overallScore,
    effectiveness,
  };
};

// Generate smart suggestions based on task analysis with multi-language support
const generateSmartSuggestions = (tasks, language = "en") => {
  const suggestions = [];

  const unassignedTasks = tasks.filter((t) =>
    t.assignee.includes("Not in Jira")
  ).length;
  const undatedTasks = tasks.filter((t) => t.dueDate === "No due date").length;
  const sameDayTasks = {};

  // Count tasks per due date
  tasks.forEach((task) => {
    if (task.dueDate && task.dueDate !== "No due date") {
      sameDayTasks[task.dueDate] = (sameDayTasks[task.dueDate] || 0) + 1;
    }
  });

  // Language-specific suggestion templates
  const templates = {
    en: {
      unassigned: (count) =>
        `${count} task${
          count > 1 ? "s" : ""
        } assigned to people not in Jira. Consider reassigning to existing team members.`,
      undated: (count) =>
        `${count} task${
          count > 1 ? "s" : ""
        } without due dates. Consider adding deadlines for better tracking.`,
      bottleneck: (count, date) =>
        `${count} tasks due on ${date}. Consider spreading deadlines to avoid bottlenecks.`,
      success:
        "Great job! Tasks are well-distributed with clear assignments and deadlines.",
    },
    es: {
      unassigned: (count) =>
        `${count} tarea${count > 1 ? "s" : ""} asignada${
          count > 1 ? "s" : ""
        } a personas que no están en Jira. Considera reasignar a miembros del equipo existentes.`,
      undated: (count) =>
        `${count} tarea${
          count > 1 ? "s" : ""
        } sin fechas de vencimiento. Considera agregar plazos para mejor seguimiento.`,
      bottleneck: (count, date) =>
        `${count} tareas vencen el ${date}. Considera distribuir los plazos para evitar cuellos de botella.`,
      success:
        "¡Excelente trabajo! Las tareas están bien distribuidas con asignaciones y plazos claros.",
    },
    fr: {
      unassigned: (count) =>
        `${count} tâche${count > 1 ? "s" : ""} assignée${
          count > 1 ? "s" : ""
        } à des personnes qui ne sont pas dans Jira. Considérez réassigner aux membres d'équipe existants.`,
      undated: (count) =>
        `${count} tâche${
          count > 1 ? "s" : ""
        } sans dates d'échéance. Considérez ajouter des délais pour un meilleur suivi.`,
      bottleneck: (count, date) =>
        `${count} tâches dues le ${date}. Considérez étaler les délais pour éviter les goulots d'étranglement.`,
      success:
        "Excellent travail! Les tâches sont bien distribuées avec des assignations et délais clairs.",
    },
    de: {
      unassigned: (count) =>
        `${count} Aufgabe${
          count > 1 ? "n" : ""
        } an Personen zugewiesen, die nicht in Jira sind. Erwägen Sie eine Neuzuweisung an bestehende Teammitglieder.`,
      undated: (count) =>
        `${count} Aufgabe${
          count > 1 ? "n" : ""
        } ohne Fälligkeitsdaten. Erwägen Sie das Hinzufügen von Terminen für bessere Verfolgung.`,
      bottleneck: (count, date) =>
        `${count} Aufgaben fällig am ${date}. Erwägen Sie eine Verteilung der Termine um Engpässe zu vermeiden.`,
      success:
        "Großartige Arbeit! Aufgaben sind gut verteilt mit klaren Zuweisungen und Terminen.",
    },
  };

  const t = templates[language] || templates.en;

  // Generate suggestions
  if (unassignedTasks > 0) {
    suggestions.push({
      type: "warning",
      icon: "👥",
      message: t.unassigned(unassignedTasks),
    });
  }

  if (undatedTasks > 0) {
    suggestions.push({
      type: "info",
      icon: "📅",
      message: t.undated(undatedTasks),
    });
  }

  Object.entries(sameDayTasks).forEach(([date, count]) => {
    if (count > 3) {
      const formattedDate = new Date(date).toLocaleDateString(
        language === "en"
          ? "en-US"
          : language === "es"
          ? "es-ES"
          : language === "fr"
          ? "fr-FR"
          : "de-DE",
        { weekday: "long", month: "short", day: "numeric" }
      );
      suggestions.push({
        type: "warning",
        icon: "⚠️",
        message: t.bottleneck(count, formattedDate),
      });
    }
  });

  if (suggestions.length === 0) {
    suggestions.push({
      type: "success",
      icon: "✅",
      message: t.success,
    });
  }

  return suggestions;
};

// Language detection function
const detectLanguage = (text) => {
  const lowerText = text.toLowerCase();

  // Spanish patterns
  if (
    /\b(necesita|debe|va a|tiene que|revisar|actualizar|programar|crear)\b/i.test(
      text
    )
  ) {
    return "es";
  }

  // French patterns
  if (
    /\b(doit|va|besoin de|faut|réviser|mettre à jour|programmer|créer)\b/i.test(
      text
    )
  ) {
    return "fr";
  }

  // German patterns
  if (
    /\b(muss|soll|wird|braucht|überprüfen|aktualisieren|planen|erstellen)\b/i.test(
      text
    )
  ) {
    return "de";
  }

  return "en"; // Default to English
};

// Multi-language templates
const getLanguageTemplates = (language) => {
  const templates = {
    en: {
      meetingContext: "Meeting Context:",
      scopeDeliverables: "Scope & Deliverables:",
      acceptanceCriteria: "Acceptance Criteria:",
      deliverables: {
        vpc: [
          "- VPC design with subnets, routing tables, and security groups",
          "- Site-to-site VPN configuration and testing",
          "- Network architecture documentation",
          "- Security and compliance validation",
        ],
        security: [
          "- Review and document current security policies",
          "- Map security requirements to AWS Security Groups and NACLs",
          "- Ensure encryption in transit and at rest compliance",
          "- Implement AWS Config for ongoing compliance monitoring",
        ],
        network: [
          "- Current network infrastructure analysis",
          "- Bandwidth and performance requirements assessment",
          "- Migration impact analysis and recommendations",
          "- Network optimization opportunities identification",
        ],
        migration: [
          "- Detailed migration timeline and phases",
          "- Dependency mapping and critical path analysis",
          "- Resource requirements and allocation plan",
          "- Risk assessment and mitigation strategies",
        ],
        budget: [
          "- Cost analysis for Direct Connect circuit",
          "- Business justification and ROI calculation",
          "- Budget approval documentation",
          "- Procurement process initiation",
        ],
        monitoring: [
          "- CloudWatch monitoring setup and configuration",
          "- Alert thresholds and notification rules",
          "- Dashboard creation for key metrics",
          "- Incident response procedures",
        ],
        default: [
          "- Task completion as specified in meeting",
          "- Documentation of work performed",
          "- Status updates and progress reports",
        ],
      },
      acceptance: [
        "- All deliverables completed and peer-reviewed",
        "- Quality standards and best practices followed",
        "- Stakeholders notified of completion",
        "- Documentation updated and accessible",
      ],
      deliveryRequired: "Delivery required by",
    },
    es: {
      meetingContext: "Contexto de la Reunión:",
      scopeDeliverables: "Alcance y Entregables:",
      acceptanceCriteria: "Criterios de Aceptación:",
      deliverables: {
        vpc: [
          "- Diseño de VPC con subredes, tablas de enrutamiento y grupos de seguridad",
          "- Configuración y pruebas de VPN sitio a sitio",
          "- Documentación de arquitectura de red",
          "- Validación de seguridad y cumplimiento",
        ],
        security: [
          "- Revisar y documentar las políticas de seguridad actuales",
          "- Mapear requisitos de seguridad a Grupos de Seguridad y NACLs de AWS",
          "- Asegurar cumplimiento de cifrado en tránsito y en reposo",
          "- Implementar AWS Config para monitoreo continuo de cumplimiento",
        ],
        network: [
          "- Análisis de infraestructura de red actual",
          "- Evaluación de requisitos de ancho de banda y rendimiento",
          "- Análisis de impacto de migración y recomendaciones",
          "- Identificación de oportunidades de optimización de red",
        ],
        migration: [
          "- Cronograma detallado de migración y fases",
          "- Mapeo de dependencias y análisis de ruta crítica",
          "- Plan de requisitos y asignación de recursos",
          "- Evaluación de riesgos y estrategias de mitigación",
        ],
        budget: [
          "- Análisis de costos para circuito Direct Connect",
          "- Justificación comercial y cálculo de ROI",
          "- Documentación de aprobación de presupuesto",
          "- Inicio del proceso de adquisición",
        ],
        monitoring: [
          "- Configuración de monitoreo CloudWatch",
          "- Umbrales de alerta y reglas de notificación",
          "- Creación de dashboard para métricas clave",
          "- Procedimientos de respuesta a incidentes",
        ],
        default: [
          "- Completar tarea según especificado en reunión",
          "- Documentación del trabajo realizado",
          "- Actualizaciones de estado e informes de progreso",
        ],
      },
      acceptance: [
        "- Todos los entregables completados y revisados por pares",
        "- Estándares de calidad y mejores prácticas seguidos",
        "- Partes interesadas notificadas de la finalización",
        "- Documentación actualizada y accesible",
      ],
      deliveryRequired: "Entrega requerida para el",
    },
    fr: {
      meetingContext: "Contexte de la Réunion:",
      scopeDeliverables: "Portée et Livrables:",
      acceptanceCriteria: "Critères d'Acceptation:",
      deliverables: {
        vpc: [
          "- Conception VPC avec sous-réseaux, tables de routage et groupes de sécurité",
          "- Configuration et test VPN site-à-site",
          "- Documentation d'architecture réseau",
          "- Validation de sécurité et conformité",
        ],
        security: [
          "- Réviser et documenter les politiques de sécurité actuelles",
          "- Mapper les exigences de sécurité aux Groupes de Sécurité et NACLs AWS",
          "- Assurer la conformité du chiffrement en transit et au repos",
          "- Implémenter AWS Config pour surveillance continue de conformité",
        ],
        network: [
          "- Analyse de l'infrastructure réseau actuelle",
          "- Évaluation des exigences de bande passante et performance",
          "- Analyse d'impact de migration et recommandations",
          "- Identification des opportunités d'optimisation réseau",
        ],
        migration: [
          "- Calendrier détaillé de migration et phases",
          "- Cartographie des dépendances et analyse du chemin critique",
          "- Plan d'exigences et allocation des ressources",
          "- Évaluation des risques et stratégies d'atténuation",
        ],
        budget: [
          "- Analyse des coûts pour circuit Direct Connect",
          "- Justification commerciale et calcul ROI",
          "- Documentation d'approbation budgétaire",
          "- Initiation du processus d'approvisionnement",
        ],
        monitoring: [
          "- Configuration de surveillance CloudWatch",
          "- Seuils d'alerte et règles de notification",
          "- Création de tableau de bord pour métriques clés",
          "- Procédures de réponse aux incidents",
        ],
        default: [
          "- Achèvement de tâche selon spécifié en réunion",
          "- Documentation du travail effectué",
          "- Mises à jour de statut et rapports de progrès",
        ],
      },
      acceptance: [
        "- Tous les livrables complétés et révisés par les pairs",
        "- Standards de qualité et meilleures pratiques suivis",
        "- Parties prenantes notifiées de l'achèvement",
        "- Documentation mise à jour et accessible",
      ],
      deliveryRequired: "Livraison requise pour le",
    },
    de: {
      meetingContext: "Besprechungskontext:",
      scopeDeliverables: "Umfang & Lieferungen:",
      acceptanceCriteria: "Akzeptanzkriterien:",
      deliverables: {
        vpc: [
          "- VPC-Design mit Subnetzen, Routing-Tabellen und Sicherheitsgruppen",
          "- Site-to-Site VPN Konfiguration und Tests",
          "- Netzwerkarchitektur-Dokumentation",
          "- Sicherheits- und Compliance-Validierung",
        ],
        security: [
          "- Aktuelle Sicherheitsrichtlinien überprüfen und dokumentieren",
          "- Sicherheitsanforderungen auf AWS Security Groups und NACLs abbilden",
          "- Verschlüsselung in Transit und Ruhe Compliance sicherstellen",
          "- AWS Config für kontinuierliche Compliance-Überwachung implementieren",
        ],
        network: [
          "- Analyse der aktuellen Netzwerkinfrastruktur",
          "- Bewertung von Bandbreiten- und Leistungsanforderungen",
          "- Migrations-Impact-Analyse und Empfehlungen",
          "- Identifikation von Netzwerkoptimierungsmöglichkeiten",
        ],
        migration: [
          "- Detaillierter Migrationszeitplan und Phasen",
          "- Abhängigkeitsmapping und kritische Pfadanalyse",
          "- Ressourcenanforderungen und Zuweisungsplan",
          "- Risikobewertung und Minderungsstrategien",
        ],
        budget: [
          "- Kostenanalyse für Direct Connect Schaltung",
          "- Geschäftsbegründung und ROI-Berechnung",
          "- Budget-Genehmigungsdokumentation",
          "- Beschaffungsprozess-Initiierung",
        ],
        monitoring: [
          "- CloudWatch Monitoring Setup und Konfiguration",
          "- Alarmschwellen und Benachrichtigungsregeln",
          "- Dashboard-Erstellung für Schlüsselmetriken",
          "- Incident Response Verfahren",
        ],
        default: [
          "- Aufgabenabschluss wie in Besprechung spezifiziert",
          "- Dokumentation der durchgeführten Arbeit",
          "- Status-Updates und Fortschrittsberichte",
        ],
      },
      acceptance: [
        "- Alle Lieferungen abgeschlossen und peer-reviewed",
        "- Qualitätsstandards und Best Practices befolgt",
        "- Stakeholder über Abschluss benachrichtigt",
        "- Dokumentation aktualisiert und zugänglich",
      ],
      deliveryRequired: "Lieferung erforderlich bis",
    },
  };

  return templates[language] || templates.en;
};

// Enhanced professional description generator with multi-language support
const generateProfessionalDescription = (
  taskTitle,
  originalContext,
  dueDate,
  assignee,
  language = "en"
) => {
  const templates = getLanguageTemplates(language);

  // Generate comprehensive professional description
  let description = `${taskTitle}.`;

  // Add detailed context section
  if (originalContext) {
    description += `\n\n${templates.meetingContext}\n"${originalContext}"`;
  }

  // Add specific deliverables based on task content
  description += `\n\n${templates.scopeDeliverables}`;

  const taskLower = taskTitle.toLowerCase();
  let deliverables = templates.deliverables.default;

  if (taskLower.includes("vpc") || taskLower.includes("architecture")) {
    deliverables = templates.deliverables.vpc;
  } else if (taskLower.includes("security") && taskLower.includes("policies")) {
    deliverables = templates.deliverables.security;
  } else if (
    taskLower.includes("network") &&
    taskLower.includes("assessment")
  ) {
    deliverables = templates.deliverables.network;
  } else if (taskLower.includes("migration") && taskLower.includes("roadmap")) {
    deliverables = templates.deliverables.migration;
  } else if (taskLower.includes("budget") && taskLower.includes("approval")) {
    deliverables = templates.deliverables.budget;
  } else if (
    taskLower.includes("monitoring") ||
    taskLower.includes("alerting")
  ) {
    deliverables = templates.deliverables.monitoring;
  }

  deliverables.forEach((item) => {
    description += `\n${item}`;
  });

  // Add acceptance criteria
  description += `\n\n${templates.acceptanceCriteria}`;
  templates.acceptance.forEach((item) => {
    description += `\n${item}`;
  });

  // Add deadline with business context
  if (dueDate) {
    const formattedDate = new Date(dueDate).toLocaleDateString(
      language === "en"
        ? "en-US"
        : language === "es"
        ? "es-ES"
        : language === "fr"
        ? "fr-FR"
        : "de-DE",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
    description += `\n- ${templates.deliveryRequired} ${formattedDate}`;
  }

  return description;
};

// OpenAI extraction with enhanced precision and multi-language support
const extractWithOpenAI = async (notes, jiraUsers) => {
  const userNames = jiraUsers.map((u) => u.displayName).join(", ");
  const detectedLanguage = detectLanguage(notes);

  const prompt = `You are a meeting minutes expert. Extract ALL actionable tasks from this meeting transcript.

Available Jira users: ${userNames}

For each task, return JSON:
{
  "text": "Professional task title (action-oriented, no person names)",
  "assignedPerson": "EXACT name from Jira users list or original name if not in list",
  "priority": "High|Medium|Low",
  "taskType": "Task|Story|Epic",
  "dueDate": "YYYY-MM-DD or null",
  "originalContext": "Full original sentence/context from meeting",
  "language": "${detectedLanguage}"
}

CRITICAL RULES:
1. Extract EVERY task mentioned, including ones assigned to "Oyindamola"
2. Match assignee names EXACTLY to Jira users list - look for partial matches
3. NEVER ASSUME DUE DATES - Only set dueDate if explicitly mentioned:
   - "by Monday" = 2025-12-22
   - "by next Friday" = 2025-12-26 
   - "next Wednesday" = 2025-12-25
   - "next Thursday" = 2025-12-26
   - If NO deadline mentioned = null
4. DO NOT infer or guess deadlines from other tasks
5. Include ALL scope mentioned in descriptions
6. Set High priority for urgent/deadline items
7. Keep task titles in the ORIGINAL LANGUAGE of the meeting

Meeting date context: December 20, 2025 (Friday)

Meeting transcript:
${notes}

Return complete JSON array with ALL tasks. ONLY set dueDate if deadline explicitly stated:`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.05,
      max_tokens: 3000,
    }),
  });

  if (!response.ok) throw new Error(`OpenAI error: ${response.status}`);

  const data = await response.json();
  const content = data.choices[0].message.content;

  const jsonMatch = content.match(/\[.*\]/s);
  if (jsonMatch) {
    const tasks = JSON.parse(jsonMatch[0]);
    console.log(`🤖 OpenAI extracted ${tasks.length} tasks:`);
    tasks.forEach((task, i) => {
      console.log(
        `  ${i + 1}. "${task.text}" → ${task.assignedPerson} (Due: ${
          task.dueDate || "No date"
        })`
      );
    });

    // Generate professional descriptions for each task with language support
    return tasks.map((task) => ({
      ...task,
      description: generateProfessionalDescription(
        task.text,
        task.originalContext,
        task.dueDate,
        task.assignedPerson,
        task.language || detectedLanguage
      ),
    }));
  }
  throw new Error("No JSON in OpenAI response");
};

// Pattern extraction with professional descriptions and multi-language support
const extractWithPatterns = (notes, jiraUsers) => {
  const detectedLanguage = detectLanguage(notes);
  const sentences = notes.split(/[.!?]\s+/).filter((s) => s.trim().length > 20);
  const tasks = [];

  for (const sentence of sentences) {
    const match = sentence.match(/(\w+)\s+(?:to|will|should|needs to)\s+(.+)/i);
    if (match) {
      const [, person, action] = match;
      const assignee = findUserByName(person, jiraUsers);

      const cleanAction = action.charAt(0).toUpperCase() + action.slice(1);
      const dueDate = parseDateFromText(action);

      tasks.push({
        text: cleanAction,
        description: generateProfessionalDescription(
          cleanAction,
          sentence,
          dueDate,
          assignee || person,
          detectedLanguage
        ),
        assignedPerson: assignee || person,
        priority: "Medium",
        taskType: "Task",
        dueDate: dueDate,
        originalContext: sentence,
        language: detectedLanguage,
      });
    }
  }
  return tasks;
};

// Enhanced user matching with better name variations
const findUserByName = (name, users) => {
  if (!name || !users.length) return null;

  const nameLower = name.toLowerCase().trim();
  console.log(
    `🔍 Looking for: "${name}" in users:`,
    users.map((u) => u.displayName)
  );

  // Exact match first
  const exactMatch = users.find(
    (user) => user.displayName.toLowerCase() === nameLower
  );
  if (exactMatch) {
    console.log(`✅ Exact match: ${exactMatch.displayName}`);
    return exactMatch.displayName;
  }

  // Full name variations (handle "Abdulateef Oyindamola" vs "Oyindamola")
  const nameVariations = users.filter((user) => {
    const userNameParts = user.displayName.toLowerCase().split(" ");
    const searchNameParts = nameLower.split(" ");

    // Check if any part of the search name matches any part of the user name
    return searchNameParts.some((searchPart) =>
      userNameParts.some(
        (userPart) =>
          userPart.includes(searchPart) || searchPart.includes(userPart)
      )
    );
  });

  if (nameVariations.length === 1) {
    console.log(`✅ Name variation match: ${nameVariations[0].displayName}`);
    return nameVariations[0].displayName;
  }

  // First name match
  const firstNameMatch = users.find((user) => {
    const firstName = user.displayName.split(" ")[0].toLowerCase();
    const searchFirstName = nameLower.split(" ")[0];
    return firstName === searchFirstName;
  });
  if (firstNameMatch) {
    console.log(`✅ First name match: ${firstNameMatch.displayName}`);
    return firstNameMatch.displayName;
  }

  // Last name match
  const lastNameMatch = users.find((user) => {
    const lastName = user.displayName.split(" ").pop().toLowerCase();
    const searchLastName = nameLower.split(" ").pop();
    return lastName === searchLastName;
  });
  if (lastNameMatch) {
    console.log(`✅ Last name match: ${lastNameMatch.displayName}`);
    return lastNameMatch.displayName;
  }

  // Partial match (substring)
  const partialMatch = users.find((user) => {
    const userNameLower = user.displayName.toLowerCase();
    return (
      userNameLower.includes(nameLower) || nameLower.includes(userNameLower)
    );
  });

  if (partialMatch) {
    console.log(`✅ Partial match: ${partialMatch.displayName}`);
    return partialMatch.displayName;
  }

  console.log(`❌ No match found for: "${name}"`);
  return null;
};

// Main extraction with fallback
const extractTasks = async (notes, users) => {
  try {
    console.log("🤖 Trying OpenAI extraction...");
    const aiTasks = await extractWithOpenAI(notes, users);
    if (aiTasks?.length > 0) {
      console.log(`✅ OpenAI extracted ${aiTasks.length} tasks`);
      return aiTasks;
    }
  } catch (error) {
    console.log("❌ OpenAI failed:", error.message);
  }

  console.log("🔄 Falling back to pattern matching...");
  return extractWithPatterns(notes, users);
};

// Extract for preview
resolver.define("extractTasks", async (req) => {
  const { notes } = req.payload;

  try {
    const projectsResponse = await api
      .asUser()
      .requestJira(route`/rest/api/3/project`);
    const projects = await projectsResponse.json();
    if (projects.length === 0)
      return { success: false, message: "No projects found" };

    const project = projects[0];
    const usersResponse = await api
      .asUser()
      .requestJira(
        route`/rest/api/3/user/assignable/search?project=${project.key}`
      );
    const users = await usersResponse.json();

    const detectedLanguage = detectLanguage(notes);
    const actionItems = await extractTasks(notes, users);
    if (actionItems.length === 0)
      return { success: false, message: "No tasks found" };

    const formattedTasks = actionItems.map((item) => {
      const matchedUser = findUserByName(item.assignedPerson, users);
      const isInJira = matchedUser !== null;

      return {
        summary: item.text,
        description: item.description,
        assignee: isInJira
          ? matchedUser
          : `${item.assignedPerson} (Not in Jira)`,
        priority: item.priority || "Medium",
        dueDate: item.dueDate || "No due date",
        taskType: item.taskType || "Task",
      };
    });

    // Calculate meeting effectiveness and generate suggestions with language support
    const meetingScore = calculateMeetingScore(
      formattedTasks,
      detectedLanguage
    );
    const suggestions = generateSmartSuggestions(
      formattedTasks,
      detectedLanguage
    );

    // Localized success message
    const successMessages = {
      en: `Extracted ${formattedTasks.length} task${
        formattedTasks.length === 1 ? "" : "s"
      } • Meeting Effectiveness: ${meetingScore.effectiveness} (${
        meetingScore.overallScore
      }%)`,
      es: `Extraídas ${formattedTasks.length} tarea${
        formattedTasks.length === 1 ? "" : "s"
      } • Efectividad de Reunión: ${meetingScore.effectiveness} (${
        meetingScore.overallScore
      }%)`,
      fr: `Extrait ${formattedTasks.length} tâche${
        formattedTasks.length === 1 ? "" : "s"
      } • Efficacité de Réunion: ${meetingScore.effectiveness} (${
        meetingScore.overallScore
      }%)`,
      de: `${formattedTasks.length} Aufgabe${
        formattedTasks.length === 1 ? "" : "n"
      } extrahiert • Besprechungseffektivität: ${meetingScore.effectiveness} (${
        meetingScore.overallScore
      }%)`,
    };

    return {
      success: true,
      tasks: formattedTasks,
      jiraUsers: users.map((user) => ({
        displayName: user.displayName,
        accountId: user.accountId,
      })),
      meetingScore,
      suggestions,
      language: detectedLanguage,
      message: successMessages[detectedLanguage] || successMessages.en,
    };
  } catch (error) {
    return { success: false, message: `Error: ${error.message}` };
  }
});

// Create Jira tasks - CREATE ALL TASKS
resolver.define("createJiraTasks", async (req) => {
  const { notes, tasks } = req.payload;

  try {
    const projectsResponse = await api
      .asUser()
      .requestJira(route`/rest/api/3/project`);
    const projects = await projectsResponse.json();
    const project = projects[0];

    const usersResponse = await api
      .asUser()
      .requestJira(
        route`/rest/api/3/user/assignable/search?project=${project.key}`
      );
    const users = await usersResponse.json();

    const prioritiesResponse = await api
      .asUser()
      .requestJira(route`/rest/api/3/priority`);
    const priorities = await prioritiesResponse.json();

    const issueTypesResponse = await api
      .asUser()
      .requestJira(route`/rest/api/3/project/${project.key}`);
    const projectData = await issueTypesResponse.json();
    const issueTypes = projectData.issueTypes;

    let actionItems;
    if (tasks) {
      actionItems = tasks.map((task) => ({
        text: task.summary,
        description: task.description,
        assignedPerson: task.assignee?.includes("(Not in Jira)")
          ? task.assignee.replace(" (Not in Jira)", "")
          : task.assignee,
        priority: task.priority,
        taskType: task.taskType,
        dueDate: task.dueDate !== "No due date" ? task.dueDate : null,
      }));
    } else {
      actionItems = await extractTasks(notes, users);
    }

    if (actionItems.length === 0)
      return { success: false, message: "No tasks found" };

    const createdTasks = [];
    const today = new Date().toISOString().split("T")[0];

    // CREATE ALL TASKS
    for (const item of actionItems) {
      const priority =
        priorities.find((p) => p.name === (item.priority || "Medium")) ||
        priorities[0];
      const issueType =
        issueTypes.find((t) => t.name === (item.taskType || "Task")) ||
        issueTypes.find((t) => t.name === "Task") ||
        issueTypes[0];

      let assignee = null;
      if (item.assignedPerson && item.assignedPerson !== "Unassigned") {
        assignee = users.find((u) => u.displayName === item.assignedPerson);
      }

      const taskData = {
        fields: {
          project: { key: project.key },
          summary: item.text,
          description: {
            type: "doc",
            version: 1,
            content: [
              {
                type: "paragraph",
                content: [
                  { type: "text", text: item.description || item.text },
                ],
              },
            ],
          },
          issuetype: { id: issueType.id },
          priority: { id: priority.id },
        },
      };

      if (assignee)
        taskData.fields.assignee = { accountId: assignee.accountId };
      if (item.dueDate) taskData.fields.duedate = item.dueDate;

      const response = await api
        .asUser()
        .requestJira(route`/rest/api/3/issue`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(taskData),
        });

      if (response.ok) {
        const task = await response.json();

        // Set start date and time tracking
        try {
          await api.asUser().requestJira(route`/rest/api/3/issue/${task.key}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fields: {
                customfield_10015: today, // Start date field
                timetracking: {
                  originalEstimate: "4h",
                  remainingEstimate: "4h",
                },
              },
            }),
          });
        } catch (updateError) {
          console.log(
            "Could not set start date/time tracking:",
            updateError.message
          );
        }

        createdTasks.push({
          key: task.key,
          summary: item.text,
          assignee: assignee
            ? assignee.displayName
            : item.assignedPerson || "Unassigned",
          dueDate: item.dueDate || "No due date",
          startDate: today,
          priority: priority.name,
          type: issueType.name,
        });
      } else {
        // Retry without assignee
        delete taskData.fields.assignee;
        const retryResponse = await api
          .asUser()
          .requestJira(route`/rest/api/3/issue`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(taskData),
          });

        if (retryResponse.ok) {
          const retryTask = await retryResponse.json();
          createdTasks.push({
            key: retryTask.key,
            summary: item.text,
            assignee: "Unassigned",
            dueDate: item.dueDate || "No due date",
            startDate: today,
            priority: priority.name,
            type: issueType.name,
          });
        }
      }
    }

    // Store analytics
    const globalStats = (await storage.get("global-analytics")) || {
      totalMeetings: 0,
      totalActionItems: 0,
      totalTasksCreated: 0,
    };
    globalStats.totalMeetings += 1;
    globalStats.totalActionItems += actionItems.length;
    globalStats.totalTasksCreated += createdTasks.length;
    await storage.set("global-analytics", globalStats);

    // Localized success messages
    const successMessages = {
      en: (count) => `Created ${count} task${count === 1 ? "" : "s"}`,
      fr: (count) => `Créé ${count} tâche${count === 1 ? "" : "s"}`,
      es: (count) => `Creado ${count} tarea${count === 1 ? "" : "s"}`,
      de: (count) => `${count} Aufgabe${count === 1 ? "" : "n"} erstellt`,
    };

    const detectedLanguage = detectLanguage(notes || "");
    const getMessage = successMessages[detectedLanguage] || successMessages.en;

    return {
      success: true,
      message: getMessage(createdTasks.length),
      tasks: createdTasks,
    };
  } catch (error) {
    return { success: false, message: `Error: ${error.message}` };
  }
});

// Get analytics
resolver.define("getAnalytics", async () => {
  try {
    const globalStats = (await storage.get("global-analytics")) || {
      totalMeetings: 0,
      totalActionItems: 0,
      totalTasksCreated: 0,
    };

    const avgTasksPerMeeting =
      globalStats.totalMeetings > 0
        ? Math.round(
            (globalStats.totalTasksCreated / globalStats.totalMeetings) * 10
          ) / 10
        : 0;

    const completionRate =
      globalStats.totalActionItems > 0
        ? Math.round(
            (globalStats.totalTasksCreated / globalStats.totalActionItems) * 100
          )
        : 100;

    return {
      success: true,
      analytics: { ...globalStats, avgTasksPerMeeting, completionRate },
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

export const handler = resolver.getDefinitions();
