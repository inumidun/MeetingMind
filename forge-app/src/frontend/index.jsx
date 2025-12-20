import React, { useState, useEffect } from 'react';
import ForgeReconciler, { Text, Button, Stack, Heading, Modal, ModalTransition, ModalHeader, ModalTitle, ModalBody, ModalFooter, TextArea, Box, Inline, ButtonGroup } from '@forge/react';
import { invoke } from '@forge/bridge';

const MetricCard = ({ value, label, color, icon, subtitle }) => {
  return (
    <Box xcss={{
      background: color,
      padding: 'space.400',
      borderRadius: 'border.radius.200',
      textAlign: 'center',
      color: 'white',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
      minHeight: '140px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <Text xcss={{ fontSize: '2.5em', marginBottom: 'space.050', color: 'white' }}>{icon}</Text>
      <Text xcss={{ fontSize: '2.8em', fontWeight: '800', color: 'white', lineHeight: '1', marginBottom: 'space.050' }}>
        {value}
      </Text>
      <Text xcss={{ fontSize: '0.95em', color: 'white', fontWeight: '600', opacity: 0.95, letterSpacing: '0.5px' }}>
        {label}
      </Text>
      {subtitle && (
        <Text xcss={{ fontSize: '0.75em', color: 'white', marginTop: 'space.050', opacity: 0.8 }}>
          {subtitle}
        </Text>
      )}
    </Box>
  );
};

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [lastProcessedNotes, setLastProcessedNotes] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [extractedTasks, setExtractedTasks] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const loadAnalytics = async () => {
    try {
      const response = await invoke('getAnalytics');
      if (response.success) {
        setAnalytics(response.analytics);
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
    setResult(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNotes('');
    setResult(null);
    setProcessing(false);
    setLastProcessedNotes('');
    setExtractedTasks(null);
    setShowPreview(false);
  };

  const handleExtract = async () => {
    if (!notes.trim()) {
      setResult({ success: false, message: 'Please enter meeting notes' });
      return;
    }

    setProcessing(true);
    setResult(null);
    
    try {
      const response = await invoke('extractTasks', { notes });
      if (response.success) {
        setExtractedTasks(response.tasks);
        setShowPreview(true);
      } else {
        setResult({ success: false, message: response.message || 'Failed to extract tasks' });
      }
    } catch (error) {
      setResult({ success: false, message: 'Error extracting tasks' });
    }
    
    setProcessing(false);
  };

  const handleApprove = async () => {
    setProcessing(true);
    
    try {
      const response = await invoke('createJiraTasks', { tasks: extractedTasks });
      setResult(response);
      if (response.success) {
        setLastProcessedNotes(notes);
        setShowPreview(false);
        loadAnalytics();
      }
    } catch (error) {
      setResult({ success: false, message: 'Error creating tasks' });
    }
    
    setProcessing(false);
  };

  const handleDiscard = () => {
    setExtractedTasks(null);
    setShowPreview(false);
    setResult(null);
  };

  return (
    <Stack space="medium">
      <Box
        xcss={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: 'space.300',
          borderRadius: 'border.radius.200',
          marginBottom: 'space.200'
        }}
      >
        <Heading size="medium" xcss={{ color: 'white', fontWeight: '600' }}>
          MeetingMind - Powered by Williams Racing
        </Heading>
        <Text xcss={{ color: 'white', opacity: 0.9 }}>
          Transform your meeting notes into actionable Jira tasks automatically.
        </Text>
        <Text xcss={{ color: 'white', opacity: 0.8, fontSize: '0.9em' }}>
          🌍 Multi-language support: English, Spanish, French, German
        </Text>
      </Box>
      
      <Button
        onClick={openModal}
        appearance="primary"
        xcss={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          fontWeight: '600',
          padding: 'space.200 space.400',
          borderRadius: 'border.radius.200',
          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)'
          }
        }}
      >
        🚀 Transform Meeting Notes
      </Button>
      
      {analytics && (
        <Box
          xcss={{
            background: '#0f1419',
            padding: 'space.500',
            borderRadius: 'border.radius.300',
            border: '1px solid #2d3748',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            marginTop: 'space.400'
          }}
        >
          <Box xcss={{ textAlign: 'center', marginBottom: 'space.400' }}>
            <Heading size="large" xcss={{ color: 'white', fontWeight: '800', marginBottom: 'space.100' }}>
              📊 Performance Dashboard
            </Heading>
            <Text xcss={{ color: '#a0aec0', fontSize: '1em', fontWeight: '500' }}>
              Real-time insights • Enterprise analytics
            </Text>
          </Box>
          
          <Box xcss={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', 
            gap: 'space.400',
            marginBottom: 'space.400'
          }}>
            <MetricCard
              value={analytics.totalMeetings}
              label="MEETINGS"
              subtitle="Total Processed"
              color="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              icon="📅"
            />
            <MetricCard
              value={analytics.totalTasksCreated}
              label="TASKS"
              subtitle="Successfully Created"
              color="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
              icon="✅"
            />
            <MetricCard
              value={`${analytics.completionRate}%`}
              label="SUCCESS RATE"
              subtitle="Automation Quality"
              color="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
              icon="🎯"
            />
          </Box>
          
          <Box xcss={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: 'space.300',
            borderRadius: 'border.radius.200',
            textAlign: 'center',
            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
          }}>
            <Text xcss={{ color: 'white', fontWeight: '700', fontSize: '1.2em' }}>
              ⚡ {analytics.avgTasksPerMeeting} avg tasks per meeting • {analytics.totalTasksCreated} total automation wins
            </Text>
          </Box>
        </Box>
      )}
      
      <ModalTransition>
        {isModalOpen && (
          <Modal onClose={closeModal}>
            <ModalHeader>
              <ModalTitle xcss={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: '600'
              }}>
                🤖 Enter Meeting Notes - AI Powered
              </ModalTitle>
            </ModalHeader>
            <ModalBody>
              <Stack space="medium">
                {!showPreview ? (
                  <>
                    <Text>Paste your meeting notes below. AI will extract action items for your review.</Text>
                    <TextArea
                      placeholder="Example:
- John to review the Q4 budget by Friday
- Sarah will update the project timeline
- Team decided to use React for the frontend
- Mike to schedule follow-up meeting next week"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      minimumRows={8}
                      resize="vertical"
                    />
                  </>
                ) : (
                  <>
                    <Box xcss={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      padding: 'space.300',
                      borderRadius: 'border.radius.200',
                      textAlign: 'center'
                    }}>
                      <Text xcss={{ color: 'white', fontWeight: '700', fontSize: '1.2em' }}>
                        🔍 Review Extracted Tasks
                      </Text>
                      <Text xcss={{ color: 'white', opacity: 0.9, fontSize: '0.9em' }}>
                        {extractedTasks?.length || 0} tasks ready for creation
                      </Text>
                    </Box>
                    
                    <Stack space="small">
                      {extractedTasks?.map((task, index) => (
                        <Box key={index} xcss={{
                          background: '#f8f9fa',
                          padding: 'space.300',
                          borderRadius: 'border.radius.100',
                          border: '2px solid #667eea'
                        }}>
                          <Text xcss={{ fontWeight: '700', color: '#667eea' }}>Task {index + 1}</Text>
                          <Text>📝 {task.summary}</Text>
                          <Text>👤 Assignee: {task.assignee}</Text>
                          <Text>📅 Due: {task.dueDate}</Text>
                          <Text>⚡ Priority: {task.priority}</Text>
                        </Box>
                      ))}
                    </Stack>
                  </>
                )}
                
                {processing && (
                  <Box xcss={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: 'space.200',
                    borderRadius: 'border.radius.100',
                    textAlign: 'center'
                  }}>
                    <Text xcss={{ color: 'white', fontWeight: '500' }}>
                      {showPreview ? '🚀 Creating Jira tasks...' : '🤖 Extracting tasks with AI...'}
                    </Text>
                  </Box>
                )}
                
                {result && (
                  <Box xcss={{
                    background: result.success 
                      ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)'
                      : 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
                    color: 'white',
                    padding: 'space.200',
                    borderRadius: 'border.radius.100',
                    textAlign: 'center'
                  }}>
                    <Text xcss={{ color: 'white', fontWeight: '500' }}>
                      {result.success ? `✅ ${result.message}` : `❌ ${result.message}`}
                    </Text>
                  </Box>
                )}
                
                {result?.success && result.tasks && result.tasks.length > 0 && (
                  <Stack space="small">
                    <Text xcss={{ fontWeight: '600' }}>Created tasks:</Text>
                    {result.tasks.map((task, index) => (
                      <Text key={index}>• {task.key}: {task.summary} → {task.assignee} • Start: {task.startDate} • Due: {task.dueDate} • {task.priority} {task.type}</Text>
                    ))}
                  </Stack>
                )}
              </Stack>
            </ModalBody>
            <ModalFooter>
              {!showPreview ? (
                <>
                  <Button onClick={closeModal}>Cancel</Button>
                  <Button
                    onClick={handleExtract}
                    appearance="primary"
                    isDisabled={processing || !notes.trim() || extractedTasks}
                  >
                    {processing ? 'Extracting...' : extractedTasks ? '✅ Tasks Extracted' : '🔍 Extract Tasks'}
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={handleDiscard} isDisabled={processing}>❌ Discard</Button>
                  <Button onClick={() => setShowPreview(false)} isDisabled={processing}>✏️ Edit Notes</Button>
                  <Button
                    onClick={handleApprove}
                    appearance="primary"
                    isDisabled={processing}
                  >
                    {processing ? 'Creating...' : '✅ Approve & Create'}
                  </Button>
                </>
              )}
              {result?.success && (
                <Button onClick={closeModal} appearance="primary">
                  Close
                </Button>
              )}
            </ModalFooter>
          </Modal>
        )}
      </ModalTransition>
    </Stack>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);