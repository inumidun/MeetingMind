import React, { useState } from 'react';
import ForgeReconciler, { Text, Button, Stack, Heading, Modal, ModalTransition, ModalHeader, ModalTitle, ModalBody, ModalFooter, TextArea } from '@forge/react';
import { invoke } from '@forge/bridge';

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [lastProcessedNotes, setLastProcessedNotes] = useState('');

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
  };

  const handleSubmit = async () => {
    if (!notes.trim()) {
      setResult({ success: false, message: 'Please enter meeting notes' });
      return;
    }

    setProcessing(true);
    setResult(null);
    
    try {
      const response = await invoke('createJiraTasks', { notes });
      setResult(response);
      if (response.success) {
        setLastProcessedNotes(notes);
      }
    } catch (error) {
      setResult({ success: false, message: 'Error creating tasks' });
    }
    
    setProcessing(false);
  };

  return (
    <Stack space="medium">
      <Heading size="medium">MeetingMind - Powered by Williams Racing</Heading>
      <Text>Transform your meeting notes into actionable Jira tasks automatically.</Text>
      <Button
        onClick={openModal}
        appearance="primary"
      >
        Transform Meeting Notes
      </Button>
      
      <ModalTransition>
        {isModalOpen && (
          <Modal onClose={closeModal}>
            <ModalHeader>
              <ModalTitle>Enter Meeting Notes</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <Stack space="medium">
                <Text>Paste your meeting notes below. AI will extract action items automatically.</Text>
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
                {processing && <Text>Creating Jira tasks...</Text>}
                {result && (
                  <Stack space="small">
                    <Text>{result.success ? `✅ ${result.message}` : `❌ ${result.message}`}</Text>

                    {result.success && result.tasks && result.tasks.length > 0 && (
                      <Stack space="small">
                        <Text>Created tasks:</Text>
                        {result.tasks.map((task, index) => (
                          <Text key={index}>• {task.key}: {task.summary} → {task.assignee} • Start: {task.startDate} • Due: {task.dueDate} • {task.priority} {task.type}</Text>
                        ))}
                      </Stack>
                    )}
                  </Stack>
                )}
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button onClick={closeModal}>Cancel</Button>
              <Button
                onClick={handleSubmit}
                appearance="primary"
                isDisabled={processing || !notes.trim() || (notes === lastProcessedNotes && result?.success)}
              >
                {processing ? 'Creating Tasks...' : 'Create Jira Tasks'}
              </Button>
              {result && result.success && (
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
