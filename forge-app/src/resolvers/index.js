import Resolver from '@forge/resolver';
import api, { route } from '@forge/api';

const resolver = new Resolver();

resolver.define('createJiraTasks', async (req) => {
  const { notes } = req.payload;
  
  try {
    // Extract action items from notes
    const lines = notes.split('\n');
    const actionItems = lines
      .filter(line => line.trim().startsWith('-')) // Simple: just lines starting with -
      .map(line => line.trim().substring(1).trim()) // Remove - and trim
      .filter(item => item.length > 0);

    console.log('Found action items:', actionItems);

    if (actionItems.length === 0) {
      return { success: false, message: 'No action items found. Lines should start with -' };
    }

    // Get first available project
    const projectsResponse = await api.asUser().requestJira(route`/rest/api/3/project`);
    const projects = await projectsResponse.json();
    
    console.log('Found projects:', projects.length);
    
    if (projects.length === 0) {
      return { success: false, message: 'No Jira projects found' };
    }

    const project = projects[0];
    console.log('Using project:', project.key);
    
    // Get issue types for the project
    const issueTypesResponse = await api.asUser().requestJira(route`/rest/api/3/issuetype`);
    const issueTypes = await issueTypesResponse.json();
    const taskType = issueTypes.find(type => type.name === 'Task') || issueTypes[0];
    
    const createdTasks = [];

    // Create just the first task for testing
    const item = actionItems[0];
    const taskData = {
      fields: {
        project: { key: project.key },
        summary: item,
        description: {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Created from meeting notes via MeetingMind'
                }
              ]
            }
          ]
        },
        issuetype: { id: taskType.id }
      }
    };

    console.log('Creating task:', taskData);

    const response = await api.asUser().requestJira(route`/rest/api/3/issue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });

    if (response.ok) {
      const task = await response.json();
      createdTasks.push({ key: task.key, summary: item });
    } else {
      const error = await response.text();
      console.error('Jira API error:', error);
      return { success: false, message: `Jira API error: ${response.status}` };
    }

    return {
      success: true,
      message: `Created ${createdTasks.length} Jira task (demo)`,
      tasks: createdTasks
    };

  } catch (error) {
    console.error('Error creating Jira tasks:', error);
    return { success: false, message: `Error: ${error.message}` };
  }
});

export const handler = resolver.getDefinitions();
