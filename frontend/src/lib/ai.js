// frontend/src/lib/ai.js

/**
 * A simple keyword-based text classifier to assign priority to messages.
 * This runs entirely on the client-side and has no external dependencies.
 * @param {string} messageText The text of the message to classify.
 * @returns {'Urgent' | 'Needs' | 'Info' | 'General'} The priority tag.
 */
export function classifyMessage(messageText) {
  if (!messageText || typeof messageText !== 'string') {
    return 'General';
  }
  const lowerText = messageText.toLowerCase();

  // Keywords for 'Urgent'
  const urgentKeywords = ['help', 'emergency', 'urgent', 'danger', 'fire', 'medical', 'injured', 'stuck', 'trapped', 'asap'];
  if (urgentKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'Urgent';
  }

  // Keywords for 'Needs'
  const needsKeywords = ['water', 'food', 'shelter', 'medicine', 'blanket', 'supply', 'need', 'require'];
  if (needsKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'Needs';
  }

  // Keywords for 'Info'
  const infoKeywords = ['info', 'update', 'situation', 'report', 'location', 'status', 'safe'];
  if (infoKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'Info';
  }

  // Default to 'General' if no specific keywords are found
  return 'General';
}
