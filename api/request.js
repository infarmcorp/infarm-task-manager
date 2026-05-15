// File ini harus disimpan di: api/request.js atau pages/api/request.js di Vercel
// Ini adalah endpoint yang menerima data dari Google Apps Script

export default function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { title, requestedBy, category, description, dueDate, status, pic, comments, attachments } = req.body;

    // Validate required fields
    if (!title || !requestedBy) {
      return res.status(400).json({ error: 'Title and requestedBy are required' });
    }

    // Create task object
    const newTask = {
      id: Date.now(),
      title,
      requestedBy,
      category: category || 'Lainnya',
      description: description || '',
      dueDate: dueDate || '',
      status: status || 'request',
      pic: pic || null,
      comments: comments || [],
      attachments: attachments || [],
      createdDate: new Date().toISOString().split('T')[0]
    };

    // Log the received data
    console.log('Received new request:', newTask);

    // Success response
    res.status(200).json({
      success: true,
      message: 'Request received successfully',
      task: newTask
    });

  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
