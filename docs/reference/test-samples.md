# MeetingMind Test Samples

Test these samples to verify multi-language functionality and AI extraction accuracy.

## English Sample

```
Meeting: Q4 Planning Session - December 20, 2025

Attendees: John Smith, Sarah Johnson, Mike Wilson, Jennifer Wu

Action Items:
- John to review the budget by Monday
- Sarah will update the project timeline by next Wednesday  
- Mike needs to schedule client meeting next Friday
- Jennifer to prepare presentation slides by Thursday
- Team decided to use React for the frontend development
- Budget approval needed for new server infrastructure
- Security policies review required before deployment

Next meeting: January 3rd, 2026
```

**Expected Output**: 6-7 Jira tasks with proper assignees and due dates

## Spanish Sample

```
Reunión: Planificación del Q4 - 20 de diciembre, 2025

Asistentes: Juan García, María López, Carlos Rodríguez

Elementos de acción:
- Juan necesita revisar el presupuesto para el lunes
- María actualizará la cronología del proyecto para el miércoles que viene
- Carlos debe programar reunión con cliente para el viernes próximo
- El equipo decidió usar React para el desarrollo frontend
- Se requiere aprobación del presupuesto para nueva infraestructura

Próxima reunión: 3 de enero, 2026
```

**Expected Output**: 4-5 Jira tasks in Spanish with proper assignees

## French Sample

```
Réunion: Planification Q4 - 20 décembre 2025

Participants: Jean Dupont, Marie Martin, Pierre Durand

Points d'action:
- Jean doit réviser le budget pour lundi
- Marie mettra à jour le calendrier du projet pour mercredi prochain
- Pierre doit programmer une réunion client pour vendredi prochain
- L'équipe a décidé d'utiliser React pour le développement frontend
- Approbation budgétaire nécessaire pour la nouvelle infrastructure

Prochaine réunion: 3 janvier 2026
```

**Expected Output**: 4-5 Jira tasks in French with proper assignees

## German Sample

```
Besprechung: Q4-Planung - 20. Dezember 2025

Teilnehmer: Hans Müller, Anna Schmidt, Klaus Weber

Aktionspunkte:
- Hans soll das Budget bis Montag überprüfen
- Anna wird den Projektzeitplan bis nächsten Mittwoch aktualisieren
- Klaus muss ein Kundentreffen für nächsten Freitag planen
- Das Team hat beschlossen, React für die Frontend-Entwicklung zu verwenden
- Budgetgenehmigung für neue Server-Infrastruktur erforderlich

Nächste Besprechung: 3. Januar 2026
```

**Expected Output**: 4-5 Jira tasks in German with proper assignees

## Complex Mixed Sample

```
Meeting: International Project Kickoff - December 20, 2025

Global Team:
- John Smith (US) - Project Lead
- María González (Spain) - UX Designer  
- Jean Dubois (France) - Backend Developer
- Hans Weber (Germany) - DevOps Engineer

Action Items:
- John to create project charter by Monday
- María necesita diseñar wireframes para miércoles
- Jean doit configurer l'environnement de développement pour vendredi
- Hans soll die CI/CD Pipeline bis nächste Woche einrichten
- All team members to attend daily standups at 9 AM UTC
- Budget review meeting scheduled for next Thursday
- Security compliance check required before go-live

Technical Decisions:
- Frontend: React with TypeScript
- Backend: Node.js with Express
- Database: PostgreSQL
- Deployment: AWS with Docker containers

Next meeting: December 27, 2025 at 9 AM UTC
```

**Expected Output**: 6-8 Jira tasks with mixed languages and proper technical context

## Testing Instructions

1. **Copy any sample** into the MeetingMind macro
2. **Click "Transform Meeting Notes"**
3. **Verify the output** matches expected results:
   - Correct number of tasks extracted
   - Proper user assignment (or "Not in Jira" for non-existent users)
   - Accurate due date parsing
   - Appropriate priority levels
   - Professional task descriptions
   - Original language preserved

## Expected Behavior

- ✅ **User Matching**: Exact name matches should assign to real Jira users
- ✅ **Date Parsing**: "by Monday" = 2025-12-22, "next Wednesday" = 2025-12-25
- ✅ **Language Detection**: Tasks created in original meeting language
- ✅ **Priority Assignment**: Deadline-driven tasks get higher priority
- ✅ **Fallback Handling**: Pattern matching works when AI fails
- ✅ **Professional Descriptions**: Comprehensive task details with acceptance criteria