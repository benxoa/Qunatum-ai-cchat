import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';

export default function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef(null);
  const [loading, setloading] = useState(false)

  const handleSend = async () => {
    if (inputText.trim()) {
      // Add user message to the list
      const userMessage = { role: 'user', content: inputText };
      setMessages([...messages, userMessage]);

      // Reset input field
      setInputText('');

      // Fetch response from ChatGPT
      const response = await fetchChatGPT(inputText);
      const assistantMessage = { role: 'assistant', content: response };

      // Add assistant message to the list
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    }
  };

  const fetchChatGPT = async (userInput) => {
    setloading(true)
    try {

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer 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`, // Replace with your actual API key // Replace with your actual API key
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: userInput }],
        }),
      });

      const data = await response.json();
      setloading(false)
      return data.choices[0].message.content;
  
    } catch (error) {
      setloading(false)
      console.error('Error fetching ChatGPT response:', error);
      return 'Sorry, something went wrong.';
    }
  };

  // Use useEffect to scroll to the bottom when messages change
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex flex-row justify-center p-4 bg-gray-900">
        <Text className="text-2xl font-bold text-white">Quantum ChatAi</Text>
      </View>

      {/* Chat Area */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 p-4"
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg, index) => (
          <View
            key={index}
            className={`p-4 m-2 rounded-lg ${
              msg.role === 'user' ? 'bg-blue-100 self-end' : 'bg-gray-100 self-start'
            }`}
          >
            <Text className="text-lg">{msg.content}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Input Area */}
      <View className="flex flex-row items-center p-4 bg-gray-200">
        <TextInput
          className="flex-1 bg-white p-4 rounded-lg"
          placeholder="Type a message..."
          value={inputText}
          onChangeText={(text) => setInputText(text)}
        />
        <TouchableOpacity
          onPress={handleSend}
          className="ml-2 p-4 bg-blue-500 rounded-lg"
        >
          {loading ? (<>
            <Text className="text-white font-bold"><ActivityIndicator /></Text>
          </>):(<>
            <Text className="text-white font-bold">Send</Text>
          </>)}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
