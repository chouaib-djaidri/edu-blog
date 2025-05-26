  // AI functions with better error handling
  const handleAIAction = async (action: string) => {
    const selection = window.getSelection();
    if (!selection || selection.toString().trim() === '') {
      alert('Please select some text first');
      return;
    }

    const selectedText = selection.toString();
    setIsLoading(action);

    try {
      let result = '';
      let response: Response;
      
      switch (action) {
        case 'grammar':
          response = await fetch('/api/ai/grammar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: selectedText })
          });
          break;
        case 'shorten':
          response = await fetch('/api/ai/shorten', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: selectedText })
          });
          break;
        case 'expand':
          response = await fetch('/api/ai/expand', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: selectedText })
          });
          break;
        case 'improve':
          response = await fetch('/api/ai/improve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: selectedText })
          });
          break;
        default:
          return;
      }

      const data = await response.json();
      
      if (!response.ok) {
        // Handle specific error types
        if (response.status === 429) {
          alert('⚠️ OpenAI quota exceeded. Please check your billing settings.\n\nVisit: https://platform.openai.com/account/billing');
          return;
        } else {
          alert(`AI service error: ${data.error || 'Unknown error'}`);
          return;
        }
      }

      // Get the result based on action type
      switch (action) {
        case 'grammar':
          result = data.corrected;
          break;
        case 'shorten':
          result = data.shortened;
          break;
        case 'expand':
          result = data.expanded;
          break;
        case 'improve':
          result = data.improved;
          break;
      }

      if (result && result !== selectedText) {
        document.execCommand('insertText', false, result);
      }
    } catch (error) {
      console.error(`AI ${action} error:`, error);
      alert(`Failed to ${action} text. Please try again or check your internet connection.`);
    } finally {
      setIsLoading(null);
    }
  };