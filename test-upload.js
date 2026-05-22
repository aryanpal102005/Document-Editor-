// Test file upload functionality
// Run this in browser console on http://localhost:3000

async function testFileUpload() {
  console.log('Testing file upload...');
  
  // Create a test text file
  const testContent = 'This is a test file for CollabEdit Pro.\nLine 2\nLine 3';
  const blob = new Blob([testContent], { type: 'text/plain' });
  const file = new File([blob], 'test.txt', { type: 'text/plain' });
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('roomId', 'default');
  formData.append('userName', 'TestUser');
  
  try {
    const response = await fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    console.log('Upload response:', data);
    
    if (data.success) {
      console.log('✅ Upload successful!');
      console.log('File ID:', data.fileId);
      console.log('Content:', data.content);
    } else {
      console.error('❌ Upload failed:', data.error);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the test
testFileUpload();
